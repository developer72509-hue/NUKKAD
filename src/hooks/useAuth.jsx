import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getSession,
  fetchProfile,
  onAuthStateChange,
  signOut as authSignOut,
} from '../services/authService';

const AuthContext = createContext(null);

// Shared across StrictMode's dev-only mount→unmount→remount cycle so the
// initial session check fires exactly once instead of twice concurrently
// (two concurrent calls can race Supabase's rotating refresh token and
// produce a spurious 400 on the second one — this doesn't corrupt app
// state thanks to the 'active' guard below, but it's real, avoidable noise).
let initialSessionPromise = null;

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  async function hydrateProfile(nextSession) {
    if (!nextSession?.user) {
      setProfile(null);
      return;
    }
    setProfileLoading(true);
    try {
      const p = await fetchProfile(nextSession.user.id);
      setProfile(p);
    } catch (err) {
      if (err.code === 'PGRST116') {
        // No profile row. Could be a brand-new signup racing the DB
        // trigger — give it one short retry before concluding the
        // account genuinely no longer exists (e.g. deleted server-side,
        // leaving a stale but not-yet-expired local session).
        await new Promise((r) => setTimeout(r, 800));
        try {
          const p = await fetchProfile(nextSession.user.id);
          setProfile(p);
          return;
        } catch {
          await authSignOut().catch(() => {});
          setSession(null);
          setProfile(null);
          return;
        }
      }
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        initialSessionPromise ??= getSession();
        const initialSession = await initialSessionPromise;
        if (!active) return;
        setSession(initialSession);
        await hydrateProfile(initialSession);
      } finally {
        if (active) setSessionLoading(false);
      }
    })();

    const unsubscribe = onAuthStateChange(async (nextSession) => {
      if (!active) return;
      setSession(nextSession);
      await hydrateProfile(nextSession);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      role: profile?.role ?? null,
      isAuthenticated: Boolean(session),
      emailVerified: Boolean(session?.user?.email_confirmed_at),
      loading: sessionLoading || profileLoading,
      signOut: authSignOut,
      refreshProfile: () => hydrateProfile(session),
      setProfile,
    }),
    [session, profile, sessionLoading, profileLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
