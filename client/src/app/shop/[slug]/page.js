import ProductDetailPage from '@/components/shop/ProductDetailPage';

export default async function ProductRoute({ params }) {
  const { slug } = await params;
  return <ProductDetailPage slug={slug} />;
}
