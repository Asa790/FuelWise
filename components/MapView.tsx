'use client';

import { useEffect, useRef } from 'react';

// Dynamically import Leaflet only on client to avoid SSR issues
type LL = typeof import('leaflet');

interface LatLng {
  lat: number;
  lng: number;
}

interface MapViewProps {
  center: LatLng;
  zoom?: number;
  marker?: LatLng;
  destination?: LatLng;
  routeGeometry?: { type: 'LineString'; coordinates: [number, number][] };
  livePath?: LatLng[];
  follow?: boolean;
  height?: string;
  className?: string;
  progressDistance?: number; // Distance traveled along the route in km
  totalDistance?: number; // Total route distance in km
}

export default function MapView({
  center,
  zoom = 14,
  marker,
  destination,
  routeGeometry,
  livePath,
  follow = false,
  height = '300px',
  className = '',
  progressDistance = 0,
  totalDistance = 0,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const destMarkerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const livePathRef = useRef<any>(null);
  const progressMarkerRef = useRef<any>(null);
  const LRef = useRef<LL | null>(null);

  // Init map
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')) as LL;
      if (cancelled || !containerRef.current) return;
      LRef.current = L;

      // Fix default icon paths (Leaflet bug with bundlers)
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current, {
        center: [center.lat, center.lng],
        zoom,
        zoomControl: true,
        attributionControl: true,
      });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      }).addTo(map);
      mapRef.current = map;
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // User marker
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map || !marker) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([marker.lat, marker.lng]);
    } else {
      const icon = L.divIcon({
        className: 'fw-user-marker',
        html: '<div style="background:#00C896;width:16px;height:16px;border-radius:50%;border:3px solid #0B1120;box-shadow:0 0 0 4px rgba(0,200,150,0.3);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      userMarkerRef.current = L.marker([marker.lat, marker.lng], { icon }).addTo(map);
    }
    if (follow) {
      map.setView([marker.lat, marker.lng], map.getZoom(), { animate: true });
    }
  }, [marker, follow]);

  // Destination marker
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    if (destination) {
      if (destMarkerRef.current) destMarkerRef.current.setLatLng([destination.lat, destination.lng]);
      else {
        const icon = L.divIcon({
          className: 'fw-dest-marker',
          html: '<div style="background:#4BA3C7;width:18px;height:18px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #0B1120;box-shadow:0 2px 4px rgba(0,0,0,0.4);"></div>',
          iconSize: [18, 18],
          iconAnchor: [9, 18],
        });
        destMarkerRef.current = L.marker([destination.lat, destination.lng], { icon }).addTo(map);
      }
    } else if (destMarkerRef.current) {
      map.removeLayer(destMarkerRef.current);
      destMarkerRef.current = null;
    }
  }, [destination]);

  // Route polyline
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    if (routeGeometry?.coordinates?.length) {
      const latlngs = routeGeometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);
      const layer = L.polyline(latlngs, { color: '#4BA3C7', weight: 4, opacity: 0.9 }).addTo(map);
      routeLayerRef.current = layer;
      try {
        map.fitBounds(layer.getBounds(), { padding: [40, 40] });
      } catch {}
    }
  }, [routeGeometry]);

  // Live path (actual driven track)
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    if (livePathRef.current) {
      map.removeLayer(livePathRef.current);
      livePathRef.current = null;
    }
    if (livePath && livePath.length > 1) {
      const latlngs = livePath.map((p) => [p.lat, p.lng] as [number, number]);
      livePathRef.current = L.polyline(latlngs, {
        color: '#2196A6',
        weight: 5,
        opacity: 0.8,
      }).addTo(map);
    }
  }, [livePath]);

  // Progress marker along route polyline
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map || !routeGeometry?.coordinates?.length) return;

    // Calculate position along polyline based on progress
    const coordinates = routeGeometry.coordinates;
    const totalDist = totalDistance || 1;
    const progressRatio = Math.min(1, Math.max(0, progressDistance / totalDist));

    // Calculate cumulative distance along polyline
    const segmentDistances: number[] = [];
    let cumulativeDist = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      const [lng1, lat1] = coordinates[i];
      const [lng2, lat2] = coordinates[i + 1];
      const dist = Math.sqrt(
        Math.pow((lat2 - lat1) * 111.32, 2) +
        Math.pow((lng2 - lng1) * 111.32 * Math.cos((lat1 + lat2) / 2 * Math.PI / 180), 2)
      );
      segmentDistances.push(cumulativeDist);
      cumulativeDist += dist;
    }
    segmentDistances.push(cumulativeDist);

    // Find the segment where the current progress position falls
    const targetDist = progressRatio * cumulativeDist;
    let segmentIndex = 0;
    for (let i = 0; i < segmentDistances.length - 1; i++) {
      if (targetDist >= segmentDistances[i] && targetDist <= segmentDistances[i + 1]) {
        segmentIndex = i;
        break;
      }
    }

    // Interpolate position within the segment
    const [lng1, lat1] = coordinates[segmentIndex];
    const [lng2, lat2] = coordinates[segmentIndex + 1];
    const segmentStartDist = segmentDistances[segmentIndex];
    const segmentEndDist = segmentDistances[segmentIndex + 1];
    const segmentLength = segmentEndDist - segmentStartDist;
    const segmentProgress = segmentLength > 0 ? (targetDist - segmentStartDist) / segmentLength : 0;

    const lat = lat1 + (lat2 - lat1) * segmentProgress;
    const lng = lng1 + (lng2 - lng1) * segmentProgress;

    // Update or create progress marker
    if (progressMarkerRef.current) {
      progressMarkerRef.current.setLatLng([lat, lng]);
    } else {
      const icon = L.divIcon({
        className: 'fw-progress-marker',
        html: '<div style="background:#4BA3C7;width:20px;height:20px;border-radius:50%;border:4px solid #fff;box-shadow:0 0 0 6px rgba(75,163,199,0.4),0 4px 8px rgba(0,0,0,0.3);animation:pulse 1.5s ease-in-out infinite;"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      progressMarkerRef.current = L.marker([lat, lng], { icon }).addTo(map);
      (progressMarkerRef.current as any).setZIndexOffset(1000);
    }
  }, [routeGeometry, progressDistance, totalDistance]);

  return <div ref={containerRef} style={{ height }} className={`w-full rounded-card overflow-hidden ${className}`} />;
}
