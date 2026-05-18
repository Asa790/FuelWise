'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Car,
  Wallet,
  LogOut,
  ChevronRight,
  Edit3,
  Fuel,
  Save,
  Loader2,
  Sun,
  Moon,
} from 'lucide-react';
import { formatRupiah } from '@/lib/fmt';
import BottomNav from '@/components/BottomNav';
import ConfirmDialog from '@/components/ConfirmDialog';
import { FUEL_TYPES } from '@/lib/vehicle-specs-data';

interface User {
  id: string;
  name: string;
  email: string;
  monthlyBudget: number;
  vehicleCount: number;
}

interface FuelPrice {
  fuelType: string;
  pricePerLiter: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState('');
  const [budget, setBudget] = useState(0);
  const [editBudget, setEditBudget] = useState(false);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const [prices, setPrices] = useState<FuelPrice[]>([]);
  const [editPrices, setEditPrices] = useState(false);
  const [priceEdits, setPriceEdits] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    Promise.all([
      fetch('/api/auth/me').then((r) => r.json()),
      fetch('/api/fuel-prices').then((r) => r.json()),
    ]).then(([u, p]) => {
      setUser(u.user);
      setName(u.user?.name || '');
      setBudget(u.user?.monthlyBudget || 0);
      setPrices(p.prices || []);
      setLoading(false);
    });
  }, []);

  function toggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }

  async function saveName() {
    setSaving(true);
    await fetch('/api/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setUser((u) => (u ? { ...u, name } : u));
    setEditName(false);
    setSaving(false);
  }

  async function saveBudget() {
    setSaving(true);
    await fetch('/api/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monthlyBudget: budget }),
    });
    setUser((u) => (u ? { ...u, monthlyBudget: budget } : u));
    setEditBudget(false);
    setSaving(false);
  }

  async function savePrices() {
    setSaving(true);
    for (const [fuelType, price] of Object.entries(priceEdits)) {
      await fetch('/api/fuel-prices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fuelType, pricePerLiter: price }),
      });
    }
    const res = await fetch('/api/fuel-prices');
    const data = await res.json();
    setPrices(data.prices || []);
    setPriceEdits({});
    setEditPrices(false);
    setSaving(false);
  }

  async function logout() {
    setShowLogoutDialog(true);
  }

  async function handleLogoutConfirm() {
    setShowLogoutDialog(false);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto px-5 pt-10 pb-32 safe-top animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 animate-slide-up">Profil</h1>

      <div className="stagger-children">
        {/* User card */}
        <div className="card-surface mb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-2xl font-bold text-brand-primary animate-bounce-in">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              {editName ? (
                <div className="flex gap-2">
                  <input
                    className="input-base !py-2 text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                  <button
                    onClick={saveName}
                    disabled={saving}
                    className="text-brand-primary p-2 hover:scale-110 transition-transform"
                  >
                    <Save size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg truncate">{user.name}</p>
                    <button onClick={() => setEditName(true)} className="text-text-muted hover:scale-110 transition-transform">
                      <Edit3 size={14} />
                    </button>
                  </div>
                  <p className="text-sm text-text-muted truncate">{user.email}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="card-surface mb-4">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between hover:bg-bg-input rounded-input transition-colors p-2 -mx-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-input bg-brand-primary/10 flex items-center justify-center">
                {theme === 'light' ? <Sun size={18} className="text-brand-primary" /> : <Moon size={18} className="text-brand-primary" />}
              </div>
              <div>
                <p className="font-semibold text-sm">Tema</p>
                <p className="text-xs text-text-muted">{theme === 'light' ? 'Terang' : 'Gelap'}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-text-muted" />
          </button>
        </div>

        {/* Vehicles */}
        <Link
          href="/vehicles"
          className="card-surface mb-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-input bg-brand-primary/10 flex items-center justify-center">
              <Car size={18} className="text-brand-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Kendaraan Saya</p>
              <p className="text-xs text-text-muted">{user.vehicleCount} kendaraan tersimpan</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-text-muted" />
        </Link>

        {/* Budget */}
        <div className="card-surface mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-input bg-brand-primary/10 flex items-center justify-center">
              <Wallet size={18} className="text-brand-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Budget BBM Bulanan</p>
              {!editBudget && (
                <p className="text-xs text-text-muted">
                  {user.monthlyBudget > 0
                    ? formatRupiah(user.monthlyBudget) + '/bulan'
                    : 'Belum ditentukan'}
                </p>
              )}
            </div>
            {!editBudget && (
              <button onClick={() => setEditBudget(true)} className="text-brand-primary text-xs font-semibold hover:opacity-80 transition-opacity">
                {user.monthlyBudget > 0 ? 'Ubah' : 'Atur'}
              </button>
            )}
          </div>
          {editBudget && (
            <div className="space-y-3 pt-2 animate-scale-in">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">Rp</span>
                <input
                  type="number"
                  className="input-base pl-10"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value, 10) || 0)}
                  placeholder="0"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditBudget(false);
                    setBudget(user.monthlyBudget);
                  }}
                  className="btn-secondary flex-1 !py-2.5 text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={saveBudget}
                  disabled={saving}
                  className="btn-primary flex-1 !py-2.5 text-sm"
                >
                  Simpan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Fuel prices admin */}
        <div className="card-surface mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-input bg-brand-primary/10 flex items-center justify-center">
              <Fuel size={18} className="text-brand-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Harga BBM Pertamina</p>
              <p className="text-xs text-text-muted">
                Update saat ada perubahan harga resmi
              </p>
            </div>
            <button
              onClick={() => setEditPrices((e) => !e)}
              className="text-brand-primary text-xs font-semibold hover:opacity-80 transition-opacity"
            >
              {editPrices ? 'Tutup' : 'Kelola'}
            </button>
          </div>
          {editPrices ? (
            <div className="space-y-3 pt-3 animate-scale-in">
              {prices.map((p) => {
                const ft = FUEL_TYPES.find((x) => x.value === p.fuelType);
                return (
                  <div key={p.fuelType} className="flex items-center gap-3">
                    <span className="text-xs flex-1">{ft?.label || p.fuelType}</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">Rp</span>
                      <input
                        type="number"
                        className="input-base !py-2 pl-8 text-sm w-36"
                        defaultValue={p.pricePerLiter}
                        onChange={(e) =>
                          setPriceEdits((cur) => ({
                            ...cur,
                            [p.fuelType]: parseInt(e.target.value, 10) || 0,
                          }))
                        }
                      />
                    </div>
                  </div>
                );
              })}
              <button
                onClick={savePrices}
                disabled={saving || Object.keys(priceEdits).length === 0}
                className="btn-primary !py-2.5 text-sm mt-2"
              >
                {saving ? 'Menyimpan...' : 'Simpan Harga'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
              {prices.map((p) => {
                const ft = FUEL_TYPES.find((x) => x.value === p.fuelType);
                return (
                  <div key={p.fuelType} className="flex justify-between">
                    <span className="text-text-muted">{ft?.label || p.fuelType}:</span>
                    <span className="font-semibold">{formatRupiah(p.pricePerLiter)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className="w-full card-surface flex items-center gap-3 text-status-danger"
        >
          <div className="w-10 h-10 rounded-input bg-status-danger/15 flex items-center justify-center">
            <LogOut size={18} />
          </div>
          <span className="font-semibold text-sm">Keluar</span>
        </button>

        <p className="text-xs text-text-muted text-center mt-8">
          Fuel Wise v1.0 · Made for Indonesian drivers
        </p>
      </div>

      <BottomNav />

      <ConfirmDialog
        isOpen={showLogoutDialog}
        title="Keluar"
        message="Yakin ingin logout?"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutDialog(false)}
        confirmText="Ya"
        cancelText="Batal"
      />
    </div>
  );
}
