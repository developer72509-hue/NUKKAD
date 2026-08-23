import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';

/**
 * Fallback destination for Supabase's email confirmation link, for cases
 * where the "Confirm signup" template still renders {{ .ConfirmationURL }}
 * instead of {{ .Token }}. The primary verification path is now the
 * 6-digit code entered on /auth/verify (supabase.auth.verifyOtp); this page
 * only matters if the email contains a clickable link instead of/alongside
 * a code, and remains wired via emailRedirectTo in authService.signUp.
 *
 * supabaseClient is configured with detectSessionInUrl: true, so the
 * access/refresh tokens in the URL are already parsed and the session
 * established by the time useAuth's listener fires — this page just waits
 * for that and routes based on the (now verified) session.
 *
 * If the link is expired/invalid, Supabase redirects here with
 * #error=...&error_description=... instead of tokens.
 */
export default function AuthCallback() {
  const { isAuthenticated, emailVerified, loading } = useAuth();
  const navigate = useNavigate();
  const [linkError, setLinkError] = useState('');
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const err = hash.get('error_description') || hash.get('error');
    if (err) setLinkError(decodeURIComponent(err.replace(/\+/g, ' ')));
  }, []);

  useEffect(() => {
    if (loading || linkError) return;
    if (isAuthenticated && emailVerified) {
      navigate('/', { replace: true });
    }
  }, [loading, isAuthenticated, emailVerified, linkError, navigate]);

  // No error hash, but also no session ever materialised (e.g. the page was
  // opened directly, or the link was already consumed) — don't spin forever.
  useEffect(() => {
    if (loading || linkError) return;
    if (isAuthenticated && emailVerified) return; // already navigating away
    const t = setTimeout(() => setTimedOut(true), 4000);
    return () => clearTimeout(t);
  }, [loading, isAuthenticated, emailVerified, linkError]);

  if (linkError) {
    return (
      <ErrorState
        title="This link didn't work"
        message={linkError}
        onRetry={() => navigate('/auth/verify', { replace: true })}
      />
    );
  }

  if (timedOut) {
    return (
      <ErrorState
        title="We couldn't confirm your email"
        message="This link may have already been used or expired. Request a new confirmation email and try again."
        onRetry={() => navigate('/auth/verify', { replace: true })}
      />
    );
  }

  return <LoadingState label="Confirming your email…" />;
}
