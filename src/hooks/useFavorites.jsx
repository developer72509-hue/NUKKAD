import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './useAuth';
import { getFavoriteShopIds, addFavorite, removeFavorite } from '../services/favoritesService';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      setLoaded(false);
      return;
    }
    getFavoriteShopIds()
      .then((ids) => active && setFavoriteIds(new Set(ids)))
      .catch(() => {})
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, [isAuthenticated, user?.id]);

  /**
   * Optimistic toggle: flips local state immediately, reverts on failure.
   * Throws on failure so callers can surface an inline error.
   */
  async function toggleFavorite(shopId) {
    const wasFavorite = favoriteIds.has(shopId);

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      wasFavorite ? next.delete(shopId) : next.add(shopId);
      return next;
    });

    try {
      if (wasFavorite) {
        await removeFavorite(shopId);
      } else {
        await addFavorite(shopId, user.id);
      }
    } catch (err) {
      // Rollback on failure.
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        wasFavorite ? next.add(shopId) : next.delete(shopId);
        return next;
      });
      throw err;
    }
  }

  const value = useMemo(
    () => ({
      favoriteIds,
      loaded,
      isFavorite: (shopId) => favoriteIds.has(shopId),
      toggleFavorite,
    }),
    [favoriteIds, loaded]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
