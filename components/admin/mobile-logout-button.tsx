"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

export function MobileLogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  async function logout() {
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      // ignore — vamos redirecionar de qualquer jeito
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      disabled={busy}
      aria-label="Sair"
      className="p-1.5 rounded-full text-ink-400 hover:text-bordeaux-500 hover:bg-blush-50 transition-colors disabled:opacity-50"
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.6} />
      ) : (
        <LogOut className="h-4 w-4" strokeWidth={1.6} />
      )}
    </button>
  );
}
