'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button, Card, CardBody } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <DashboardLayout title="Dashboard Guru">
      <div className="container mx-auto p-4">
        <Card>
          <CardBody className="p-6">
            <div>{JSON.stringify(session, null, 2)}</div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="mb-4">Welcome, {session?.user?.name || session?.user?.email}!</p>
            <Button color="danger" variant="bordered" onPress={() => signOut({ callbackUrl: '/login' })}>
              Sign Out
            </Button>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
