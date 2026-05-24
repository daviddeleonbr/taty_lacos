import { promises as fs } from "fs";
import path from "path";
import { DEFAULT_STAGES, type Order } from "./order-types";

// Server-only file-based storage. Works in dev and on a long-lived Node host.
// On serverless (Vercel) writes won't persist — migrate to Supabase before deploy.
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "orders.json");

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ orders: [] }, null, 2), "utf8");
  }
}

async function readAll(): Promise<Order[]> {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as { orders: Order[] };
    return parsed.orders ?? [];
  } catch {
    return [];
  }
}

async function writeAll(orders: Order[]) {
  await ensureFile();
  await fs.writeFile(DATA_FILE, JSON.stringify({ orders }, null, 2), "utf8");
}

function generateId(existing: Order[]): string {
  const year = new Date().getFullYear();
  const yearOrders = existing.filter((o) => o.id.includes(`-${year}-`));
  const next = (yearOrders.length + 1).toString().padStart(4, "0");
  return `LL-${year}-${next}`;
}

export async function listOrders(): Promise<Order[]> {
  const all = await readAll();
  return all.sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export async function getOrder(id: string): Promise<Order | null> {
  const all = await readAll();
  return all.find((o) => o.id === id) ?? null;
}

export async function createOrder(
  input: Omit<Order, "id" | "createdAt" | "stages"> & { stages?: Order["stages"] }
): Promise<Order> {
  const all = await readAll();
  const order: Order = {
    ...input,
    id: generateId(all),
    createdAt: new Date().toISOString(),
    stages: input.stages ?? DEFAULT_STAGES.map((s) => ({ ...s })),
  };
  all.push(order);
  await writeAll(all);
  return order;
}

export async function updateOrder(
  id: string,
  patch: Partial<Order>
): Promise<Order | null> {
  const all = await readAll();
  const idx = all.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  const merged: Order = { ...all[idx], ...patch, id: all[idx].id };
  all[idx] = merged;
  await writeAll(all);
  return merged;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const all = await readAll();
  const next = all.filter((o) => o.id !== id);
  if (next.length === all.length) return false;
  await writeAll(next);
  return true;
}
