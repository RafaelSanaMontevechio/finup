import { firestoreClient } from "@/lib/firebase/firestore-client";
import type { Category } from "@/types";
import type { CategoryInput } from "@/lib/validations/schemas";

function toCategory(record: Record<string, string>): Category {
  return {
    id: record.id,
    name: record.name,
    color: record.color,
    icon: record.icon,
    type: "despesa",
  };
}

export const categoriesService = {
  async list(userId: string): Promise<Category[]> {
    const rows = await firestoreClient.list("categories", userId);
    return rows.map(toCategory);
  },

  async create(userId: string, input: CategoryInput): Promise<Category> {
    const record = await firestoreClient.create("categories", userId, input);
    return toCategory(record);
  },

  async update(userId: string, id: string, input: CategoryInput): Promise<Category | null> {
    const record = await firestoreClient.update("categories", userId, id, input);
    return record ? toCategory(record) : null;
  },

  async remove(userId: string, id: string): Promise<boolean> {
    return firestoreClient.remove("categories", userId, id);
  },
};
