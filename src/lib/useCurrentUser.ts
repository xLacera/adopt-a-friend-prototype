import { useEffect, useState } from "react";
import { apiFetch, getToken } from "./api";
import type { CurrentUser } from "./types";

export const useCurrentUser = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const loadUser = async () => {
      const token = getToken();
      if (!token) {
        if (alive) {
          setUser(null);
          setLoading(false);
        }
        return;
      }
      try {
        const data = await apiFetch<CurrentUser>("/api/auth/me", { auth: true });
        if (alive) setUser(data);
      } catch {
        if (alive) setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadUser();
    window.addEventListener("authChange", loadUser);
    return () => {
      alive = false;
      window.removeEventListener("authChange", loadUser);
    };
  }, []);

  return { user, loading, isAuthenticated: !!user, isAdmin: user?.role === "ADMIN" };
};
