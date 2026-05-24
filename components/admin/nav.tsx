"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  ImageIcon,
  Loader2,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/conteudo", label: "Conteúdo do site", icon: ImageIcon },
  { href: "/admin/modelos", label: "Modelos de encomenda", icon: Sparkles },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = React.useState(false);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      // ignore — vamos redirecionar de qualquer jeito
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="flex flex-col px-3 py-5 gap-1">
      {links.map((link) => {
        const active =
          pathname === link.href ||
          (link.href !== "/admin" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300",
              active
                ? "bg-bordeaux-500/10 text-bordeaux-600 font-medium"
                : "text-ink-500 hover:bg-blush-50 hover:text-bordeaux-500"
            )}
          >
            <link.icon className="h-4 w-4" strokeWidth={1.6} />
            {link.label}
          </Link>
        );
      })}

      <button
        onClick={logout}
        disabled={loggingOut}
        className="mt-2 flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-ink-400 hover:bg-blush-50 hover:text-bordeaux-500 transition-all duration-300 disabled:opacity-50"
      >
        {loggingOut ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" strokeWidth={1.6} />
        )}
        Sair
      </button>
    </nav>
  );
}
