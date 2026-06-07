'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, ChevronLeft, ChevronRight, Check, Fuel } from 'lucide-react';
import { FUEL_TYPES } from '@/lib/vehicle-specs-data';
import { formatRupiah } from '@/lib/fmt';
import BottomNav from '@/components/BottomNav';

interface Spec {
  id: string;
  brand: string;
  model: string;
  yearStart: number;
  yearEnd: number | null;
  efficiencyAvg: string | number;
  fuelTypeRecommended: string;
}

interface FuelPrice {
  fuelType: string;
  pricePerLiter: number;
}

export default function SetupVehiclePage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [brands, setBrands] = useState<string[]>([]);
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [prices, setPrices] = useState<FuelPrice[]>([]);

  const [brand, setBrand] = useState<string | null>(null);
  const [model, setModel] = useState<Spec | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [fuelType, setFuelType] = useState<string | null>(null);
  const [efficiency, setEfficiency] = useState<number>(0);
  const [nickname, setNickname] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/vehicle-specs?list=brands')
      .then((r) => r.json())
      .then((d) => setBrands(d.brands || []));
    fetch('/api/fuel-prices')
      .then((r) => r.json())
      .then((d) => setPrices(d.prices || []));
  }, []);

  useEffect(() => {
    if (brand) {
      fetch(`/api/vehicle-specs?brand=${encodeURIComponent(brand)}`)
        .then((r) => r.json())
        .then((d) => setSpecs(d.specs || []));
    }
  }, [brand]);

  useEffect(() => {
    if (model) {
      setEfficiency(Number(model.efficiencyAvg));
      setFuelType(model.fuelTypeRecommended);
    }
  }, [model]);

  async function handleSave() {
    if (!brand || !model || !year || !fuelType) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname || null,
          brand,
          model: model.model,
          year,
          fuelType,
          efficiencyKmpl: Number(model.efficiencyAvg),
          customEfficiency: efficiency !== Number(model.efficiencyAvg) ? efficiency : null,
          setActive: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan');
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Year options based on model year range
  const yearOptions = (() => {
    if (!model) return [];
    const currentYear = new Date().getFullYear();
    const end = model.yearEnd ?? currentYear;
    const arr: number[] = [];
    for (let y = end; y >= model.yearStart; y--) arr.push(y);
    return arr;
  })();

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto">
      <div className="flex-1 px-5 pt-8 pb-32 safe-top">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => {
              if (step === 1) {
                router.push('/');
              } else {
                setStep((s) => (s - 1) as 1 | 2 | 3 | 4);
              }
            }} 
            className="btn-back"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Setup Kendaraan</h1>
            <div className="flex gap-1.5 mt-1.5">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className={`h-1 flex-1 rounded-input ${
                    n <= step ? 'bg-brand-teal' : 'bg-bg-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {step === 1 && (
        <>
          <h2 className="text-xl font-bold mb-1">Pilih Merek Kendaraan</h2>
          <p className="text-sm text-text-muted mb-5">Pilih merek mobil Anda</p>
          <div className="grid grid-cols-2 gap-3">
            {brands.map((b) => {
              const bgImg = `/brands/${b.toLowerCase().replace(/\s+/g, '-')}.jpg`;
              return (
                <button
                  key={b}
                  onClick={() => {
                    setBrand(b);
                    setModel(null);
                    setYear(null);
                    setStep(2);
                  }}
                  className={`relative overflow-hidden text-left active:scale-95 transition-transform h-24 rounded-2xl border ${
                    brand === b ? 'border-brand-teal ring-2 ring-brand-teal' : 'border-bg-border'
                  }`}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: `url('${bgImg}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="font-semibold text-sm text-white drop-shadow-md">{b}</span>
                    {brand === b && <Check size={16} className="text-brand-teal drop-shadow" />}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {step === 2 && brand && (
        <>
          <h2 className="text-xl font-bold mb-1">Pilih Model</h2>
          <p className="text-sm text-text-muted mb-5">Model {brand} Anda</p>
          <div className="grid grid-cols-2 gap-3">
            {specs.map((s) => {
              const bgImg = `/models/${brand.toLowerCase().replace(/\s+/g, '-')}-${s.model.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`;
              const fallbackBgImg = `/brands/${brand.toLowerCase().replace(/\s+/g, '-')}.jpg`;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setModel(s);
                    setStep(3);
                  }}
                  className={`relative overflow-hidden text-left active:scale-[0.98] transition-transform h-32 rounded-2xl border ${
                    model?.id === s.id ? 'border-brand-teal ring-2 ring-brand-teal' : 'border-bg-border'
                  }`}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: `url('${bgImg}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex flex-col justify-end">
                    <span className="font-semibold text-sm text-white leading-tight drop-shadow-md">{s.model}</span>
                    <span className="text-[10px] text-white/80 mt-1 drop-shadow-md">
                      {s.yearStart}–{s.yearEnd ?? 'now'} · {Number(s.efficiencyAvg)} km/L
                    </span>
                  </div>
                  {model?.id === s.id && (
                    <div className="absolute top-2 right-2 bg-brand-teal rounded-full p-0.5 shadow">
                      <Check size={12} className="text-black" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {step === 3 && model && (
        <>
          <h2 className="text-xl font-bold mb-1">Tahun Produksi</h2>
          <p className="text-sm text-text-muted mb-5">
            {brand} {model.model}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {yearOptions.map((y) => (
              <button
                key={y}
                onClick={() => {
                  setYear(y);
                  setStep(4);
                }}
                className={`card-surface text-center py-3 active:scale-95 transition-transform ${
                  year === y ? 'border-brand-teal text-brand-teal' : ''
                }`}
              >
                <span className="font-semibold">{y}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 4 && model && year && (
        <>
          <h2 className="text-xl font-bold mb-1">Bahan Bakar & Efisiensi</h2>
          <p className="text-sm text-text-muted mb-5">Atur jenis BBM</p>

          <div className="mb-5">
            <label className="block text-xs font-medium text-text-muted mb-2">
              Nama panggilan (opsional)
            </label>
            <input
              type="text"
              className="input-base"
              placeholder="Mis. Avanza Harian"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-medium text-text-muted mb-2">
              Jenis BBM
            </label>
            <div className="space-y-2">
              {FUEL_TYPES.map((ft) => {
                const price = prices.find((p) => p.fuelType === ft.value);
                const selected = fuelType === ft.value;
                return (
                  <button
                    key={ft.value}
                    onClick={() => setFuelType(ft.value)}
                    className={`w-full card-surface flex items-center justify-between active:scale-[0.99] transition-transform ${
                      selected ? 'border-brand-teal bg-brand-teal/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Fuel
                        size={18}
                        className={selected ? 'text-brand-teal' : 'text-text-muted'}
                      />
                      <div className="text-left">
                        <div className="font-semibold text-sm">{ft.label}</div>
                        <div className="text-xs text-text-muted">
                          {price ? formatRupiah(price.pricePerLiter) + '/L' : '—'}
                        </div>
                      </div>
                    </div>
                    {selected && <Check size={18} className="text-brand-teal" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-text-muted">
                Efisiensi (km/Liter)
              </label>
              <span className="text-xs text-brand-teal">
                Default: {Number(model.efficiencyAvg)} km/L
              </span>
            </div>
            <input
              type="number"
              className="input-base"
              step="0.1"
              min="1"
              max="100"
              value={efficiency}
              onChange={(e) => setEfficiency(parseFloat(e.target.value) || 0)}
            />
            <p className="text-[11px] text-text-muted mt-1.5">
              Bisa disesuaikan jika konsumsi nyata berbeda dari default.
            </p>
          </div>

          {error && (
            <div className="bg-status-danger/10 border border-status-danger/30 text-status-danger text-sm rounded-input px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving || !fuelType || efficiency <= 0}
            className="btn-primary"
          >
            {saving ? 'Menyimpan...' : 'Simpan Kendaraan'}
          </button>
        </>
      )}
      </div>
      <BottomNav />
    </div>
  );
}
