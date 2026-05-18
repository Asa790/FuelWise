export function formatRupiah(amount: unknown): string {
  const n = num(amount);
  if (isNaN(n)) return 'Rp 0';
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

export function formatKm(km: unknown, digits = 2): string {
  const n = num(km);
  if (isNaN(n)) return '0 km';
  return n.toFixed(digits) + ' km';
}

export function formatLiter(l: unknown, digits = 2): string {
  const n = num(l);
  if (isNaN(n)) return '0 L';
  return n.toFixed(digits) + ' L';
}

export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds < 0) return '0 mnt';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}j ${m}mnt`;
  if (m > 0) return `${m} mnt`;
  return `${s} dtk`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} hari lalu`;
  return formatDate(d);
}

export function num(v: unknown): number {
  if (v === null || v === undefined) return 0;
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return parseFloat(v);
  if (typeof v === 'object' && v !== null && 'toString' in v) {
    return parseFloat((v as any).toString());
  }
  return 0;
}
