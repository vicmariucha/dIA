import { initializeApp } from "firebase/app";
import {
  getFirestore,
  serverTimestamp as firestoreServerTimestamp,
  doc,
  updateDoc,
  getDoc,
  addDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDKeoRmrGnpVGmio72zM894JpGWn2BuWA8",
  authDomain: "diapp-3e683.firebaseapp.com",
  projectId: "diapp-3e683",
  storageBucket: "diapp-3e683.appspot.com",
  messagingSenderId: "356276976589",
  appId: "1:356276976589:android:e51736efd09441a4696284",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const serverTimestamp = firestoreServerTimestamp; // Renomear para evitar conflito

// Exemplo de uso do httpsCallable com configuração de CORS
export const getGlicemiasEInsulinas = async () => {
  try {
    const callable = httpsCallable(functions, "getGlicemiasEInsulinas");
    const result = await callable();
    return result.data;
  } catch (error) {
    console.error("Erro ao chamar a função getGlicemiasEInsulinas: ", error.message);
    throw error;
  }
};

// Enviar pedido de associação
export const enviarPedidoAssociacao = async (profissionalId, pacienteId) => {
  try {
    const pacienteRef = doc(db, "usuarios", pacienteId);
    await updateDoc(pacienteRef, {
      pedidosDeAssociacao: arrayUnion({
        profissionalId,
        status: "pendente",
        timestamp: serverTimestamp(),
      }),
    });
  } catch (error) {
    console.error("Erro ao enviar pedido de associação:", error.message);
  }
};

// Carregar pedidos de associação
export const carregarPedidos = async (pacienteId) => {
  try {
    const pacienteRef = doc(db, "usuarios", pacienteId);
    const docSnap = await getDoc(pacienteRef);
    if (docSnap.exists()) {
      return docSnap.data().pedidosDeAssociacao || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Erro ao carregar pedidos:", error.message);
    return [];
  }
};

// Responder a pedido de associação
export const responderPedido = async (pacienteId, pedido, aceitar) => {
  try {
    const pacienteRef = doc(db, "usuarios", pacienteId);
    const profissionalRef = doc(db, "usuarios", pedido.profissionalId);
    await updateDoc(pacienteRef, {
      pedidosDeAssociacao: arrayRemove(pedido),
    });
    if (aceitar) {
      await updateDoc(pacienteRef, {
        profissionaisAssociados: arrayUnion(pedido.profissionalId),
      });
      await updateDoc(profissionalRef, {
        pacientesAssociados: arrayUnion(pacienteId),
      });
    }
  } catch (error) {
    console.error("Erro ao responder pedido:", error.message);
  }
};

// Carregar médico associado
export const carregarMedicoAssociado = async (pacienteId) => {
  try {
    const pacienteRef = doc(db, "usuarios", pacienteId);
    const pacienteSnap = await getDoc(pacienteRef);
    if (!pacienteSnap.exists()) return null;

    const profissionaisAssociados = pacienteSnap.data().profissionaisAssociados || [];
    if (profissionaisAssociados.length === 0) return null;

    const profissionalId = profissionaisAssociados[0];
    const profissionalRef = doc(db, "usuarios", profissionalId);
    const profissionalSnap = await getDoc(profissionalRef);

    if (profissionalSnap.exists()) {
      return { id: profissionalId, ...profissionalSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erro ao carregar médico associado:", error.message);
    return null;
  }
};

// Enviar mensagem
export const enviarMensagem = async (pacienteId, medicoId, mensagem) => {
  try {
    const mensagensRef = collection(db, "mensagens");
    await addDoc(mensagensRef, {
      pacienteId,
      medicoId,
      mensagem,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error.message);
  }
};

// Carregar mensagens
export const carregarMensagens = async (pacienteId) => {
  try {
    const mensagensRef = collection(db, "mensagens");
    const q = query(mensagensRef, where("pacienteId", "==", pacienteId), orderBy("timestamp", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erro ao carregar mensagens:", error.message);
    return [];
  }
};

// Registrar dado
export const registrarDado = async (tipo, dado, pacienteId) => {
  try {
    if (!pacienteId) {
      throw new Error("ID do paciente não fornecido.");
    }
    const dadosRef = collection(db, "dados");
    await addDoc(dadosRef, {
      pacienteId,
      tipo,
      dado,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Erro ao registrar dado:", error.message);
    throw error;
  }
};


