import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Fuel, ArrowRight, MapPin, Clock, Car, TrendingUp } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { formatRupiah, formatKm, formatRelativeTime, num } from '@/lib/fmt';
import BottomNav from '@/components/BottomNav';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, monthlyBudget: true },
  });
  if (!user) redirect('/login');

  const vehicleCount = await prisma.vehicle.count({ where: { userId: session.userId } });
  if (vehicleCount === 0) redirect('/setup-vehicle');

  const activeVehicle = await prisma.vehicle.findFirst({
    where: { userId: session.userId, isActive: true },
  });

  // Stats this month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const trips = await prisma.trip.findMany({
    where: {
      userId: session.userId,
      status: 'completed',
      startedAt: { gte: monthStart },
    },
    select: { distanceKm: true, fuelLiters: true, fuelCostIdr: true },
  });
  const totalCost = trips.reduce((s, t) => s + (t.fuelCostIdr || 0), 0);
  const totalDistance = trips.reduce((s, t) => s + num(t.distanceKm), 0);
  const totalLiters = trips.reduce((s, t) => s + num(t.fuelLiters), 0);
  const avgEff = totalLiters > 0 ? totalDistance / totalLiters : 0;

  const recent = await prisma.trip.findMany({
    where: { userId: session.userId, status: 'completed' },
    orderBy: { startedAt: 'desc' },
    take: 3,
    include: { vehicle: { select: { brand: true, model: true, nickname: true } } },
  });

  // Active trip check
  const activeTrip = await prisma.trip.findFirst({
    where: { userId: session.userId, status: 'active' },
    orderBy: { startedAt: 'desc' },
  });

  const budgetUsed = user.monthlyBudget > 0 ? (totalCost / user.monthlyBudget) * 100 : 0;

  return (
    <div className="min-h-screen max-w-md mx-auto px-5 pt-10 pb-32 safe-top animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-slide-up">
        <div className="flex items-center gap-3">
          <img src="/fuelwise.png" alt="Fuel Wise" className="w-10 h-10" />
          <div>
            <p className="text-xs text-text-muted">Halo,</p>
            <h1 className="text-2xl font-bold">{user.name}</h1>
          </div>
        </div>
        <Link
          href="/profile"
          className="w-12 h-12 rounded-full bg-bg-surface border border-border flex items-center justify-center font-bold text-brand-primary shadow-sm hover:scale-110 transition-transform"
        >
          {user.name.charAt(0).toUpperCase()}
        </Link>
      </div>

      {/* Gradient Hero Card */}
      <div className="card-hero mb-6 animate-scale-in">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm opacity-90 mb-1">Pengeluaran BBM Bulan Ini</p>
            <p className="text-3xl font-bold">{formatRupiah(totalCost)}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <TrendingUp size={24} className="text-white" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/15 rounded-input p-3">
            <p className="text-xs opacity-80 mb-1">Jarak</p>
            <p className="text-lg font-semibold">{formatKm(totalDistance, 1)}</p>
          </div>
          <div className="bg-white/15 rounded-input p-3">
            <p className="text-xs opacity-80 mb-1">Efisiensi</p>
            <p className="text-lg font-semibold">{avgEff.toFixed(1)} km/L</p>
          </div>
        </div>
      </div>

      <div className="stagger-children">
        {/* Active trip banner */}
        {activeTrip && (
          <Link
            href={`/trip/active/${activeTrip.id}`}
            className="mb-5 block rounded-card bg-brand-primary/10 border border-brand-primary/30 p-4 flex items-center justify-between hover:bg-brand-primary/15 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary" />
                </span>
                <span className="text-brand-primary text-xs font-semibold">PERJALANAN AKTIF</span>
              </div>
              <p className="text-sm font-semibold">{activeTrip.destinationName.split(',')[0]}</p>
            </div>
            <ArrowRight size={20} className="text-brand-primary" />
          </Link>
        )}

        {/* Budget bar */}
        {user.monthlyBudget > 0 && (
          <div className="card-surface mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted">Budget BBM bulan ini</span>
              <span className="text-xs font-semibold">
                {formatRupiah(totalCost)} / {formatRupiah(user.monthlyBudget)}
              </span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetUsed >= 100
                    ? 'bg-status-danger'
                    : budgetUsed >= 80
                    ? 'bg-status-warning'
                    : 'bg-brand-primary'
                }`}
                style={{ width: `${Math.min(100, budgetUsed)}%` }}
              />
            </div>
            {budgetUsed >= 80 && (
              <p
                className={`text-[11px] mt-1.5 ${
                  budgetUsed >= 100 ? 'text-status-danger' : 'text-status-warning'
                }`}
              >
                {budgetUsed >= 100
                  ? '⚠ Budget terlampaui'
                  : `⚠ ${budgetUsed.toFixed(0)}% dari budget terpakai`}
              </p>
            )}
          </div>
        )}

        {/* Active vehicle */}
        {activeVehicle && (
          <Link
            href="/vehicles"
            className="card-surface mb-5 flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-input bg-brand-primary/10 flex items-center justify-center">
              <Car size={20} className="text-brand-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-text-muted uppercase tracking-wide">Kendaraan aktif</p>
              <p className="font-semibold text-base truncate">
                {activeVehicle.nickname || `${activeVehicle.brand} ${activeVehicle.model}`}
              </p>
              <p className="text-xs text-text-muted">
                {activeVehicle.year} · {activeVehicle.fuelType.replace('_', ' ')}
              </p>
            </div>
            <ArrowRight size={18} className="text-text-muted" />
          </Link>
        )}

        {/* Big CTA */}
        <Link
          href="/trip/new"
          className="block btn-primary mb-6"
        >
          <div className="flex items-center justify-center gap-2">
            <Fuel size={20} strokeWidth={2.5} />
            <span className="font-bold">Mulai Perjalanan</span>
            <ArrowRight size={20} strokeWidth={2.5} />
          </div>
        </Link>

        {/* Recent trips */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">Riwayat Terakhir</h2>
          <Link href="/history" className="text-xs text-brand-primary font-semibold hover:opacity-80 transition-opacity">
            Lihat semua
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="card-surface text-center py-10">
            <p className="text-sm text-text-muted">Belum ada perjalanan</p>
            <p className="text-xs text-text-muted mt-1">Mulai trip pertama Anda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((t) => (
              <Link
                key={t.id}
                href={`/trip/result/${t.id}`}
                className="card-surface flex items-center justify-between"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={14} className="text-text-muted flex-shrink-0" />
                    <p className="font-semibold text-sm truncate">
                      {t.destinationName.split(',')[0]}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span>{formatKm(num(t.distanceKm), 1)}</span>
                    <span className="flex items-center gap-0.5">
                      <Clock size={12} />
                      {formatRelativeTime(t.startedAt)}
                    </span>
                  </div>
                </div>
                <p className="font-bold text-sm text-brand-primary whitespace-nowrap">
                  {formatRupiah(t.fuelCostIdr)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
