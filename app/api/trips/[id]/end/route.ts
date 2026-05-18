import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { calculateTrip } from '@/lib/calc-fuel';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as {
    distanceKm?: number;
    routePoints?: Array<{ lat: number; lng: number; ts: number }>;
    cancelled?: boolean;
  };

  const existing = await prisma.trip.findFirst({
    where: { id, userId: session.userId },
  });
  if (!existing) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
  if (existing.status !== 'active') {
    return NextResponse.json({ trip: existing });
  }

  const distanceKm =
    typeof body.distanceKm === 'number' && body.distanceKm > 0
      ? body.distanceKm
      : Number(existing.distanceKm ?? 0);

  const eff = Number(existing.efficiencyKmpl ?? 0);
  const price = existing.fuelPriceSnapshot ?? 0;
  const fuelType = existing.fuelTypeSnapshot ?? 'pertalite';
  const calc = calculateTrip({
    distanceKm,
    efficiencyKmpl: eff,
    fuelPricePerLiter: price,
    fuelType,
  });

  const endedAt = new Date();
  const durationSeconds = Math.round(
    (endedAt.getTime() - new Date(existing.startedAt).getTime()) / 1000
  );

  const trip = await prisma.trip.update({
    where: { id },
    data: {
      status: body.cancelled ? 'cancelled' : 'completed',
      endedAt,
      durationSeconds,
      distanceKm,
      fuelLiters: calc.fuelLiters,
      fuelCostIdr: calc.fuelCostIdr,
      co2Kg: calc.co2Kg,
      routePoints: body.routePoints ? (body.routePoints as any) : existing.routePoints,
    },
  });

  return NextResponse.json({ trip });
}
