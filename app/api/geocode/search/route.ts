import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// Simple in-memory cache (per-instance)
const cache = new Map<string, { ts: number; data: any }>();
const CACHE_MS = 1000 * 60 * 60 * 6; // 6 jam

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();
  if (!q || q.length < 2) return NextResponse.json({ results: [] });

  const cached = cache.get(q.toLowerCase());
  if (cached && Date.now() - cached.ts < CACHE_MS) {
    return NextResponse.json({ results: cached.data, cached: true });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      q
    )}&format=json&countrycodes=id&limit=8&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': process.env.NOMINATIM_USER_AGENT || 'FuelWiseApp/1.0',
        'Accept-Language': 'id,en',
      },
      // Nominatim usage policy: max 1 req/sec — we cache and assume low traffic
    });
    if (!res.ok) throw new Error('Nominatim error: ' + res.status);
    const raw = await res.json();
    const results = (raw as any[]).map((r) => ({
      placeId: r.place_id,
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
      displayName: r.display_name as string,
      shortName: (r.name || r.display_name?.split(',')[0] || 'Lokasi') as string,
      type: r.type as string,
      address: r.address,
    }));
    cache.set(q.toLowerCase(), { ts: Date.now(), data: results });
    return NextResponse.json({ results });
  } catch (e: any) {
    console.error('geocode search err', e);
    return NextResponse.json({ error: 'Pencarian gagal', results: [] }, { status: 500 });
  }
}
