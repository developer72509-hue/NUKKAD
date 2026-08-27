export default function Returns() {
  return (
    <div className="container-app max-w-2xl py-10">
      <h1 className="text-2xl font-bold text-ink-900">Return & Refund Policy</h1>
      <p className="mt-1 text-sm text-ink-500">Last updated: 22 August 2026</p>

      <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed text-ink-700">
        <section>
          <h2 className="text-base font-semibold text-ink-900">1. Overview</h2>
          <p className="mt-1">
            NUKKAD connects you with independent local shops. Return and refund eligibility
            depends on the shop and the type of product ordered — perishable items such as
            fresh produce, dairy, and cooked food are generally not returnable once delivered,
            except where the shop got your order wrong or the item was damaged or spoiled on
            arrival.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">2. When you can request a return</h2>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            <li>The item delivered is damaged, spoiled, or defective</li>
            <li>You received the wrong item, or an item is missing from your order</li>
            <li>The item is materially different from how it was listed</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">3. What isn't covered</h2>
          <p className="mt-1">
            Change-of-mind returns, opened or partially used items, and perishable goods that
            were delivered correctly and in good condition are not eligible for return or refund.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">4. How to request one</h2>
          <p className="mt-1">
            Raise an issue from the order in <a href="/orders" className="text-brand-600 underline">My Orders</a>{' '}
            within 24 hours of delivery, with a photo of the item where possible. We'll pass this
            to the shop and follow up with you.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">5. Refunds</h2>
          <p className="mt-1">
            Since orders are paid Cash on Delivery, approved refunds are settled directly by the
            shop — typically as cash, a replacement item, or credit toward your next order from
            that shop, as agreed between you and the shop. NUKKAD will step in to help resolve
            the issue if a shop is unresponsive.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">6. Disputes</h2>
          <p className="mt-1">
            If you and a shop can't reach a resolution, contact us via the{' '}
            <a href="/contact" className="text-brand-600 underline">Contact us</a> page or our{' '}
            <a href="/grievance" className="text-brand-600 underline">Grievance Officer</a>, and
            we'll help mediate.
          </p>
        </section>
      </div>
    </div>
  );
}
