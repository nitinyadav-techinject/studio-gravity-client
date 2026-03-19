/**
 * In-memory access token store.
 *
 * ─── Why in-memory? ───────────────────────────────────────────────────────────
 * Storing the access token in localStorage / sessionStorage exposes it to any
 * JavaScript running on the page (XSS). Keeping it in a JS module variable
 * makes it invisible to injected scripts.
 *
 * ─── What about the refresh token? ───────────────────────────────────────────
 * The refresh token is stored in an HttpOnly cookie (set by the backend).
 * HttpOnly cookies cannot be read by JavaScript at all — not even by this file.
 * The browser sends the cookie automatically on requests to the backend.
 * This file does NOT manage the refresh token.
 *
 * ─── Trade-off ────────────────────────────────────────────────────────────────
 * The access token is lost on page reload. On startup, AuthContext calls
 * /auth/refresh (the browser automatically attaches the HttpOnly cookie) to
 * silently obtain a fresh access token — so the user experience is seamless.
 */

let _accessToken: string | null = null;

export const tokenStore = {
    getAccessToken: (): string | null => _accessToken,
    setAccessToken: (token: string): void => { _accessToken = token; },
    clearAccessToken: (): void => { _accessToken = null; },

    /** Remove any non-sensitive persisted data (refresh token lives in HttpOnly cookie). */
    clearAll: (): void => {
        _accessToken = null;
        localStorage.removeItem('user');
    },
};
