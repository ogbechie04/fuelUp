export interface AuthorizedFetchOptions extends RequestInit {}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

type UnauthorizedHandler = () => void | Promise<void>;

let unauthorizedHandler: UnauthorizedHandler | null = null;
let unauthorizedInProgress = false;

export const setUnauthorizedHandler = (
  handler: UnauthorizedHandler | null
): void => {
  unauthorizedHandler = handler;
};

const extractErrorMessage = (
  payload: unknown,
  fallback: string
): string => {
  if (isPlainObject(payload)) {
    const candidate =
      (typeof payload.message === 'string' && payload.message) ||
      (typeof payload.error === 'string' && payload.error);
    if (candidate) {
      return candidate;
    }
  }

  if (typeof payload === 'string' && payload.trim().length > 0) {
    return payload;
  }

  return fallback;
};

export async function authorizedFetch<T = unknown>(
  token: string | null | undefined,
  input: string,
  init: AuthorizedFetchOptions = {}
): Promise<T | null> {
  if (!token) {
    throw new Error('Authentication token is missing.');
  }

  const headers = new Headers(init.headers ?? {});
  headers.set('Authorization', `Bearer ${token}`);

  const bodyIsFormData =
    typeof FormData !== 'undefined' && init.body instanceof FormData;

  if (init.body && !headers.has('Content-Type') && !bodyIsFormData) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  const text = await response.text();
  let payload: unknown = null;

  if (text) {
    try {
      payload = JSON.parse(text) as T;
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    if (response.status === 401 && unauthorizedHandler && !unauthorizedInProgress) {
      unauthorizedInProgress = true;
      Promise.resolve(unauthorizedHandler()).finally(() => {
        unauthorizedInProgress = false;
      });
    }

    const message = extractErrorMessage(
      payload,
      response.statusText || 'Request failed'
    );
    throw new Error(message);
  }

  return (payload as T) ?? null;
}
