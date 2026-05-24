import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { listStyles } from "@/lib/encomenda-styles";
import { StylesEditor } from "@/components/admin/styles-editor";

export const dynamic = "force-dynamic";

export default async function AdminModelosPage() {
  const styles = await listStyles();

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-champagne-600 font-medium">
            Encomenda
          </p>
          <h1 className="mt-2 font-serif text-3xl text-ink-600">
            Modelos da encomenda
          </h1>
          <p className="mt-2 text-sm text-ink-500/80 max-w-xl">
            Os cards que a cliente vê na primeira etapa do formulário de
            encomenda. Adicione novos modelos sempre que quiser oferecer uma
            referência diferente.
          </p>
        </div>
        <Link
          href="/encomenda"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs text-ink-400 hover:text-bordeaux-500 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Ver formulário público
        </Link>
      </header>

      <StylesEditor initialStyles={styles} />
    </div>
  );
}
