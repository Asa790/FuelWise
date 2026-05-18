import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const prices = await prisma.fuelPrice.findMany({ orderBy: { fuelType: 'asc' } });
  return NextResponse.json({ prices });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json()) as { fuelType: string; pricePerLiter: number };
  if (!body.fuelType || typeof body.pricePerLiter !== 'number' || body.pricePerLiter < 0) {
    return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
  }

  const updated = await prisma.fuelPrice.update({
    where: { fuelType: body.fuelType },
    data: { pricePerLiter: Math.floor(body.pricePerLiter) },
  });

  return NextResponse.json({ price: updated });
}
