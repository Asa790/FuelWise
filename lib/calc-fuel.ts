import { CO2_FACTORS } from './vehicle-specs-data';

export interface TripCalculationInput {
  distanceKm: number;
  efficiencyKmpl: number;
  fuelPricePerLiter: number;
  fuelType: string;
}

export interface TripCalculationResult {
  fuelLiters: number;
  fuelCostIdr: number;
  co2Kg: number;
}

export function calculateTrip(params: TripCalculationInput): TripCalculationResult {
  if (params.efficiencyKmpl <= 0) {
    return { fuelLiters: 0, fuelCostIdr: 0, co2Kg: 0 };
  }
  const fuelLiters = params.distanceKm / params.efficiencyKmpl;
  const fuelCostIdr = Math.round(fuelLiters * params.fuelPricePerLiter);
  const co2Factor = CO2_FACTORS[params.fuelType] ?? 2.31;
  const co2Kg = fuelLiters * co2Factor;

  return {
    fuelLiters: Math.round(fuelLiters * 1000) / 1000,
    fuelCostIdr,
    co2Kg: Math.round(co2Kg * 1000) / 1000,
  };
}

const EARTH_RADIUS_KM = 6371;

export function distanceBetweenKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const ARRIVAL_RADIUS_KM = 0.1; // 100 meter

export function checkArrival(
  currentLat: number,
  currentLng: number,
  destLat: number,
  destLng: number
): boolean {
  return (
    distanceBetweenKm(currentLat, currentLng, destLat, destLng) <= ARRIVAL_RADIUS_KM
  );
}
