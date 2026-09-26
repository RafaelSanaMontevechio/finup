import { getAdminDb } from "@/lib/firebase/admin";
import type { CollectionReference, DocumentData } from "firebase-admin/firestore";

/**
 * Camada de abstração sobre o Firestore.
 *
 * Nunca importar este arquivo em componentes React, apenas em services
 * (features graphs -> services) que rodam em Route Handlers no servidor.
 *
 * Cada documento é sempre escopado por userId, então um usuário nunca lê ou
 * grava dados de outro. Trocar Firestore por outro banco no futuro deve
 * exigir apenas reescrever este arquivo — nada nas features deve mudar.
 */

export type CollectionName = "categories" | "expenses" | "income";

function collectionRef(name: CollectionName): CollectionReference<DocumentData> {
  return getAdminDb().collection(name);
}

export const firestoreClient = {
  async list(collection: CollectionName, userId: string): Promise<Record<string, string>[]> {
    const snapshot = await collectionRef(collection).where("userId", "==", userId).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Record<string, string>);
  },

  async create(
    collection: CollectionName,
    userId: string,
    data: Record<string, string>
  ): Promise<Record<string, string>> {
    const ref = await collectionRef(collection).add({ ...data, userId });
    return { id: ref.id, ...data, userId };
  },

  async update(
    collection: CollectionName,
    userId: string,
    id: string,
    patch: Record<string, string>
  ): Promise<Record<string, string> | null> {
    const docRef = collectionRef(collection).doc(id);
    const doc = await docRef.get();
    if (!doc.exists || doc.data()?.userId !== userId) return null;

    await docRef.update(patch);
    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() } as Record<string, string>;
  },

  async remove(collection: CollectionName, userId: string, id: string): Promise<boolean> {
    const docRef = collectionRef(collection).doc(id);
    const doc = await docRef.get();
    if (!doc.exists || doc.data()?.userId !== userId) return false;

    await docRef.delete();
    return true;
  },
};
