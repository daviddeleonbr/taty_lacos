"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/novo", label: "Novo pedido", icon: Plus },
];

export function AdminNav() {
  const pathname = usePathname();
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
    </nav>
  );
}
