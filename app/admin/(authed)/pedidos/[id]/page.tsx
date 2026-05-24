import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getOrder } from "@/lib/orders";
import { OrderEditor } from "@/components/admin/order-editor";

export const dynamic = "force-dynamic";

export default async function AdminOrderPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrder(params.id);
  if (!order) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/admin/pedidos"
        className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-bordeaux-500 transition-colors group mb-8"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Todos os pedidos
      </Link>

      <OrderEditor initialOrder={order} />
    </div>
  );
}
