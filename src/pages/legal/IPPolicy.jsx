export default function IPPolicy() {
  return (
    <div className="container-app max-w-2xl py-10">
      <h1 className="text-2xl font-bold text-ink-900">Intellectual Property & Copyright Policy</h1>
      <p className="mt-1 text-sm text-ink-500">Last updated: 22 August 2026</p>

      <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed text-ink-700">
        <section>
          <h2 className="text-base font-semibold text-ink-900">1. Our content</h2>
          <p className="mt-1">
            The NUKKAD name, logo, app design, and underlying software are the intellectual
            property of NUKKAD, unless stated otherwise, and are protected under Indian and
            applicable international law.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">2. Shop and product content</h2>
          <p className="mt-1">
            Shopkeepers retain ownership of the product images and descriptions they upload, but
            grant NUKKAD a licence to display that content on the platform for the purpose of
            listing and selling their products.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">3. Restrictions</h2>
          <p className="mt-1">
            You may not copy, reproduce, or create derivative works from any part of the NUKKAD
            platform without our prior written permission.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">4. Reporting infringement</h2>
          <p className="mt-1">
            If you believe content on NUKKAD infringes your intellectual property rights, contact
            us via the <a href="/contact" className="text-brand-600 underline">Contact us</a> page
            with details of the material and your claim, and we'll investigate.
          </p>
        </section>
      </div>
    </div>
  );
}
