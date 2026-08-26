import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, User } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { clsx } from '../../utils/clsx';
import { signUp } from '../../services/authService';
import { checkPasswordStrength, scorePasswordStrength } from '../../utils/passwordStrength';
import { isValidIndianPhone, normalizeIndianPhone } from '../../utils/phone';

const STRENGTH_COLORS = ['bg-danger-500', 'bg-danger-500', 'bg-amber-500', 'bg-lime-500', 'bg-green-600'];

const ROLES = [
  { value: 'customer', label: 'Customer', icon: User },
  { value: 'shopkeeper', label: 'Shopkeeper', icon: Store },
];

export default function Register() {
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const strength = scorePasswordStrength(form.password);
  const passwordsMatch = confirmPassword.length > 0 && form.password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && form.password !== confirmPassword;

  function handlePhoneChange(e) {
    // Keep only digits, and cap at 10 digits — a valid Indian mobile
    // number can't be longer than that, so don't let the field accept more.
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm({ ...form, phone: digitsOnly });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    if (!termsAccepted) {
      setError('Please agree to the Privacy Policy and Terms of Service to continue.');
      return;
    }
    if (!isValidIndianPhone(form.phone)) {
      setError('Enter a correct 10-digit phone number (e.g. 9876543210).');
      return;
    }
    const { valid, issues } = checkPasswordStrength(form.password);
    if (!valid) {
      setError(`Password needs: ${issues.join(', ')}.`);
      return;
    }
    if (form.password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter to confirm.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signUp({ ...form, phone: normalizeIndianPhone(form.phone), role, termsAccepted });
      navigate('/auth/verify', { state: { email: form.email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-xl font-bold text-ink-900">Create your account</h1>
      <p className="mt-1 text-sm text-ink-500">Join NUKKAD in a minute</p>

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

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          label="Full name"
          name="fullName"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Input
          label="Phone"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="9876543210"
          name="phone"
          value={form.phone}
          onChange={handlePhoneChange}
          hint="Enter correct 10-digit phone number"
          required
        />
        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            hint="At least 10 characters, with upper/lowercase, a number, and a symbol."
            required
          />
          {form.password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={clsx(
                      'h-1.5 flex-1 rounded-full transition-colors',
                      i < strength.score ? STRENGTH_COLORS[strength.score] : 'bg-ink-100'
                    )}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-ink-500">Password strength: {strength.label}</p>
            </div>
          )}
        </div>
        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={passwordsMismatch ? 'Passwords do not match.' : undefined}
          hint={!passwordsMismatch && passwordsMatch ? 'Passwords match.' : 'Re-enter your password.'}
          required
        />
        <label className="flex items-start gap-2 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-500 focus-ring"
          />
          <span>
            I agree to NUKKAD's{' '}
            <Link to="/terms" target="_blank" className="text-brand-600 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" target="_blank" className="text-brand-600 underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {error && <p className="text-sm text-danger-500">{error}</p>}
        <Button
          type="submit"
          loading={loading}
          disabled={!checkPasswordStrength(form.password).valid || !passwordsMatch}
          className="mt-2 w-full"
        >
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-medium text-brand-600">
          Log in
        </Link>
      </p>
    </Card>
  );
}
