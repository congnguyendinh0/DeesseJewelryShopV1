import {CartForm, Money} from '@shopify/hydrogen';

export function CartSummary({cart, layout}) {
  const className =
    layout === 'page'
      ? 'max-w-md mx-auto bg-white shadow-sm'
      : 'bg-white shadow-sm';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <div className="px-6 py-4">
        <h4 className="font-light text-gray-800 mb-4">Totals</h4>
        <dl className="flex justify-between items-center mb-4">
          <dt className="text-gray-600">Subtotal</dt>
          <dd className="text-lg font-light text-gray-800">
            {cart.cost?.subtotalAmount?.amount ? (
              <Money data={cart.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </dl>
        <CartDiscounts discountCodes={cart.discountCodes} />
        <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
      </div>
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <div className="mt-6">
      <a
        href={checkoutUrl}
        target="_self"
        className="block w-full bg-black text-white text-center py-3 px-4 hover:bg-black-500 transition duration-300 ease-in-out"
      >
        Continue to Checkout →
      </a>
    </div>
  );
}

function CartDiscounts({discountCodes}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="mt-4">
      <dl hidden={!codes.length} className="mb-4">
        <div>
          <dt className="text-gray-600 mb-1">Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="flex items-center">
              <code className="bg-gray-100 px-2 py-1 text-sm mr-2">
                {codes?.join(', ')}
              </code>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex">
          <input
            type="text"
            name="discountCode"
            placeholder="Discount code"
            className="flex-grow border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 hover:bg-black transition duration-300 ease-in-out"
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}
