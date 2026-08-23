import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldOff } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import {
  listFactors,
  enrollTotp,
  confirmEnrollment,
  unenroll,
  cleanupUnverifiedFactors,
} from '../../services/mfaService';

export default function TwoFactorSetup() {
  const [factors, setFactors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [enrolling, setEnrolling] = useState(false);
  const [pendingFactor, setPendingFactor] = useState(null); // { id, totp: { qr_code, secret } }
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  const [unenrolling, setUnenrolling] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      setFactors(await listFactors());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const verifiedTotp = factors?.totp?.find((f) => f.status === 'verified');

  async function handleStartEnroll() {
    setEnrolling(true);
    setError('');
    try {
      await cleanupUnverifiedFactors();
      const data = await enrollTotp();
      setPendingFactor(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnrolling(false);
    }
  }

  async function handleConfirm(e) {
    e.preventDefault();
    if (verifying) return;
    setVerifying(true);
    setError('');
    try {
      await confirmEnrollment(pendingFactor.id, code);
      setPendingFactor(null);
      setCode('');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  }

  async function handleDisable() {
    if (!verifiedTotp || unenrolling) return;
    if (!window.confirm('Turn off two-factor authentication?')) return;
    setUnenrolling(true);
    setError('');
    try {
      await unenroll(verifiedTotp.id);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setUnenrolling(false);
    }
  }

  if (loading) return null;

  return (
    <Card className="mt-4 p-4">
      <h2 className="mb-1 text-sm font-semibold text-ink-900">Two-factor authentication</h2>
      <p className="mb-3 text-xs text-ink-500">
        Add a second step at login using an authenticator app (Google Authenticator, Authy, etc.).
      </p>

      {error && <p className="mb-2 text-xs text-danger-500">{error}</p>}

      {verifiedTotp ? (
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-500">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            2FA is enabled
          </span>
          <Button variant="outline" size="sm" loading={unenrolling} onClick={handleDisable}>
            <ShieldOff className="h-3.5 w-3.5" aria-hidden="true" />
            Turn off
          </Button>
        </div>
      ) : pendingFactor ? (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-ink-600">
            Scan this QR code with your authenticator app, then enter the 6-digit code it shows.
          </p>
          <div
            className="w-fit rounded-lg border border-ink-200 bg-white p-2"
            dangerouslySetInnerHTML={{ __html: pendingFactor.totp.qr_code }}
          />
          <p className="break-all text-xs text-ink-400">
            Can't scan? Enter manually: <span className="font-mono">{pendingFactor.totp.secret}</span>
          </p>
          <form onSubmit={handleConfirm} className="flex flex-col gap-2">
            <Input
              label="6-digit code"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              autoFocus
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" loading={verifying}>
                Confirm & enable
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={async () => {
                  const id = pendingFactor.id;
                  setPendingFactor(null);
                  await unenroll(id).catch(() => {});
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button size="sm" loading={enrolling} onClick={handleStartEnroll}>
          Enable 2FA
        </Button>
      )}
    </Card>
  );
}
