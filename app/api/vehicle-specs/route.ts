import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const brand = searchParams.get('brand');
  const list = searchParams.get('list'); // 'brands'

  if (list === 'brands') {
    const rows = await prisma.vehicleSpec.findMany({
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    });
    return NextResponse.json({ brands: rows.map((r: { brand: string }) => r.brand) });
  }

  if (brand) {
    const specs = await prisma.vehicleSpec.findMany({
      where: { brand },
      orderBy: { model: 'asc' },
    });
    return NextResponse.json({ specs });
  }

  return NextResponse.json({ specs: [] });
}
