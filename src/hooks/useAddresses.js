import { useCallback, useEffect, useState } from 'react';
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../services/addressService';

export function useAddresses(profileId) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function create(payload) {
    const created = await addAddress({ ...payload, profileId });
    await load();
    return created;
  }

  async function update(id, payload) {
    await updateAddress(id, payload);
    await load();
  }

  async function remove(id) {
    await deleteAddress(id);
    await load();
  }

  async function makeDefault(id) {
    await setDefaultAddress(id);
    await load();
  }

  return { addresses, loading, error, reload: load, create, update, remove, makeDefault };
}
