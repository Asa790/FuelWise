'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Fuel } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Konfirmasi password tidak cocok');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mendaftar');
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 max-w-md mx-auto safe-top safe-bottom">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-input bg-brand-teal/15 flex items-center justify-center">
          <Fuel className="text-brand-teal" size={26} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">FuelWise</h1>
          <p className="text-xs text-text-muted">Pelacak konsumsi BBM</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2">Buat akun baru</h2>
      <p className="text-sm text-text-muted mb-6">Mulai pantau biaya BBM Anda</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Nama Lengkap</label>
          <input
            type="text"
            className="input-base"
            placeholder="Nama Anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Email</label>
          <input
            type="email"
            className="input-base"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              className="input-base pr-12"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">
            Konfirmasi Password
          </label>
          <input
            type={showPass ? 'text' : 'password'}
            className="input-base"
            placeholder="Ulangi password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        {error && (
          <div className="bg-status-danger/10 border border-status-danger/30 text-status-danger text-sm rounded-input px-3 py-2">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Memproses...' : 'Daftar Sekarang'}
        </button>
      </form>

      <p className="text-sm text-center text-text-muted mt-8">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-brand-teal font-semibold">
          Masuk
        </Link>
      </p>
    </div>
  );
}
