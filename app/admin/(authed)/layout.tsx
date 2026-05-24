import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { RibbonIcon } from "@/components/icons/decorative";
import { AdminNav } from "@/components/admin/nav";
import { MobileShell } from "@/components/admin/mobile-shell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-cream-100">
      <aside className="hidden lg:flex flex-col w-64 border-r border-blush-100/60 bg-cream sticky top-0 h-screen">
        <div className="px-7 py-7 border-b border-blush-100/60">
          <Link href="/admin/pedidos" className="flex items-center gap-3">
            <RibbonIcon className="h-6 w-6 text-bordeaux-500" />
            <div>
              <p className="font-serif text-sm tracking-[0.18em] uppercase text-ink-600">
                Lúa &amp; Lis
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-champagne-600">
                ateliê · admin
              </p>
            </div>
          </Link>
        </div>

        <AdminNav />

        <div className="mt-auto p-6 text-xs text-ink-400 border-t border-blush-100/60">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 hover:text-bordeaux-500 transition-colors"
          >
            Ver loja pública <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <MobileShell />
        <main className="flex-1 p-4 sm:p-6 lg:p-12">{children}</main>
      </div>
    </div>
  );
}
