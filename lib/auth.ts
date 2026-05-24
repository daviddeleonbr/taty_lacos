/**
 * Autenticação simples por senha única + cookie HMAC assinado.
 * Edge-compatível (usa Web Crypto), funciona em middleware.
 *
 * Configuração via env vars (.env.local):
 *   ADMIN_PASSWORD=...          → senha que a Bruna usa para entrar
 *   ADMIN_SESSION_SECRET=...    → string aleatória longa para assinar tokens
 *
 * Sem essas variáveis, usa defaults inseguros (apenas para dev).
 */

export const SESSION_COOKIE = "lacos_session";
const SESSION_DAYS = 30;
export const SESSION_MAX_AGE_SECONDS = SESSION_DAYS * 24 * 60 * 60;

const DEV_PASSWORD = "admin";
const DEV_SECRET = "DEV_INSECURE_SECRET_PLEASE_CHANGE_FOR_PRODUCTION";

function warnedOnce(key: string) {
  const g = globalThis as unknown as { __lacosAuthWarn?: Set<string> };
  if (!g.__lacosAuthWarn) g.__lacosAuthWarn = new Set();
  if (g.__lacosAuthWarn.has(key)) return false;
  g.__lacosAuthWarn.add(key);
  return true;
}

export function getAdminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) {
    if (warnedOnce("password")) {
      console.warn(
        "[auth] ADMIN_PASSWORD não definido. Usando 'admin' (NÃO USE EM PRODUÇÃO)."
      );
    }
    return DEV_PASSWORD;
  }
  return pw;
}

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) {
    if (warnedOnce("secret")) {
      console.warn(
        "[auth] ADMIN_SESSION_SECRET não definido. Usando default inseguro (apenas dev)."
      );
    }
    return DEV_SECRET;
  }
  return s;
}

function base64url(bytes: Uint8Array): string {
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmacSha256(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return base64url(new Uint8Array(sig));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) {
    res |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return res === 0;
}

export async function passwordMatches(input: string): Promise<boolean> {
  return timingSafeEqual(input, getAdminPassword());
}

export async function createSessionToken(): Promise<string> {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = String(exp);
  const sig = await hmacSha256(payload, getSecret());
  return `${payload}.${sig}`;
}

export async function verifySession(token: string | undefined | null): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  try {
    const expected = await hmacSha256(payload, getSecret());
    return timingSafeEqual(expected, sig);
  } catch {
    return false;
  }
}
