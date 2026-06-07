# FuelWise — Pelacak Konsumsi BBM Real-Time

Aplikasi mobile-first PWA untuk mengukur konsumsi bahan bakar saat berkendara di Indonesia. Pengguna memilih tujuan, lalu aplikasi melacak GPS secara real-time dan menghitung jarak, liter BBM yang terpakai, dan biaya berdasarkan harga BBM Pertamina + spesifikasi kendaraan.

**Production**: https://fuelwise.anjas.id

---

## Fitur Utama

- **Autentikasi**: Register/login dengan JWT cookie httpOnly
- **Setup kendaraan**: Wizard 4 langkah (brand → model → tahun → BBM/efisiensi), pre-loaded 70+ mobil populer Indonesia
- **Pencarian tujuan**: Geocoding via Nominatim OSM (Indonesia only), saran "sering dikunjungi"
- **Routing**: OSRM (atau OpenRouteService bila `ORS_API_KEY` di-set) untuk estimasi jarak + waktu + biaya
- **Live tracking**: `navigator.geolocation.watchPosition` dengan filter noise GPS, geofencing arrival (100m), pause/resume, vibrate + notifikasi saat tiba
- **Riwayat**: List trip dengan filter (semua / 7 hari / bulan), favorit, hapus
- **Statistik**: Total biaya/jarak/efisiensi bulan ini, bar chart pengeluaran mingguan (Recharts), breakdown per kendaraan, top tujuan, export CSV
- **Profil**: Edit nama, budget BBM bulanan dengan progress bar warning, manage kendaraan, admin harga BBM
- **PWA**: Manifest + service worker (network-first + OSM tile cache), installable, ikon adaptif

## Stack Teknis

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS dengan design token kustom (palet brand teal/orange di tema gelap)
- **Database**: MariaDB via Prisma ORM
- **Auth**: JWT (`jose`) + cookie httpOnly + middleware
- **Maps**: Leaflet + OpenStreetMap tiles
- **Charts**: Recharts
- **Geocoding**: Nominatim (gratis, dengan cache server-side 6 jam)
- **Routing**: OSRM (gratis publik) atau OpenRouteService
- **Icons**: Lucide React

## Arsitektur

```
/var/www/fuelwise
├── app/
│   ├── api/                # Route handlers (auth, trips, vehicles, geocode, route, stats)
│   ├── dashboard/          # Beranda
│   ├── trip/{new,confirm,active/[id],result/[id]}
│   ├── history/ stats/ profile/ vehicles/
│   ├── setup-vehicle/ login/ register/
│   ├── layout.tsx globals.css
├── components/             # BottomNav, StatCard, MapView (Leaflet)
├── lib/                    # db, auth, calc-fuel, fmt, vehicle-specs-data
├── prisma/                 # schema.prisma, seed.ts
├── public/                 # manifest.json, sw.js, icons/
├── middleware.ts           # Auth + redirect
└── tests/calc.test.ts      # Unit tests untuk perhitungan
```

## Menjalankan Lokal

```bash
# Database (MariaDB sudah harus jalan + user `fuelwise` punya akses ke DB `fuelwise`)
cp .env.example .env  # lalu sesuaikan DATABASE_URL & JWT_SECRET

npm install
npx prisma db push
npx tsx prisma/seed.ts    # Seed 70 vehicle specs + 5 fuel prices Pertamina

npm run dev               # Mode development di :3000
# atau
npm run build && npm start
```

## Testing

```bash
npm run test:calc         # Unit test untuk lib/calc-fuel
```

## Deployment Production (PM2 + Nginx)

Aplikasi dideploy di:
- **Domain**: fuelwise.anjas.id (HTTPS via Let's Encrypt)
- **Proses**: PM2 `fuelwise` di port 3000
- **Reverse proxy**: Nginx di `/etc/nginx/sites-available/fuelwise.anjas.id.conf`

```bash
pm2 start npm --name fuelwise -- start
pm2 save
pm2 startup
```

Renew SSL otomatis via certbot scheduled task.

## Environment Variables

| Variable | Wajib | Keterangan |
|---|---|---|
| `DATABASE_URL` | ✓ | MySQL/MariaDB connection string |
| `JWT_SECRET` | ✓ | Minimal 32 karakter untuk sign session |
| `NEXT_PUBLIC_APP_URL` | — | URL publik aplikasi |
| `ORS_API_KEY` | — | OpenRouteService API key (opsional, fallback ke OSRM) |
| `NOMINATIM_USER_AGENT` | — | User-Agent untuk Nominatim API |

## Catatan Penting

- **GPS tracking** butuh layar tetap aktif. Service worker tidak bisa mengakses GPS di background — ini batasan platform web. Pengguna diberitahu via banner warning di layar tracking.
- **Akurasi**: Distance dihitung dengan formula Haversine dari titik-titik GPS dengan filter noise (<5m diabaikan, >1km dengan akurasi >50m dianggap jump).
- **Harga BBM**: Snapshot disimpan per trip agar perubahan harga tidak mempengaruhi riwayat lama.
- **Efisiensi**: Default per model (database 70 mobil), bisa di-override custom per kendaraan user.
- **Nominatim usage policy**: Maks 1 req/detik; aplikasi cache 6 jam + debounce 500ms input.

## License

MIT
# FuelWise
