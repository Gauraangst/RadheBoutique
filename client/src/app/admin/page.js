import AdminPanel from '@/components/admin/AdminPanel';

export const metadata = {
  title: 'Admin | Radhe Boutique',
  description: 'Manage catalog, orders, inventory, and storefront operations for Radhe Boutique.',
};

export default function AdminRoute() {
  return <AdminPanel />;
}
