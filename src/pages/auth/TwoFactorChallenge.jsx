import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { listFactors, verifyLoginChallenge } from '../../services/mfaService';

const ROLE_HOME = {
  customer: '/',
  shopkeeper: '/shopkeeper',
};

export default function TwoFactorChallenge() {
  const [code, setCode] = useState('');
  const [factorId, setFactorId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingFactor, setLoadingFactor] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role;

  useEffect(() => {
    listFactors()
      .then((factors) => {
        const verified = factors.totp?.find((f) => f.status === 'verified');
        if (!verified) {
          // Nothing to challenge against — shouldn't normally happen, but
          // fail safe by sending them back to login rather than get stuck.
          navigate('/auth/login', { replace: true });
          return;
        }
        setFactorId(verified.id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingFactor(false));
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading || !factorId) return;
    setError('');
    setLoading(true);
    try {
      await verifyLoginChallenge(factorId, code);
      navigate(location.state?.from?.pathname ?? ROLE_HOME[role] ?? '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loadingFactor) return null;

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
        <ShieldCheck className="h-6 w-6 text-brand-500" aria-hidden="true" />
      </div>
      <h1 className="mt-4 text-xl font-bold text-ink-900">Two-factor verification</h1>
      <p className="mt-1 text-sm text-ink-500">
        Enter the 6-digit code from your authenticator app.
      </p>

      <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
        <Input
          label="Code"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          autoFocus
        />
        {error && <p className="text-sm text-danger-500">{error}</p>}
        <Button type="submit" loading={loading}>
          Verify
        </Button>
      </form>
    </Card>
  );
}
