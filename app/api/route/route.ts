import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// Route between two points using OSRM public demo (free, no key)
// Optionally uses OpenRouteService if ORS_API_KEY is set.

const cache = new Map<string, { ts: number; data: any }>();
const CACHE_MS = 1000 * 60 * 30; // 30 menit

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const oLat = parseFloat(searchParams.get('oLat') || '');
  const oLng = parseFloat(searchParams.get('oLng') || '');
  const dLat = parseFloat(searchParams.get('dLat') || '');
  const dLng = parseFloat(searchParams.get('dLng') || '');

  if ([oLat, oLng, dLat, dLng].some((v) => isNaN(v))) {
    return NextResponse.json({ error: 'Koordinat tidak valid' }, { status: 400 });
  }

  const key = `${oLat.toFixed(4)},${oLng.toFixed(4)}|${dLat.toFixed(4)},${dLng.toFixed(4)}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_MS) {
    return NextResponse.json(cached.data);
  }

  const orsKey = process.env.ORS_API_KEY;
  try {
    if (orsKey) {
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?start=${oLng},${oLat}&end=${dLng},${dLat}`;
      const res = await fetch(url, { headers: { Authorization: orsKey } });
      if (!res.ok) throw new Error('ORS ' + res.status);
      const raw = await res.json();
      const f = raw.features?.[0];
      const result = {
        distanceKm: (f.properties.summary.distance ?? 0) / 1000,
        durationSeconds: Math.round(f.properties.summary.duration ?? 0),
        geometry: f.geometry, // GeoJSON LineString
      };
      cache.set(key, { ts: Date.now(), data: result });
      return NextResponse.json(result);
    } else {
      const url = `https://router.project-osrm.org/route/v1/driving/${oLng},${oLat};${dLng},${dLat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('OSRM ' + res.status);
      const raw = await res.json();
      const r = raw.routes?.[0];
      if (!r) throw new Error('No route');
      const result = {
        distanceKm: (r.distance ?? 0) / 1000,
        durationSeconds: Math.round(r.duration ?? 0),
        geometry: r.geometry,
      };
      cache.set(key, { ts: Date.now(), data: result });
      return NextResponse.json(result);
    }
  } catch (e: any) {
    console.error('route error', e);
    // Fallback: straight-line haversine estimate
    const R = 6371;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLatR = toRad(dLat - oLat);
    const dLngR = toRad(dLng - oLng);
    const a =
      Math.sin(dLatR / 2) ** 2 +
      Math.cos(toRad(oLat)) * Math.cos(toRad(dLat)) * Math.sin(dLngR / 2) ** 2;
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return NextResponse.json({
      distanceKm: distance * 1.3, // rough road factor
      durationSeconds: Math.round((distance / 35) * 3600), // ~35 km/h avg
      geometry: {
        type: 'LineString',
        coordinates: [
          [oLng, oLat],
          [dLng, dLat],
        ],
      },
      fallback: true,
    });
  }
}
