import { NextResponse } from "next/server";
import { deleteStyle, updateStyle } from "@/lib/encomenda-styles";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patch = await request.json();
    const style = await updateStyle(params.id, patch);
    if (!style) {
      return NextResponse.json({ error: "Modelo não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ style });
  } catch (err) {
    console.error("[PATCH /api/encomenda-styles/:id]", err);
    return NextResponse.json(
      { error: "Não foi possível atualizar o modelo." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const ok = await deleteStyle(params.id);
  if (!ok) {
    return NextResponse.json({ error: "Modelo não encontrado." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
