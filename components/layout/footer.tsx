import Link from "next/link";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { RibbonIcon, DividerOrnament } from "@/components/icons/decorative";

export function Footer() {
  return (
    <footer className="relative bg-ink-600 text-cream-50 mt-32 overflow-hidden">
      <div className="absolute inset-0 bg-paper-texture opacity-30 pointer-events-none" />

      <div className="container-boutique relative py-20">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand block */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex flex-col items-start gap-1">
              <RibbonIcon className="h-7 w-7 text-blush-200" />
              <span className="font-serif text-xl tracking-[0.2em] uppercase">
                Lúa &amp; Lis
              </span>
              <span className="font-script text-sm text-champagne-400 -mt-1">
                ateliê de laços
              </span>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-cream-50/70 max-w-sm">
              Laços feitos à mão, em pequenos lotes, para as princesinhas que
              estão crescendo no colo da família. Cada peça carrega uma história.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <Link
                href="#"
                aria-label="Instagram"
                className="h-10 w-10 rounded-full border border-cream-50/15 flex items-center justify-center hover:bg-blush-200 hover:text-bordeaux-600 hover:border-transparent transition-all duration-300"
              >
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
              </Link>
              <Link
                href="#"
                aria-label="WhatsApp"
                className="h-10 w-10 rounded-full border border-cream-50/15 flex items-center justify-center hover:bg-blush-200 hover:text-bordeaux-600 hover:border-transparent transition-all duration-300"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
              </Link>
              <Link
                href="#"
                aria-label="E-mail"
                className="h-10 w-10 rounded-full border border-cream-50/15 flex items-center justify-center hover:bg-blush-200 hover:text-bordeaux-600 hover:border-transparent transition-all duration-300"
              >
                <Mail className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          {/* Link columns */}
          <FooterColumn
            title="Coleção"
            links={[
              { label: "Recém-nascidas", href: "#" },
              { label: "Bebês", href: "#" },
              { label: "Toddler", href: "#" },
              { label: "Datas especiais", href: "#" },
              { label: "Pronta entrega", href: "#" },
            ]}
            className="md:col-span-2"
          />
          <FooterColumn
            title="Ateliê"
            links={[
              { label: "Nossa história", href: "#" },
              { label: "Encomendas", href: "#" },
              { label: "Cuidados com o laço", href: "#" },
              { label: "Galeria de clientes", href: "#" },
            ]}
            className="md:col-span-2"
          />
          <FooterColumn
            title="Ajuda"
            links={[
              { label: "Trocas e devoluções", href: "#" },
              { label: "Prazo de entrega", href: "#" },
              { label: "Formas de pagamento", href: "#" },
              { label: "FAQ", href: "#" },
              { label: "Contato", href: "#" },
            ]}
            className="md:col-span-2"
          />

          <div className="md:col-span-2 text-sm">
            <h4 className="font-serif uppercase tracking-[0.18em] text-xs text-blush-200 mb-5">
              Atendimento
            </h4>
            <p className="text-cream-50/70 leading-relaxed">
              ter–sáb · 10h às 18h
              <br />
              <a
                href="https://wa.me/5500000000000"
                className="hover:text-blush-200 transition-colors"
              >
                +55 (00) 00000-0000
              </a>
              <br />
              <a
                href="mailto:ola@luaelis.com.br"
                className="hover:text-blush-200 transition-colors"
              >
                ola@luaelis.com.br
              </a>
            </p>
          </div>
        </div>

        <DividerOrnament className="mt-16 mb-10 opacity-70" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-50/50">
          <p>© {new Date().getFullYear()} Lúa &amp; Lis. Feito à mão com carinho em São Paulo.</p>
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-blush-200 transition-colors">
              Política de privacidade
            </Link>
            <Link href="#" className="hover:text-blush-200 transition-colors">
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  className,
}: {
  title: string;
  links: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h4 className="font-serif uppercase tracking-[0.18em] text-xs text-blush-200 mb-5">
        {title}
      </h4>
      <ul className="space-y-3 text-sm text-cream-50/70">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="hover:text-blush-200 transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
