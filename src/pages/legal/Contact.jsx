import { Mail } from 'lucide-react';

export default function Contact() {
  return (
    <div className="container-app max-w-2xl py-10">
      <h1 className="text-2xl font-bold text-ink-900">Contact us</h1>
      <p className="mt-2 text-sm text-ink-600">
        For general support, reach out at:
      </p>
      <div className="mt-3 flex items-center gap-2 text-sm text-ink-700">
        <Mail className="h-4 w-4 text-ink-400" aria-hidden="true" />
        <a href="mailto:support@nukkad.in" className="text-brand-600 underline">
          support@nukkad.in
        </a>
      </div>
      <p className="mt-4 text-xs text-ink-400">
        Replace with your real support address before launch. For data-protection concerns
        specifically, use the <a href="/grievance" className="text-brand-600 underline">Grievance page</a> instead.
      </p>
    </div>
  );
}
