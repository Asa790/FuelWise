'use client';

import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MapPin, Clock, Fuel, Car, Loader2 } from 'lucide-react';
import { calculateTrip } from '@/lib/calc-fuel';
import { formatRupiah, formatKm, formatLiter, formatDuration } from '@/lib/fmt';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  nickname: string | null;
  fuelType: string;
  efficiencyKmpl: string;
  customEfficiency: string | null;
  isActive: boolean;
}

interface FuelPrice {
  fuelType: string;
  pricePerLiter: number;
}

interface RouteResult {
  distanceKm: number;
  durationSeconds: number;
  geometry: { type: 'LineString'; coordinates: [number, number][] };
  fallback?: boolean;
}

function ConfirmInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const dLat = parseFloat(sp.get('dLat') || '');
  const dLng = parseFloat(sp.get('dLng') || '');
  const dName = sp.get('dName') || 'Tujuan';
  const dFullName = sp.get('dFullName') || dName;
  const oLatStr = sp.get('oLat');
  const oLngStr = sp.get('oLng');

  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(
    oLatStr && oLngStr ? { lat: parseFloat(oLatStr), lng: parseFloat(oLngStr) } : null
  );
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);
  const [prices, setPrices] = useState<FuelPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get origin if not provided
  useEffect(() => {
    if (!origin && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setError('Tidak bisa mendeteksi lokasi GPS Anda'),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load vehicles + prices
  useEffect(() => {
    Promise.all([
      fetch('/api/vehicles').then((r) => r.json()),
      fetch('/api/fuel-prices').then((r) => r.json()),
    ]).then(([v, p]) => {
      setVehicles(v.vehicles || []);
      const active = v.vehicles?.find((x: Vehicle) => x.isActive) || v.vehicles?.[0];
      setActiveVehicleId(active?.id || null);
      setPrices(p.prices || []);
      setLoading(false);
    });
  }, []);

  // Fetch route
  useEffect(() => {
    if (!origin || isNaN(dLat) || isNaN(dLng)) return;
    const url = `/api/route?oLat=${origin.lat}&oLng=${origin.lng}&dLat=${dLat}&dLng=${dLng}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setRoute(d);
      })
      .catch(() => setError('Gagal memuat rute'));
  }, [origin, dLat, dLng]);

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId);
  const fuelPrice = activeVehicle
    ? prices.find((p) => p.fuelType === activeVehicle.fuelType)
    : null;
  const eff = activeVehicle
    ? Number(activeVehicle.customEfficiency ?? activeVehicle.efficiencyKmpl)
    : 0;

  const estimate =
    route && activeVehicle && fuelPrice
      ? calculateTrip({
          distanceKm: route.distanceKm,
          efficiencyKmpl: eff,
          fuelPricePerLiter: fuelPrice.pricePerLiter,
          fuelType: activeVehicle.fuelType,
        })
      : null;

  async function startTrip() {
    if (!activeVehicleId) {
      setError('Pilih kendaraan terlebih dahulu');
      return;
    }
    setStarting(true);
    setError(null);
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: activeVehicleId,
          originLat: origin?.lat,
          originLng: origin?.lng,
          originName: 'Lokasi saya',
          destinationLat: dLat,
          destinationLng: dLng,
          destinationName: dFullName,
          plannedDistanceKm: route?.distanceKm,
          plannedDurationSec: route?.durationSeconds,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memulai perjalanan');
      // Save planned route to localStorage so tracking page can use it
      try {
        if (route) {
          localStorage.setItem(
            `fw_route_${data.trip.id}`,
            JSON.stringify({ geometry: route.geometry, plannedDistanceKm: route.distanceKm })
          );
        }
      } catch {}
      router.push(`/trip/active/${data.trip.id}`);
    } catch (err: any) {
      setError(err.message);
      setStarting(false);
    }
  }

  if (isNaN(dLat) || isNaN(dLng)) {
    return (
      <div className="p-6">
        <p className="text-status-danger">Tujuan tidak valid.</p>
        <Link href="/trip/new" className="text-brand-teal text-sm">
          Pilih ulang
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto px-5 pt-6 pb-32 safe-top safe-bottom">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/trip/new" className="btn-back">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-lg font-bold">Konfirmasi Perjalanan</h1>
      </div>

      {/* Destination */}
      <div className="card-surface mb-4">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-brand-primary mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-text-muted uppercase tracking-wide">Tujuan</p>
            <p className="font-bold text-base">{dName}</p>
            <p className="text-xs text-text-muted line-clamp-2 mt-0.5">{dFullName}</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="mb-4">
        {origin && (
          <MapView
            center={origin}
            zoom={12}
            marker={origin}
            destination={{ lat: dLat, lng: dLng }}
            routeGeometry={route?.geometry}
            height="220px"
          />
        )}
      </div>

      {/* Estimates */}
      {!route && !error && (
        <div className="card-surface flex items-center justify-center py-6 mb-4">
          <Loader2 className="animate-spin text-text-muted" size={20} />
          <span className="ml-2 text-sm text-text-muted">Menghitung rute...</span>
        </div>
      )}

      {error && (
        <div className="bg-status-danger/10 border border-status-danger/30 text-status-danger text-sm rounded-input px-3 py-2 mb-4">
          {error}
        </div>
      )}

      {route && estimate && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="card-surface">
              <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">Jarak</p>
              <p className="text-xl font-bold">{formatKm(route.distanceKm, 1)}</p>
            </div>
            <div className="card-surface">
              <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">Estimasi waktu</p>
              <p className="text-xl font-bold">
                <Clock size={14} className="inline mr-1 mb-0.5" />
                {formatDuration(route.durationSeconds)}
              </p>
            </div>
            <div className="card-surface">
              <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">Estimasi BBM</p>
              <p className="text-xl font-bold">{formatLiter(estimate.fuelLiters)}</p>
            </div>
            <div className="card-elevated border-brand-primary/30 bg-brand-primary/5">
              <p className="text-[10px] text-brand-primary uppercase tracking-wide mb-1 font-semibold">
                Estimasi Biaya
              </p>
              <p className="text-xl font-bold text-brand-primary">{formatRupiah(estimate.fuelCostIdr)}</p>
            </div>
          </div>

          {route.fallback && (
            <p className="text-[11px] text-status-warning mb-3">
              ⚠ Server routing tidak merespons, menggunakan estimasi garis lurus.
            </p>
          )}
        </>
      )}

      {/* Vehicle selector */}
      {!loading && vehicles.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold mb-2">
            Kendaraan
          </p>
          <div className="space-y-2">
            {vehicles.map((v) => {
              const selected = v.id === activeVehicleId;
              const price = prices.find((p) => p.fuelType === v.fuelType);
              return (
                <button
                  key={v.id}
                  onClick={() => setActiveVehicleId(v.id)}
                  className={`w-full card-surface flex items-center justify-between active:scale-[0.99] transition-transform ${
                    selected ? 'border-brand-teal bg-brand-teal/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Car
                      size={18}
                      className={selected ? 'text-brand-teal' : 'text-text-muted'}
                    />
                    <div className="text-left">
                      <p className="font-semibold text-sm">
                        {v.nickname || `${v.brand} ${v.model}`}
                      </p>
                      <p className="text-[11px] text-text-muted capitalize">
                        {v.fuelType.replace('_', ' ')}
                        {price ? ` · ${formatRupiah(price.pricePerLiter)}/L` : ''}
                        {' · '}
                        {Number(v.customEfficiency ?? v.efficiencyKmpl).toFixed(1)} km/L
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!loading && vehicles.length === 0 && (
        <div className="card-surface text-center py-6 mb-4">
          <p className="text-sm">Belum ada kendaraan.</p>
          <Link href="/setup-vehicle" className="text-brand-teal text-xs">
            Tambah kendaraan
          </Link>
        </div>
      )}

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-primary/95 backdrop-blur border-t border-bg-border p-4 safe-bottom z-40">
        <div className="max-w-md mx-auto">
          <button
            onClick={startTrip}
            disabled={!route || !activeVehicleId || starting}
            className="btn-primary"
          >
            <Fuel size={18} className="inline mr-2 mb-0.5" />
            {starting ? 'Memulai...' : 'Mulai Perjalanan'}
          </button>
          <p className="text-[10px] text-text-muted text-center mt-2">
            Estimasi berdasarkan rata-rata efisiensi. Hasil aktual dapat berbeda.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TripConfirmPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Memuat...</div>}>
      <ConfirmInner />
    </Suspense>
  );
}
