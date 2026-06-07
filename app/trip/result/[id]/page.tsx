import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { CheckCircle2, MapPin, Fuel, Leaf, Clock, Route, Home, History as HistoryIcon } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { formatRupiah, formatKm, formatLiter, formatDuration, formatDate, num } from '@/lib/fmt';
import BottomNav from '@/components/BottomNav';

export const dynamic = 'force-dynamic';

export default async function TripResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect('/login');

  const { id } = await params;
  const trip = await prisma.trip.findFirst({
    where: { id, userId: session.userId },
    include: { vehicle: true },
  });
  if (!trip) notFound();

  const eff = num(trip.efficiencyKmpl);
  const distance = num(trip.distanceKm);
  const liters = num(trip.fuelLiters);
  const cost = trip.fuelCostIdr ?? 0;
  const co2 = num(trip.co2Kg);
  const duration = trip.durationSeconds || 0;
  const actualEff = liters > 0 ? distance / liters : eff;

  // Compare to user's average efficiency
  const allCompletedAgg = await prisma.trip.aggregate({
    where: { userId: session.userId, status: 'completed', id: { not: id } },
    _avg: { efficiencyKmpl: true },
    _count: { _all: true },
  });
  const avgEff = num(allCompletedAgg._avg.efficiencyKmpl) || eff;
  const better = actualEff > avgEff;
  const diff = avgEff > 0 ? Math.abs(((actualEff - avgEff) / avgEff) * 100) : 0;

  return (
    <div className="min-h-screen max-w-md mx-auto px-5 pt-10 pb-8 safe-top safe-bottom">
      <div className="text-center mb-6 animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-brand-teal/15 flex items-center justify-center">
          <CheckCircle2 size={36} className="text-brand-teal" />
        </div>
        <h1 className="text-2xl font-bold mb-1">
          {trip.status === 'completed' ? 'Sampai Tujuan!' : 'Perjalanan Dibatalkan'}
        </h1>
        <p className="text-sm text-text-muted">
          <MapPin size={12} className="inline mr-1 mb-0.5" />
          {trip.destinationName.split(',')[0]}
        </p>
        <p className="text-xs text-text-muted mt-0.5">{formatDate(trip.startedAt)}</p>
      </div>

      {/* Big cost card */}
      <div className="card-elevated border-brand-primary/30 bg-gradient-to-br from-brand-primary/10 to-transparent text-center py-6 mb-5">
        <p className="text-xs text-brand-primary uppercase tracking-wide font-semibold mb-2">
          Total Biaya BBM
        </p>
        <p className="text-4xl font-bold text-brand-primary">{formatRupiah(cost)}</p>
        <p className="text-xs text-text-muted mt-2">
          {formatLiter(liters)} ×{' '}
          {trip.fuelPriceSnapshot
            ? formatRupiah(trip.fuelPriceSnapshot) + '/L'
            : '—'}
        </p>
        {trip.fuelTypeSnapshot && (
          <p className="text-[11px] text-text-muted mt-0.5 capitalize">
            BBM: {trip.fuelTypeSnapshot.replace('_', ' ')}
          </p>
        )}
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="card-surface">
          <div className="flex items-center gap-1.5 text-text-muted mb-1">
            <Route size={12} />
            <span className="text-[10px] uppercase tracking-wide">Jarak</span>
          </div>
          <p className="text-xl font-bold">{formatKm(distance, 2)}</p>
        </div>
        <div className="card-surface">
          <div className="flex items-center gap-1.5 text-text-muted mb-1">
            <Clock size={12} />
            <span className="text-[10px] uppercase tracking-wide">Durasi</span>
          </div>
          <p className="text-xl font-bold">{formatDuration(duration)}</p>
        </div>
        <div className="card-surface">
          <div className="flex items-center gap-1.5 text-text-muted mb-1">
            <Fuel size={12} />
            <span className="text-[10px] uppercase tracking-wide">BBM</span>
          </div>
          <p className="text-xl font-bold">{formatLiter(liters)}</p>
        </div>
        <div className="card-surface">
          <div className="flex items-center gap-1.5 text-text-muted mb-1">
            <Leaf size={12} />
            <span className="text-[10px] uppercase tracking-wide">CO₂</span>
          </div>
          <p className="text-xl font-bold">{co2.toFixed(2)} kg</p>
        </div>
      </div>

      {/* Efficiency comparison */}
      {allCompletedAgg._count._all > 0 && (
        <div className="card-surface mb-5">
          <p className="text-[10px] text-text-muted uppercase tracking-wide mb-2 font-semibold">
            Efisiensi trip ini
          </p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">
                {actualEff.toFixed(1)}
                <span className="text-sm font-medium ml-1">km/L</span>
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                Rata-rata Anda: {avgEff.toFixed(1)} km/L
              </p>
            </div>
            <div
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                better
                  ? 'bg-status-success/15 text-status-success'
                  : 'bg-status-warning/15 text-status-warning'
              }`}
            >
              {better ? '↑' : '↓'} {diff.toFixed(0)}%
            </div>
          </div>
        </div>
      )}

      {trip.vehicle && (
        <div className="text-center mb-6">
          <p className="text-[10px] text-text-muted uppercase tracking-wide">Kendaraan</p>
          <p className="text-sm font-semibold">
            {trip.vehicle.nickname || `${trip.vehicle.brand} ${trip.vehicle.model} ${trip.vehicle.year}`}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Link href="/" className="btn-primary flex items-center justify-center gap-2">
          <Home size={16} />
          Kembali ke Beranda
        </Link>
        <Link href="/history" className="btn-secondary flex items-center justify-center gap-2">
          <HistoryIcon size={16} />
          Lihat Riwayat
        </Link>
      </div>

      <p className="text-[10px] text-text-muted text-center mt-5 px-4">
        Estimasi berdasarkan rata-rata efisiensi kendaraan. Hasil aktual dapat berbeda
        karena kondisi lalu lintas dan gaya berkendara.
      </p>

      <BottomNav />
    </div>
  );
}
