export default function Terms() {
  return (
    <div className="container-app max-w-2xl py-10">
      <h1 className="text-2xl font-bold text-ink-900">Terms of Service</h1>
      <p className="mt-1 text-sm text-ink-500">Last updated: 22 August 2026</p>

      <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed text-ink-700">
        <section>
          <h2 className="text-base font-semibold text-ink-900">1. Acceptance</h2>
          <p className="mt-1">
            By creating a NUKKAD account, you agree to these Terms and our{' '}
            <a href="/privacy" className="text-brand-600 underline">Privacy Policy</a>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">2. Who can use NUKKAD</h2>
          <p className="mt-1">
            You must be at least 18 years old and able to form a binding contract to use NUKKAD
            as a customer or shopkeeper.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">3. Customer accounts</h2>
          <p className="mt-1">
            You are responsible for the accuracy of your delivery address and contact details.
            Orders are placed at the price and stock shown at checkout, verified server-side at
            the moment of ordering.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">4. Shopkeeper accounts</h2>
          <p className="mt-1">
            Shopkeepers are responsible for the accuracy of their shop information, product
            listings, pricing, and stock levels, and for fulfilling accepted orders in good faith.
            NUKKAD facilitates the connection between shops and customers but is not a party to
            the sale itself.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">5. Payments</h2>
          <p className="mt-1">
            Orders are currently Cash on Delivery only. You agree to pay the shop directly upon
            delivery for the amount shown at checkout.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">6. Cancellations</h2>
          <p className="mt-1">
            Customers may cancel an order only while it is in the "Placed" state, before the shop
            accepts it. Shopkeepers may reject a placed order. Once accepted, an order cannot be
            cancelled through the app.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">7. Reviews</h2>
          <p className="mt-1">
            Reviews may only be left for orders that have actually been delivered to you, and
            reflect your genuine experience. Shopkeepers cannot edit or remove customer reviews.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">8. Account termination</h2>
          <p className="mt-1">
            You may delete your account at any time from your Profile page. We may suspend
            accounts that violate these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">9. Limitation of liability</h2>
          <p className="mt-1">
            NUKKAD provides the platform "as is" and is not liable for the quality, safety, or
            legality of products listed by shopkeepers, or for disputes between customers and
            shopkeepers arising from a transaction.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink-900">10. Governing law</h2>
          <p className="mt-1">
            These Terms are governed by the laws of India.
          </p>
        </section>
      </div>
    </div>
  );
}
