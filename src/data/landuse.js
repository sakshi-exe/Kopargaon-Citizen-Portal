// Land-Use Planning Zones — Kopargaon Municipal Council (CivicFix Platform)
// Geographic bounds centered on Kopargaon, Maharashtra

export const LANDUSE_TYPES = [
  'Residential', 'Commercial', 'Industrial', 'Institutional',
  'Green Space', 'Agricultural / Agro-Buffer', 'Mixed Use', 'Public Utilities'
];

export const LANDUSE_COLORS = {
  'Residential':               '#3b82f6', // Blue
  'Commercial':                '#f59e0b', // Amber
  'Industrial':                '#64748b', // Slate
  'Institutional':             '#8b5cf6', // Purple
  'Green Space':               '#22c55e', // Green
  'Agricultural / Agro-Buffer':'#84cc16', // Lime
  'Mixed Use':                 '#ec4899', // Pink
  'Public Utilities':          '#06b6d4', // Cyan
};

export const LANDUSE_FILL_OPACITY = 0.35;

export const landUseZones = [
  // ── W1: Shivaji Chowk Core ──────────────────────────────────────────────────
  {
    id: 'ZN-KPG-01',
    wardId: 'W1',
    name: 'Shivaji Chowk Central Bazaar & Retail Zone',
    type: 'Commercial',
    area: 0.9,
    population: 8500,
    developmentStatus: 'Fully Developed',
    coordinates: [
      [19.8905, 74.4770],
      [19.8935, 74.4770],
      [19.8935, 74.4815],
      [19.8905, 74.4815]
    ],
    notes: 'Dense retail market with cloth merchant shops, banks, and municipal administrative headquarters.'
  },
  {
    id: 'ZN-KPG-02',
    wardId: 'W1',
    name: 'Municipal Complex & Civil Hospital Institutional District',
    type: 'Institutional',
    area: 0.6,
    population: 4200,
    developmentStatus: 'Developed',
    coordinates: [
      [19.8920, 74.4795],
      [19.8950, 74.4795],
      [19.8950, 74.4835],
      [19.8920, 74.4835]
    ],
    notes: 'Sub-district hospital, municipal offices, civil court, and post office campus.'
  },

  // ── W2: Station Area ────────────────────────────────────────────────────────
  {
    id: 'ZN-KPG-03',
    wardId: 'W2',
    name: 'Railway Colony & Station Transit Residential Zone',
    type: 'Residential',
    area: 1.2,
    population: 8200,
    developmentStatus: 'Developed',
    coordinates: [
      [19.8990, 74.4810],
      [19.9040, 74.4810],
      [19.9040, 74.4865],
      [19.8990, 74.4865]
    ],
    notes: 'Railway quarters, transit lodges, passenger boarding amenities, and staff housing.'
  },

  // ── W3: Samata Nagar ────────────────────────────────────────────────────────
  {
    id: 'ZN-KPG-04',
    wardId: 'W3',
    name: 'Somaiya College Educational Campus & Green Buffer',
    type: 'Institutional',
    area: 1.1,
    population: 6500,
    developmentStatus: 'Developed',
    coordinates: [
      [19.8840, 74.4860],
      [19.8885, 74.4860],
      [19.8885, 74.4920],
      [19.8840, 74.4920]
    ],
    notes: 'Degree colleges, polytechnic institutes, student hostels, and athletic sports grounds.'
  },
  {
    id: 'ZN-KPG-05',
    wardId: 'W3',
    name: 'Samata Nagar Planned Housing Sector',
    type: 'Residential',
    area: 1.0,
    population: 9500,
    developmentStatus: 'Developed',
    coordinates: [
      [19.8850, 74.4880],
      [19.8890, 74.4880],
      [19.8890, 74.4940],
      [19.8850, 74.4940]
    ],
    notes: 'Middle-income residential housing societies with internal arterial link to APMC yard.'
  },

  // ── W4: Godavari Riverfront ─────────────────────────────────────────────────
  {
    id: 'ZN-KPG-06',
    wardId: 'W4',
    name: 'Godavari River Heritage, Ghats & Ecological Buffer',
    type: 'Green Space',
    area: 1.5,
    population: 3200,
    developmentStatus: 'Conservation Zone',
    coordinates: [
      [19.8940, 74.4700],
      [19.8995, 74.4700],
      [19.8995, 74.4760],
      [19.8940, 74.4760]
    ],
    notes: 'Heritage riverside pilgrimage ghats, temple promenades, and flood buffer conservation.'
  },

  // ── W5: Bet Kopargaon ───────────────────────────────────────────────────────
  {
    id: 'ZN-KPG-07',
    wardId: 'W5',
    name: 'Bet Kopargaon Residential & Canal Enclave',
    type: 'Residential',
    area: 1.4,
    population: 9800,
    developmentStatus: 'Developing',
    coordinates: [
      [19.8960, 74.4630],
      [19.9020, 74.4630],
      [19.9020, 74.4695],
      [19.8960, 74.4695]
    ],
    notes: 'High-elevation residential zone served by newly commissioned 1.0 MLD reservoir.'
  },

  // ── W6: Yeola Naka ──────────────────────────────────────────────────────────
  {
    id: 'ZN-KPG-08',
    wardId: 'W6',
    name: 'Yeola Naka Interstate Freight & Transport Logistics Hub',
    type: 'Commercial',
    area: 1.8,
    population: 4800,
    developmentStatus: 'Developing',
    coordinates: [
      [19.8790, 74.4670],
      [19.8845, 74.4670],
      [19.8845, 74.4740],
      [19.8790, 74.4740]
    ],
    notes: 'Heavy commercial warehouses, truck terminals, petroleum stations, and freight weighbridges.'
  },

  // ── W7: Sai Nagar ───────────────────────────────────────────────────────────
  {
    id: 'ZN-KPG-09',
    wardId: 'W7',
    name: 'Sai Nagar Pilgrimage Corridor & Hospitality District',
    type: 'Mixed Use',
    area: 1.6,
    population: 11200,
    developmentStatus: 'Developed',
    coordinates: [
      [19.8750, 74.4790],
      [19.8805, 74.4790],
      [19.8805, 74.4855],
      [19.8750, 74.4855]
    ],
    notes: 'Pilgrim lodges, restaurants, commercial shopping, and residential colonies along the Shirdi Highway.'
  },

  // ── W8: Tilak Nagar ─────────────────────────────────────────────────────────
  {
    id: 'ZN-KPG-10',
    wardId: 'W8',
    name: 'Old Town Heritage Settlement & Traditional Gaothan',
    type: 'Residential',
    area: 1.1,
    population: 13500,
    developmentStatus: 'Fully Developed',
    coordinates: [
      [19.8920, 74.4835],
      [19.8965, 74.4835],
      [19.8965, 74.4890],
      [19.8920, 74.4890]
    ],
    notes: 'High-density historical residential gaothan with traditional wada architecture.'
  },

  // ── W9: APMC Market Yard ────────────────────────────────────────────────────
  {
    id: 'ZN-KPG-11',
    wardId: 'W9',
    name: 'Kopargaon APMC Onion, Grain & Agro-Produce Trading Mandi',
    type: 'Commercial',
    area: 1.7,
    population: 5100,
    developmentStatus: 'Developed',
    coordinates: [
      [19.8860, 74.4920],
      [19.8915, 74.4920],
      [19.8915, 74.4980],
      [19.8860, 74.4980]
    ],
    notes: 'State-level agricultural trading yard with auction halls, cold storages, and municipal waste station.'
  },

  // ── W10: Sharda Nagar ───────────────────────────────────────────────────────
  {
    id: 'ZN-KPG-12',
    wardId: 'W10',
    name: 'Sharda Nagar Green Townships & Parklands',
    type: 'Residential',
    area: 1.5,
    population: 10400,
    developmentStatus: 'Developed',
    coordinates: [
      [19.9030, 74.4730],
      [19.9090, 74.4730],
      [19.9090, 74.4795],
      [19.9030, 74.4795]
    ],
    notes: 'Low-density modern housing colonies with botanical garden and percolation lakes.'
  },

  // ── W11: MIDC Industrial Estate ─────────────────────────────────────────────
  {
    id: 'ZN-KPG-13',
    wardId: 'W11',
    name: 'Kopargaon MIDC Industrial & Agro-Processing Zone',
    type: 'Industrial',
    area: 2.6,
    population: 3400,
    developmentStatus: 'Developed',
    coordinates: [
      [19.8680, 74.4880],
      [19.8750, 74.4880],
      [19.8750, 74.4960],
      [19.8680, 74.4960]
    ],
    notes: 'Sugar cooperative ancillary manufacturing, agro-tool fabrication, distillery, and packaging factories.'
  },

  // ── W12: Subhash Nagar (High Priority) ──────────────────────────────────────
  {
    id: 'ZN-KPG-14',
    wardId: 'W12',
    name: 'Subhash Nagar & Kopargaon East Urban Extension',
    type: 'Residential',
    area: 2.2,
    population: 16800,
    developmentStatus: 'Rapidly Developing',
    coordinates: [
      [19.8810, 74.4940],
      [19.8875, 74.4940],
      [19.8875, 74.5020],
      [19.8810, 74.5020]
    ],
    notes: 'High-density residential expansion with active road reconstruction and stormwater drainage upgrade requirements.'
  }
];

export const getZonesByWard = (wardId) => landUseZones.filter(z => z.wardId === wardId);
export const getLanduseColor = (type) => LANDUSE_COLORS[type] || '#94a3b8';
