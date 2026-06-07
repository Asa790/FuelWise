/* Simple unit tests for fuel calculations (run with: npm run test:calc) */
import { calculateTrip, distanceBetweenKm, checkArrival } from '../lib/calc-fuel';

let passed = 0;
let failed = 0;

function assertClose(actual: number, expected: number, tolerance: number, label: string) {
  if (Math.abs(actual - expected) <= tolerance) {
    passed++;
    console.log(`  ✓ ${label} (got ${actual.toFixed(3)}, expected ~${expected})`);
  } else {
    failed++;
    console.error(`  ✗ ${label}: got ${actual}, expected ~${expected}±${tolerance}`);
  }
}

function assertEqual(actual: any, expected: any, label: string) {
  if (actual === expected) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.error(`  ✗ ${label}: got ${actual}, expected ${expected}`);
  }
}

console.log('\n[Trip calculation]');
{
  // 20 km @ 5 km/L @ Rp10.000/L
  const r = calculateTrip({
    distanceKm: 20,
    efficiencyKmpl: 5,
    fuelPricePerLiter: 10000,
    fuelType: 'pertalite',
  });
  assertClose(r.fuelLiters, 20 / 5, 0.001, '20km/5kmL fuel liters');
  assertEqual(r.fuelCostIdr, Math.round((20 / 5) * 10000), '20km cost');
}
{
  // 50 km @ 7 km/L
  const r = calculateTrip({
    distanceKm: 50,
    efficiencyKmpl: 7,
    fuelPricePerLiter: 13700,
    fuelType: 'pertamax',
  });
  assertClose(r.fuelLiters, 50 / 7, 0.005, '50km/7kmL fuel liters');
  assertClose(r.co2Kg, (50 / 7) * 2.31, 0.01, '50km CO2');
}
{
  // Zero efficiency edge case
  const r = calculateTrip({
    distanceKm: 100,
    efficiencyKmpl: 0,
    fuelPricePerLiter: 10000,
    fuelType: 'pertalite',
  });
  assertEqual(r.fuelLiters, 0, 'zero efficiency: liters = 0');
  assertEqual(r.fuelCostIdr, 0, 'zero efficiency: cost = 0');
}

console.log('\n[Haversine distance]');
{
  // Monas Jakarta ↔ Bundaran HI (~1.5 km)
  const d = distanceBetweenKm(-6.1754, 106.8272, -6.1944, 106.8229);
  assertClose(d, 2.2, 0.5, 'Monas → HI ~2km');
}
{
  // Same point
  const d = distanceBetweenKm(-6.2, 106.8, -6.2, 106.8);
  assertEqual(d, 0, 'Same point = 0');
}

console.log('\n[Arrival check]');
{
  // 50 meters away
  const arrived = checkArrival(-6.2, 106.8, -6.20045, 106.8);
  assertEqual(arrived, true, '50m away = arrived');
}
{
  // 500 meters away
  const arrived = checkArrival(-6.2, 106.8, -6.2045, 106.8);
  assertEqual(arrived, false, '500m away = not arrived');
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
