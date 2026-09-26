import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Inicializa o Firebase Admin SDK sob demanda (lazy singleton).
 *
 * Nunca importe este arquivo em componentes React — ele usa credenciais de
 * service account e só pode rodar no servidor (Route Handlers). A
 * inicialização é lazy para que `next build` não falhe caso as variáveis de
 * ambiente ainda não tenham sido configuradas (elas só são necessárias em
 * runtime, quando uma rota realmente precisa falar com o Firebase).
 */
let app: App | null = null;

function getAdminApp(): App {
  if (app) return app;
  const existing = getApps();
  if (existing.length > 0) {
    app = existing[0];
    return app;
  }

  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
  return app;
}

let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

export function getAdminAuth(): Auth {
  if (!authInstance) authInstance = getAuth(getAdminApp());
  return authInstance;
}

export function getAdminDb(): Firestore {
  if (!dbInstance) dbInstance = getFirestore(getAdminApp());
  return dbInstance;
}
