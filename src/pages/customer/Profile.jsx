import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, LogOut, User, Download, Trash2, ShieldCheck } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../services/authService';
import { exportMyData, downloadAsJson } from '../../services/dataExportService';
import { deleteMyAccount } from '../../services/accountService';
import TwoFactorSetup from '../../components/account/TwoFactorSetup';
import { isValidIndianPhone, normalizeIndianPhone } from '../../utils/phone';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी' },
];

export default function Profile() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    language: profile?.language ?? 'en',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const [deleteStep, setDeleteStep] = useState(0); // 0=idle, 1=confirming
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  async function handleExport() {
    setExporting(true);
    setExportError('');
    try {
      const data = await exportMyData(user.id);
      downloadAsJson(data, `nukkad-my-data-${user.id}.json`);
    } catch (err) {
      setExportError(err.message);
    } finally {
      setExporting(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleting || deleteConfirmText !== 'DELETE') return;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteMyAccount();
      await signOut();
      navigate('/', { replace: true });
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError('');
    setSaved(false);

    if (form.phone && !isValidIndianPhone(form.phone)) {
      setError('Enter a valid 10-digit mobile number (e.g. 98765 43210).');
      setSaving(false);
      return;
    }

    try {
      await updateProfile(user.id, { ...form, phone: normalizeIndianPhone(form.phone) });
      await refreshProfile();
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <div className="container-app max-w-lg py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
          <User className="h-7 w-7 text-brand-500" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink-900">{profile?.full_name || 'Your profile'}</h1>
          <p className="text-sm text-ink-500">{user?.email}</p>
        </div>
      </div>

      <Card className="mt-6 p-4">
        <Link
          to="/addresses"
          className="flex items-center gap-3 rounded-xl px-1 py-1 text-sm font-medium text-ink-700 hover:text-ink-900 focus-ring"
        >
          <MapPin className="h-4 w-4 text-ink-400" aria-hidden="true" />
          Manage addresses
        </Link>
      </Card>

      <Card className="mt-4 p-4">
        <h2 className="mb-3 text-sm font-semibold text-ink-900">Personal details</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full name"
            name="fullName"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            maxLength={13}
            placeholder="98765 43210"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-800">Language</label>
            <div className="flex gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setForm({ ...form, language: l.value })}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-ring ${
                    form.language === l.value
                      ? 'bg-brand-500 text-white'
                      : 'border border-ink-200 text-ink-600 hover:bg-ink-50'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-danger-500">{error}</p>}
          {saved && <p className="text-sm text-success-500">Profile updated.</p>}

          <Button type="submit" loading={saving} className="w-full">
            Save changes
          </Button>
        </form>
      </Card>

      <TwoFactorSetup />

      <Card className="mt-4 p-4">
        <h2 className="mb-3 text-sm font-semibold text-ink-900">Your data & privacy</h2>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-3 rounded-xl px-1 py-1 text-sm font-medium text-ink-700 hover:text-ink-900 focus-ring disabled:opacity-60"
          >
            <Download className="h-4 w-4 text-ink-400" aria-hidden="true" />
            {exporting ? 'Preparing download…' : 'Download my data'}
          </button>
          {exportError && <p className="text-xs text-danger-500">{exportError}</p>}

          <Link
            to="/grievance"
            className="flex items-center gap-3 rounded-xl px-1 py-1 text-sm font-medium text-ink-700 hover:text-ink-900 focus-ring"
          >
            <ShieldCheck className="h-4 w-4 text-ink-400" aria-hidden="true" />
            File a grievance
          </Link>
        </div>
      </Card>

      <Card className="mt-4 border-danger-500/30 p-4">
        <h2 className="mb-1 text-sm font-semibold text-danger-500">Delete account</h2>
        <p className="mb-3 text-xs text-ink-500">
          If you've never placed an order, your account is deleted permanently. If you have order
          history, your profile is anonymised and your login permanently disabled, while order
          records are retained as required by law.
        </p>

        {deleteStep === 0 ? (
          <Button variant="danger" size="sm" onClick={() => setDeleteStep(1)}>
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Delete my account
          </Button>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-ink-600">
              This cannot be undone. Type <strong>DELETE</strong> to confirm.
            </p>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
            />
            {deleteError && <p className="text-xs text-danger-500">{deleteError}</p>}
            <div className="flex gap-2">
              <Button
                variant="danger"
                size="sm"
                loading={deleting}
                disabled={deleteConfirmText !== 'DELETE'}
                onClick={handleDeleteAccount}
              >
                Confirm deletion
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteStep(0);
                  setDeleteConfirmText('');
                  setDeleteError('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Button variant="outline" className="mt-6 w-full" onClick={handleSignOut}>
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Sign out
      </Button>
    </div>
  );
}
