import { Suspense } from 'react';
import ShopPage from '@/components/shop/ShopPage';

export const metadata = {
  title: 'Shop | Radhe Boutique',
  description: 'Browse festive kurtis, everyday wear, and statement jewellery from Radhe Boutique.',
};

export default function ShopRoute() {
  return (
    <Suspense fallback={<main style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>Loading shop...</main>}>
      <ShopPage />
    </Suspense>
  );
}
