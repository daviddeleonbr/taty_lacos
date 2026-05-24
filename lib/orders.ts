import "server-only";

import { getSupabase } from "./supabase";
import {
  DEFAULT_STAGES,
  type Order,
  type OrderStage,
} from "./order-types";

const TABLE = "orders";

/** Schema cru da row do Supabase, com snake_case. */
type OrderRow = {
  id: string;
  created_at: string;
  desired_date: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_city: string | null;
  customer_state: string | null;
  child_name: string | null;
  child_age_range: string | null;
  child_head_size: string | null;
  piece_style_id: string | null;
  piece_style_label: string | null;
  piece_colors: string[] | null;
  piece_materials: string[] | null;
  piece_customization: string | null;
  piece_occasion: string | null;
  stages: OrderStage[];
  total_price: string | number | null;
  tracking_code: string | null;
  internal_notes: string | null;
};

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    desiredDate: row.desired_date ?? undefined,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone ?? "",
      city: row.customer_city ?? undefined,
      state: row.customer_state ?? undefined,
    },
    child: {
      name: row.child_name ?? undefined,
      ageRange: row.child_age_range ?? undefined,
      headSize: row.child_head_size ?? undefined,
    },
    piece: {
      styleId: row.piece_style_id ?? undefined,
      styleLabel: row.piece_style_label ?? undefined,
      colors: row.piece_colors ?? [],
      materials: row.piece_materials ?? [],
      customization: row.piece_customization ?? undefined,
      occasion: row.piece_occasion ?? undefined,
    },
    stages: row.stages ?? [],
    totalPrice: row.total_price != null ? Number(row.total_price) : undefined,
    trackingCode: row.tracking_code ?? undefined,
    internalNotes: row.internal_notes ?? undefined,
  };
}

function orderToInsertRow(order: Order) {
  return {
    id: order.id,
    created_at: order.createdAt,
    desired_date: order.desiredDate ?? null,
    customer_name: order.customer.name,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone || null,
    customer_city: order.customer.city ?? null,
    customer_state: order.customer.state ?? null,
    child_name: order.child.name ?? null,
    child_age_range: order.child.ageRange ?? null,
    child_head_size: order.child.headSize ?? null,
    piece_style_id: order.piece.styleId ?? null,
    piece_style_label: order.piece.styleLabel ?? null,
    piece_colors: order.piece.colors ?? [],
    piece_materials: order.piece.materials ?? [],
    piece_customization: order.piece.customization ?? null,
    piece_occasion: order.piece.occasion ?? null,
    stages: order.stages,
    total_price: order.totalPrice ?? null,
    tracking_code: order.trackingCode ?? null,
    internal_notes: order.internalNotes ?? null,
  };
}

async function generateId(): Promise<string> {
  const year = new Date().getFullYear();
  const supabase = getSupabase();
  // Conta quantos pedidos já existem do ano atual
  const { count, error } = await supabase
    .from(TABLE)
    .select("id", { count: "exact", head: true })
    .like("id", `LL-${year}-%`);
  if (error) throw new Error(`Não foi possível gerar ID: ${error.message}`);
  const next = ((count ?? 0) + 1).toString().padStart(4, "0");
  return `LL-${year}-${next}`;
}

export async function listOrders(): Promise<Order[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`listOrders: ${error.message}`);
  return (data as OrderRow[]).map(rowToOrder);
}

export async function getOrder(id: string): Promise<Order | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`getOrder: ${error.message}`);
  return data ? rowToOrder(data as OrderRow) : null;
}

export async function createOrder(
  input: Omit<Order, "id" | "createdAt" | "stages"> & { stages?: Order["stages"] }
): Promise<Order> {
  const id = await generateId();
  const order: Order = {
    ...input,
    id,
    createdAt: new Date().toISOString(),
    stages: input.stages ?? DEFAULT_STAGES.map((s) => ({ ...s })),
  };

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(orderToInsertRow(order))
    .select("*")
    .single();
  if (error) throw new Error(`createOrder: ${error.message}`);
  return rowToOrder(data as OrderRow);
}

export async function updateOrder(
  id: string,
  patch: Partial<Order>
): Promise<Order | null> {
  const supabase = getSupabase();

  // Monta apenas os campos que mudaram, em snake_case
  const update: Record<string, unknown> = {};
  if (patch.desiredDate !== undefined) update.desired_date = patch.desiredDate ?? null;
  if (patch.customer) {
    if (patch.customer.name !== undefined) update.customer_name = patch.customer.name;
    if (patch.customer.email !== undefined) update.customer_email = patch.customer.email;
    if (patch.customer.phone !== undefined) update.customer_phone = patch.customer.phone || null;
    if (patch.customer.city !== undefined) update.customer_city = patch.customer.city ?? null;
    if (patch.customer.state !== undefined) update.customer_state = patch.customer.state ?? null;
  }
  if (patch.child) {
    if (patch.child.name !== undefined) update.child_name = patch.child.name ?? null;
    if (patch.child.ageRange !== undefined) update.child_age_range = patch.child.ageRange ?? null;
    if (patch.child.headSize !== undefined) update.child_head_size = patch.child.headSize ?? null;
  }
  if (patch.piece) {
    if (patch.piece.styleId !== undefined) update.piece_style_id = patch.piece.styleId ?? null;
    if (patch.piece.styleLabel !== undefined) update.piece_style_label = patch.piece.styleLabel ?? null;
    if (patch.piece.colors !== undefined) update.piece_colors = patch.piece.colors ?? [];
    if (patch.piece.materials !== undefined) update.piece_materials = patch.piece.materials ?? [];
    if (patch.piece.customization !== undefined) update.piece_customization = patch.piece.customization ?? null;
    if (patch.piece.occasion !== undefined) update.piece_occasion = patch.piece.occasion ?? null;
  }
  if (patch.stages !== undefined) update.stages = patch.stages;
  if (patch.totalPrice !== undefined) update.total_price = patch.totalPrice ?? null;
  if (patch.trackingCode !== undefined) update.tracking_code = patch.trackingCode ?? null;
  if (patch.internalNotes !== undefined) update.internal_notes = patch.internalNotes ?? null;

  if (Object.keys(update).length === 0) {
    return await getOrder(id);
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update(update)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(`updateOrder: ${error.message}`);
  return data ? rowToOrder(data as OrderRow) : null;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error, count } = await supabase
    .from(TABLE)
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) throw new Error(`deleteOrder: ${error.message}`);
  return (count ?? 0) > 0;
}
