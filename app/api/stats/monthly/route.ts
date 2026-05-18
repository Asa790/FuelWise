import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function startOfNextMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const monthParam = searchParams.get('month'); // YYYY-MM
  const ref = monthParam ? new Date(monthParam + '-01') : new Date();
  const from = startOfMonth(ref);
  const to = startOfNextMonth(ref);
  const prevFrom = startOfMonth(new Date(ref.getFullYear(), ref.getMonth() - 1, 1));
  const prevTo = from;

  const baseFilter = {
    userId: session.userId,
    status: 'completed',
  };

  const [currTrips, prevAgg] = await Promise.all([
    prisma.trip.findMany({
      where: { ...baseFilter, startedAt: { gte: from, lt: to } },
      orderBy: { startedAt: 'asc' },
      include: { vehicle: { select: { brand: true, model: true, nickname: true, fuelType: true } } },
    }),
    prisma.trip.aggregate({
      where: { ...baseFilter, startedAt: { gte: prevFrom, lt: prevTo } },
      _sum: { distanceKm: true, fuelLiters: true, fuelCostIdr: true },
      _count: { _all: true },
    }),
  ]);

  // Aggregate stats
  let totalDistance = 0;
  let totalLiters = 0;
  let totalCost = 0;
  const tripCount = currTrips.length;

  // Weekly bins (split month into ~4-5 weeks)
  const weeklyCost: number[] = [0, 0, 0, 0, 0];
  const weeklyDistance: number[] = [0, 0, 0, 0, 0];

  // Per-vehicle
  const perVehicle = new Map<string, { label: string; cost: number; distance: number; trips: number }>();
  // Top destinations
  const destinations = new Map<string, { name: string; count: number; totalCost: number }>();

  for (const t of currTrips) {
    const dist = Number(t.distanceKm ?? 0);
    const liters = Number(t.fuelLiters ?? 0);
    const cost = Number(t.fuelCostIdr ?? 0);
    totalDistance += dist;
    totalLiters += liters;
    totalCost += cost;

    // Week index
    const day = new Date(t.startedAt).getDate();
    const weekIdx = Math.min(4, Math.floor((day - 1) / 7));
    weeklyCost[weekIdx] += cost;
    weeklyDistance[weekIdx] += dist;

    // Per vehicle
    if (t.vehicleId && t.vehicle) {
      const label = t.vehicle.nickname || `${t.vehicle.brand} ${t.vehicle.model}`;
      const cur = perVehicle.get(t.vehicleId) || { label, cost: 0, distance: 0, trips: 0 };
      cur.cost += cost;
      cur.distance += dist;
      cur.trips += 1;
      perVehicle.set(t.vehicleId, cur);
    }

    // Destinations
    const key = t.destinationName.split(',')[0].trim().toLowerCase();
    const dCur = destinations.get(key) || {
      name: t.destinationName.split(',')[0].trim(),
      count: 0,
      totalCost: 0,
    };
    dCur.count += 1;
    dCur.totalCost += cost;
    destinations.set(key, dCur);
  }

  const avgEfficiency = totalLiters > 0 ? totalDistance / totalLiters : 0;

  const prevCost = Number(prevAgg._sum.fuelCostIdr ?? 0);
  const prevDistance = Number(prevAgg._sum.distanceKm ?? 0);
  const prevTripCount = prevAgg._count._all;

  return NextResponse.json({
    period: {
      from: from.toISOString(),
      to: to.toISOString(),
      label: ref.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
    },
    summary: {
      totalCost,
      totalDistance: Math.round(totalDistance * 100) / 100,
      totalLiters: Math.round(totalLiters * 100) / 100,
      avgEfficiency: Math.round(avgEfficiency * 100) / 100,
      tripCount,
    },
    previous: {
      totalCost: prevCost,
      totalDistance: Math.round(prevDistance * 100) / 100,
      tripCount: prevTripCount,
    },
    weeklyCost,
    weeklyDistance,
    perVehicle: Array.from(perVehicle.values()).sort((a, b) => b.cost - a.cost),
    topDestinations: Array.from(destinations.values()).sort((a, b) => b.count - a.count).slice(0, 5),
  });
}
