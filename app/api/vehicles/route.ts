import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const vehicles = await prisma.vehicle.findMany({
    where: { userId: session.userId },
    orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
  });

  return NextResponse.json({ vehicles });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json()) as {
    nickname?: string;
    brand: string;
    model: string;
    year: number;
    fuelType: string;
    efficiencyKmpl: number;
    customEfficiency?: number | null;
    setActive?: boolean;
  };

  if (!body.brand || !body.model || !body.year || !body.fuelType || !body.efficiencyKmpl) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }

  // If setActive, deactivate others
  if (body.setActive !== false) {
    await prisma.vehicle.updateMany({
      where: { userId: session.userId, isActive: true },
      data: { isActive: false },
    });
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      userId: session.userId,
      nickname: body.nickname || null,
      brand: body.brand,
      model: body.model,
      year: body.year,
      fuelType: body.fuelType,
      efficiencyKmpl: body.efficiencyKmpl,
      customEfficiency: body.customEfficiency ?? null,
      isActive: body.setActive !== false,
    },
  });

  return NextResponse.json({ vehicle });
}
