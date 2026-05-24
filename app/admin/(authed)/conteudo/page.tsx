import { ContentEditor } from "@/components/admin/content-editor";
import { getDefaultSiteContent, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AdminConteudoPage() {
  const [content, defaults] = await Promise.all([
    getSiteContent(),
    Promise.resolve(getDefaultSiteContent()),
  ]);

  return (
    <div className="max-w-5xl mx-auto -mt-6 -mb-6 lg:-mt-12 lg:-mb-12">
      {/* negative margins so the sticky save bar can extend full-width */}
      <div className="px-6 lg:px-12 pt-6 lg:pt-12 pb-6 lg:pb-12">
        <header className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-champagne-600 font-medium">
            Conteúdo
          </p>
          <h1 className="mt-2 font-serif text-3xl text-ink-600">
            Imagens e textos do site
          </h1>
          <p className="mt-2 text-sm text-ink-500/80 max-w-xl">
            Tudo o que aparece na home — hero, banner, fundadora, produtos
            destaque, categorias e galeria. As mudanças entram no ar quando você
            clicar em <strong>Salvar e publicar</strong>.
          </p>
        </header>

        <ContentEditor initialContent={content} defaults={defaults} />
      </div>
    </div>
  );
}
