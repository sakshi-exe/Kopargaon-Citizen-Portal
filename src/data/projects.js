// Development Projects of Kopargaon Municipal Council (CivicFix Platform)
// Status: 'Planned' | 'Approved' | 'In Progress' | 'Delayed' | 'Completed'

export const PROJECT_STATUSES = ['Planned', 'Approved', 'In Progress', 'Delayed', 'Completed'];

export const PROJECT_CATEGORIES = [
  'Road Infrastructure', 'Water Supply', 'Stormwater Drainage',
  'Street Lighting', 'Public Health', 'Waste Management', 'Bridge & Structures', 'Urban Greens'
];

export const DEPARTMENTS = [
  'KMC Engineering & Roads Div',
  'Godavari Water Supply & Sanitation Board',
  'KMC Electrical & Telemetry Cell',
  'Public Health & Sanitation Dept',
  'Maharashtra State PWD (Kopargaon Sub-Div)',
  'Town Planning & Urban Development Authority'
];

export const projects = [
  {
    id: 'PROJECT-KPG-2026-01',
    name: 'Kopargaon Main Road & Shivaji Chowk Arterial Resurfacing',
    wardId: 'W1',
    department: 'KMC Engineering & Roads Div',
    category: 'Road Infrastructure',
    budget: 24500000,
    spent: 22800000,
    startDate: '2026-06-12',
    expectedEnd: '2026-09-30',
    progress: 88,
    status: 'In Progress',
    contractor: 'Sahyadri Infrastructure & Highway Developers',
    lat: 19.8918, lng: 74.4792,
    qrAssetRef: 'ROAD-KPG-1028',
    description: 'Bituminous overlay, thermoplastic retro-reflective lane marking, and subgrade stabilization on Kopargaon Main Road.',
    updates: [
      { date: '2026-06-12', text: 'Work order issued and initial milling started from Shivaji Chowk.' },
      { date: '2026-07-20', text: '50mm dense bituminous macadam base completed.' },
      { date: '2026-08-15', text: 'Final wearing course laid; curing and kerb painting underway.' }
    ]
  },
  {
    id: 'PROJECT-KPG-2026-02',
    name: 'Kopargaon Sub-District Hospital Emergency Diagnostic Modernization',
    wardId: 'W1',
    department: 'Public Health & Sanitation Dept',
    category: 'Public Health',
    budget: 42000000,
    spent: 42000000,
    startDate: '2026-03-01',
    expectedEnd: '2026-08-10',
    progress: 100,
    status: 'Completed',
    contractor: 'Dhanvantari Healthcare Builders',
    lat: 19.8932, lng: 74.4810,
    qrAssetRef: 'HOSP-KPG-0512',
    description: 'Establishment of 24x7 trauma care center, digital diagnostic imaging wing, and OPD civil renovation.',
    updates: [
      { date: '2026-03-01', text: 'Civil renovation and structural reinforcement initiated.' },
      { date: '2026-06-25', text: 'Medical equipment installation and central AC testing.' },
      { date: '2026-08-10', text: 'NABH audit passed; fully commissioned for public service.' }
    ]
  },
  {
    id: 'PROJECT-KPG-2026-03',
    name: 'Kopargaon Railway Station Multi-Modal Link & Auto Bay',
    wardId: 'W2',
    department: 'Town Planning & Urban Development Authority',
    category: 'Road Infrastructure',
    budget: 18500000,
    spent: 12400000,
    startDate: '2026-04-15',
    expectedEnd: '2026-10-15',
    progress: 62,
    status: 'In Progress',
    contractor: 'Apex Infra Projects',
    lat: 19.9025, lng: 74.4845,
    qrAssetRef: 'ROAD-KPG-1044',
    description: 'Road widening, pedestrian walkways, organized auto-rickshaw bays, and high-mast solar lighting at station approach.',
    updates: [
      { date: '2026-04-15', text: 'Encroachment removal and utility relocation completed.' },
      { date: '2026-07-05', text: 'Paver block installation for parking bays completed.' }
    ]
  },
  {
    id: 'PROJECT-KPG-2026-04',
    name: 'Godavari Riverfront Storm Water Drainage & Silt Remediation',
    wardId: 'W4',
    department: 'Godavari Water Supply & Sanitation Board',
    category: 'Stormwater Drainage',
    budget: 18000000,
    spent: 18000000,
    startDate: '2026-05-01',
    expectedEnd: '2026-07-28',
    progress: 100,
    status: 'Completed',
    contractor: 'Kopargaon Jal Kalyan Projects Ltd.',
    lat: 19.8968, lng: 74.4740,
    qrAssetRef: 'DRAIN-KPG-0138',
    description: 'Engineered twin-cell RCC stormwater outfall to eliminate annual monsoon flood risk around the Ghat area.',
    updates: [
      { date: '2026-05-01', text: 'De-silting and hydraulic excavation along the riverbank.' },
      { date: '2026-06-20', text: 'RCC box culvert casting and outfall flap gates installed.' },
      { date: '2026-07-28', text: 'Final hydraulic testing verified zero waterlogging during heavy rain.' }
    ]
  },
  {
    id: 'PROJECT-KPG-2026-05',
    name: 'Bet Kopargaon Elevated Reservoir & Booster Pumping Station',
    wardId: 'W5',
    department: 'Godavari Water Supply & Sanitation Board',
    category: 'Water Supply',
    budget: 31000000,
    spent: 31000000,
    startDate: '2025-10-10',
    expectedEnd: '2026-07-12',
    progress: 100,
    status: 'Completed',
    contractor: 'Godavari Water Works & Urban Infra',
    lat: 19.8995, lng: 74.4678,
    qrAssetRef: 'WATER-KPG-0217',
    description: '10-lakh litre elevated water storage reservoir and SCADA telemetry automated feeder network.',
    updates: [
      { date: '2025-10-10', text: 'Civil foundation and column staging works begun.' },
      { date: '2026-04-15', text: 'Hydrostatic pressure testing of container vessel.' },
      { date: '2026-07-12', text: 'Commissioned; regular piped supply delivered to 3,850 households.' }
    ]
  },
  {
    id: 'PROJECT-KPG-2026-06',
    name: 'Yeola Naka Interstate Freight Bypass Rehabilitation',
    wardId: 'W6',
    department: 'Maharashtra State PWD (Kopargaon Sub-Div)',
    category: 'Road Infrastructure',
    budget: 48000000,
    spent: 28000000,
    startDate: '2026-02-01',
    expectedEnd: '2026-11-30',
    progress: 54,
    status: 'In Progress',
    contractor: 'National Highway Infra Ltd',
    lat: 19.8825, lng: 74.4715,
    qrAssetRef: 'ROAD-KPG-1070',
    description: 'Pavement reconstruction and rigid concrete toll-free lay-bye for sugarcane and agricultural freight transport.',
    updates: [
      { date: '2026-02-01', text: 'Granular sub-base construction initiated.' },
      { date: '2026-06-18', text: 'Concrete paving on Left Carriage Way completed.' }
    ]
  },
  {
    id: 'PROJECT-KPG-2026-07',
    name: 'Sai Nagar Link Road Smart LED Solar-Hybrid Lighting Grid',
    wardId: 'W7',
    department: 'KMC Electrical & Telemetry Cell',
    category: 'Street Lighting',
    budget: 8500000,
    spent: 8500000,
    startDate: '2026-06-01',
    expectedEnd: '2026-08-04',
    progress: 100,
    status: 'Completed',
    contractor: 'Mahalaxmi Electricals & Smart Grids',
    lat: 19.8785, lng: 74.4825,
    qrAssetRef: 'LIGHT-KPG-0451',
    description: 'Complete replacement of non-functional sodium lamps with 90W smart telemetry LED fixtures on Shirdi link corridor.',
    updates: [
      { date: '2026-06-01', text: 'Poles erection and underground cabling completed.' },
      { date: '2026-07-22', text: 'Smart telemetry lux controllers synchronized.' },
      { date: '2026-08-04', text: 'Public illumination verified with 99.8% uptime.' }
    ]
  },
  {
    id: 'PROJECT-KPG-2026-08',
    name: 'Godavari Old Ghat Bridge Pier Structural Retrofitting',
    wardId: 'W4',
    department: 'Maharashtra State PWD (Kopargaon Sub-Div)',
    category: 'Bridge & Structures',
    budget: 35000000,
    spent: 11000000,
    startDate: '2026-01-10',
    expectedEnd: '2026-06-30',
    progress: 35,
    status: 'Delayed',
    contractor: 'Heritage Bridge Tech Infra',
    lat: 19.8980, lng: 74.4725,
    qrAssetRef: 'BRIDGE-KPG-0105',
    description: 'Underwater jacketing of masonry bridge piers and deck expansion joints. Delayed due to monsoon water surge and contractor equipment delays.',
    updates: [
      { date: '2026-01-10', text: 'Underwater diver inspection and non-destructive testing completed.' },
      { date: '2026-05-15', text: 'Monsoon water level rise forced temporary work stoppage.' },
      { date: '2026-08-01', text: 'Show-cause notice served to contractor for slow mobilization.' }
    ]
  },
  {
    id: 'PROJECT-KPG-2026-09',
    name: 'APMC Market Yard Clean Solid Waste Transfer Station',
    wardId: 'W9',
    department: 'Public Health & Sanitation Dept',
    category: 'Waste Management',
    budget: 9500000,
    spent: 9500000,
    startDate: '2026-05-15',
    expectedEnd: '2026-08-22',
    progress: 100,
    status: 'Completed',
    contractor: 'Nirmal Urban Cleanliness Solutions',
    lat: 19.8895, lng: 74.4955,
    qrAssetRef: 'WASTE-KPG-0190',
    description: 'Enclosed compactor waste transfer facility eliminating open garbage blackspots at onion/grain trading yard.',
    updates: [
      { date: '2026-05-15', text: 'Civil floor slab and leachate drain trenching.' },
      { date: '2026-07-20', text: 'Hydraulic compactor and bio-sprayer units installed.' },
      { date: '2026-08-22', text: 'Commissioned with ISO 14001 certification.' }
    ]
  },
  {
    id: 'PROJECT-KPG-2026-10',
    name: 'Sharda Nagar Rainwater Harvesting & Community Park Development',
    wardId: 'W10',
    department: 'Town Planning & Urban Development Authority',
    category: 'Urban Greens',
    budget: 7800000,
    spent: 6200000,
    startDate: '2026-03-20',
    expectedEnd: '2026-10-31',
    progress: 75,
    status: 'In Progress',
    contractor: 'Green Earth Landscapes',
    lat: 19.9065, lng: 74.4765,
    qrAssetRef: 'PARK-KPG-0102',
    description: 'Creation of 4-acre urban green space with walking tracks and artificial recharge percolation pond.',
    updates: [
      { date: '2026-03-20', text: 'Earthwork excavation and pond lining begun.' },
      { date: '2026-07-10', text: 'Jogging track paving and solar garden lamps installed.' }
    ]
  },
  {
    id: 'PROJECT-KPG-2026-11',
    name: 'MIDC Industrial Estate Stormwater Canal & Effluent Segregation',
    wardId: 'W11',
    department: 'KMC Engineering & Roads Div',
    category: 'Stormwater Drainage',
    budget: 28000000,
    spent: 8500000,
    startDate: '2026-02-15',
    expectedEnd: '2026-07-15',
    progress: 30,
    status: 'Delayed',
    contractor: 'MIDC Civil Infrastructure Wing',
    lat: 19.8725, lng: 74.4925,
    qrAssetRef: 'DRAIN-KPG-0145',
    description: 'Concrete lining of industrial stormwater channel. Delayed due to utility clearances and factory connection realignment.',
    updates: [
      { date: '2026-02-15', text: 'Alignment survey completed.' },
      { date: '2026-06-10', text: 'Work halted pending underground gas pipeline clearance.' }
    ]
  },
  {
    id: 'PROJECT-KPG-2026-12',
    name: 'Subhash Nagar & Kopargaon East Road & Drainage Comprehensive Package',
    wardId: 'W12',
    department: 'KMC Engineering & Roads Div',
    category: 'Road Infrastructure',
    budget: 40500000,
    spent: 12500000,
    startDate: '2026-01-20',
    expectedEnd: '2026-06-30',
    progress: 32,
    status: 'Delayed',
    contractor: 'Pragati Infra Builders',
    lat: 19.8848, lng: 74.4988,
    qrAssetRef: 'ROAD-KPG-1120',
    description: 'Complete road reconstruction and covered stormwater drainage in Ward 12. Identified as High Priority due to 34 citizen complaints and 29 severe potholes.',
    updates: [
      { date: '2026-01-20', text: 'Work order executed and drain excavation commenced.' },
      { date: '2026-05-30', text: 'Contractor faced sub-base material shortages; revised schedule requested.' },
      { date: '2026-08-18', text: 'CivicFix priority score (84/100) triggered emergency municipal audit review.' }
    ]
  }
];

export const getProjectById = (id) => projects.find(p => p.id === id);
export const getProjectsByWard = (wardId) => projects.filter(p => p.wardId === wardId);

export const getStatusDot = (status) => {
  const map = {
    'Planned': '#94a3b8',
    'Approved': '#3b82f6',
    'In Progress': '#f59e0b',
    'Delayed': '#ef4444',
    'Completed': '#22c55e',
  };
  return map[status] || '#94a3b8';
};
