import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store, User } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { clsx } from '../../utils/clsx';
import { signIn, fetchProfile } from '../../services/authService';
import { getAssuranceLevel } from '../../services/mfaService';

const ROLE_HOME = {
  customer: '/',
  shopkeeper: '/shopkeeper',
};

const ROLES = [
  { value: 'customer', label: 'Customer', icon: User },
  { value: 'shopkeeper', label: 'Shopkeeper', icon: Store },
];

export default function Login() {
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const { user } = await signIn(form);
      // The selected tab above is a UX hint only — it never gates access.
      // Redirect is always based on the account's real profiles.role.
      const profile = await fetchProfile(user.id);
      if (profile?.role && profile.role !== role) {
        // Let them know why they're landing somewhere other than the tab they picked.
        setError(
          `This account is registered as a ${profile.role}. Taking you to the ${profile.role} app.`
        );
      }

      const { currentLevel, nextLevel } = await getAssuranceLevel();
      if (nextLevel === 'aal2' && currentLevel !== 'aal2') {
        navigate('/auth/2fa', {
          replace: true,
          state: { role: profile?.role, from: location.state?.from },
        });
        return;
      }

      const destination = location.state?.from?.pathname ?? ROLE_HOME[profile?.role] ?? '/';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-xl font-bold text-ink-900">Welcome back</h1>
      <p className="mt-1 text-sm text-ink-500">Log in to your NUKKAD account</p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {ROLES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            className={clsx(
              'flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-sm font-medium transition-colors focus-ring',
              role === value
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-ink-200 text-ink-600 hover:bg-ink-50'
            )}
          >
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {error && <p className="text-sm text-danger-500">{error}</p>}
        <Button type="submit" loading={loading} className="mt-2 w-full">
          Log in as {role === 'shopkeeper' ? 'Shopkeeper' : 'Customer'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        New to NUKKAD?{' '}
        <Link to="/auth/register" className="font-medium text-brand-600">
          Create an account
        </Link>
      </p>
    </Card>
  );
}
