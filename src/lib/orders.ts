import "server-only";

import { Collections } from "@/constants/Collections";
import { db } from "@/lib/firebase-admin";
import { Order } from "@/types/order";

export async function getOrderById(id: string): Promise<Order | null> {
  if (!id || typeof id !== "string" || id.length > 128) {
    return null;
  }

  const snap = await db.collection(Collections.Orders).doc(id).get();
  if (!snap.exists) return null;

  return { id: snap.id, ...snap.data() } as Order;
}

export async function updateOrderFields(
  orderId: string,
  fields: Record<string, unknown>
) {
  await db.collection(Collections.Orders).doc(orderId).update(fields);
}
