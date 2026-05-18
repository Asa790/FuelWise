import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const cache = new Map<string, { ts: number; data: any }>();
const CACHE_MS = 1000 * 60 * 60 * 24;

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Koordinat tidak valid' }, { status: 400 });
  }

  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_MS) {
    return NextResponse.json(cached.data);
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=16`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': process.env.NOMINATIM_USER_AGENT || 'FuelWiseApp/1.0',
        'Accept-Language': 'id,en',
      },
    });
    const raw = await res.json();
    const result = {
      displayName: raw.display_name || 'Lokasi tidak diketahui',
      shortName: raw.name || raw.display_name?.split(',')[0] || 'Lokasi',
      address: raw.address,
    };
    cache.set(key, { ts: Date.now(), data: result });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { displayName: 'Lokasi tidak diketahui', shortName: 'Lokasi' },
      { status: 200 }
    );
  }
}
