/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Admin pode cadastrar imagens via URL (qualquer host HTTPS) ou upload de
    // arquivo (data URL). Para produção, considere restringir a hosts conhecidos
    // (Supabase Storage, Cloudinary, Unsplash) para reduzir risco de SSRF.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
