import { NextResponse } from "next/server";
import { createOrder, listOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET() {
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.customer?.email || !body?.customer?.name) {
      return NextResponse.json(
        { error: "Nome e email da cliente são obrigatórios." },
        { status: 400 }
      );
    }

    const order = await createOrder({
      desiredDate: body.desiredDate,
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        phone: body.customer.phone ?? "",
        city: body.customer.city,
        state: body.customer.state,
      },
      child: {
        name: body.child?.name,
        ageRange: body.child?.ageRange,
        headSize: body.child?.headSize,
      },
      piece: {
        styleId: body.piece?.styleId,
        styleLabel: body.piece?.styleLabel,
        colors: body.piece?.colors ?? [],
        materials: body.piece?.materials ?? [],
        customization: body.piece?.customization,
        occasion: body.piece?.occasion,
      },
      totalPrice: body.totalPrice,
      trackingCode: body.trackingCode,
      internalNotes: body.internalNotes,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/orders]", err);
    return NextResponse.json(
      { error: "Não foi possível criar o pedido." },
      { status: 500 }
    );
  }
}
