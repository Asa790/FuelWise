'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, BarChart3, User } from 'lucide-react';

const items = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/history', label: 'Riwayat', icon: History },
  { href: '/stats', label: 'Statistik', icon: BarChart3 },
  { href: '/profile', label: 'Profil', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom nav-pill !rounded-none !border-x-0 !border-b-0 pb-safe">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around gap-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`nav-item ${active ? 'active' : ''}`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {active && <span className="ml-1.5 text-xs font-semibold">{label}</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
