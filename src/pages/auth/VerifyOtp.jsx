import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { verifyOtp, resendConfirmation } from '../../services/authService';

const RESEND_COOLDOWN_SECONDS = 45;

/**
 * Primary flow: Supabase's "Confirm signup" email delivers a 6-digit code
 * ({{ .Token }}) which is submitted here via supabase.auth.verifyOtp({type:
 * 'signup'}). Verification success/failure and the resulting session come
 * entirely from that call — nothing here marks a user verified locally.
 *
 * NOTE: whether the email actually contains a code depends on the "Confirm
 * signup" template in the Supabase Dashboard (Authentication → Email
 * Templates) using {{ .Token }} rather than {{ .ConfirmationURL }}. That
 * setting can't be read or changed from this codebase/integration — if the
 * template still sends a link, clicking it lands on /auth/callback, which
 * establishes the same real session and this page auto-advances past itself
 * (see the effect below), so both delivery styles resolve correctly either way.
 */
export default function VerifyOtp() {
  const { isAuthenticated, emailVerified, user } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState('');
  const [resendSent, setResendSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setEmail(location.state?.email || user?.email || '');
  }, [location.state, user?.email]);

  // Covers the case where verification happened another way (e.g. the
  // email contained a link and it was clicked in another tab) — Supabase's
  // own session state is the only thing checked here.
  useEffect(() => {
    if (isAuthenticated && emailVerified) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, emailVerified, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  async function handleVerify(e) {
    e.preventDefault();
    if (submitting) return; // prevent duplicate submissions
    setError('');

    if (!email) {
      setError('Missing email — please sign up again.');
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit code from your email.');
      return;
    }

    setSubmitting(true);
    try {
      // Real Supabase verification — throws on wrong/expired/used code.
      // Success establishes a real session with email_confirmed_at set;
      // useAuth picks it up via onAuthStateChange and the effect above navigates.
      await verifyOtp({ email, token: otp, type: 'signup' });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (!email || resendCooldown > 0 || resending) return;
    setResending(true);
    setResendError('');
    setResendSent(false);
    try {
      await resendConfirmation({ email });
      setResendSent(true);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setResendError(err.message);
    } finally {
      setResending(false);
    }
  }

  return (
    <Card className="shadow-float-lg p-6 sm:p-8">
      <div className="gradient-brand shadow-float flex h-14 w-14 items-center justify-center rounded-2xl">
        <KeyRound className="h-7 w-7 text-white" aria-hidden="true" />
      </div>
      <h1 className="mt-4 text-xl font-bold text-ink-900">Verify your OTP</h1>
      <p className="mt-1 text-sm text-ink-500">
        We've sent a 6-digit verification code to{' '}
        <span className="font-medium text-ink-700">{email || 'your email address'}</span>.
        Enter it below to activate your account.
      </p>

      <form className="mt-5 flex flex-col gap-3" onSubmit={handleVerify}>
        <Input
          label="6-digit code"
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="• • • • • •"
          className="text-center text-lg tracking-[0.5em]"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          autoFocus
        />
        {error && <p className="text-sm text-danger-500">{error}</p>}
        <Button type="submit" loading={submitting} disabled={submitting}>
          Verify &amp; continue
        </Button>
      </form>

      <div className="mt-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleResend}
          loading={resending}
          disabled={resendCooldown > 0 || !email || resending}
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Didn't get a code? Resend"}
        </Button>
        {resendSent && <p className="mt-2 text-xs text-success-500">Verification email sent.</p>}
        {resendError && <p className="mt-2 text-xs text-danger-500">{resendError}</p>}
      </div>

      <p className="mt-4 text-xs text-ink-400">
        If your email contained a link instead of a code, opening it works too.
      </p>
    </Card>
  );
}
