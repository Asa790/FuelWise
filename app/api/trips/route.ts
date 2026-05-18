import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const status = searchParams.get('status');
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);
  const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);

  const where: any = { userId: session.userId };
  if (status) where.status = status;
  if (from || to) {
    where.startedAt = {};
    if (from) where.startedAt.gte = new Date(from);
    if (to) where.startedAt.lte = new Date(to);
  }

  const [trips, total] = await Promise.all([
    prisma.trip.findMany({
      where,
      include: { vehicle: { select: { id: true, brand: true, model: true, nickname: true, fuelType: true } } },
      orderBy: { startedAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.trip.count({ where }),
  ]);

  return NextResponse.json({ trips, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json()) as {
    vehicleId: string;
    originLat?: number;
    originLng?: number;
    originName?: string;
    destinationLat: number;
    destinationLng: number;
    destinationName: string;
    plannedDistanceKm?: number;
    plannedDurationSec?: number;
  };

  if (
    !body.vehicleId ||
    typeof body.destinationLat !== 'number' ||
    typeof body.destinationLng !== 'number' ||
    !body.destinationName
  ) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }

  const vehicle = await prisma.vehicle.findFirst({
    where: { id: body.vehicleId, userId: session.userId },
  });
  if (!vehicle) {
    return NextResponse.json({ error: 'Kendaraan tidak ditemukan' }, { status: 404 });
  }

  const fuelPrice = await prisma.fuelPrice.findUnique({
    where: { fuelType: vehicle.fuelType },
  });
  const effective = vehicle.customEfficiency
    ? Number(vehicle.customEfficiency)
    : Number(vehicle.efficiencyKmpl);

  const trip = await prisma.trip.create({
    data: {
      userId: session.userId,
      vehicleId: vehicle.id,
      originLat: body.originLat ?? null,
      originLng: body.originLng ?? null,
      originName: body.originName ?? null,
      destinationLat: body.destinationLat,
      destinationLng: body.destinationLng,
      destinationName: body.destinationName,
      startedAt: new Date(),
      status: 'active',
      efficiencyKmpl: effective,
      fuelPriceSnapshot: fuelPrice?.pricePerLiter ?? null,
      fuelTypeSnapshot: vehicle.fuelType,
      distanceKm: 0,
      fuelLiters: 0,
      fuelCostIdr: 0,
      co2Kg: 0,
      routePoints: [],
    },
  });

  return NextResponse.json({ trip });
}
