import { useCallback, useEffect, useState } from 'react';
import { Mail, ShieldCheck } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/states/LoadingState';
import EmptyState from '../../components/states/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { getMyGrievances, fileGrievance } from '../../services/grievanceService';

const STATUS_STYLES = {
  open: 'bg-brand-50 text-brand-600',
  in_progress: 'bg-warning-500/10 text-warning-500',
  resolved: 'bg-success-500/10 text-success-500',
  closed: 'bg-ink-200 text-ink-600',
};

export default function Grievance() {
  const { isAuthenticated, user } = useAuth();
  const [form, setForm] = useState({ subject: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(isAuthenticated);

  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      setGrievances(await getMyGrievances());
    } catch {
      // non-critical — form still works even if history fails to load
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitError('');
    setSubmitting(true);
    try {
      await fileGrievance({ userId: user.id, subject: form.subject.trim(), description: form.description.trim() });
      setForm({ subject: '', description: '' });
      setSubmitted(true);
      await load();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-app max-w-xl py-10">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
        <ShieldCheck className="h-6 w-6 text-brand-500" aria-hidden="true" />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-ink-900">Grievance Redressal</h1>
      <p className="mt-2 text-sm text-ink-600">
        If you have a concern about your data or how it's handled, file it here. Under the DPDP
        Act, 2023, we aim to respond within <strong>90 days</strong>. You can also escalate
        unresolved grievances to the Data Protection Board of India.
      </p>

      <Card className="mt-4 p-4">
        <div className="flex items-center gap-2 text-sm text-ink-700">
          <Mail className="h-4 w-4 text-ink-400" aria-hidden="true" />
          Grievance Officer:{' '}
          <a href="mailto:grievance@nukkad.in" className="text-brand-600 underline">
            grievance@nukkad.in
          </a>
        </div>
        <p className="mt-1 text-xs text-ink-400">
          Replace this with your real registered Grievance Officer contact before going live —
          DPDP Rule 3 requires this to be a genuine, monitored contact.
        </p>
      </Card>

      {!isAuthenticated ? (
        <Card className="mt-6 p-4 text-sm text-ink-600">
          Please log in to file a grievance through the form, or email us directly using the
          address above.
        </Card>
      ) : (
        <>
          <Card className="mt-6 p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink-900">File a grievance</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-800">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  required
                  className="rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 focus-ring focus:border-brand-500"
                />
              </div>
              {submitError && <p className="text-sm text-danger-500">{submitError}</p>}
              {submitted && <p className="text-sm text-success-500">Grievance filed. We'll respond within 90 days.</p>}
              <Button type="submit" loading={submitting}>
                Submit grievance
              </Button>
            </form>
          </Card>

          <div className="mt-6">
            <h2 className="mb-3 text-sm font-semibold text-ink-900">Your grievances</h2>
            {loading ? (
              <LoadingState label="Loading…" />
            ) : grievances.length === 0 ? (
              <EmptyState title="No grievances filed" />
            ) : (
              <div className="flex flex-col gap-2">
                {grievances.map((g) => (
                  <Card key={g.id} className="p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-ink-900">{g.subject}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          STATUS_STYLES[g.status] ?? 'bg-ink-100 text-ink-600'
                        }`}
                      >
                        {g.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink-500">
                      Filed {new Date(g.created_at).toLocaleDateString()}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
