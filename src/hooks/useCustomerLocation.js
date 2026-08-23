import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { getAddresses } from '../services/addressService';

const SESSION_KEY = 'nukkad_session_location_v1';

function loadSessionLocation() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Resolves "where is this customer" from two sources:
 *  1. A saved default address (logged-in customers) — takes priority.
 *  2. A one-off browser GPS fix for this tab (works for guests too,
 *     stored in sessionStorage so a refresh doesn't ask again).
 *
 * Until either exists, `needsLocation` is true and callers should show a
 * location prompt instead of an unfiltered shop list — a shop "5 km away"
 * is meaningless without knowing where the customer actually is.
 */
export function useCustomerLocation() {
  const { isAuthenticated, role } = useAuth();
  const [savedLocation, setSavedLocation] = useState(null);
  const [hasAnyAddress, setHasAnyAddress] = useState(null);
  const [sessionLocation, setSessionLocation] = useState(loadSessionLocation);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || role !== 'customer') {
      setLoading(false);
      setHasAnyAddress(null);
      setSavedLocation(null);
      return;
    }
    let active = true;
    getAddresses()
      .then((addresses) => {
        if (!active) return;
        setHasAnyAddress(addresses.length > 0);
        const chosen = addresses.find((a) => a.is_default) ?? addresses[0];
        setSavedLocation(
          chosen
            ? { latitude: chosen.latitude, longitude: chosen.longitude, addressLine: chosen.address_line }
            : null
        );
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [isAuthenticated, role]);

  const requestBrowserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Location services are not available on this device.');
      return;
    }
    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setSessionLocation(next);
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
        } catch {
          // sessionStorage unavailable (e.g. private browsing) — location
          // still works for the rest of this render, just won't persist.
        }
        setLocating(false);
      },
      () => {
        setLocationError(
          'Could not get your location. Please allow location access, or set a delivery address instead.'
        );
        setLocating(false);
      }
    );
  }, []);

  const location = savedLocation ?? sessionLocation;

  return {
    location,
    hasAnyAddress,
    loading,
    needsLocation: !loading && location == null,
    locating,
    locationError,
    requestBrowserLocation,
  };
}
