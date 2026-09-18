import createClient, { type Client } from "openapi-fetch";
import type { paths } from "~/types/api";

let _client: Client<paths> | undefined;

/**
 * Typed API client generated from the backend's OpenAPI spec. Paths and their
 * params are checked at compile time — a renamed/removed backend route or a
 * mistyped param name is a build error here instead of a runtime 404/NaN.
 */
export const useApiClient = (): Client<paths> => {
  if (!_client) {
    const config = useRuntimeConfig();
    // On the server, prefer the Docker-internal URL when one's configured
    // (reaches the api container directly instead of round-tripping back
    // out through the reverse proxy); the browser bundle never sees this
    // branch, since process.server is baked in at build time per bundle.
    const baseUrl =
      (import.meta.server && config.apiBaseInternal) || config.public.apiBase;
    _client = createClient<paths>({
      baseUrl,
      credentials: "include",
    });
  }
  return _client;
};

/**
 * Unwraps an openapi-fetch result, throwing on error so existing call sites
 * can keep their try/catch shape instead of destructuring {data, error}
 * everywhere. Mirrors the old useApi composable's throw-on-failure contract.
 *
 * `data` is deliberately typed `unknown` here (not `T`) — the backend doesn't
 * declare response DTOs for most endpoints, so the generated spec's response
 * shape is unreliable (sometimes `never`, sometimes an incorrectly-inferred
 * concrete type). Using `unknown` for the parameter means it always accepts
 * whatever openapi-fetch actually returns; `T` only governs the return type,
 * which callers pin explicitly (`unwrap<Resource[]>(...)`) or leave as `any`.
 */
export const unwrap = <T = any>({
  data,
  error,
}: {
  data?: unknown;
  error?: unknown;
}): T => {
  if (error) {
    const message =
      typeof error === "object" && error && "message" in error
        ? String((error as { message?: unknown }).message)
        : "An error occurred";
    throw new Error(message);
  }
  return data as T;
};
