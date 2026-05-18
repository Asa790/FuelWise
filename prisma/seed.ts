import { PrismaClient } from '@prisma/client';
import { VEHICLE_SPECS, FUEL_PRICES_INITIAL } from '../lib/vehicle-specs-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding fuel prices...');
  for (const fp of FUEL_PRICES_INITIAL) {
    await prisma.fuelPrice.upsert({
      where: { fuelType: fp.fuelType },
      update: { pricePerLiter: fp.pricePerLiter },
      create: fp,
    });
  }
  console.log(`Seeded ${FUEL_PRICES_INITIAL.length} fuel prices`);

  console.log('Seeding vehicle specs...');
  // clear & reinsert for idempotent seed
  await prisma.vehicleSpec.deleteMany({});
  await prisma.vehicleSpec.createMany({
    data: VEHICLE_SPECS.map((s) => ({
      brand: s.brand,
      model: s.model,
      yearStart: s.yearStart,
      yearEnd: s.yearEnd,
      engineCc: s.engineCc,
      fuelTypeRecommended: s.fuelTypeRecommended,
      efficiencyCity: s.efficiencyCity,
      efficiencyHighway: s.efficiencyHighway,
      efficiencyAvg: s.efficiencyAvg,
    })),
  });
  console.log(`Seeded ${VEHICLE_SPECS.length} vehicle specs`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
