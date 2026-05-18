import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      monthlyBudget: true,
      themePref: true,
      _count: { select: { vehicles: true } },
    },
  });

  if (!user) return NextResponse.json({ user: null }, { status: 401 });

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      monthlyBudget: user.monthlyBudget,
      themePref: user.themePref,
      vehicleCount: user._count.vehicles,
    },
  });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json()) as {
    name?: string;
    avatarUrl?: string | null;
    monthlyBudget?: number;
    themePref?: 'dark' | 'light';
  };

  const data: any = {};
  if (typeof body.name === 'string' && body.name.length >= 2) data.name = body.name.trim();
  if ('avatarUrl' in body) data.avatarUrl = body.avatarUrl;
  if (typeof body.monthlyBudget === 'number' && body.monthlyBudget >= 0)
    data.monthlyBudget = Math.floor(body.monthlyBudget);
  if (body.themePref === 'dark' || body.themePref === 'light') data.themePref = body.themePref;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Tidak ada perubahan' }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.userId },
    data,
    select: { id: true, name: true, email: true, avatarUrl: true, monthlyBudget: true, themePref: true },
  });

  return NextResponse.json({ user });
}
