import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { listOrders } from "@/lib/orders";
import { currentStageLabel, progressFromStages } from "@/lib/order-types";

export const dynamic = "force-dynamic";

export default async function AdminPedidosPage() {
  const orders = await listOrders();

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.18em] text-champagne-600 font-medium">
          Painel
        </p>
        <h1 className="mt-2 font-serif text-3xl text-ink-600">Pedidos</h1>
        <p className="mt-2 text-sm text-ink-500/80 max-w-md">
          Aqui você acompanha todas as encomendas. Clique em um pedido para
          atualizar etapas, adicionar fotos do processo e notas para a cliente.
        </p>
      </header>

      {orders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="rounded-3xl bg-cream border border-blush-100/60 shadow-soft overflow-hidden">
          {/* Desktop table */}
          <table className="hidden md:table w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-ink-400 border-b border-blush-100/60">
                <Th>Pedido</Th>
                <Th>Cliente</Th>
                <Th>Peça</Th>
                <Th>Status</Th>
                <Th>Progresso</Th>
                <Th>Criado</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const progress = progressFromStages(order.stages);
                return (
                  <tr
                    key={order.id}
                    className="border-b border-blush-100/40 last:border-0 hover:bg-blush-50/40 transition-colors"
                  >
                    <Td>
                      <p className="font-serif text-bordeaux-500">{order.id}</p>
                    </Td>
                    <Td>
                      <p className="text-ink-600">{order.customer.name}</p>
                      <p className="text-xs text-ink-400">{order.customer.email}</p>
                    </Td>
                    <Td>
                      <p className="text-ink-600 truncate max-w-[200px]">
                        {order.piece.styleLabel ?? "—"}
                      </p>
                      <p className="text-xs text-ink-400">
                        {order.piece.colors.slice(0, 2).join(", ") || "—"}
                      </p>
                    </Td>
                    <Td>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blush-100/60 text-[11px] text-bordeaux-500">
                        {currentStageLabel(order.stages)}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <div className="flex-1 h-1 rounded-full bg-blush-100/60 overflow-hidden">
                          <div
                            className="h-full bg-bordeaux-500 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-ink-400 w-8 text-right">
                          {progress}%
                        </span>
                      </div>
                    </Td>
                    <Td>
                      <p className="text-xs text-ink-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </Td>
                    <Td>
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/pedido/${order.id}`}
                          target="_blank"
                          className="p-2 text-ink-400 hover:text-bordeaux-500 transition-colors"
                          title="Ver página pública"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/pedidos/${order.id}`}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs text-bordeaux-500 hover:bg-blush-100/60 transition-colors group"
                        >
                          Gerenciar
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-blush-100/40">
            {orders.map((order) => {
              const progress = progressFromStages(order.stages);
              return (
                <Link
                  key={order.id}
                  href={`/admin/pedidos/${order.id}`}
                  className="block p-5 hover:bg-blush-50/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-serif text-bordeaux-500">{order.id}</p>
                      <p className="mt-0.5 text-sm text-ink-600">
                        {order.customer.name}
                      </p>
                      <p className="text-xs text-ink-400">
                        {order.piece.styleLabel ?? "Sem estilo definido"}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blush-100/60 text-[11px] text-bordeaux-500 whitespace-nowrap">
                      {currentStageLabel(order.stages)}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-blush-100/60 overflow-hidden">
                      <div
                        className="h-full bg-bordeaux-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-ink-400">{progress}%</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-5 py-4 font-medium">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-4 align-top">{children}</td>;
}

function EmptyState() {
  return (
    <div className="rounded-3xl bg-cream border border-dashed border-blush-200 p-14 text-center">
      <p className="font-serif text-2xl text-ink-600">
        Nenhum pedido ainda <span className="font-script text-bordeaux-500">por aqui</span>
      </p>
      <p className="mt-3 text-sm text-ink-500/80 max-w-sm mx-auto">
        Quando uma cliente preencher o formulário em{" "}
        <Link
          href="/encomenda"
          target="_blank"
          className="text-bordeaux-500 hover:underline"
        >
          /encomenda
        </Link>
        , o pedido aparece aqui.
      </p>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
