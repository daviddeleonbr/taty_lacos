import { ContentEditor } from "@/components/admin/content-editor";
import { getDefaultSiteContent, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AdminConteudoPage() {
  const [content, defaults] = await Promise.all([
    getSiteContent(),
    Promise.resolve(getDefaultSiteContent()),
  ]);

  return (
    <div className="max-w-5xl mx-auto -mt-4 sm:-mt-6 lg:-mt-12 -mb-4 sm:-mb-6 lg:-mb-12">
      {/* margens negativas para a sticky save bar bleed full-width */}
      <div className="px-4 sm:px-6 lg:px-12 pt-4 sm:pt-6 lg:pt-12 pb-4 sm:pb-6 lg:pb-12">
        <header className="mb-6 sm:mb-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-champagne-600 font-medium">
            Conteúdo
          </p>
          <h1 className="mt-2 font-serif text-2xl sm:text-3xl text-ink-600">
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
