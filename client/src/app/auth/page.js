import AuthPage from '@/components/auth/AuthPage';

export default async function AuthRoute({ searchParams }) {
  const params = await searchParams;
  return <AuthPage redirectTo={params?.redirect || '/account'} />;
}
