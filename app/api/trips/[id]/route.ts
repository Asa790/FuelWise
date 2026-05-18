import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { calculateTrip } from '@/lib/calc-fuel';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const trip = await prisma.trip.findFirst({
    where: { id, userId: session.userId },
    include: { vehicle: true },
  });
  if (!trip) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
  return NextResponse.json({ trip });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = (await req.json()) as {
    distanceKm: number;
    routePoints?: Array<{ lat: number; lng: number; ts: number }>;
    appendRoutePoints?: Array<{ lat: number; lng: number; ts: number }>;
  };

  const existing = await prisma.trip.findFirst({
    where: { id, userId: session.userId },
  });
  if (!existing) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
  if (existing.status !== 'active') {
    return NextResponse.json({ error: 'Trip sudah selesai' }, { status: 409 });
  }

  const distanceKm = Math.max(0, body.distanceKm);
  const eff = Number(existing.efficiencyKmpl ?? 0);
  const price = existing.fuelPriceSnapshot ?? 0;
  const fuelType = existing.fuelTypeSnapshot ?? 'pertalite';
  const calc = calculateTrip({
    distanceKm,
    efficiencyKmpl: eff,
    fuelPricePerLiter: price,
    fuelType,
  });

  let routePoints = existing.routePoints as any[] | null;
  if (body.routePoints) routePoints = body.routePoints;
  else if (body.appendRoutePoints) {
    routePoints = [...(routePoints || []), ...body.appendRoutePoints];
    // Cap stored points to last 2000 to keep payload manageable
    if (routePoints.length > 2000) routePoints = routePoints.slice(-2000);
  }

  const updated = await prisma.trip.update({
    where: { id },
    data: {
      distanceKm,
      fuelLiters: calc.fuelLiters,
      fuelCostIdr: calc.fuelCostIdr,
      co2Kg: calc.co2Kg,
      routePoints: routePoints as any,
    },
  });

  return NextResponse.json({ trip: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.trip.findFirst({
    where: { id, userId: session.userId },
  });
  if (!existing) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
  await prisma.trip.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = (await req.json()) as {
    isFavourite?: boolean;
  };

  const existing = await prisma.trip.findFirst({
    where: { id, userId: session.userId },
  });
  if (!existing) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });

  const data: any = {};
  if (typeof body.isFavourite === 'boolean') data.isFavourite = body.isFavourite;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Tidak ada perubahan' }, { status: 400 });
  }

  const trip = await prisma.trip.update({ where: { id }, data });
  return NextResponse.json({ trip });
}
