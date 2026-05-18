'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Car, Plus, Check, Trash2, Edit3, Save, Loader2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import ConfirmDialog from '@/components/ConfirmDialog';
import { FUEL_TYPES } from '@/lib/vehicle-specs-data';
import { formatRupiah } from '@/lib/fmt';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  nickname: string | null;
  fuelType: string;
  efficiencyKmpl: string;
  customEfficiency: string | null;
  isActive: boolean;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [customEff, setCustomEff] = useState<string | number>('');
  const [fuelType, setFuelType] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ id: string } | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/vehicles');
    const data = await res.json();
    setVehicles(data.vehicles || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(v: Vehicle) {
    setEditingId(v.id);
    setNickname(v.nickname || '');
    setCustomEff(v.customEfficiency ? Number(v.customEfficiency) : '');
    setFuelType(v.fuelType);
  }

  async function saveEdit(v: Vehicle) {
    await fetch(`/api/vehicles/${v.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickname: nickname || null,
        customEfficiency: customEff === '' ? null : Number(customEff),
        fuelType,
      }),
    });
    setEditingId(null);
    load();
  }

  async function setActive(id: string) {
    await fetch(`/api/vehicles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setActive: true }),
    });
    load();
  }

  async function remove(id: string) {
    setDeleteDialog({ id });
  }

  async function handleDeleteConfirm() {
    if (!deleteDialog) return;
    await fetch(`/api/vehicles/${deleteDialog.id}`, { method: 'DELETE' });
    load();
    setDeleteDialog(null);
  }

  return (
    <div className="min-h-screen max-w-md mx-auto px-5 pt-6 pb-20 safe-top">
      <div className="flex items-center gap-2 mb-5">
        <Link href="/dashboard" className="btn-back">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-lg font-bold flex-1">Kendaraan Saya</h1>
        <Link
          href="/setup-vehicle"
          className="text-brand-teal text-xs font-semibold flex items-center gap-1 bg-brand-teal/10 px-3 py-1.5 rounded-full"
        >
          <Plus size={14} />
          Tambah
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-text-muted" />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="card-surface text-center py-10">
          <Car size={32} className="text-text-muted mx-auto mb-2" />
          <p className="text-sm font-semibold mb-1">Belum ada kendaraan</p>
          <p className="text-xs text-text-muted mb-4">
            Tambahkan kendaraan untuk mulai tracking
          </p>
          <Link href="/setup-vehicle" className="btn-primary inline-block">
            Tambah Kendaraan
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((v) => {
            const isEditing = editingId === v.id;
            const eff = Number(v.customEfficiency ?? v.efficiencyKmpl);
            return (
              <div
                key={v.id}
                className={`card-surface ${v.isActive ? 'border-brand-teal/40 bg-brand-teal/5' : ''}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-input flex items-center justify-center ${
                      v.isActive ? 'bg-brand-teal/20' : 'bg-bg-border'
                    }`}
                  >
                    <Car size={18} className={v.isActive ? 'text-brand-teal' : 'text-text-muted'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-sm truncate">
                        {v.nickname || `${v.brand} ${v.model}`}
                      </p>
                      {v.isActive && (
                        <span className="text-[9px] bg-brand-teal text-bg-primary px-1.5 py-0.5 rounded font-bold">
                          AKTIF
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted">
                      {v.brand} {v.model} {v.year}
                    </p>
                    <p className="text-[11px] text-text-muted capitalize">
                      {v.fuelType.replace('_', ' ')} · {eff.toFixed(1)} km/L
                      {v.customEfficiency && (
                        <span className="text-brand-primary"> (custom)</span>
                      )}
                    </p>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-2 pt-2 border-t border-bg-border">
                    <input
                      type="text"
                      className="input-base !py-2 text-sm"
                      placeholder="Nama panggilan"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                    />
                    <select
                      className="input-base !py-2 text-sm"
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                    >
                      {FUEL_TYPES.map((ft) => (
                        <option key={ft.value} value={ft.value}>
                          {ft.label}
                        </option>
                      ))}
                    </select>
                    <div>
                      <label className="text-[10px] text-text-muted">
                        Efisiensi custom (km/L, kosongkan untuk default)
                      </label>
                      <input
                        type="number"
                        className="input-base !py-2 text-sm"
                        placeholder={`Default: ${Number(v.efficiencyKmpl)}`}
                        value={customEff}
                        onChange={(e) =>
                          setCustomEff(e.target.value === '' ? '' : parseFloat(e.target.value))
                        }
                        step="0.1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="btn-secondary flex-1 !py-2 text-sm"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => saveEdit(v)}
                        className="btn-primary flex-1 !py-2 text-sm flex items-center justify-center gap-1"
                      >
                        <Save size={14} />
                        Simpan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 pt-2 border-t border-bg-border">
                    {!v.isActive && (
                      <button
                        onClick={() => setActive(v.id)}
                        className="flex-1 text-xs font-semibold text-brand-teal bg-brand-teal/10 rounded-input py-2 flex items-center justify-center gap-1"
                      >
                        <Check size={14} />
                        Aktifkan
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(v)}
                      className="flex-1 text-xs font-semibold text-text-primary bg-bg-border/50 rounded-input py-2 flex items-center justify-center gap-1"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => remove(v.id)}
                      className="text-xs font-semibold text-status-danger bg-status-danger/10 rounded-input py-2 px-3 flex items-center justify-center"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <BottomNav />

      <ConfirmDialog
        isOpen={!!deleteDialog}
        title="Hapus Kendaraan"
        message="Hapus kendaraan ini? Data perjalanan terkait tidak akan terhapus."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog(null)}
        confirmText="Ya"
        cancelText="Batal"
      />
    </div>
  );
}
