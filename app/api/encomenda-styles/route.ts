import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createStyle, listStyles, resetStyles } from "@/lib/encomenda-styles";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function invalidate() {
  revalidatePath("/encomenda");
  revalidatePath("/admin/modelos");
}

export async function GET() {
  const styles = await listStyles();
  return NextResponse.json({ styles });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.label || !body?.image) {
      return NextResponse.json(
        { error: "Nome e imagem do modelo são obrigatórios." },
        { status: 400 }
      );
    }
    const style = await createStyle({
      label: body.label,
      description: body.description ?? "",
      image: body.image,
      id: body.id,
    });
    invalidate();
    return NextResponse.json({ style }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/encomenda-styles]", err);
    return NextResponse.json(
      { error: "Não foi possível criar o modelo." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const styles = await resetStyles();
  invalidate();
  return NextResponse.json({ styles });
}
