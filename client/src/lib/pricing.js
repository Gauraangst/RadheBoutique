export const FREE_SHIPPING_THRESHOLD = 2999;
export const SHIPPING_CHARGE = 149;
export const TAX_RATE = 0.05;

const roundCurrency = (value) => Number(value.toFixed(2));

export function calculateOrderTotals(items) {
  const itemsPrice = roundCurrency(
    items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0)
  );
  const shippingPrice = itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const taxPrice = roundCurrency(itemsPrice * TAX_RATE);
  const totalPrice = roundCurrency(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
}
