import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { getMyShop } from '../services/shopService';

export function useMyShop() {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMyShop(user.id);
      setShop(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  return { shop, setShop, loading, error, reload: load };
}
