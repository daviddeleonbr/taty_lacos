"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { RibbonIcon } from "@/components/icons/decorative";

const navLinks = [
  { label: "Coleção", href: "/#colecao" },
  { label: "Sob Encomenda", href: "/encomenda" },
  { label: "Datas Especiais", href: "/#datas" },
  { label: "Nossa História", href: "/#sobre" },
];

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-bordeaux-500 text-cream text-[11px] tracking-[0.18em] uppercase">
        <div className="container-boutique flex h-9 items-center justify-center gap-3 text-center">
          <span className="hidden sm:inline">Frete grátis em pedidos acima de R$ 250</span>
          <span className="sm:hidden">Frete grátis acima de R$ 250</span>
          <span className="hidden sm:inline opacity-50">·</span>
          <span className="hidden sm:inline">Pix com 5% off</span>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500 ease-out-expo",
          scrolled
            ? "bg-cream/85 backdrop-blur-md shadow-soft"
            : "bg-cream/40 backdrop-blur-sm"
        )}
      >
        <div className="container-boutique flex h-20 items-center justify-between">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden -ml-2 p-2 text-ink-600 hover:text-bordeaux-500 transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>

          {/* Desktop nav left */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ink-500 hover:text-bordeaux-500 transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-bordeaux-500 transition-all duration-500 ease-out-expo group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Brand */}
          <Link
            href="/"
            className="flex flex-col items-center gap-0.5 group"
          >
            <RibbonIcon className="h-6 w-6 text-bordeaux-500 transition-transform duration-500 ease-out-expo group-hover:rotate-6" />
            <span className="font-serif text-lg tracking-[0.2em] uppercase text-ink-600">
              Lúa &amp; Lis
            </span>
            <span className="font-script text-[10px] text-champagne-600 -mt-1">
              ateliê de laços
            </span>
          </Link>

          {/* Desktop nav right */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ink-500 hover:text-bordeaux-500 transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-bordeaux-500 transition-all duration-500 ease-out-expo group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            <button
              aria-label="Buscar"
              className="p-2 text-ink-600 hover:text-bordeaux-500 transition-colors hidden sm:block"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              aria-label="Favoritos"
              className="p-2 text-ink-600 hover:text-bordeaux-500 transition-colors hidden sm:block"
            >
              <Heart className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              aria-label="Sacola"
              className="relative p-2 text-ink-600 hover:text-bordeaux-500 transition-colors"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-bordeaux-500 text-cream text-[10px] font-medium flex items-center justify-center">
                2
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <div
              className="absolute inset-0 bg-ink-700/30 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-0 h-full w-[84%] max-w-sm bg-cream shadow-soft-xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-blush-100">
                <div className="flex items-center gap-2">
                  <RibbonIcon className="h-5 w-5 text-bordeaux-500" />
                  <span className="font-serif tracking-[0.18em] uppercase text-sm text-ink-600">
                    Lúa &amp; Lis
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 text-ink-500"
                  aria-label="Fechar menu"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex flex-col p-6 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-serif text-2xl text-ink-600 py-3 border-b border-blush-100/60 hover:text-bordeaux-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto p-6 text-xs text-ink-400">
                <p className="font-script text-base text-champagne-600 mb-1">
                  Cada laço, uma memória.
                </p>
                <p>Atendimento: ter–sáb · 10h às 18h</p>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
