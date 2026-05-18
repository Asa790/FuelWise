'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Download, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { formatRupiah, formatKm } from '@/lib/fmt';
import BottomNav from '@/components/BottomNav';

interface Stats {
  period: { from: string; to: string; label: string };
  summary: {
    totalCost: number;
    totalDistance: number;
    totalLiters: number;
    avgEfficiency: number;
    tripCount: number;
  };
  previous: { totalCost: number; totalDistance: number; tripCount: number };
  weeklyCost: number[];
  weeklyDistance: number[];
  perVehicle: Array<{ label: string; cost: number; distance: number; trips: number }>;
  topDestinations: Array<{ name: string; count: number; totalCost: number }>;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch('/api/stats/monthly')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setStats(d);
      })
      .catch(() => setError('Gagal memuat statistik'))
      .finally(() => setLoading(false));
  }, []);

  async function exportCSV() {
    setExporting(true);
    try {
      const res = await fetch('/api/trips?status=completed&limit=500');
      const data = await res.json();
      const trips = data.trips || [];
      const headers = [
        'Tanggal',
        'Tujuan',
        'Jarak (km)',
        'BBM (L)',
        'Biaya (Rp)',
        'Durasi (mnt)',
        'Efisiensi (km/L)',
        'CO2 (kg)',
        'Kendaraan',
      ];
      const rows = trips.map((t: any) => [
        new Date(t.startedAt).toLocaleDateString('id-ID'),
        '"' + (t.destinationName || '').replace(/"/g, '""') + '"',
        t.distanceKm ?? '',
        t.fuelLiters ?? '',
        t.fuelCostIdr ?? '',
        t.durationSeconds ? Math.round(t.durationSeconds / 60) : '',
        t.efficiencyKmpl ?? '',
        t.co2Kg ?? '',
        t.vehicle
          ? '"' + ((t.vehicle.nickname || t.vehicle.brand + ' ' + t.vehicle.model)).replace(/"/g, '""') + '"'
          : '',
      ]);
      const csv = [headers.join(','), ...rows.map((r: any[]) => r.join(','))].join('\n');
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fuelwise-trips-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  const costChange =
    stats && stats.previous.totalCost > 0
      ? ((stats.summary.totalCost - stats.previous.totalCost) / stats.previous.totalCost) * 100
      : 0;

  const weeklyData = stats
    ? stats.weeklyCost.map((c, i) => ({
        name: `M${i + 1}`,
        cost: c,
        distance: stats.weeklyDistance[i],
      }))
    : [];

  return (
    <div className="min-h-screen max-w-md mx-auto px-5 pt-8 pb-28 safe-top">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold">Statistik</h1>
          <p className="text-xs text-text-muted">{stats?.period.label || '—'}</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={exporting}
          className="text-xs text-brand-teal font-semibold flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-teal/10"
        >
          <Download size={14} />
          {exporting ? 'Export...' : 'Export CSV'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin text-text-muted" />
        </div>
      ) : error ? (
        <div className="text-status-danger">{error}</div>
      ) : !stats || stats.summary.tripCount === 0 ? (
        <div className="card-surface text-center py-10">
          <p className="text-sm font-semibold mb-1">Belum ada data</p>
          <p className="text-xs text-text-muted">
            Selesaikan beberapa trip dulu untuk melihat statistik
          </p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="card-elevated bg-brand-primary/5 border-brand-primary/20">
              <p className="text-[10px] text-brand-primary uppercase tracking-wide font-semibold mb-1">
                Total Pengeluaran
              </p>
              <p className="text-xl font-bold text-brand-primary">{formatRupiah(stats.summary.totalCost)}</p>
              {stats.previous.totalCost > 0 && (
                <div
                  className={`flex items-center gap-1 text-[10px] mt-1 ${
                    costChange > 0 ? 'text-status-danger' : 'text-status-success'
                  }`}
                >
                  {costChange > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {Math.abs(costChange).toFixed(1)}% dari bulan lalu
                </div>
              )}
            </div>
            <div className="card-surface">
              <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">
                Total jarak
              </p>
              <p className="text-xl font-bold">{formatKm(stats.summary.totalDistance, 1)}</p>
            </div>
            <div className="card-surface">
              <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">
                Rata-rata efisiensi
              </p>
              <p className="text-xl font-bold text-brand-teal">
                {stats.summary.avgEfficiency.toFixed(1)}
                <span className="text-xs font-medium ml-1">km/L</span>
              </p>
            </div>
            <div className="card-surface">
              <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">
                Jumlah trip
              </p>
              <p className="text-xl font-bold">{stats.summary.tripCount}</p>
            </div>
          </div>

          {/* Weekly chart */}
          <div className="card-surface mb-5">
            <p className="text-xs font-semibold mb-3">Pengeluaran Mingguan</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="#243350" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#6B7FA3', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: '#6B7FA3', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1A2840',
                      border: '1px solid #243350',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: '#EEF2FF' }}
                    formatter={(v: any) => [formatRupiah(v), 'Biaya']}
                  />
                  <Bar dataKey="cost" fill="#FF6B35" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Per vehicle */}
          {stats.perVehicle.length > 0 && (
            <div className="card-surface mb-5">
              <p className="text-xs font-semibold mb-3">Breakdown per Kendaraan</p>
              <div className="space-y-2">
                {stats.perVehicle.map((v) => (
                  <div key={v.label} className="flex items-center justify-between text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{v.label}</p>
                      <p className="text-[11px] text-text-muted">
                        {v.trips} trip · {formatKm(v.distance, 1)}
                      </p>
                    </div>
                    <p className="font-bold text-brand-primary whitespace-nowrap">
                      {formatRupiah(v.cost)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top destinations */}
          {stats.topDestinations.length > 0 && (
            <div className="card-surface mb-5">
              <p className="text-xs font-semibold mb-3">Top Tujuan</p>
              <div className="space-y-2">
                {stats.topDestinations.map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-brand-teal font-bold text-sm w-5">
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{d.name}</p>
                      <p className="text-[11px] text-text-muted">
                        {d.count}× · total {formatRupiah(d.totalCost)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <BottomNav />
    </div>
  );
}
