import OrderConfirmationPage from '@/components/shop/OrderConfirmationPage';

export default async function OrderRoute({ params }) {
  const { id } = await params;
  return <OrderConfirmationPage id={id} />;
}
