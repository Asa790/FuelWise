import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.vehicle.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
  }

  const body = await req.json();
  const data: any = {};
  if (typeof body.nickname === 'string' || body.nickname === null) data.nickname = body.nickname;
  if (typeof body.customEfficiency === 'number' || body.customEfficiency === null)
    data.customEfficiency = body.customEfficiency;
  if (typeof body.fuelType === 'string') data.fuelType = body.fuelType;
  if (body.setActive === true) {
    await prisma.vehicle.updateMany({
      where: { userId: session.userId, isActive: true },
      data: { isActive: false },
    });
    data.isActive = true;
  }

  const vehicle = await prisma.vehicle.update({ where: { id }, data });
  return NextResponse.json({ vehicle });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.vehicle.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
  }

  await prisma.vehicle.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
