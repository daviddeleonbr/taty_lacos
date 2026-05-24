"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ClipboardList,
  ExternalLink,
  ImageIcon,
  Loader2,
  LogOut,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RibbonIcon } from "@/components/icons/decorative";

const links = [
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/conteudo", label: "Conteúdo do site", icon: ImageIcon },
  { href: "/admin/modelos", label: "Modelos de encomenda", icon: Sparkles },
];

export function MobileShell() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);

  // Fecha o drawer toda vez que mudar de rota
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const currentLabel =
    links.find((l) => pathname === l.href || pathname.startsWith(l.href))?.label ?? "Admin";

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      // ignore
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <header className="lg:hidden h-16 sticky top-0 z-30 bg-cream/95 backdrop-blur-md border-b border-blush-100/60 flex items-center justify-between px-4">
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          className="-ml-2 p-2 text-ink-600 hover:text-bordeaux-500 transition-colors"
        >
          <Menu className="h-5 w-5" strokeWidth={1.6} />
        </button>

        <div className="flex flex-col items-center min-w-0">
          <p className="font-serif tracking-[0.18em] uppercase text-[11px] text-ink-400 leading-none">
            Lúa &amp; Lis
          </p>
          <p className="font-serif text-sm text-ink-600 leading-tight truncate max-w-[180px]">
            {currentLabel}
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          aria-label="Ver loja"
          className="p-2 text-ink-400 hover:text-bordeaux-500 transition-colors"
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.6} />
        </Link>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-ink-700/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-0 h-full w-[86%] max-w-sm bg-cream shadow-soft-xl flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-blush-100/60">
                <Link href="/admin/pedidos" className="flex items-center gap-2.5">
                  <RibbonIcon className="h-6 w-6 text-bordeaux-500" />
                  <div>
                    <p className="font-serif text-sm tracking-[0.18em] uppercase text-ink-600 leading-tight">
                      Lúa &amp; Lis
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-champagne-600">
                      ateliê · admin
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 text-ink-500 hover:text-bordeaux-500 transition-colors"
                  aria-label="Fechar menu"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-3 py-5">
                {links.map((link) => {
                  const active =
                    pathname === link.href || pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all duration-300",
                        active
                          ? "bg-bordeaux-500/10 text-bordeaux-600 font-medium"
                          : "text-ink-600 hover:bg-blush-50 hover:text-bordeaux-500"
                      )}
                    >
                      <link.icon className="h-5 w-5" strokeWidth={1.6} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto border-t border-blush-100/60 px-3 py-4">
                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-ink-500 hover:bg-blush-50 hover:text-bordeaux-500 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" strokeWidth={1.6} />
                  Ver loja pública
                </Link>
                <button
                  onClick={logout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-ink-500 hover:bg-blush-50 hover:text-bordeaux-500 transition-colors disabled:opacity-50"
                >
                  {loggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" strokeWidth={1.6} />
                  )}
                  Sair
                </button>
              </div>

              <p className="px-6 pb-5 text-[10px] text-ink-400 text-center">
                Feito com{" "}
                <span className="font-script text-sm text-champagne-600">carinho ♡</span>
              </p>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
