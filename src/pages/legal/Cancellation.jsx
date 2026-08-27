export default function Cancellation() {
  return (
    <div className="container-app max-w-2xl py-10">
      <h1 className="text-2xl font-bold text-ink-900">Cancellation Policy</h1>
      <p className="mt-1 text-sm text-ink-500">Last updated: 22 August 2026</p>

      <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed text-ink-700">
        <section>
          <h2 className="text-base font-semibold text-ink-900">1. Cancelling as a customer</h2>
          <p className="mt-1">
            You can cancel an order free of charge only while it is in the "Placed" state, before
            the shop has accepted it. Once a shop accepts your order and starts preparing it, it
            can no longer be cancelled from the app, since the shop has already committed stock
            and effort to it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">2. How to cancel</h2>
          <p className="mt-1">
            Go to <a href="/orders" className="text-brand-600 underline">My Orders</a>, open the
            order, and use the cancel option shown while it's still in the "Placed" state.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">3. Cancellation by a shop</h2>
          <p className="mt-1">
            A shop may reject or cancel a placed order — for example, if an item is out of stock.
            You'll be notified in the app, and since payment is Cash on Delivery, no refund
            processing is needed in this case.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">4. Repeated cancellations</h2>
          <p className="mt-1">
            Shops that cancel accepted orders repeatedly, or customers who habitually cancel or
            fail to accept delivery, may have restrictions placed on their account.
          </p>
        </section>
      </div>
    </div>
  );
}
