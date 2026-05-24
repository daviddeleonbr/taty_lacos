import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminNovoForm } from "@/components/admin/novo-form";

export default function AdminNovoPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/admin/pedidos"
        className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-bordeaux-500 transition-colors group mb-8"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Voltar para pedidos
      </Link>

      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.18em] text-champagne-600 font-medium">
          Novo pedido
        </p>
        <h1 className="mt-2 font-serif text-3xl text-ink-600">
          Cadastrar encomenda manual
        </h1>
        <p className="mt-2 text-sm text-ink-500/80 max-w-md">
          Use quando a cliente fechar a encomenda fora do site (WhatsApp,
          Instagram, presencial). O pedido entra na esteira do ateliê normalmente.
        </p>
      </header>

      <AdminNovoForm />
    </div>
  );
}
