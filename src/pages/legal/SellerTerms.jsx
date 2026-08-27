export default function SellerTerms() {
  return (
    <div className="container-app max-w-2xl py-10">
      <h1 className="text-2xl font-bold text-ink-900">Seller / Shopkeeper Terms & Conditions</h1>
      <p className="mt-1 text-sm text-ink-500">Last updated: 22 August 2026</p>

      <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed text-ink-700">
        <section>
          <h2 className="text-base font-semibold text-ink-900">1. Registration</h2>
          <p className="mt-1">
            By registering a shop on NUKKAD, you confirm that your shop name, owner details,
            contact information, address, and any licence details you provide are true, accurate,
            and kept up to date. Where you declare that GST registration doesn't apply to your
            business, you confirm that declaration is accurate.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">2. Legal compliance</h2>
          <p className="mt-1">
            You are solely responsible for ensuring your shop complies with applicable law,
            including FSSAI licensing for food items, Legal Metrology rules, GST regulations
            where applicable, and any local trade licences your business needs.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">3. Product listings</h2>
          <p className="mt-1">
            You are responsible for the accuracy of your product descriptions, images, pricing,
            and stock levels, and you confirm that every product you list is genuine and legal to
            sell. Misleading listings may lead to removal or suspension of your shop.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">4. Order fulfilment</h2>
          <p className="mt-1">
            You agree to accept, prepare, and fulfil orders you receive in a timely manner.
            Repeated failure to fulfil accepted orders may result in restrictions on your account.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">5. Prohibited products</h2>
          <p className="mt-1">
            You will not list any item covered by our{' '}
            <a href="/prohibited-products" className="text-brand-600 underline">
              Prohibited Products Policy
            </a>{' '}
            or otherwise illegal to sell under Indian law.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">6. Payments</h2>
          <p className="mt-1">
            Orders are currently Cash on Delivery — customers pay you directly on delivery.
            NUKKAD does not collect or hold customer payments on your behalf at this time.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">7. Suspension & termination</h2>
          <p className="mt-1">
            We may suspend or remove a shop for violating these Terms, listing prohibited or
            counterfeit goods, repeated customer complaints, or fraudulent activity.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">8. Indemnity</h2>
          <p className="mt-1">
            You agree to indemnify NUKKAD against claims, damages, or liabilities arising from
            products you list or sell through the platform.
          </p>
        </section>
      </div>
    </div>
  );
}
