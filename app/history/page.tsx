'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Star,
  Trash2,
  Filter,
  Loader2,
} from 'lucide-react';
import {
  formatRupiah,
  formatKm,
  formatLiter,
  formatRelativeTime,
  num,
} from '@/lib/fmt';
import BottomNav from '@/components/BottomNav';
import ConfirmDialog from '@/components/ConfirmDialog';

interface Trip {
  id: string;
  destinationName: string;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
  distanceKm: string | null;
  fuelLiters: string | null;
  fuelCostIdr: number | null;
  status: string;
  isFavourite: boolean;
  vehicle: {
    brand: string;
    model: string;
    nickname: string | null;
    fuelType: string;
  } | null;
}

type FilterKey = 'all' | 'week' | 'month' | 'favourite';

export default function HistoryPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [deleteDialog, setDeleteDialog] = useState<{ id: string } | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    let url = '/api/trips?status=completed&limit=200';
    const now = new Date();
    if (filter === 'favourite') {
      url += '&favourite=true';
    } else if (filter === 'week') {
      const from = new Date(now);
      from.setDate(from.getDate() - 7);
      url += `&from=${from.toISOString()}`;
    } else if (filter === 'month') {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      url += `&from=${from.toISOString()}`;
    }
    try {
      const res = await fetch(url);
      const data = await res.json();
      setTrips(data.trips || []);
    } catch {
      setError('Gagal memuat riwayat');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function deleteTrip(id: string) {
    setDeleteDialog({ id });
  }

  async function handleDeleteConfirm() {
    if (!deleteDialog) return;
    await fetch(`/api/trips/${deleteDialog.id}`, { method: 'DELETE' });
    setTrips((t) => t.filter((x) => x.id !== deleteDialog.id));
    setDeleteDialog(null);
  }

  async function toggleFav(id: string, current: boolean) {
    setTrips((arr) => arr.map((t) => (t.id === id ? { ...t, isFavourite: !current } : t)));
    await fetch(`/api/trips/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFavourite: !current }),
    });
  }

  const totalCost = trips.reduce((s, t) => s + (t.fuelCostIdr || 0), 0);
  const totalDistance = trips.reduce((s, t) => s + num(t.distanceKm), 0);

  return (
    <div className="min-h-screen max-w-md mx-auto px-5 pt-8 pb-28 safe-top">
      <h1 className="text-xl font-bold mb-1">Riwayat Perjalanan</h1>
      <p className="text-xs text-text-muted mb-5">
        Total {trips.length} perjalanan tercatat
      </p>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {(
          [
            { k: 'all', label: 'Semua' },
            { k: 'week', label: '7 Hari' },
            { k: 'month', label: 'Bulan ini' },
          ] as const
        ).map((f) => (
          <button
            key={f.k}
            onClick={() => setFilter(f.k)}
            className={`chip ${filter === f.k ? 'chip-active' : ''} flex-shrink-0`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="card-surface">
          <p className="text-[10px] text-text-muted uppercase tracking-wide">Total biaya</p>
          <p className="text-lg font-bold text-brand-primary">{formatRupiah(totalCost)}</p>
        </div>
        <div className="card-surface">
          <p className="text-[10px] text-text-muted uppercase tracking-wide">Total jarak</p>
          <p className="text-lg font-bold">{formatKm(totalDistance, 1)}</p>
        </div>
      </div>

      {error && (
        <div className="bg-status-danger/10 border border-status-danger/30 text-status-danger text-sm rounded-input px-3 py-2 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin text-text-muted" />
        </div>
      ) : trips.length === 0 ? (
        <div className="card-surface text-center py-10">
          <MapPin size={28} className="text-text-muted mx-auto mb-2" />
          <p className="text-sm font-semibold mb-1">Belum ada perjalanan</p>
          <p className="text-xs text-text-muted">
            Trip yang sudah selesai akan tampil di sini
          </p>
          <Link href="/trip/new" className="btn-primary mt-4 inline-block">
            Mulai Perjalanan
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {trips.map((t) => (
            <div key={t.id} className="card-surface group">
              <Link href={`/trip/result/${t.id}`} className="block">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <MapPin size={12} className="text-text-muted flex-shrink-0" />
                      <p className="font-semibold text-sm truncate">
                        {t.destinationName.split(',')[0]}
                      </p>
                    </div>
                    <p className="text-[11px] text-text-muted">
                      {formatRelativeTime(t.startedAt)}
                    </p>
                  </div>
                  <p className="font-bold text-sm text-brand-primary whitespace-nowrap">
                    {formatRupiah(t.fuelCostIdr)}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-text-muted">
                  <span>📍 {formatKm(t.distanceKm, 1)}</span>
                  <span>⛽ {formatLiter(t.fuelLiters)}</span>
                  <span className="flex items-center gap-0.5">
                    <Clock size={11} />
                    {t.durationSeconds
                      ? `${Math.round(t.durationSeconds / 60)} mnt`
                      : '—'}
                  </span>
                </div>
              </Link>
              <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-bg-border">
                <button
                  onClick={() => toggleFav(t.id, t.isFavourite)}
                  className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full ${
                    t.isFavourite
                      ? 'text-brand-primary'
                      : 'text-text-muted'
                  }`}
                >
                  <Star
                    size={16}
                    fill={t.isFavourite ? '#4BA3C7' : 'none'}
                  />
                  {t.isFavourite ? 'Favorit' : 'Tandai'}
                </button>
                <button
                  onClick={() => deleteTrip(t.id)}
                  className="text-xs text-status-danger flex items-center gap-1 px-2 py-1 rounded-full"
                >
                  <Trash2 size={12} />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />

      <ConfirmDialog
        isOpen={!!deleteDialog}
        title="Hapus Perjalanan"
        message="Hapus perjalanan ini?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog(null)}
        confirmText="Ya"
        cancelText="Batal"
      />
    </div>
  );
}
