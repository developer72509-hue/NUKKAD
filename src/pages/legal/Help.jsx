import { Link } from 'react-router-dom';

const FAQS = [
  { q: 'How do I track my order?', a: 'Go to Orders from the top navigation and open any order to see live status.' },
  { q: 'How do I cancel an order?', a: 'Orders can only be cancelled while still in the "Placed" state, from the order detail page.' },
  { q: 'How do I delete my account or data?', a: 'Go to Profile → Delete account, or see our Privacy Policy for details.' },
  { q: 'How do I contact a shop?', a: "Open the shop's page — their phone number and address are listed there." },
];

export default function Help() {
  return (
    <div className="container-app max-w-2xl py-10">
      <h1 className="text-2xl font-bold text-ink-900">Help Centre</h1>
      <div className="mt-6 flex flex-col gap-4">
        {FAQS.map((f) => (
          <div key={f.q}>
            <h2 className="text-sm font-semibold text-ink-900">{f.q}</h2>
            <p className="mt-1 text-sm text-ink-600">{f.a}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-ink-500">
        Still need help? <Link to="/contact" className="text-brand-600 underline">Contact us</Link>.
      </p>
    </div>
  );
}
