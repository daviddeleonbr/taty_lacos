export type StageKey = "received" | "production" | "shipped" | "delivered";

export type StageStatus = "pending" | "current" | "completed";

export type OrderStage = {
  key: StageKey;
  title: string;
  description: string;
  status: StageStatus;
  completedAt?: string;
  note?: string;
  photos?: string[]; // data URLs ou URLs externas
};

export type OrderStyle = {
  styleId?: string;
  styleLabel?: string;
  colors: string[];
  materials: string[];
  customization?: string;
  occasion?: string;
};

export type OrderChild = {
  name?: string;
  ageRange?: string;
  headSize?: string;
};

export type OrderCustomer = {
  name: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
};

export type Order = {
  id: string; // ex: LL-2026-0001
  createdAt: string;
  desiredDate?: string;
  customer: OrderCustomer;
  child: OrderChild;
  piece: OrderStyle;
  stages: OrderStage[];
  totalPrice?: number;
  trackingCode?: string;
  internalNotes?: string;
};

export const DEFAULT_STAGES: OrderStage[] = [
  {
    key: "received",
    title: "Pedido recebido",
    description:
      "Sua encomenda chegou ao ateliê e foi anotada com carinho. Em breve começamos a confecção.",
    status: "current",
  },
  {
    key: "production",
    title: "Em produção",
    description:
      "Estamos costurando à mão a sua peça. Cada ponto é dado pensando na sua filha.",
    status: "pending",
  },
  {
    key: "shipped",
    title: "A caminho",
    description:
      "Sua encomenda foi embalada e enviada. Já está a caminho do colo dela.",
    status: "pending",
  },
  {
    key: "delivered",
    title: "Entregue",
    description:
      "Chegou! Esperamos que esse momento se transforme em uma memória bonita.",
    status: "pending",
  },
];

export const STAGE_ORDER: StageKey[] = [
  "received",
  "production",
  "shipped",
  "delivered",
];

export function progressFromStages(stages: OrderStage[]): number {
  const completed = stages.filter((s) => s.status === "completed").length;
  const hasCurrent = stages.some((s) => s.status === "current");
  const total = stages.length;
  // completed steps = 100%; current = + half a step weight
  const value = ((completed + (hasCurrent ? 0.5 : 0)) / total) * 100;
  return Math.round(value);
}

export function currentStageLabel(stages: OrderStage[]): string {
  const current = stages.find((s) => s.status === "current");
  if (current) return current.title;
  const lastCompleted = [...stages].reverse().find((s) => s.status === "completed");
  return lastCompleted?.title ?? "Aguardando";
}
