export default function Privacy() {
  return (
    <div className="container-app max-w-2xl py-10">
      <h1 className="text-2xl font-bold text-ink-900">Privacy Policy</h1>
      <p className="mt-1 text-sm text-ink-500">Last updated: 22 August 2026</p>

      <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed text-ink-700">
        <section>
          <h2 className="text-base font-semibold text-ink-900">1. Who we are</h2>
          <p className="mt-1">
            NUKKAD ("we", "us") operates a local-commerce platform connecting customers with
            nearby shops. For the purposes of India's Digital Personal Data Protection Act, 2023
            ("DPDP Act") and the DPDP Rules, 2025, NUKKAD is the Data Fiduciary for the personal
            data described below.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">2. What personal data we collect</h2>
          <table className="mt-2 w-full text-left text-xs">
            <thead>
              <tr className="border-b border-ink-200 text-ink-500">
                <th className="py-1.5 pr-2">Data</th>
                <th className="py-1.5">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              <tr><td className="py-1.5 pr-2">Name, email, phone</td><td className="py-1.5">Account creation, order communication</td></tr>
              <tr><td className="py-1.5 pr-2">Delivery address, coordinates</td><td className="py-1.5">Order delivery, shop discovery</td></tr>
              <tr><td className="py-1.5 pr-2">Order history</td><td className="py-1.5">Order fulfilment, support, legal record-keeping</td></tr>
              <tr><td className="py-1.5 pr-2">Shop details, product listings</td><td className="py-1.5">Operating a shopkeeper storefront</td></tr>
              <tr><td className="py-1.5 pr-2">Reviews and ratings</td><td className="py-1.5">Helping other customers choose shops</td></tr>
            </tbody>
          </table>
          <p className="mt-2">
            We do not collect more than what is needed for these purposes, and we do not use
            your data for anything beyond them without asking again.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">3. Consent</h2>
          <p className="mt-1">
            By creating an account, you consent to the collection and use of your personal data
            as described here. You may withdraw consent at any time by deleting your account
            (see Section 7) — withdrawal is as easy as giving consent was.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">4. How we protect your data</h2>
          <p className="mt-1">
            Data is stored with row-level access controls so that no user can read another
            user's private data. Shopkeepers only ever see the delivery details for their own
            orders, never your saved address book. We do not sell your personal data to anyone.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">5. Data retention</h2>
          <p className="mt-1">
            We retain order records for as long as needed for business, tax, and dispute-resolution
            purposes, even after you delete your account, in an anonymised form. Data no longer
            needed for its original purpose (e.g. saved addresses, favourites) is deleted, not
            merely archived.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">6. Your rights</h2>
          <p className="mt-1">Under the DPDP Act, you have the right to:</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            <li>Access a copy of your personal data (Profile → Download my data)</li>
            <li>Correct inaccurate data (Profile → edit)</li>
            <li>Erase your data, subject to lawful retention needs (Profile → Delete account)</li>
            <li>Withdraw consent at any time</li>
            <li>File a grievance (see Section 8) and, if unresolved, escalate to the Data Protection Board of India</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">7. Account deletion</h2>
          <p className="mt-1">
            If you have never placed an order, your account and all associated data are deleted
            permanently. If you have order history, we anonymise your profile (name, phone,
            photo removed) and permanently disable login, while retaining the order records
            themselves as a lawful retention ground under DPDP Rule 8.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">8. Grievance redressal</h2>
          <p className="mt-1">
            If you have a concern about how your data is handled, contact our Grievance Officer
            via the <a href="/grievance" className="text-brand-600 underline">Grievance page</a>.
            We aim to resolve grievances within 90 days, per DPDP Rule 14(3).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">9. Where your data is stored</h2>
          <p className="mt-1">
            Your data is stored on servers located in India (Mumbai region).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">10. Children's data</h2>
          <p className="mt-1">
            NUKKAD is not intended for use by individuals under 18. We do not knowingly collect
            data from minors.
          </p>
        </section>
      </div>
    </div>
  );
}
