// Infrastructure inventory — Kopargaon Municipal Council (CivicFix Platform)
// Unique QR Asset IDs: ROAD-KPG-XXXX, LIGHT-KPG-XXXX, WATER-KPG-XXXX, etc.
// Condition: 1 (Critical) → 10 (Excellent)

export const INFRA_TYPES = [
  'Road', 'Bridge', 'Water Tank', 'Water Pipeline', 'Drainage',
  'Street Lights', 'School', 'Hospital', 'Park', 'Public Building', 'Waste Management'
];

export const CONDITION_LABELS = {
  1: 'Critical', 2: 'Critical', 3: 'Poor', 4: 'Poor',
  5: 'Fair', 6: 'Fair', 7: 'Good', 8: 'Good', 9: 'Excellent', 10: 'Excellent'
};

export const MAINTENANCE_STATUS = ['Up-to-date', 'Due', 'Overdue', 'Under Maintenance'];

export const infrastructure = [
  // ── Ward 1: Shivaji Chowk & Central Market ────────────────────────────────────
  {
    id: 'ROAD-KPG-1028',
    name: 'Kopargaon Main Road (Shivaji Chowk Stretch)',
    type: 'Road',
    wardId: 'W1',
    condition: 4,
    lat: 19.8918, lng: 74.4792,
    installDate: '2016-04-12',
    lastInspection: '2026-08-18',
    maintenanceStatus: 'Under Maintenance',
    contractor: 'Sahyadri Infrastructure & Highway Developers',
    verifiedBy: 'Er. Sandeep Patil (Field Inspection Team)',
    budget: 24500000,
    citizenReports: 23,
    potholes: 18,
    description: 'Primary arterial commercial corridor from Shivaji Chowk to Tilak Road. High traffic volume with ongoing resurfacing.',
    maintenanceHistory: [
      { date: '2024-03-10', action: 'Cold mix pothole patching prior to monsoon' },
      { date: '2025-06-15', action: 'Bituminous tack coat and edge repairs' },
      { date: '2026-08-15', action: 'Heavy-duty resurfacing project initiated' },
    ],
    relatedProjects: ['PROJECT-KPG-2026-01'],
    beforeAfterRef: 'TRANS-01'
  },
  {
    id: 'HOSP-KPG-0512',
    name: 'Kopargaon Sub-District Hospital Diagnostic Wing',
    type: 'Hospital',
    wardId: 'W1',
    condition: 8,
    lat: 19.8932, lng: 74.4810,
    installDate: '2010-08-15',
    lastInspection: '2026-08-10',
    maintenanceStatus: 'Up-to-date',
    contractor: 'Dhanvantari Healthcare Builders',
    verifiedBy: 'Dr. Meena Tambe (Civil Surgeon)',
    budget: 42000000,
    citizenReports: 19,
    description: '100-bed government medical center with newly commissioned 24x7 trauma care and pathology lab.',
    maintenanceHistory: [
      { date: '2023-11-20', action: 'OPD civil waterproofing' },
      { date: '2026-08-10', action: 'Emergency ward modernization certified' }
    ],
    relatedProjects: ['PROJECT-KPG-2026-02'],
    beforeAfterRef: 'TRANS-06'
  },
  {
    id: 'BLDG-KPG-0312',
    name: 'Kopargaon Municipal Council Headquarters',
    type: 'Public Building',
    wardId: 'W1',
    condition: 7,
    lat: 19.8912, lng: 74.4782,
    installDate: '2004-01-26',
    lastInspection: '2026-07-22',
    maintenanceStatus: 'Up-to-date',
    contractor: 'KMC Public Works Dept',
    verifiedBy: 'Er. Sandeep Patil',
    budget: 11000000,
    citizenReports: 4,
    description: 'Administrative offices, citizen e-governance service counters, and town planning division.',
    maintenanceHistory: [
      { date: '2025-01-15', action: 'Solar rooftop installation (40kW)' }
    ],
    relatedProjects: []
  },
  {
    id: 'LIGHT-KPG-0102',
    name: 'Shivaji Chowk High-Mast Smart Luminaire',
    type: 'Street Lights',
    wardId: 'W1',
    condition: 9,
    lat: 19.8920, lng: 74.4798,
    installDate: '2022-10-05',
    lastInspection: '2026-08-14',
    maintenanceStatus: 'Up-to-date',
    contractor: 'Mahalaxmi Electricals',
    verifiedBy: 'Smt. Anjali Kulkarni',
    budget: 1200000,
    citizenReports: 2,
    description: '30-meter high-mast LED tower with automated dusk-to-dawn astronomical timer.',
    maintenanceHistory: [
      { date: '2026-05-12', action: 'LED driver and junction box maintenance' }
    ],
    relatedProjects: []
  },

  // ── Ward 2: Railway Station Road ──────────────────────────────────────────────
  {
    id: 'ROAD-KPG-1044',
    name: 'Station Road Multi-Modal Link (KPG Junction)',
    type: 'Road',
    wardId: 'W2',
    condition: 5,
    lat: 19.9025, lng: 74.4845,
    installDate: '2014-02-18',
    lastInspection: '2026-07-19',
    maintenanceStatus: 'Due',
    contractor: 'Apex Infra Projects',
    verifiedBy: 'Er. R. S. Shinde',
    budget: 18500000,
    citizenReports: 14,
    potholes: 9,
    description: '2.1 km railway connectivity link. Heavy auto-rickshaw and interstate bus movement requires shoulder widening.',
    maintenanceHistory: [
      { date: '2024-08-12', action: 'Surface patching' },
      { date: '2025-09-02', action: 'Kerb stone alignment' }
    ],
    relatedProjects: ['PROJECT-KPG-2026-03']
  },
  {
    id: 'SCH-KPG-0320',
    name: 'KMC Municipal High School No. 2 (Station Area)',
    type: 'School',
    wardId: 'W2',
    condition: 6,
    lat: 19.9012, lng: 74.4828,
    installDate: '1996-06-15',
    lastInspection: '2026-06-30',
    maintenanceStatus: 'Due',
    contractor: 'Sahyadri Builders',
    verifiedBy: 'Er. Sandeep Patil',
    budget: 6500000,
    citizenReports: 8,
    description: 'Co-educational Marathi & Semi-English medium municipal school with 850 students.',
    maintenanceHistory: [
      { date: '2024-05-10', action: 'Classroom ceiling repair and painting' }
    ],
    relatedProjects: []
  },
  {
    id: 'WATER-KPG-0205',
    name: 'Station Area Elevated Water Tank (ESR 2)',
    type: 'Water Tank',
    wardId: 'W2',
    condition: 7,
    lat: 19.9040, lng: 74.4855,
    installDate: '2011-09-10',
    lastInspection: '2026-08-01',
    maintenanceStatus: 'Up-to-date',
    contractor: 'Godavari Water Works',
    verifiedBy: 'Er. R. S. Shinde',
    budget: 8500000,
    citizenReports: 5,
    description: '5.0 lakh litre capacity overhead water reservoir supplying Station colony and transit hotels.',
    maintenanceHistory: [
      { date: '2026-04-18', action: 'Tank chlorination and cleaning cycle' }
    ],
    relatedProjects: []
  },
  {
    id: 'LIGHT-KPG-0412',
    name: 'Station Road Sodium-LED Replacement Sector',
    type: 'Street Lights',
    wardId: 'W2',
    condition: 4,
    lat: 19.9018, lng: 74.4836,
    installDate: '2015-03-20',
    lastInspection: '2026-07-28',
    maintenanceStatus: 'Overdue',
    contractor: 'KMC Electrical Div',
    verifiedBy: 'Smt. Anjali Kulkarni',
    budget: 950000,
    citizenReports: 17,
    description: '45 streetlight poles between junction and bus stand. 14 poles currently flickering/dead.',
    maintenanceHistory: [
      { date: '2025-08-10', action: 'Temporary bulb replacement' }
    ],
    relatedProjects: ['PROJECT-KPG-2026-07']
  },

  // ── Ward 3: Samata Nagar & College Campus ────────────────────────────────────
  {
    id: 'ROAD-KPG-1052',
    name: 'Somaiya College Road & Samata Nagar Link',
    type: 'Road',
    wardId: 'W3',
    condition: 5,
    lat: 19.8865, lng: 74.4885,
    installDate: '2017-11-05',
    lastInspection: '2026-08-05',
    maintenanceStatus: 'Due',
    contractor: 'Pragati Constructions',
    verifiedBy: 'Er. Sandeep Patil',
    budget: 14000000,
    citizenReports: 16,
    potholes: 11,
    description: 'Heavy student footfall and two-wheeler traffic. Surface cracking reported post-monsoon.',
    maintenanceHistory: [
      { date: '2024-12-05', action: 'Bituminous slurry seal application' }
    ],
    relatedProjects: []
  },
  {
    id: 'DRAIN-KPG-0122',
    name: 'Samata Nagar Primary Storm Drain Canal',
    type: 'Drainage',
    wardId: 'W3',
    condition: 3,
    lat: 19.8850, lng: 74.4898,
    installDate: '2008-04-10',
    lastInspection: '2026-08-12',
    maintenanceStatus: 'Overdue',
    contractor: 'KMC Sanitation Works',
    verifiedBy: 'Shri V. R. Deshmukh',
    budget: 6800000,
    citizenReports: 28,
    description: 'Masonry storm drain clogged with plastic debris and silt; causes localized water accumulation during cloudbursts.',
    maintenanceHistory: [
      { date: '2025-05-18', action: 'Manual desilting drive prior to monsoon' }
    ],
    relatedProjects: []
  },
  {
    id: 'PARK-KPG-0094',
    name: 'Samata Nagar Citizens Garden & Jogging Track',
    type: 'Park',
    wardId: 'W3',
    condition: 8,
    lat: 19.8872, lng: 74.4910,
    installDate: '2019-02-14',
    lastInspection: '2026-08-02',
    maintenanceStatus: 'Up-to-date',
    contractor: 'Green Earth Landscapes',
    verifiedBy: 'Shri V. R. Deshmukh',
    budget: 4500000,
    citizenReports: 3,
    description: '2.5 acre public park with solar lighting, children play equipment, and herbal garden.',
    maintenanceHistory: [
      { date: '2026-02-20', action: 'Grass re-turfing and open gym maintenance' }
    ],
    relatedProjects: []
  },

  // ── Ward 4: Godavari Riverfront & Ghat Area ──────────────────────────────────
  {
    id: 'DRAIN-KPG-0138',
    name: 'Godavari Riverfront Storm Water Drainage & Silt Remediation',
    type: 'Drainage',
    wardId: 'W4',
    condition: 9,
    lat: 19.8968, lng: 74.4740,
    installDate: '2026-07-28',
    lastInspection: '2026-08-16',
    maintenanceStatus: 'Up-to-date',
    contractor: 'Kopargaon Jal Kalyan Projects Ltd.',
    verifiedBy: 'Shri V. R. Deshmukh (Chief Sanitation Officer)',
    budget: 18000000,
    citizenReports: 0,
    description: 'Twin-cell RCC covered stormwater channel with high-velocity outflow directly to Godavari. Zero flooding post-commissioning.',
    maintenanceHistory: [
      { date: '2026-07-28', action: 'Commissioned and hydraulic discharge tested' }
    ],
    relatedProjects: ['PROJECT-KPG-2026-04'],
    beforeAfterRef: 'TRANS-02'
  },
  {
    id: 'BRIDGE-KPG-0105',
    name: 'Godavari Old Ghat Masonry Bridge',
    type: 'Bridge',
    wardId: 'W4',
    condition: 4,
    lat: 19.8980, lng: 74.4725,
    installDate: '1972-03-30',
    lastInspection: '2026-08-08',
    maintenanceStatus: 'Due',
    contractor: 'Maharashtra PWD',
    verifiedBy: 'Er. Sandeep Patil',
    budget: 35000000,
    citizenReports: 21,
    description: 'Historic low-level river crossing bridge. Pier scour assessment and expansion joint retrofitting required.',
    maintenanceHistory: [
      { date: '2023-09-15', action: 'Parapet wall reinforcement after flood surge' }
    ],
    relatedProjects: ['PROJECT-KPG-2026-08']
  },
  {
    id: 'WATER-KPG-0210',
    name: 'Godavari River Raw Water Intake Pumping Station',
    type: 'Water Pipeline',
    wardId: 'W4',
    condition: 7,
    lat: 19.8955, lng: 74.4715,
    installDate: '2013-05-20',
    lastInspection: '2026-08-04',
    maintenanceStatus: 'Up-to-date',
    contractor: 'Godavari Water Works',
    verifiedBy: 'Er. R. S. Shinde',
    budget: 52000000,
    citizenReports: 6,
    description: 'Main intake jackwell and 600mm raw water transmission pipeline feeding Kopargaon water treatment plant.',
    maintenanceHistory: [
      { date: '2026-06-01', action: 'Pump motor rewinding and impeller replacement' }
    ],
    relatedProjects: []
  },

  // ── Ward 5: Bet Kopargaon Elevated Sector ────────────────────────────────────
  {
    id: 'WATER-KPG-0217',
    name: 'Bet Kopargaon Overhead Reservoir & Booster Pumping Station',
    type: 'Water Tank',
    wardId: 'W5',
    condition: 9,
    lat: 19.8995, lng: 74.4678,
    installDate: '2026-07-12',
    lastInspection: '2026-08-14',
    maintenanceStatus: 'Up-to-date',
    contractor: 'Godavari Water Works & Urban Infra',
    verifiedBy: 'Er. R. S. Shinde (Hydraulic Engineer, KMC)',
    budget: 31000000,
    citizenReports: 1,
    description: '10-lakh litre elevated reservoir with automated SCADA telemetry. Supplies 3,850 households with high pressure.',
    maintenanceHistory: [
      { date: '2026-07-12', action: 'Commissioned and pressure testing certified' }
    ],
    relatedProjects: ['PROJECT-KPG-2026-05'],
    beforeAfterRef: 'TRANS-04'
  },
  {
    id: 'ROAD-KPG-1065',
    name: 'Bet Kopargaon Hill Link Road',
    type: 'Road',
    wardId: 'W5',
    condition: 3,
    lat: 19.8975, lng: 74.4650,
    installDate: '2012-01-10',
    lastInspection: '2026-07-20',
    maintenanceStatus: 'Overdue',
    contractor: 'Sai Kripa Earthmovers',
    verifiedBy: 'Er. Sandeep Patil',
    budget: 11500000,
    citizenReports: 25,
    potholes: 22,
    description: 'Steep gradient arterial road with severe rainwater ruts and broken retaining wall.',
    maintenanceHistory: [
      { date: '2024-04-10', action: 'Gravel backfilling' }
    ],
    relatedProjects: []
  },

  // ── Ward 6: Yeola Naka & Bypass Corridor ────────────────────────────────────
  {
    id: 'ROAD-KPG-1070',
    name: 'Yeola Naka Interstate Freight Bypass (KPG-Yeola SH-10)',
    type: 'Road',
    wardId: 'W6',
    condition: 6,
    lat: 19.8825, lng: 74.4715,
    installDate: '2018-09-25',
    lastInspection: '2026-08-10',
    maintenanceStatus: 'Due',
    contractor: 'National Highway Infra Ltd',
    verifiedBy: 'Er. Sandeep Patil',
    budget: 48000000,
    citizenReports: 12,
    potholes: 7,
    description: '4-lane bypass road handling heavy sugarcane trucks and long-distance container transport.',
    maintenanceHistory: [
      { date: '2025-10-14', action: 'Thermoplastic reflective lane marking' }
    ],
    relatedProjects: ['PROJECT-KPG-2026-06']
  },
  {
    id: 'LIGHT-KPG-0430',
    name: 'Yeola Naka Transport Hub Floodlight Towers',
    type: 'Street Lights',
    wardId: 'W6',
    condition: 7,
    lat: 19.8812, lng: 74.4705,
    installDate: '2021-03-15',
    lastInspection: '2026-07-15',
    maintenanceStatus: 'Up-to-date',
    contractor: 'Mahalaxmi Electricals',
    verifiedBy: 'Smt. Anjali Kulkarni',
    budget: 2200000,
    citizenReports: 3,
    description: '4 octagonal high-mast lighting towers at truck lay-bye and check-post area.',
    maintenanceHistory: [
      { date: '2026-03-10', action: 'Quarterly lamp and cable inspection' }
    ],
    relatedProjects: []
  },

  // ── Ward 7: Sai Nagar & Shirdi Link Corridor ────────────────────────────────
  {
    id: 'LIGHT-KPG-0451',
    name: 'Sai Nagar Link Road Smart LED Solar-Hybrid Lighting Grid',
    type: 'Street Lights',
    wardId: 'W7',
    condition: 10,
    lat: 19.8785, lng: 74.4825,
    installDate: '2026-08-04',
    lastInspection: '2026-08-20',
    maintenanceStatus: 'Up-to-date',
    contractor: 'Mahalaxmi Electricals & Smart Grids',
    verifiedBy: 'Smt. Anjali Kulkarni (Municipal Electrical Inspector)',
    budget: 8500000,
    citizenReports: 0,
    description: '3.2 km corridor illuminated with 90W smart LED luminaires with 99.8% uptime telemetry.',
    maintenanceHistory: [
      { date: '2026-08-04', action: 'Illuminance audit passed and commissioned' }
    ],
    relatedProjects: ['PROJECT-KPG-2026-07'],
    beforeAfterRef: 'TRANS-03'
  },
  {
    id: 'ROAD-KPG-1082',
    name: 'Sai Nagar Pilgrim Highway (Kopargaon-Shirdi Stretch)',
    type: 'Road',
    wardId: 'W7',
    condition: 8,
    lat: 19.8770, lng: 74.4815,
    installDate: '2023-01-15',
    lastInspection: '2026-08-02',
    maintenanceStatus: 'Up-to-date',
    contractor: 'Maharashtra State Road Development Corp',
    verifiedBy: 'Er. Sandeep Patil',
    budget: 62000000,
    citizenReports: 5,
    potholes: 1,
    description: 'Concrete paved dual carriageway serving pilgrims traveling between Kopargaon Junction and Shirdi Shrine.',
    maintenanceHistory: [
      { date: '2026-01-18', action: 'Joint seal expansion filling and cat-eye reflector replacement' }
    ],
    relatedProjects: []
  },

  // ── Ward 8: Tilak Nagar & Old Town ──────────────────────────────────────────
  {
    id: 'ROAD-KPG-1090',
    name: 'Tilak Road & Old Bazaar Heritage Lane',
    type: 'Road',
    wardId: 'W8',
    condition: 4,
    lat: 19.8942, lng: 74.4870,
    installDate: '2011-06-20',
    lastInspection: '2026-07-25',
    maintenanceStatus: 'Due',
    contractor: 'KMC Works',
    verifiedBy: 'Er. Sandeep Patil',
    budget: 9500000,
    citizenReports: 22,
    potholes: 15,
    description: 'Narrow historic commercial lane with paver block damage and open drain trenching.',
    maintenanceHistory: [
      { date: '2024-09-12', action: 'Paver block resetting' }
    ],
    relatedProjects: []
  },
  {
    id: 'WATER-KPG-0225',
    name: 'Tilak Nagar Underground Sump & Booster Pump',
    type: 'Water Tank',
    wardId: 'W8',
    condition: 6,
    lat: 19.8935, lng: 74.4860,
    installDate: '2009-03-15',
    lastInspection: '2026-06-20',
    maintenanceStatus: 'Due',
    contractor: 'Godavari Water Works',
    verifiedBy: 'Er. R. S. Shinde',
    budget: 5400000,
    citizenReports: 9,
    description: '3.0 lakh litre underground water reservoir supplying congested old town residential lanes.',
    maintenanceHistory: [
      { date: '2025-11-10', action: 'Booster pump overhaul' }
    ],
    relatedProjects: []
  },

  // ── Ward 9: APMC Market Yard & Grain Mandi ──────────────────────────────────
  {
    id: 'WASTE-KPG-0190',
    name: 'Market Yard (APMC) Clean Civic Waste Transfer Station',
    type: 'Waste Management',
    wardId: 'W9',
    condition: 9,
    lat: 19.8895, lng: 74.4955,
    installDate: '2026-08-22',
    lastInspection: '2026-08-23',
    maintenanceStatus: 'Up-to-date',
    contractor: 'Nirmal Urban Cleanliness Solutions',
    verifiedBy: 'Dr. Suresh Gaikwad (Sanitary Inspector)',
    budget: 9500000,
    citizenReports: 0,
    description: 'Enclosed hydraulic compactor waste transfer facility with wet/dry automated segregation.',
    maintenanceHistory: [
      { date: '2026-08-22', action: 'Commissioned with ISO 14001 certification' }
    ],
    relatedProjects: ['PROJECT-KPG-2026-09'],
    beforeAfterRef: 'TRANS-05'
  },
  {
    id: 'ROAD-KPG-1098',
    name: 'APMC Onion & Grain Mandi Heavy Access Road',
    type: 'Road',
    wardId: 'W9',
    condition: 5,
    lat: 19.8885, lng: 74.4942,
    installDate: '2015-10-18',
    lastInspection: '2026-07-15',
    maintenanceStatus: 'Due',
    contractor: 'Sahyadri Infrastructure',
    verifiedBy: 'Er. Sandeep Patil',
    budget: 21000000,
    citizenReports: 15,
    potholes: 12,
    description: 'Concrete paver and WBM road taking 400+ tractor-trailers daily during harvest season.',
    maintenanceHistory: [
      { date: '2025-04-10', action: 'Concrete panel repair' }
    ],
    relatedProjects: []
  },

  // ── Ward 10: Sharda Nagar & Kankaria Enclave ────────────────────────────────
  {
    id: 'PARK-KPG-0102',
    name: 'Sharda Nagar Municipal Botanical Garden & Lake',
    type: 'Park',
    wardId: 'W10',
    condition: 8,
    lat: 19.9065, lng: 74.4765,
    installDate: '2021-11-20',
    lastInspection: '2026-08-01',
    maintenanceStatus: 'Up-to-date',
    contractor: 'Green Earth Landscapes',
    verifiedBy: 'Shri V. R. Deshmukh',
    budget: 7800000,
    citizenReports: 2,
    description: '4-acre green park with rainwater harvesting pond, walking tracks, and open air gym.',
    maintenanceHistory: [
      { date: '2026-05-15', action: 'Pond desilting and solar pump maintenance' }
    ],
    relatedProjects: []
  },
  {
    id: 'WATER-KPG-0230',
    name: 'Sharda Nagar Clean Water Booster Pump House',
    type: 'Water Pipeline',
    wardId: 'W10',
    condition: 8,
    lat: 19.9055, lng: 74.4750,
    installDate: '2020-04-10',
    lastInspection: '2026-07-28',
    maintenanceStatus: 'Up-to-date',
    contractor: 'Godavari Water Works',
    verifiedBy: 'Er. R. S. Shinde',
    budget: 6200000,
    citizenReports: 4,
    description: 'Direct booster station providing consistent 1.5 bar water pressure to 2,100 residential flats.',
    maintenanceHistory: [
      { date: '2026-01-20', action: 'Pressure sensor calibration' }
    ],
    relatedProjects: []
  },

  // ── Ward 11: MIDC & Agro-Industrial Estate ──────────────────────────────────
  {
    id: 'DRAIN-KPG-0145',
    name: 'MIDC Effluent Pre-Treatment Stormwater Drainage Line',
    type: 'Drainage',
    wardId: 'W11',
    condition: 4,
    lat: 19.8725, lng: 74.4925,
    installDate: '2007-08-15',
    lastInspection: '2026-08-11',
    maintenanceStatus: 'Overdue',
    contractor: 'Maharashtra Industrial Dev Corp',
    verifiedBy: 'Shri V. R. Deshmukh',
    budget: 28000000,
    citizenReports: 18,
    description: 'Industrial discharge canal requiring regular neutralizing chemical checks and concrete relining.',
    maintenanceHistory: [
      { date: '2024-11-05', action: 'Chemical silt extraction' }
    ],
    relatedProjects: ['PROJECT-KPG-2026-11']
  },
  {
    id: 'ROAD-KPG-1110',
    name: 'MIDC Heavy Industry Link Road',
    type: 'Road',
    wardId: 'W11',
    condition: 4,
    lat: 19.8710, lng: 74.4910,
    installDate: '2013-12-05',
    lastInspection: '2026-07-18',
    maintenanceStatus: 'Overdue',
    contractor: 'MIDC Civil Wing',
    verifiedBy: 'Er. Sandeep Patil',
    budget: 34000000,
    citizenReports: 26,
    potholes: 24,
    description: 'Heavily rutted industrial corridor with continuous heavy freight trailers.',
    maintenanceHistory: [
      { date: '2024-06-20', action: 'Gravel grading' }
    ],
    relatedProjects: []
  },

  // ── Ward 12: Subhash Nagar & Kopargaon East (High Priority) ──────────────────
  {
    id: 'ROAD-KPG-1120',
    name: 'Subhash Nagar Main Arterial Corridor',
    type: 'Road',
    wardId: 'W12',
    condition: 3,
    lat: 19.8848, lng: 74.4988,
    installDate: '2012-05-10',
    lastInspection: '2026-08-18',
    maintenanceStatus: 'Overdue',
    contractor: 'Pragati Infra Builders',
    verifiedBy: 'Er. Sandeep Patil',
    budget: 28000000,
    citizenReports: 34,
    potholes: 29,
    description: 'Critical residential artery with deep potholes, surface unraveling, and missing drainage culverts. Priority score 84/100.',
    maintenanceHistory: [
      { date: '2024-08-15', action: 'Emergency pothole filling' },
      { date: '2025-07-10', action: 'Partial gravel patch' }
    ],
    relatedProjects: ['PROJECT-KPG-2026-12']
  },
  {
    id: 'DRAIN-KPG-0155',
    name: 'Subhash Nagar Secondary Storm Drain Network',
    type: 'Drainage',
    wardId: 'W12',
    condition: 2,
    lat: 19.8840, lng: 74.4995,
    installDate: '2005-09-20',
    lastInspection: '2026-08-12',
    maintenanceStatus: 'Overdue',
    contractor: 'KMC Sanitation',
    verifiedBy: 'Shri V. R. Deshmukh',
    budget: 12500000,
    citizenReports: 27,
    description: 'Collapsed brick masonry storm drain causing seasonal waterlogging in Subhash Nagar colony lanes.',
    maintenanceHistory: [
      { date: '2023-06-10', action: 'Desilting' }
    ],
    relatedProjects: ['PROJECT-KPG-2026-12']
  },
  {
    id: 'LIGHT-KPG-0465',
    name: 'Subhash Nagar Colony Street Lighting Grid',
    type: 'Street Lights',
    wardId: 'W12',
    condition: 3,
    lat: 19.8855, lng: 74.4975,
    installDate: '2014-04-15',
    lastInspection: '2026-08-15',
    maintenanceStatus: 'Overdue',
    contractor: 'KMC Electrical Div',
    verifiedBy: 'Smt. Anjali Kulkarni',
    budget: 1800000,
    citizenReports: 23,
    description: '60 sodium vapor lighting poles. Over 40% non-operational, generating citizen safety complaints.',
    maintenanceHistory: [
      { date: '2025-09-14', action: 'Temporary bulb replacements' }
    ],
    relatedProjects: []
  },
  {
    id: 'WATER-KPG-0245',
    name: 'Kopargaon East Water Booster & Distribution Valve Point',
    type: 'Water Pipeline',
    wardId: 'W12',
    condition: 4,
    lat: 19.8835, lng: 74.4980,
    installDate: '2009-11-12',
    lastInspection: '2026-07-30',
    maintenanceStatus: 'Due',
    contractor: 'Godavari Water Works',
    verifiedBy: 'Er. R. S. Shinde',
    budget: 9200000,
    citizenReports: 19,
    description: 'Distribution manifold supplying Kopargaon East colonies with recurrent pipeline pressure drops.',
    maintenanceHistory: [
      { date: '2025-12-05', action: 'Sluice valve packing replacement' }
    ],
    relatedProjects: []
  }
];

export const getInfraById = (id) => infrastructure.find(i => i.id === id);
export const getInfraByWard = (wardId) => infrastructure.filter(i => i.wardId === wardId);

export const getConditionColor = (condition) => {
  if (condition >= 8) return '#22c55e'; // Green - Excellent
  if (condition >= 6) return '#10b981'; // Emerald - Good
  if (condition === 5) return '#f59e0b'; // Amber - Fair
  if (condition >= 3) return '#f97316'; // Orange - Poor
  return '#ef4444';                     // Red - Critical
};

export const getConditionLabel = (condition) => CONDITION_LABELS[condition] || 'Unknown';
