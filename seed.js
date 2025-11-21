// seed.js
const mongoose = require('mongoose');

const MONGO_URI =
  'mongodb://root:secret@localhost:27017/travel_planner?authSource=admin';

// ==== SCHEMAS ====

// Country
const countrySchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    region: String,
    subregion: String,
    capital: String,
    population: Number,
    flagUrl: String,
  },
  { timestamps: true },
);

// TravelPlan
const travelPlanSchema = new mongoose.Schema(
  {
    countryCode: { type: String, required: true, uppercase: true },
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    notes: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Country = mongoose.model('Country', countrySchema);
const TravelPlan = mongoose.model('TravelPlan', travelPlanSchema);

async function seed() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Conexión exitosa');

    // ====== PAÍSES A CREAR ======
    const countries = [
      {
        code: 'COL',
        name: 'Colombia',
        region: 'Americas',
        subregion: 'South America',
        capital: 'Bogotá',
        population: 50882884,
        flagUrl: 'https://flagcdn.com/w320/co.png',
      },
      {
        code: 'USA',
        name: 'United States of America',
        region: 'Americas',
        subregion: 'North America',
        capital: 'Washington, D.C.',
        population: 331449281,
        flagUrl: 'https://flagcdn.com/w320/us.png',
      },
      {
        code: 'FRA',
        name: 'France',
        region: 'Europe',
        subregion: 'Western Europe',
        capital: 'Paris',
        population: 67391582,
        flagUrl: 'https://flagcdn.com/w320/fr.png',
      },
      {
        code: 'JPN',
        name: 'Japan',
        region: 'Asia',
        subregion: 'Eastern Asia',
        capital: 'Tokyo',
        population: 125836021,
        flagUrl: 'https://flagcdn.com/w320/jp.png',
      },
    ];

    console.log('Creando/actualizando países...');
    for (const c of countries) {
      await Country.updateOne(
        { code: c.code },         // filtro
        { $setOnInsert: c },      // solo inserta si no existe
        { upsert: true },
      );
      console.log(` Country ${c.code} listo`);
    }

    // ====== PLANES A CREAR ======
    // Clave "única" para no duplicar: countryCode + title
    const plans = [
      {
        countryCode: 'COL',
        title: 'Viaje a Colombia - Caribe',
        startDate: new Date('2025-12-20'),
        endDate: new Date('2025-12-30'),
        notes: 'Cartagena, Barranquilla y Santa Marta.',
      },
      {
        countryCode: 'FRA',
        title: 'Tour por Francia',
        startDate: new Date('2026-04-10'),
        endDate: new Date('2026-04-20'),
        notes: 'París, Lyon y la Costa Azul.',
      },
      {
        countryCode: 'JPN',
        title: 'Primavera en Japón',
        startDate: new Date('2026-03-15'),
        endDate: new Date('2026-03-30'),
        notes: 'Tokio, Kioto, Osaka. Ver cerezos en flor.',
      },
    ];

    console.log('Creando/actualizando travel plans...');
    for (const p of plans) {
      await TravelPlan.updateOne(
        { countryCode: p.countryCode, title: p.title }, // filtro
        { $setOnInsert: p },                            // solo si no existe
        { upsert: true },
      );
      console.log(`Plan "${p.title}" listo`);
    }

    console.log('Seed completado');
  } catch (err) {
    console.error('Error en seed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Conexión cerrada.');
  }
}

seed();
