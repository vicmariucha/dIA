import { Firestore } from "@google-cloud/firestore";
import { Auth } from "firebase/auth";
import { Functions } from "firebase/functions";

declare module "../utils/firebase" {
  export const db: Firestore; // Firestore do Firebase
  export const auth: Auth; // Autenticação do Firebase
  export const functions: Functions; // Funções do Firebase
  export const registrarDado: (
    tipo: string,
    dado: Record<string, any>,
    pacienteId: string
  ) => Promise<void>; // Tipos precisos para 'registrarDado'
}
