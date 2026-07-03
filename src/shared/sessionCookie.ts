import { SESSION_COOKIE } from "./publicRoutes";

const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

// Cookie não-HTTPOnly usado só como flag de "existe sessão" para o
// middleware decidir se libera a navegação. O token em si continua só no
// SDK do Supabase (localStorage); a validação de verdade é sempre no backend.
export function setSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${THIRTY_DAYS_SECONDS}; samesite=lax`;
}

export function clearSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
