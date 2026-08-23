export default function PagePlaceholder({ title }) {
  return (
    <div className="container-app py-16">
      <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
      <p className="mt-2 text-sm text-ink-500">
        This screen is scaffolded and ready for the Supabase data integration
        phase.
      </p>
    </div>
  );
}
