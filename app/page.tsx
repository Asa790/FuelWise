import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export default async function RootPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const vehicleCount = await prisma.vehicle.count({
    where: { userId: session.userId },
  });

  if (vehicleCount === 0) redirect('/setup-vehicle');
  redirect('/dashboard');
}
