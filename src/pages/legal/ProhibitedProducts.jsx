export default function ProhibitedProducts() {
  return (
    <div className="container-app max-w-2xl py-10">
      <h1 className="text-2xl font-bold text-ink-900">Prohibited Products Policy</h1>
      <p className="mt-1 text-sm text-ink-500">Last updated: 22 August 2026</p>

      <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed text-ink-700">
        <section>
          <h2 className="text-base font-semibold text-ink-900">1. Purpose</h2>
          <p className="mt-1">
            To keep NUKKAD a safe and lawful marketplace, the categories below may not be listed
            or sold by any shop on the platform.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">2. Prohibited categories</h2>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            <li>Alcohol, tobacco, and narcotic substances, except where the shop holds a valid licence and local law permits the sale</li>
            <li>Firearms, weapons, and ammunition</li>
            <li>Counterfeit or pirated goods</li>
            <li>Prescription medicines, without a valid pharmacy licence</li>
            <li>Hazardous chemicals or explosives</li>
            <li>Live animals, except where locally regulated and licensed</li>
            <li>Adult or obscene content or products</li>
            <li>Any item that is illegal to sell under Indian law</li>
            <li>Products that infringe someone else's intellectual property</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">3. Consequences</h2>
          <p className="mt-1">
            Listings that violate this policy will be removed, and the shop's account may be
            suspended or terminated. Where required by law, we may also report the matter to the
            relevant authorities.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">4. Reporting a listing</h2>
          <p className="mt-1">
            If you come across a listing that you believe breaks this policy, please report it
            via the <a href="/contact" className="text-brand-600 underline">Contact us</a> page.
          </p>
        </section>
      </div>
    </div>
  );
}
