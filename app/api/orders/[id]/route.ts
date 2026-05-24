import { NextResponse } from "next/server";
import { deleteOrder, getOrder, updateOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const order = await getOrder(params.id);
  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patch = await request.json();
    const order = await updateOrder(params.id, patch);
    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (err) {
    console.error("[PATCH /api/orders/:id]", err);
    return NextResponse.json(
      { error: "Não foi possível atualizar o pedido." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const ok = await deleteOrder(params.id);
  if (!ok) {
    return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
