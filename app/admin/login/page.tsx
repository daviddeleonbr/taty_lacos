import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Entrar · admin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  return (
    <main className="min-h-screen grain bg-cream-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <LoginForm next={searchParams.next} />
      </div>
    </main>
  );
}
