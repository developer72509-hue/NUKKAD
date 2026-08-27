export default function Shipping() {
  return (
    <div className="container-app max-w-2xl py-10">
      <h1 className="text-2xl font-bold text-ink-900">Shipping & Delivery Policy</h1>
      <p className="mt-1 text-sm text-ink-500">Last updated: 22 August 2026</p>

      <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed text-ink-700">
        <section>
          <h2 className="text-base font-semibold text-ink-900">1. Delivery area</h2>
          <p className="mt-1">
            NUKKAD shows you shops located near your set delivery address, so that orders can be
            fulfilled quickly by shops in your neighbourhood. Shops outside a reasonable
            distance from you won't appear in your marketplace listing.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">2. Who delivers</h2>
          <p className="mt-1">
            Orders are delivered by the shop you ordered from, or their delivery staff. NUKKAD
            does not currently operate its own delivery fleet.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">3. Delivery time</h2>
          <p className="mt-1">
            Delivery times depend on the shop's preparation time, order volume, and distance to
            you, and are not guaranteed to the minute. You'll see order status updates in{' '}
            <a href="/orders" className="text-brand-600 underline">My Orders</a>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">4. Delivery fee</h2>
          <p className="mt-1">
            Any delivery fee for your order is shown at checkout before you place the order, and
            is charged along with the item total, payable in cash on delivery.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">5. Failed or delayed delivery</h2>
          <p className="mt-1">
            If delivery fails because of an incorrect address or because you're unavailable to
            receive the order, the shop may attempt redelivery or cancel the order at their
            discretion.
          </p>
        </section>
      </div>
    </div>
  );
}
