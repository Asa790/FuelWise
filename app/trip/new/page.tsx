'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Search, MapPin, Loader2, Navigation } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

interface GeoResult {
  placeId: number | string;
  lat: number;
  lng: number;
  displayName: string;
  shortName: string;
  type?: string;
}

interface RecentDest {
  lat: number;
  lng: number;
  name: string;
  count: number;
  lastUsed: string;
}

export default function TripNewPage() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [results, setResults] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [coordsErr, setCoordsErr] = useState<string | null>(null);
  const [recent, setRecent] = useState<RecentDest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Get current location
    if (!navigator.geolocation) {
      setCoordsErr('GPS tidak tersedia di perangkat ini');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setCoordsErr(err.message),
      { enableHighAccuracy: true, timeout: 8000 }
    );

    // Load recent destinations from localStorage
    try {
      const raw = localStorage.getItem('fw_recent_dest');
      if (raw) setRecent(JSON.parse(raw).slice(0, 5));
    } catch {}
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setError('Pencarian gagal');
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q]);

  function chooseDestination(r: GeoResult | RecentDest) {
    const dest = {
      lat: r.lat,
      lng: r.lng,
      name: 'shortName' in r ? r.shortName : r.name,
      fullName: 'displayName' in r ? r.displayName : r.name,
    };
    // Update recent
    try {
      const raw = localStorage.getItem('fw_recent_dest');
      const list: RecentDest[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex(
        (x) => Math.abs(x.lat - dest.lat) < 0.0005 && Math.abs(x.lng - dest.lng) < 0.0005
      );
      if (idx >= 0) {
        list[idx].count += 1;
        list[idx].lastUsed = new Date().toISOString();
      } else {
        list.unshift({ lat: dest.lat, lng: dest.lng, name: dest.name, count: 1, lastUsed: new Date().toISOString() });
      }
      list.sort((a, b) => b.count - a.count || (b.lastUsed > a.lastUsed ? 1 : -1));
      localStorage.setItem('fw_recent_dest', JSON.stringify(list.slice(0, 20)));
    } catch {}

    const params = new URLSearchParams({
      dLat: dest.lat.toString(),
      dLng: dest.lng.toString(),
      dName: dest.name,
      dFullName: dest.fullName,
    });
    if (coords) {
      params.set('oLat', coords.lat.toString());
      params.set('oLng', coords.lng.toString());
    }
    router.push(`/trip/confirm?${params.toString()}`);
  }

  return (
    <div className="min-h-screen max-w-md mx-auto px-5 pt-6 pb-10 safe-top safe-bottom">
      <div className="flex items-center gap-2 mb-5">
        <Link href="/" className="btn-back">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-lg font-bold">Pilih Tujuan</h1>
      </div>

      {/* GPS status */}
      <div
        className={`flex items-center gap-2 text-xs mb-4 ${
          coords ? 'text-brand-teal' : 'text-status-warning'
        }`}
      >
        <Navigation size={14} />
        {coords
          ? `Lokasi Anda: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
          : coordsErr || 'Mendeteksi lokasi...'}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          className="input-base pl-11"
          placeholder="Cari nama tempat, jalan, atau lokasi..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
        {loading && (
          <Loader2 size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted animate-spin" />
        )}
      </div>

      {error && <p className="text-status-danger text-sm mb-3">{error}</p>}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2 mb-5">
          <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold">
            Hasil pencarian
          </p>
          {results.map((r) => (
            <button
              key={r.placeId}
              onClick={() => chooseDestination(r)}
              className="w-full card-surface text-left active:scale-[0.99] transition-transform flex items-start gap-3"
            >
              <MapPin size={16} className="text-brand-teal mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{r.shortName}</p>
                <p className="text-xs text-text-muted line-clamp-2">{r.displayName}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Recent */}
      {q.trim().length < 2 && recent.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold mb-2">
            Sering dikunjungi
          </p>
          {recent.map((r, i) => (
            <button
              key={i}
              onClick={() => chooseDestination(r)}
              className="w-full card-surface text-left active:scale-[0.99] transition-transform flex items-start gap-3"
            >
              <MapPin size={16} className="text-brand-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{r.name}</p>
                <p className="text-xs text-text-muted">{r.count}× dikunjungi</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {q.trim().length < 2 && recent.length === 0 && (
        <div className="card-surface text-center py-8 mt-3">
          <MapPin size={28} className="text-text-muted mx-auto mb-2" />
          <p className="text-sm font-semibold mb-1">Mulai mencari lokasi</p>
          <p className="text-xs text-text-muted px-4">
            Ketik nama jalan, gedung, kota, atau tempat di Indonesia
          </p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
