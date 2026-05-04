import { Capacitor } from "@capacitor/core";

// Permite sobreescribir via .env (VITE_API_URL=https://api.example.com).
// Cuando la app corre como APK nativa Android (envuelta por Capacitor),
// "localhost" apunta al propio dispositivo y no llega al backend del PC.
// El emulador de Android Studio expone la máquina anfitriona en 10.0.2.2.
// En el navegador (npm run dev) seguimos usando localhost.
const envUrl = import.meta.env.VITE_API_URL as string | undefined;

export const API_BASE_URL =
  envUrl ??
  (Capacitor.isNativePlatform() ? "http://10.0.2.2:3001" : "http://localhost:3001");

const TOKEN_KEY = "adopt_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("authChange"));
};
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("authChange"));
};

interface ApiOptions extends RequestInit {
  auth?: boolean;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { auth = false, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...rest, headers: finalHeaders });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data && (data.error || data.message)) || `Error ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return data as T;
}
