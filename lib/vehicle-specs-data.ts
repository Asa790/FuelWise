// Database spesifikasi kendaraan umum di Indonesia (200+ model)
// Sumber: spesifikasi pabrikan + uji konsumsi BBM rata-rata media otomotif

export interface VehicleSpecSeed {
  brand: string;
  model: string;
  yearStart: number;
  yearEnd: number | null;
  engineCc: number | null;
  fuelTypeRecommended: string;
  efficiencyCity: number | null;
  efficiencyHighway: number | null;
  efficiencyAvg: number;
}

export const VEHICLE_SPECS: VehicleSpecSeed[] = [
  // ===== TOYOTA =====
  { brand: 'Toyota', model: 'Agya', yearStart: 2017, yearEnd: null, engineCc: 1200, fuelTypeRecommended: 'pertalite', efficiencyCity: 6, efficiencyHighway: 12, efficiencyAvg: 9 },
  { brand: 'Toyota', model: 'Agya GR Sport', yearStart: 2023, yearEnd: null, engineCc: 1200, fuelTypeRecommended: 'pertamax', efficiencyCity: 6, efficiencyHighway: 12, efficiencyAvg: 9 },
  { brand: 'Toyota', model: 'Calya', yearStart: 2016, yearEnd: null, engineCc: 1200, fuelTypeRecommended: 'pertalite', efficiencyCity: 5, efficiencyHighway: 11, efficiencyAvg: 8 },
  { brand: 'Toyota', model: 'Avanza', yearStart: 2019, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 3, efficiencyHighway: 9, efficiencyAvg: 6 },
  { brand: 'Toyota', model: 'Avanza Veloz', yearStart: 2021, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 9, efficiencyAvg: 6 },
  { brand: 'Toyota', model: 'Rush', yearStart: 2017, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 2, efficiencyHighway: 9, efficiencyAvg: 5.5 },
  { brand: 'Toyota', model: 'Rush GR Sport', yearStart: 2022, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 9, efficiencyAvg: 5.5 },
  { brand: 'Toyota', model: 'Innova', yearStart: 2016, yearEnd: 2022, engineCc: 2400, fuelTypeRecommended: 'solar', efficiencyCity: 2, efficiencyHighway: 6, efficiencyAvg: 4 },
  { brand: 'Toyota', model: 'Innova Zenix', yearStart: 2022, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 10, efficiencyAvg: 7.5 },
  { brand: 'Toyota', model: 'Innova Zenix Hybrid', yearStart: 2022, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 10, efficiencyHighway: 16, efficiencyAvg: 13 },
  { brand: 'Toyota', model: 'Fortuner', yearStart: 2020, yearEnd: null, engineCc: 2800, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 2.5 },
  { brand: 'Toyota', model: 'Fortuner GR Sport', yearStart: 2021, yearEnd: null, engineCc: 2800, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 2.5 },
  { brand: 'Toyota', model: 'Yaris', yearStart: 2018, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 4, efficiencyHighway: 10, efficiencyAvg: 7 },
  { brand: 'Toyota', model: 'Yaris Cross', yearStart: 2023, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 10, efficiencyAvg: 7.5 },
  { brand: 'Toyota', model: 'Yaris Cross Hybrid', yearStart: 2023, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 12, efficiencyHighway: 18, efficiencyAvg: 15 },
  { brand: 'Toyota', model: 'Vios', yearStart: 2018, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 10, efficiencyAvg: 7.5 },
  { brand: 'Toyota', model: 'Camry', yearStart: 2019, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'Toyota', model: 'Camry Hybrid', yearStart: 2019, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax', efficiencyCity: 8, efficiencyHighway: 14, efficiencyAvg: 11 },
  { brand: 'Toyota', model: 'Corolla Altis', yearStart: 2019, yearEnd: null, engineCc: 1800, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 9, efficiencyAvg: 6 },
  { brand: 'Toyota', model: 'Corolla Altis Hybrid', yearStart: 2020, yearEnd: null, engineCc: 1800, fuelTypeRecommended: 'pertamax', efficiencyCity: 10, efficiencyHighway: 16, efficiencyAvg: 13 },
  { brand: 'Toyota', model: 'Raize', yearStart: 2021, yearEnd: null, engineCc: 1000, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 12, efficiencyAvg: 8.5 },
  { brand: 'Toyota', model: 'Raize GR Sport', yearStart: 2022, yearEnd: null, engineCc: 1000, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 12, efficiencyAvg: 8.5 },
  { brand: 'Toyota', model: 'Raize GR Sport Turbo', yearStart: 2022, yearEnd: null, engineCc: 1000, fuelTypeRecommended: 'pertamax', efficiencyCity: 4, efficiencyHighway: 10, efficiencyAvg: 7 },
  { brand: 'Toyota', model: 'Hilux', yearStart: 2019, yearEnd: null, engineCc: 2400, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },
  { brand: 'Toyota', model: 'Land Cruiser', yearStart: 2020, yearEnd: null, engineCc: 4500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 1, efficiencyAvg: 1 },
  { brand: 'Toyota', model: 'Voxy', yearStart: 2017, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'Toyota', model: 'Hiace', yearStart: 2019, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'solar', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Toyota', model: 'Kijang Innova Reborn', yearStart: 2016, yearEnd: 2022, engineCc: 2400, fuelTypeRecommended: 'solar', efficiencyCity: 2, efficiencyHighway: 6, efficiencyAvg: 4 },
  { brand: 'Toyota', model: 'Kijang Innova Reborn Venturer', yearStart: 2018, yearEnd: 2022, engineCc: 2400, fuelTypeRecommended: 'solar', efficiencyCity: 2, efficiencyHighway: 6, efficiencyAvg: 4 },
  { brand: 'Toyota', model: 'Sienta', yearStart: 2016, yearEnd: 2022, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 4, efficiencyHighway: 9, efficiencyAvg: 6.5 },
  { brand: 'Toyota', model: 'Alphard', yearStart: 2020, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },
  { brand: 'Toyota', model: 'Vellfire', yearStart: 2020, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },
  { brand: 'Toyota', model: 'C-HR', yearStart: 2018, yearEnd: 2022, engineCc: 1800, fuelTypeRecommended: 'pertamax', efficiencyCity: 4, efficiencyHighway: 9, efficiencyAvg: 6.5 },
  { brand: 'Toyota', model: 'Corolla Cross', yearStart: 2020, yearEnd: null, engineCc: 1800, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 10, efficiencyAvg: 7.5 },
  { brand: 'Toyota', model: 'Corolla Cross Hybrid', yearStart: 2020, yearEnd: null, engineCc: 1800, fuelTypeRecommended: 'pertamax', efficiencyCity: 11, efficiencyHighway: 17, efficiencyAvg: 14 },
  { brand: 'Toyota', model: '86', yearStart: 2017, yearEnd: 2022, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'Toyota', model: 'GR Yaris', yearStart: 2021, yearEnd: null, engineCc: 1600, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Toyota', model: 'GR Supra', yearStart: 2020, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 2.5 },
  { brand: 'Toyota', model: 'BZ4X', yearStart: 2023, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 27, efficiencyHighway: 22, efficiencyAvg: 25 },

  // ===== HONDA =====
  { brand: 'Honda', model: 'Brio', yearStart: 2018, yearEnd: null, engineCc: 1200, fuelTypeRecommended: 'pertalite', efficiencyCity: 7, efficiencyHighway: 13, efficiencyAvg: 10 },
  { brand: 'Honda', model: 'Brio RS', yearStart: 2019, yearEnd: null, engineCc: 1200, fuelTypeRecommended: 'pertamax', efficiencyCity: 7, efficiencyHighway: 13, efficiencyAvg: 10 },
  { brand: 'Honda', model: 'Brio Satya', yearStart: 2018, yearEnd: null, engineCc: 1200, fuelTypeRecommended: 'pertalite', efficiencyCity: 7, efficiencyHighway: 13, efficiencyAvg: 10 },
  { brand: 'Honda', model: 'Mobilio', yearStart: 2018, yearEnd: 2022, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 4, efficiencyHighway: 11, efficiencyAvg: 7.5 },
  { brand: 'Honda', model: 'Jazz', yearStart: 2017, yearEnd: 2021, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 11, efficiencyAvg: 8 },
  { brand: 'Honda', model: 'Jazz RS', yearStart: 2018, yearEnd: 2021, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 11, efficiencyAvg: 8 },
  { brand: 'Honda', model: 'City', yearStart: 2019, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 11, efficiencyAvg: 8 },
  { brand: 'Honda', model: 'City Hatchback', yearStart: 2021, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 11, efficiencyAvg: 8 },
  { brand: 'Honda', model: 'City Hatchback RS', yearStart: 2021, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 11, efficiencyAvg: 8 },
  { brand: 'Honda', model: 'Civic', yearStart: 2019, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 3, efficiencyHighway: 9, efficiencyAvg: 6 },
  { brand: 'Honda', model: 'Civic RS', yearStart: 2021, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 2, efficiencyHighway: 8, efficiencyAvg: 5 },
  { brand: 'Honda', model: 'Civic Type R', yearStart: 2023, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'Honda', model: 'HR-V', yearStart: 2018, yearEnd: 2022, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'Honda', model: 'HR-V e:HEV', yearStart: 2022, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 10, efficiencyHighway: 16, efficiencyAvg: 13 },
  { brand: 'Honda', model: 'CR-V', yearStart: 2018, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Honda', model: 'CR-V e:HEV', yearStart: 2023, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 9, efficiencyHighway: 15, efficiencyAvg: 12 },
  { brand: 'Honda', model: 'BR-V', yearStart: 2019, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 3, efficiencyHighway: 9, efficiencyAvg: 6 },
  { brand: 'Honda', model: 'Accord', yearStart: 2019, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Honda', model: 'Accord e:HEV', yearStart: 2024, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 10, efficiencyHighway: 16, efficiencyAvg: 13 },
  { brand: 'Honda', model: 'WR-V', yearStart: 2022, yearEnd: null, engineCc: 1200, fuelTypeRecommended: 'pertalite', efficiencyCity: 6, efficiencyHighway: 12, efficiencyAvg: 9 },
  { brand: 'Honda', model: 'Stepwagon', yearStart: 2023, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'Honda', model: 'Freed', yearStart: 2017, yearEnd: 2021, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 4, efficiencyHighway: 9, efficiencyAvg: 6.5 },

  // ===== SUZUKI =====
  { brand: 'Suzuki', model: 'Ertiga', yearStart: 2018, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 4, efficiencyHighway: 10, efficiencyAvg: 7 },
  { brand: 'Suzuki', model: 'Ertiga Hybrid', yearStart: 2023, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 9, efficiencyHighway: 15, efficiencyAvg: 12 },
  { brand: 'Suzuki', model: 'XL7', yearStart: 2020, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 3, efficiencyHighway: 9, efficiencyAvg: 6 },
  { brand: 'Suzuki', model: 'Ignis', yearStart: 2017, yearEnd: null, engineCc: 1200, fuelTypeRecommended: 'pertalite', efficiencyCity: 6, efficiencyHighway: 12, efficiencyAvg: 9 },
  { brand: 'Suzuki', model: 'Ignis GL', yearStart: 2017, yearEnd: null, engineCc: 1200, fuelTypeRecommended: 'pertalite', efficiencyCity: 6, efficiencyHighway: 12, efficiencyAvg: 9 },
  { brand: 'Suzuki', model: 'Baleno', yearStart: 2017, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 11, efficiencyAvg: 8 },
  { brand: 'Suzuki', model: 'Jimny', yearStart: 2020, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },
  { brand: 'Suzuki', model: 'Jimny 5-Door', yearStart: 2024, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },
  { brand: 'Suzuki', model: 'APV', yearStart: 2017, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'Suzuki', model: 'S-Presso', yearStart: 2020, yearEnd: null, engineCc: 1000, fuelTypeRecommended: 'pertalite', efficiencyCity: 7, efficiencyHighway: 13, efficiencyAvg: 10 },
  { brand: 'Suzuki', model: 'Karimun Wagon R', yearStart: 2017, yearEnd: 2022, engineCc: 1000, fuelTypeRecommended: 'pertalite', efficiencyCity: 7, efficiencyHighway: 13, efficiencyAvg: 10 },
  { brand: 'Suzuki', model: 'Carry', yearStart: 2019, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 2, efficiencyHighway: 6, efficiencyAvg: 4 },
  { brand: 'Suzuki', model: 'Vitara', yearStart: 2017, yearEnd: 2022, engineCc: 1600, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'Suzuki', model: 'SX4 S-Cross', yearStart: 2017, yearEnd: 2022, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },

  // ===== DAIHATSU =====
  { brand: 'Daihatsu', model: 'Ayla', yearStart: 2017, yearEnd: null, engineCc: 1200, fuelTypeRecommended: 'pertalite', efficiencyCity: 6, efficiencyHighway: 12, efficiencyAvg: 9 },
  { brand: 'Daihatsu', model: 'Ayla 1.0', yearStart: 2023, yearEnd: null, engineCc: 1000, fuelTypeRecommended: 'pertalite', efficiencyCity: 7, efficiencyHighway: 13, efficiencyAvg: 10 },
  { brand: 'Daihatsu', model: 'Ayla 1.2', yearStart: 2023, yearEnd: null, engineCc: 1200, fuelTypeRecommended: 'pertalite', efficiencyCity: 6, efficiencyHighway: 12, efficiencyAvg: 9 },
  { brand: 'Daihatsu', model: 'Sigra', yearStart: 2016, yearEnd: null, engineCc: 1200, fuelTypeRecommended: 'pertalite', efficiencyCity: 5, efficiencyHighway: 12, efficiencyAvg: 8.5 },
  { brand: 'Daihatsu', model: 'Xenia', yearStart: 2019, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 4, efficiencyHighway: 9, efficiencyAvg: 6.5 },
  { brand: 'Daihatsu', model: 'Terios', yearStart: 2017, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 2, efficiencyHighway: 8, efficiencyAvg: 5 },
  { brand: 'Daihatsu', model: 'Rocky', yearStart: 2021, yearEnd: null, engineCc: 1000, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 12, efficiencyAvg: 8.5 },
  { brand: 'Daihatsu', model: 'Rocky R', yearStart: 2022, yearEnd: null, engineCc: 1000, fuelTypeRecommended: 'pertamax', efficiencyCity: 4, efficiencyHighway: 10, efficiencyAvg: 7 },
  { brand: 'Daihatsu', model: 'Gran Max', yearStart: 2017, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 2, efficiencyHighway: 6, efficiencyAvg: 4 },
  { brand: 'Daihatsu', model: 'Luxio', yearStart: 2017, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 2, efficiencyHighway: 6, efficiencyAvg: 4 },
  { brand: 'Daihatsu', model: 'Sirion', yearStart: 2017, yearEnd: 2022, engineCc: 1300, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 11, efficiencyAvg: 8 },
  { brand: 'Daihatsu', model: 'Copen', yearStart: 2018, yearEnd: 2022, engineCc: 660, fuelTypeRecommended: 'pertamax', efficiencyCity: 8, efficiencyHighway: 14, efficiencyAvg: 11 },

  // ===== MITSUBISHI =====
  { brand: 'Mitsubishi', model: 'Xpander', yearStart: 2017, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 3, efficiencyHighway: 9, efficiencyAvg: 6 },
  { brand: 'Mitsubishi', model: 'Xpander Cross', yearStart: 2019, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 3, efficiencyHighway: 9, efficiencyAvg: 6 },
  { brand: 'Mitsubishi', model: 'Xpander Cross Rockford Fosgate', yearStart: 2022, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 9, efficiencyAvg: 6 },
  { brand: 'Mitsubishi', model: 'Pajero Sport', yearStart: 2019, yearEnd: null, engineCc: 2400, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 2.5 },
  { brand: 'Mitsubishi', model: 'Pajero Sport Dakar', yearStart: 2020, yearEnd: null, engineCc: 2400, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 2.5 },
  { brand: 'Mitsubishi', model: 'Triton', yearStart: 2019, yearEnd: null, engineCc: 2400, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },
  { brand: 'Mitsubishi', model: 'Triton 4x4', yearStart: 2020, yearEnd: null, engineCc: 2400, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Mitsubishi', model: 'Outlander Sport', yearStart: 2018, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'Mitsubishi', model: 'Outlander PHEV', yearStart: 2023, yearEnd: null, engineCc: 2400, fuelTypeRecommended: 'pertamax', efficiencyCity: 12, efficiencyHighway: 18, efficiencyAvg: 15 },
  { brand: 'Mitsubishi', model: 'Eclipse Cross', yearStart: 2018, yearEnd: 2022, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Mitsubishi', model: 'L300', yearStart: 2019, yearEnd: null, engineCc: 2400, fuelTypeRecommended: 'solar', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Mitsubishi', model: 'Colt L300', yearStart: 2019, yearEnd: null, engineCc: 2400, fuelTypeRecommended: 'solar', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Mitsubishi', model: 'Mirage', yearStart: 2017, yearEnd: 2022, engineCc: 1200, fuelTypeRecommended: 'pertamax', efficiencyCity: 6, efficiencyHighway: 12, efficiencyAvg: 9 },

  // ===== NISSAN =====
  { brand: 'Nissan', model: 'Livina', yearStart: 2019, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 3, efficiencyHighway: 9, efficiencyAvg: 6 },
  { brand: 'Nissan', model: 'Livina VL', yearStart: 2019, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 3, efficiencyHighway: 9, efficiencyAvg: 6 },
  { brand: 'Nissan', model: 'Magnite', yearStart: 2021, yearEnd: null, engineCc: 1000, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 12, efficiencyAvg: 8.5 },
  { brand: 'Nissan', model: 'Magnite Turbo', yearStart: 2022, yearEnd: null, engineCc: 1000, fuelTypeRecommended: 'pertamax', efficiencyCity: 4, efficiencyHighway: 10, efficiencyAvg: 7 },
  { brand: 'Nissan', model: 'Terra', yearStart: 2019, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 2.5 },
  { brand: 'Nissan', model: 'Terra 4x4', yearStart: 2020, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 1.5 },
  { brand: 'Nissan', model: 'Kicks', yearStart: 2020, yearEnd: null, engineCc: 1300, fuelTypeRecommended: 'pertamax', efficiencyCity: 6, efficiencyHighway: 12, efficiencyAvg: 9 },
  { brand: 'Nissan', model: 'Kicks e-Power', yearStart: 2021, yearEnd: null, engineCc: 1300, fuelTypeRecommended: 'pertamax', efficiencyCity: 12, efficiencyHighway: 18, efficiencyAvg: 15 },
  { brand: 'Nissan', model: 'Serena', yearStart: 2020, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Nissan', model: 'Serena e-Power', yearStart: 2022, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 10, efficiencyHighway: 16, efficiencyAvg: 13 },
  { brand: 'Nissan', model: 'Elgrand', yearStart: 2021, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },
  { brand: 'Nissan', model: 'Navara', yearStart: 2020, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Nissan', model: 'March', yearStart: 2017, yearEnd: 2022, engineCc: 1200, fuelTypeRecommended: 'pertamax', efficiencyCity: 6, efficiencyHighway: 12, efficiencyAvg: 9 },
  { brand: 'Nissan', model: 'Leaf', yearStart: 2023, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 22, efficiencyHighway: 17, efficiencyAvg: 20 },

  // ===== MAZDA =====
  { brand: 'Mazda', model: '2', yearStart: 2018, yearEnd: 2022, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 10, efficiencyAvg: 7.5 },
  { brand: 'Mazda', model: '3', yearStart: 2019, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'Mazda', model: 'CX-3', yearStart: 2018, yearEnd: 2022, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 4, efficiencyHighway: 9, efficiencyAvg: 6.5 },
  { brand: 'Mazda', model: 'CX-5', yearStart: 2019, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'Mazda', model: 'CX-5 2.5 Turbo', yearStart: 2022, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 2.5 },
  { brand: 'Mazda', model: 'CX-8', yearStart: 2020, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },
  { brand: 'Mazda', model: 'CX-9', yearStart: 2021, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 2.5 },
  { brand: 'Mazda', model: 'MX-5', yearStart: 2019, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Mazda', model: 'BT-50', yearStart: 2020, yearEnd: null, engineCc: 2200, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },
  { brand: 'Mazda', model: 'Biante', yearStart: 2021, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },

  // ===== HYUNDAI =====
  { brand: 'Hyundai', model: 'Stargazer', yearStart: 2022, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 4, efficiencyHighway: 10, efficiencyAvg: 7 },
  { brand: 'Hyundai', model: 'Stargazer X', yearStart: 2023, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 4, efficiencyHighway: 10, efficiencyAvg: 7 },
  { brand: 'Hyundai', model: 'Creta', yearStart: 2022, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 9, efficiencyAvg: 6 },
  { brand: 'Hyundai', model: 'Creta N Line', yearStart: 2023, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 8, efficiencyAvg: 5 },
  { brand: 'Hyundai', model: 'Santa Fe', yearStart: 2020, yearEnd: null, engineCc: 2200, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'Hyundai', model: 'Santa Fe Hybrid', yearStart: 2023, yearEnd: null, engineCc: 2200, fuelTypeRecommended: 'pertamax', efficiencyCity: 8, efficiencyHighway: 14, efficiencyAvg: 11 },
  { brand: 'Hyundai', model: 'Palisade', yearStart: 2021, yearEnd: null, engineCc: 2200, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 2.5 },
  { brand: 'Hyundai', model: 'Ioniq 5', yearStart: 2022, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 22, efficiencyHighway: 17, efficiencyAvg: 20 },
  { brand: 'Hyundai', model: 'Ioniq 6', yearStart: 2024, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 24, efficiencyHighway: 19, efficiencyAvg: 22 },
  { brand: 'Hyundai', model: 'Tucson', yearStart: 2022, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'Hyundai', model: 'Tucson N Line', yearStart: 2023, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Hyundai', model: 'H-1', yearStart: 2020, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'solar', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Hyundai', model: 'H-1 X', yearStart: 2023, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'solar', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Hyundai', model: 'Grand i10', yearStart: 2023, yearEnd: null, engineCc: 1200, fuelTypeRecommended: 'pertalite', efficiencyCity: 6, efficiencyHighway: 12, efficiencyAvg: 9 },
  { brand: 'Hyundai', model: 'Venue', yearStart: 2020, yearEnd: 2022, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },

  // ===== KIA =====
  { brand: 'KIA', model: 'Sonet', yearStart: 2021, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 4, efficiencyHighway: 10, efficiencyAvg: 7 },
  { brand: 'KIA', model: 'Sonet EX Line', yearStart: 2022, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 4, efficiencyHighway: 10, efficiencyAvg: 7 },
  { brand: 'KIA', model: 'Seltos', yearStart: 2020, yearEnd: null, engineCc: 1400, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 9, efficiencyAvg: 6 },
  { brand: 'KIA', model: 'Seltos GT Line', yearStart: 2021, yearEnd: null, engineCc: 1400, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 8, efficiencyAvg: 5 },
  { brand: 'KIA', model: 'Carnival', yearStart: 2022, yearEnd: null, engineCc: 2200, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'KIA', model: 'Carnival SX', yearStart: 2023, yearEnd: null, engineCc: 2200, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'KIA', model: 'Sportage', yearStart: 2023, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'KIA', model: 'Sportage X-Line', yearStart: 2024, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'KIA', model: 'Picanto', yearStart: 2023, yearEnd: null, engineCc: 1200, fuelTypeRecommended: 'pertalite', efficiencyCity: 6, efficiencyHighway: 12, efficiencyAvg: 9 },
  { brand: 'KIA', model: 'K5', yearStart: 2024, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'KIA', model: 'Sorento', yearStart: 2024, yearEnd: null, engineCc: 2200, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },

  // ===== WULING =====
  { brand: 'Wuling', model: 'Confero', yearStart: 2017, yearEnd: 2022, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 2, efficiencyHighway: 8, efficiencyAvg: 5 },
  { brand: 'Wuling', model: 'Confero S', yearStart: 2018, yearEnd: 2022, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 2, efficiencyHighway: 8, efficiencyAvg: 5 },
  { brand: 'Wuling', model: 'Cortez', yearStart: 2018, yearEnd: 2022, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'Wuling', model: 'Cortez CT', yearStart: 2019, yearEnd: 2022, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'Wuling', model: 'Almaz', yearStart: 2019, yearEnd: 2023, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Wuling', model: 'Almaz RS', yearStart: 2021, yearEnd: 2023, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Wuling', model: 'Air ev', yearStart: 2022, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 27, efficiencyHighway: 22, efficiencyAvg: 25 },
  { brand: 'Wuling', model: 'Air ev Long Range', yearStart: 2023, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 30, efficiencyHighway: 24, efficiencyAvg: 27 },
  { brand: 'Wuling', model: 'BinguoEV', yearStart: 2024, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 25, efficiencyHighway: 20, efficiencyAvg: 23 },
  { brand: 'Wuling', model: 'Formo', yearStart: 2024, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },

  // ===== ISUZU =====
  { brand: 'Isuzu', model: 'D-Max', yearStart: 2019, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'Isuzu', model: 'D-Max 4x4', yearStart: 2020, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Isuzu', model: 'MU-X', yearStart: 2020, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 2.5 },
  { brand: 'Isuzu', model: 'MU-X 4x4', yearStart: 2021, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 1.5 },
  { brand: 'Isuzu', model: 'Panther', yearStart: 2017, yearEnd: 2021, engineCc: 2500, fuelTypeRecommended: 'solar', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },
  { brand: 'Isuzu', model: 'Traga', yearStart: 2020, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'solar', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Isuzu', model: 'Elf', yearStart: 2019, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'solar', efficiencyCity: 1, efficiencyHighway: 3, efficiencyAvg: 1 },

  // ===== DFSK / DONGFENG =====
  { brand: 'DFSK', model: 'Glory 580', yearStart: 2019, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'DFSK', model: 'Glory 580 Pro', yearStart: 2020, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'DFSK', model: 'Glory i-Auto', yearStart: 2021, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'DFSK', model: 'Gelora', yearStart: 2022, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 2, efficiencyHighway: 6, efficiencyAvg: 4 },
  { brand: 'DFSK', model: 'Gelora Blind Van', yearStart: 2022, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertalite', efficiencyCity: 2, efficiencyHighway: 6, efficiencyAvg: 4 },

  // ===== BMW =====
  { brand: 'BMW', model: '320i', yearStart: 2019, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'BMW', model: '320i Sport', yearStart: 2021, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'BMW', model: '330i', yearStart: 2020, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'BMW', model: '520i', yearStart: 2020, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'BMW', model: 'X1', yearStart: 2021, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'BMW', model: 'X3', yearStart: 2019, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'BMW', model: 'X5', yearStart: 2020, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'BMW', model: 'X7', yearStart: 2021, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 3, efficiencyAvg: 1 },
  { brand: 'BMW', model: 'iX', yearStart: 2023, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 24, efficiencyHighway: 19, efficiencyAvg: 22 },
  { brand: 'BMW', model: 'i4', yearStart: 2023, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 22, efficiencyHighway: 17, efficiencyAvg: 20 },
  { brand: 'BMW', model: 'iX3', yearStart: 2024, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 20, efficiencyHighway: 15, efficiencyAvg: 18 },
  { brand: 'BMW', model: 'M340i', yearStart: 2022, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'BMW', model: 'M3', yearStart: 2023, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 3, efficiencyAvg: 1 },
  { brand: 'BMW', model: 'M4', yearStart: 2023, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 3, efficiencyAvg: 1 },
  { brand: 'BMW', model: 'Z4', yearStart: 2021, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },

  // ===== MERCEDES-BENZ =====
  { brand: 'Mercedes-Benz', model: 'C-Class', yearStart: 2019, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Mercedes-Benz', model: 'C-Class AMG', yearStart: 2021, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Mercedes-Benz', model: 'E-Class', yearStart: 2020, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'Mercedes-Benz', model: 'S-Class', yearStart: 2021, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Mercedes-Benz', model: 'GLA', yearStart: 2021, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'Mercedes-Benz', model: 'GLB', yearStart: 2022, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Mercedes-Benz', model: 'GLC', yearStart: 2019, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'Mercedes-Benz', model: 'GLE', yearStart: 2020, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Mercedes-Benz', model: 'GLS', yearStart: 2021, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 3, efficiencyAvg: 1 },
  { brand: 'Mercedes-Benz', model: 'G-Class', yearStart: 2022, yearEnd: null, engineCc: 4000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 2, efficiencyAvg: 1 },
  { brand: 'Mercedes-Benz', model: 'EQE', yearStart: 2023, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 22, efficiencyHighway: 17, efficiencyAvg: 20 },
  { brand: 'Mercedes-Benz', model: 'EQS', yearStart: 2023, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 24, efficiencyHighway: 19, efficiencyAvg: 22 },
  { brand: 'Mercedes-Benz', model: 'EQB', yearStart: 2024, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 20, efficiencyHighway: 15, efficiencyAvg: 18 },

  // ===== AUDI =====
  { brand: 'Audi', model: 'A3', yearStart: 2021, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'Audi', model: 'A4', yearStart: 2020, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Audi', model: 'A5', yearStart: 2021, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Audi', model: 'A6', yearStart: 2022, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'Audi', model: 'Q3', yearStart: 2021, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Audi', model: 'Q5', yearStart: 2020, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'Audi', model: 'Q7', yearStart: 2021, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Audi', model: 'Q8', yearStart: 2022, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 3, efficiencyAvg: 1 },
  { brand: 'Audi', model: 'e-tron', yearStart: 2023, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 20, efficiencyHighway: 15, efficiencyAvg: 18 },
  { brand: 'Audi', model: 'e-tron GT', yearStart: 2024, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 22, efficiencyHighway: 17, efficiencyAvg: 20 },
  { brand: 'Audi', model: 'RS Q8', yearStart: 2023, yearEnd: null, engineCc: 4000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 2, efficiencyAvg: 1 },

  // ===== PORSCHE =====
  { brand: 'Porsche', model: 'Macan', yearStart: 2020, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'Porsche', model: 'Cayenne', yearStart: 2021, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Porsche', model: 'Taycan', yearStart: 2023, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 22, efficiencyHighway: 17, efficiencyAvg: 20 },
  { brand: 'Porsche', model: '911', yearStart: 2022, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Porsche', model: '718 Cayman', yearStart: 2022, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'Porsche', model: '718 Boxster', yearStart: 2022, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },

  // ===== LEXUS =====
  { brand: 'Lexus', model: 'UX', yearStart: 2021, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 4, efficiencyHighway: 9, efficiencyAvg: 6.5 },
  { brand: 'Lexus', model: 'UX 250h', yearStart: 2021, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 10, efficiencyHighway: 16, efficiencyAvg: 13 },
  { brand: 'Lexus', model: 'ES', yearStart: 2020, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Lexus', model: 'ES 300h', yearStart: 2021, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax', efficiencyCity: 8, efficiencyHighway: 14, efficiencyAvg: 11 },
  { brand: 'Lexus', model: 'NX', yearStart: 2022, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Lexus', model: 'NX 350h', yearStart: 2022, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax', efficiencyCity: 8, efficiencyHighway: 14, efficiencyAvg: 11 },
  { brand: 'Lexus', model: 'RX', yearStart: 2023, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'Lexus', model: 'RX 350h', yearStart: 2023, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax', efficiencyCity: 7, efficiencyHighway: 13, efficiencyAvg: 10 },
  { brand: 'Lexus', model: 'LX', yearStart: 2024, yearEnd: null, engineCc: 3500, fuelTypeRecommended: 'pertamax', efficiencyCity: 1, efficiencyHighway: 3, efficiencyAvg: 1 },
  { brand: 'Lexus', model: 'LM', yearStart: 2024, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },
  { brand: 'Lexus', model: 'LM 350h', yearStart: 2024, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax', efficiencyCity: 7, efficiencyHighway: 13, efficiencyAvg: 10 },

  // ===== VOLVO =====
  { brand: 'Volvo', model: 'XC40', yearStart: 2021, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'Volvo', model: 'XC40 Recharge', yearStart: 2022, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 20, efficiencyHighway: 15, efficiencyAvg: 18 },
  { brand: 'Volvo', model: 'XC60', yearStart: 2020, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Volvo', model: 'XC60 Recharge', yearStart: 2021, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax', efficiencyCity: 8, efficiencyHighway: 14, efficiencyAvg: 11 },
  { brand: 'Volvo', model: 'XC90', yearStart: 2022, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 1, efficiencyHighway: 6, efficiencyAvg: 3.5 },
  { brand: 'Volvo', model: 'XC90 Recharge', yearStart: 2022, yearEnd: null, engineCc: 2500, fuelTypeRecommended: 'pertamax', efficiencyCity: 7, efficiencyHighway: 13, efficiencyAvg: 10 },

  // ===== JEEP =====
  { brand: 'Jeep', model: 'Wrangler', yearStart: 2021, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },
  { brand: 'Jeep', model: 'Wrangler 4x4', yearStart: 2021, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Jeep', model: 'Wrangler Rubicon', yearStart: 2022, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Jeep', model: 'Renegade', yearStart: 2020, yearEnd: 2023, engineCc: 1400, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'Jeep', model: 'Compass', yearStart: 2020, yearEnd: null, engineCc: 1300, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'Jeep', model: 'Grand Cherokee', yearStart: 2023, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },

  // ===== LAND ROVER =====
  { brand: 'Land Rover', model: 'Defender', yearStart: 2021, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },
  { brand: 'Land Rover', model: 'Defender 110', yearStart: 2021, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'pertamax', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Land Rover', model: 'Discovery', yearStart: 2022, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'pertamax', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Land Rover', model: 'Discovery Sport', yearStart: 2020, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Land Rover', model: 'Range Rover Evoque', yearStart: 2020, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Land Rover', model: 'Range Rover Sport', yearStart: 2022, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'pertamax', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Land Rover', model: 'Range Rover', yearStart: 2023, yearEnd: null, engineCc: 3000, fuelTypeRecommended: 'pertamax', efficiencyCity: 1, efficiencyHighway: 3, efficiencyAvg: 1 },

  // ===== MINI =====
  { brand: 'Mini', model: 'Cooper', yearStart: 2021, yearEnd: null, engineCc: 1500, fuelTypeRecommended: 'pertamax', efficiencyCity: 4, efficiencyHighway: 9, efficiencyAvg: 6.5 },
  { brand: 'Mini', model: 'Cooper S', yearStart: 2021, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'Mini', model: 'Cooper SE', yearStart: 2022, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 20, efficiencyHighway: 15, efficiencyAvg: 18 },
  { brand: 'Mini', model: 'Countryman', yearStart: 2022, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'pertamax', efficiencyCity: 2, efficiencyHighway: 7, efficiencyAvg: 4.5 },
  { brand: 'Mini', model: 'Countryman SE', yearStart: 2023, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 18, efficiencyHighway: 13, efficiencyAvg: 16 },

  // ===== CHEVROLET =====
  { brand: 'Chevrolet', model: 'Trax', yearStart: 2020, yearEnd: 2022, engineCc: 1400, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'Chevrolet', model: 'Spark', yearStart: 2017, yearEnd: 2021, engineCc: 1200, fuelTypeRecommended: 'pertalite', efficiencyCity: 6, efficiencyHighway: 12, efficiencyAvg: 9 },
  { brand: 'Chevrolet', model: 'Orlando', yearStart: 2017, yearEnd: 2020, engineCc: 1400, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'Chevrolet', model: 'Captiva', yearStart: 2017, yearEnd: 2019, engineCc: 2400, fuelTypeRecommended: 'pertamax', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },

  // ===== FORD =====
  { brand: 'Ford', model: 'Ranger', yearStart: 2022, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },
  { brand: 'Ford', model: 'Ranger Raptor', yearStart: 2023, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 4, efficiencyAvg: 2 },
  { brand: 'Ford', model: 'Everest', yearStart: 2023, yearEnd: null, engineCc: 2000, fuelTypeRecommended: 'dex', efficiencyCity: 1, efficiencyHighway: 5, efficiencyAvg: 3 },
  { brand: 'Ford', model: 'Mustang', yearStart: 2024, yearEnd: null, engineCc: 5000, fuelTypeRecommended: 'pertamax_plus', efficiencyCity: 1, efficiencyHighway: 2, efficiencyAvg: 1 },

  // ===== PEUGEOT =====
  { brand: 'Peugeot', model: '3008', yearStart: 2021, yearEnd: null, engineCc: 1300, fuelTypeRecommended: 'pertamax', efficiencyCity: 4, efficiencyHighway: 9, efficiencyAvg: 6.5 },
  { brand: 'Peugeot', model: '5008', yearStart: 2022, yearEnd: null, engineCc: 1300, fuelTypeRecommended: 'pertamax', efficiencyCity: 3, efficiencyHighway: 8, efficiencyAvg: 5.5 },
  { brand: 'Peugeot', model: '2008', yearStart: 2023, yearEnd: null, engineCc: 1200, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 10, efficiencyAvg: 7.5 },

  // ===== CITROEN =====
  { brand: 'Citroen', model: 'C3', yearStart: 2023, yearEnd: null, engineCc: 1200, fuelTypeRecommended: 'pertalite', efficiencyCity: 6, efficiencyHighway: 12, efficiencyAvg: 9 },
  { brand: 'Citroen', model: 'C5 Aircross', yearStart: 2024, yearEnd: null, engineCc: 1300, fuelTypeRecommended: 'pertamax', efficiencyCity: 4, efficiencyHighway: 9, efficiencyAvg: 6.5 },

  // ===== RENAULT =====
  { brand: 'Renault', model: 'Kiger', yearStart: 2024, yearEnd: null, engineCc: 1000, fuelTypeRecommended: 'pertamax', efficiencyCity: 5, efficiencyHighway: 11, efficiencyAvg: 8 },
  { brand: 'Renault', model: 'Triber', yearStart: 2024, yearEnd: null, engineCc: 1000, fuelTypeRecommended: 'pertalite', efficiencyCity: 5, efficiencyHighway: 11, efficiencyAvg: 8 },

  // ===== TESLA =====
  { brand: 'Tesla', model: 'Model 3', yearStart: 2024, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 22, efficiencyHighway: 17, efficiencyAvg: 20 },
  { brand: 'Tesla', model: 'Model Y', yearStart: 2024, yearEnd: null, engineCc: null, fuelTypeRecommended: 'pertamax', efficiencyCity: 20, efficiencyHighway: 15, efficiencyAvg: 18 },
];

export const FUEL_TYPES = [
  { value: 'solar', label: 'Bio Solar', octane: 0 },
  { value: 'pertalite', label: 'Pertalite', octane: 90 },
  { value: 'pertamax', label: 'Pertamax', octane: 92 },
  { value: 'pertamax_green', label: 'Pertamax Green', octane: 95 },
  { value: 'pertamax_turbo', label: 'Pertamax Turbo', octane: 98 },
  { value: 'dexlite', label: 'Dexlite', octane: 0 },
  { value: 'dex', label: 'Pertamina Dex', octane: 0 },
  { value: 'bp_92', label: 'BP 92', octane: 92 },
  { value: 'bp_ultimate', label: 'BP Ultimate', octane: 95 },
  { value: 'bp_ultimate_diesel', label: 'BP Ultimate Diesel', octane: 0 },
] as const;

export const FUEL_PRICES_INITIAL: Array<{ fuelType: string; pricePerLiter: number }> = [
  { fuelType: 'solar', pricePerLiter: 6800 },
  { fuelType: 'pertalite', pricePerLiter: 10000 },
  { fuelType: 'pertamax', pricePerLiter: 12300 },
  { fuelType: 'pertamax_green', pricePerLiter: 12900 },
  { fuelType: 'pertamax_turbo', pricePerLiter: 19900 },
  { fuelType: 'dexlite', pricePerLiter: 26000 },
  { fuelType: 'dex', pricePerLiter: 27900 },
  { fuelType: 'bp_92', pricePerLiter: 12390 },
  { fuelType: 'bp_ultimate', pricePerLiter: 12932 },
  { fuelType: 'bp_ultimate_diesel', pricePerLiter: 29890 },
];

// Faktor emisi CO2 per liter BBM (kg CO2 / liter)
export const CO2_FACTORS: Record<string, number> = {
  solar: 2.68,
  pertalite: 2.31,
  pertamax: 2.31,
  pertamax_green: 2.31,
  pertamax_turbo: 2.31,
  dexlite: 2.68,
  dex: 2.68,
  bp_92: 2.31,
  bp_ultimate: 2.31,
  bp_ultimate_diesel: 2.68,
  pertamax_plus: 2.31, // Fallback
};
