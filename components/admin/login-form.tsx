"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RibbonIcon } from "@/components/icons/decorative";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Não foi possível entrar.");
      }
      const target = next && next.startsWith("/admin") ? next : "/admin/pedidos";
      router.push(target);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setSubmitting(false);
    }
  }

  return (
    <div className="relative">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-blush-100/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-champagne-100/40 blur-3xl pointer-events-none" />

      <div className="relative rounded-[2rem] bg-cream border border-blush-100/60 shadow-soft-xl p-8 sm:p-10">
        {/* Brand */}
        <div className="flex flex-col items-center text-center">
          <div className="h-14 w-14 rounded-full bg-blush-100 flex items-center justify-center mb-4">
            <RibbonIcon className="h-7 w-7 text-bordeaux-500" />
          </div>
          <p className="font-serif tracking-[0.2em] uppercase text-sm text-ink-600">
            Lúa &amp; Lis
          </p>
          <p className="font-script text-base text-champagne-600 -mt-0.5">
            ateliê · admin
          </p>
        </div>

        {/* Title */}
        <div className="mt-8 text-center">
          <h1 className="font-serif text-2xl text-ink-600">Bem-vinda de volta</h1>
          <p className="mt-2 text-sm text-ink-500/80 leading-relaxed">
            Entre para acompanhar pedidos e atualizar o site.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="text-[10px] uppercase tracking-[0.18em] font-medium text-ink-400"
            >
              Senha do ateliê
            </label>
            <div className="mt-2 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400">
                <Lock className="h-4 w-4" strokeWidth={1.6} />
              </span>
              <input
                id="password"
                type={show ? "text" : "password"}
                autoFocus
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 h-12 rounded-full bg-cream-100 border border-blush-100 text-sm text-ink-600 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-bordeaux-500 transition-colors"
              >
                {show ? (
                  <EyeOff className="h-4 w-4" strokeWidth={1.6} />
                ) : (
                  <Eye className="h-4 w-4" strokeWidth={1.6} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-bordeaux-500 bg-blush-100/60 border border-bordeaux-500/20 rounded-2xl px-4 py-3">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting || !password}
            className="w-full"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando…
              </>
            ) : (
              "Entrar no ateliê"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-blush-100/60 text-center">
          <Link
            href="/"
            className="text-xs text-ink-400 hover:text-bordeaux-500 transition-colors"
          >
            ← Voltar para a loja
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-[11px] text-ink-400">
        Acesso restrito ao ateliê.{" "}
        <span className="font-script text-sm text-champagne-600">com carinho ♡</span>
      </p>
    </div>
  );
}
