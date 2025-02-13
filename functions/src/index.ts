import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";

admin.initializeApp();
const db = admin.firestore();
const corsHandler = cors({ origin: true });

// Função para buscar glicemias e insulinas
export const getGlicemiasEInsulinas = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const pacienteId = req.query.pacienteId || req.body.pacienteId;

    if (!pacienteId) {
      return res.status(400).json({ error: "ID do paciente não fornecido." });
    }

    try {
      // Consultar glicemias
      const glicemiasSnapshot = await db
        .collection("dados")
        .where("pacienteId", "==", pacienteId)
        .where("tipo", "==", "glicemias")
        .orderBy("dado.dataHora", "desc")
        .get();

      const glicemias = glicemiasSnapshot.docs.map((doc) => doc.data().dado);

      // Consultar insulinas
      const insulinasSnapshot = await db
        .collection("dados")
        .where("pacienteId", "==", pacienteId)
        .where("tipo", "==", "insulinas")
        .orderBy("dado.dataHora", "desc")
        .get();

      const insulinas = insulinasSnapshot.docs.map((doc) => doc.data().dado);

      return res.status(200).json({ glicemias, insulinas });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  });
});

// Função para responder pedidos de associação
export const responderPedido = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const { pacienteId, aceitar } = req.body;

    if (!pacienteId || aceitar === undefined) {
      return res.status(400).json({ error: "Dados insuficientes." });
    }

    try {
      const pacienteRef = db.collection("usuarios").doc(pacienteId);
      const profissionalId = "simulado-profissional-id"; // Adapte conforme necessário

      const pedido = { profissionalId, status: "pendente", timestamp: admin.firestore.FieldValue.serverTimestamp() };

      if (aceitar) {
        await pacienteRef.update({ profissionaisAssociados: admin.firestore.FieldValue.arrayUnion(profissionalId) });
      } else {
        await pacienteRef.update({ pedidosDeAssociacao: admin.firestore.FieldValue.arrayRemove(pedido) });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Erro ao responder pedido:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  });
});

// Função para carregar mensagens
export const carregarMensagens = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const pacienteId = req.query.pacienteId || req.body.pacienteId;

    if (!pacienteId) {
      return res.status(400).json({ error: "ID do paciente não fornecido." });
    }

    try {
      const mensagensSnapshot = await db
        .collection("mensagens")
        .where("pacienteId", "==", pacienteId)
        .orderBy("timestamp", "asc")
        .get();

      const mensagens = mensagensSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json({ mensagens });
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  });
});

// Função para enviar mensagens
export const enviarMensagem = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const { pacienteId, medicoId, mensagem } = req.body;

    if (!pacienteId || !medicoId || !mensagem) {
      return res.status(400).json({ error: "Dados insuficientes." });
    }

    try {
      await db.collection("mensagens").add({
        pacienteId,
        medicoId,
        mensagem,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  });
});
