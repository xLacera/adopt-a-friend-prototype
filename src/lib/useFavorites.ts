import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "./api";
import { useCurrentUser } from "./useCurrentUser";
import type { Pet } from "./types";

export const useFavorites = () => {
  const { isAuthenticated } = useCurrentUser();
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch<Pet[]>("/api/favorites", { auth: true });
      setFavorites(data);
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isFavorite = (petId: number) => favorites.some((p) => p.id === petId);

  const toggle = async (petId: number) => {
    if (!isAuthenticated) return false;
    try {
      if (isFavorite(petId)) {
        await apiFetch(`/api/favorites/${petId}`, { method: "DELETE", auth: true });
      } else {
        await apiFetch(`/api/favorites/${petId}`, { method: "POST", auth: true });
      }
      await refresh();
      return true;
    } catch {
      return false;
    }
  };

  return { favorites, loading, isFavorite, toggle, refresh };
};
