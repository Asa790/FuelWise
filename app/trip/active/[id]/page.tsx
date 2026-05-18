'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  Pause,
  Play,
  StopCircle,
  Navigation,
  Activity,
  TriangleAlert,
} from 'lucide-react';
import {
  calculateTrip,
  distanceBetweenKm,
  checkArrival,
  ARRIVAL_RADIUS_KM,
} from '@/lib/calc-fuel';
import { formatRupiah, formatKm, formatLiter, formatDuration } from '@/lib/fmt';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

interface Trip {
  id: string;
  destinationLat: string;
  destinationLng: string;
  destinationName: string;
  startedAt: string;
  status: string;
  distanceKm: string | null;
  efficiencyKmpl: string | null;
  fuelPriceSnapshot: number | null;
  fuelTypeSnapshot: string | null;
}

interface RoutePoint {
  lat: number;
  lng: number;
  ts: number;
}

const SYNC_INTERVAL_MS = 15000; // sync ke server tiap 15 detik

export default function TripActivePage(props: { params: { id: string } }) {
  const { id } = props.params;
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [speed, setSpeed] = useState(0); // km/h
  const [accuracy, setAccuracy] = useState<number>(0);
  const [distance, setDistance] = useState(0);
  const [paused, setPaused] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [ending, setEnding] = useState(false);
  const [plannedRoute, setPlannedRoute] = useState<{
    geometry: any;
    plannedDistanceKm: number;
  } | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const lastPosRef = useRef<{ lat: number; lng: number } | null>(null);
  const livePathRef = useRef<RoutePoint[]>([]);
  const distanceRef = useRef(0);
  const pausedRef = useRef(false);
  const lastSyncRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [now, setNow] = useState(Date.now());

  // Load trip
  useEffect(() => {
    fetch(`/api/trips/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error);
        } else {
          setTrip(d.trip);
          if (d.trip.distanceKm) {
            const dKm = Number(d.trip.distanceKm);
            setDistance(dKm);
            distanceRef.current = dKm;
          }
        }
        setLoading(false);
      });
    try {
      const raw = localStorage.getItem(`fw_route_${id}`);
      if (raw) setPlannedRoute(JSON.parse(raw));
    } catch {}
  }, [id]);

  // Tick for elapsed time
  useEffect(() => {
    tickRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  // GPS watch
  useEffect(() => {
    if (!trip || trip.status !== 'active' || arrived) return;
    if (!navigator.geolocation) {
      setError('GPS tidak tersedia');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (p) => {
        const cur = { lat: p.coords.latitude, lng: p.coords.longitude };
        setPos(cur);
        setAccuracy(p.coords.accuracy);
        if (typeof p.coords.speed === 'number' && p.coords.speed >= 0) {
          setSpeed(p.coords.speed * 3.6); // m/s -> km/h
        }

        // Skip distance calc if paused
        if (pausedRef.current) {
          lastPosRef.current = cur;
          return;
        }

        // Filter out wild jumps (>1km in <3sec) and noisy small movements
        const last = lastPosRef.current;
        if (last) {
          const delta = distanceBetweenKm(last.lat, last.lng, cur.lat, cur.lng);
          if (delta < 0.005) {
            // Less than 5m, ignore noise
            return;
          }
          if (delta > 1 && p.coords.accuracy > 50) {
            // Likely jump, skip
            lastPosRef.current = cur;
            return;
          }
          distanceRef.current += delta;
          setDistance(distanceRef.current);
        }
        lastPosRef.current = cur;
        livePathRef.current.push({ lat: cur.lat, lng: cur.lng, ts: Date.now() });

        // Geofencing arrival check
        const destLat = parseFloat(trip.destinationLat);
        const destLng = parseFloat(trip.destinationLng);
        if (checkArrival(cur.lat, cur.lng, destLat, destLng)) {
          if (!arrived) {
            setArrived(true);
            try {
              if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Anda telah tiba di tujuan', {
                  body: trip.destinationName,
                });
              }
            } catch {}
          }
        }

        // Periodic sync
        if (Date.now() - lastSyncRef.current > SYNC_INTERVAL_MS) {
          lastSyncRef.current = Date.now();
          fetch(`/api/trips/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              distanceKm: distanceRef.current,
              appendRoutePoints: livePathRef.current.slice(-30),
            }),
          }).catch(() => {});
        }
      },
      (err) => {
        console.warn('GPS error', err);
        setError('GPS error: ' + err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 8000,
      }
    );

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip, arrived]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Live calculation
  const eff = trip ? Number(trip.efficiencyKmpl ?? 0) : 0;
  const price = trip?.fuelPriceSnapshot ?? 0;
  const fuelType = trip?.fuelTypeSnapshot ?? 'pertalite';
  const calc = calculateTrip({
    distanceKm: distance,
    efficiencyKmpl: eff,
    fuelPricePerLiter: price,
    fuelType,
  });

  const startMs = trip ? new Date(trip.startedAt).getTime() : Date.now();
  const elapsedSec = Math.max(0, Math.floor((now - startMs) / 1000));

  // Progress to destination
  const totalPlanned = plannedRoute?.plannedDistanceKm || 0;
  const progress = totalPlanned > 0 ? Math.min(100, (distance / totalPlanned) * 100) : 0;
  const distanceToDestKm = pos && trip
    ? distanceBetweenKm(
        pos.lat,
        pos.lng,
        parseFloat(trip.destinationLat),
        parseFloat(trip.destinationLng)
      )
    : null;

  // ETA: based on remaining distance and avg speed (or 35 km/h fallback)
  const avgSpeedKmh = elapsedSec > 30 && distance > 0 ? distance / (elapsedSec / 3600) : 0;
  const etaMinutes =
    distanceToDestKm && distanceToDestKm > 0
      ? (distanceToDestKm / Math.max(15, avgSpeedKmh || 30)) * 60
      : 0;

  async function endTrip(cancelled = false) {
    if (ending) return;
    setEnding(true);
    try {
      const res = await fetch(`/api/trips/${id}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          distanceKm: distanceRef.current,
          routePoints: livePathRef.current,
          cancelled,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyelesaikan');
      try {
        localStorage.removeItem(`fw_route_${id}`);
      } catch {}
      if (cancelled) router.push('/dashboard');
      else router.push(`/trip/result/${id}`);
    } catch (err: any) {
      setError(err.message);
      setEnding(false);
    }
  }

  if (loading) return <div className="p-6 text-center">Memuat trip...</div>;
  if (error && !trip) return <div className="p-6 text-status-danger">{error}</div>;
  if (!trip) return <div className="p-6 text-status-danger">Trip tidak ditemukan</div>;

  if (trip.status !== 'active') {
    // Trip already ended, redirect to result
    if (typeof window !== 'undefined') router.replace(`/trip/result/${id}`);
    return <div className="p-6">Trip sudah selesai...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      {/* Map fullscreen */}
      <div className="relative flex-1 min-h-0">
        {pos ? (
          <div className="absolute inset-0">
            <MapView
              center={pos}
              zoom={15}
              marker={pos}
              destination={{
                lat: parseFloat(trip.destinationLat),
                lng: parseFloat(trip.destinationLng),
              }}
              routeGeometry={plannedRoute?.geometry}
              livePath={livePathRef.current}
              progressDistance={distance}
              totalDistance={plannedRoute?.plannedDistanceKm || 0}
              follow
              height="100%"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Navigation size={32} className="text-text-muted mx-auto mb-2 animate-pulse" />
              <p className="text-sm text-text-muted">Mencari sinyal GPS...</p>
            </div>
          </div>
        )}

        {/* LIVE badge */}
        <div className="absolute top-4 left-4 z-10 bg-bg-surface/90 backdrop-blur border border-bg-border rounded-full px-3 py-1.5 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${
                paused ? 'bg-status-warning' : 'bg-brand-teal animate-ping opacity-75'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                paused ? 'bg-status-warning' : 'bg-brand-teal'
              }`}
            />
          </span>
          <span className="text-xs font-bold uppercase tracking-wide">
            {paused ? 'Dijeda' : 'Live'}
          </span>
        </div>

        {/* GPS accuracy */}
        <div className="absolute top-4 right-4 z-10 bg-bg-surface/90 backdrop-blur border border-bg-border rounded-full px-3 py-1.5 flex items-center gap-2 text-xs">
          <Activity
            size={12}
            className={
              accuracy === 0
                ? 'text-text-muted'
                : accuracy < 20
                ? 'text-brand-teal'
                : accuracy < 50
                ? 'text-status-warning'
                : 'text-status-danger'
            }
          />
          <span>
            {accuracy === 0 ? '—' : `±${accuracy.toFixed(0)}m`}
          </span>
        </div>

        {/* Arrival banner */}
        {arrived && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-brand-teal text-bg-primary p-4 text-center font-bold animate-slide-up">
            🎉 Anda telah tiba di tujuan!
            <p className="text-xs font-medium opacity-90 mt-0.5">
              Tap "Selesaikan" untuk simpan
            </p>
          </div>
        )}
      </div>

      {/* Bottom panel */}
      <div className="bg-bg-surface border-t border-bg-border safe-bottom">
        {/* Progress */}
        {totalPlanned > 0 && (
          <div className="px-4 pt-3">
            <div className="flex items-center justify-between text-[11px] text-text-muted mb-1">
              <span>Progress perjalanan</span>
              <span className="font-semibold">
                {formatKm(distance, 1)} / {formatKm(totalPlanned, 1)}
              </span>
            </div>
            <div className="h-1.5 bg-bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-teal transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-px bg-bg-border mt-3">
          <div className="bg-bg-surface p-3 text-center">
            <p className="text-[10px] text-text-muted uppercase">Jarak</p>
            <p className="text-base font-bold mt-0.5">{distance.toFixed(2)}</p>
            <p className="text-[10px] text-text-muted">km</p>
          </div>
          <div className="bg-bg-surface p-3 text-center">
            <p className="text-[10px] text-text-muted uppercase">BBM</p>
            <p className="text-base font-bold mt-0.5">{calc.fuelLiters.toFixed(2)}</p>
            <p className="text-[10px] text-text-muted">liter</p>
          </div>
          <div className="bg-bg-surface p-3 text-center">
            <p className="text-[10px] text-brand-primary uppercase font-semibold">Biaya</p>
            <p className="text-base font-bold mt-0.5 text-brand-primary">
              {formatRupiah(calc.fuelCostIdr).replace('Rp ', '')}
            </p>
            <p className="text-[10px] text-text-muted">rupiah</p>
          </div>
          <div className="bg-bg-surface p-3 text-center">
            <p className="text-[10px] text-text-muted uppercase">Speed</p>
            <p className="text-base font-bold mt-0.5">{speed.toFixed(0)}</p>
            <p className="text-[10px] text-text-muted">km/h</p>
          </div>
          <div className="bg-bg-surface p-3 text-center">
            <p className="text-[10px] text-text-muted uppercase">Durasi</p>
            <p className="text-base font-bold mt-0.5">
              {formatDuration(elapsedSec).replace(' mnt', '').replace(' dtk', '')}
            </p>
            <p className="text-[10px] text-text-muted">{elapsedSec < 60 ? 'detik' : 'menit'}</p>
          </div>
          <div className="bg-bg-surface p-3 text-center">
            <p className="text-[10px] text-text-muted uppercase">ETA</p>
            <p className="text-base font-bold mt-0.5">
              {etaMinutes > 0 && etaMinutes < 999 ? Math.round(etaMinutes) : '—'}
            </p>
            <p className="text-[10px] text-text-muted">menit</p>
          </div>
        </div>

        {/* Warning */}
        <div className="px-4 py-2 bg-status-warning/10 border-y border-status-warning/20 text-[10px] text-status-warning flex items-center gap-1.5">
          <TriangleAlert size={11} />
          Jaga layar tetap aktif. GPS akan berhenti jika layar terkunci.
        </div>

        {/* Actions */}
        <div className="p-4 flex gap-3">
          <button
            onClick={() => setPaused((p) => !p)}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            {paused ? (
              <>
                <Play size={16} /> Lanjutkan
              </>
            ) : (
              <>
                <Pause size={16} /> Jeda
              </>
            )}
          </button>
          <button
            onClick={() => endTrip(false)}
            disabled={ending}
            className="btn-primary flex-[2] flex items-center justify-center gap-2"
          >
            <StopCircle size={16} />
            {ending ? 'Menyimpan...' : 'Selesaikan'}
          </button>
        </div>

        {error && (
          <div className="px-4 pb-3 text-status-danger text-xs">{error}</div>
        )}
      </div>
    </div>
  );
}
