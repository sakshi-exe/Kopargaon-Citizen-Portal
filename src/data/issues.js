// Citizen Reports & Complaints — Kopargaon Municipal Council (CivicFix Platform)
// Complaint IDs: CF-KPG-XXXX
// Flow: Reported → Under Review → Assigned → In Progress → Resolved → Verified

export const ISSUE_CATEGORIES = [
  'Road Damage', 'Pothole', 'Street Light', 'Water Problem',
  'Drainage', 'Garbage', 'Public Infrastructure', 'Traffic', 'Park', 'Other'
];

export const ISSUE_STATUSES = [
  'Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Verified'
];

export const STATUS_FLOW = {
  'Reported': {
    next: 'Under Review',
    color: '#ef4444',
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    desc: 'Complaint submitted by citizen and queued for initial verification by ward officer.'
  },
  'Under Review': {
    next: 'Assigned',
    color: '#f97316',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-300',
    desc: 'Ward municipal inspector validating geo-location and severity on GIS system.'
  },
  'Assigned': {
    next: 'In Progress',
    color: '#f59e0b',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
    desc: 'Work order allocated to specialized maintenance contractor / departmental squad.'
  },
  'In Progress': {
    next: 'Resolved',
    color: '#3b82f6',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    desc: 'Physical repair or maintenance work actively executing on-site.'
  },
  'Resolved': {
    next: 'Verified',
    color: '#10b981',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    desc: 'Contractor marked repair as completed; awaiting field verification.'
  },
  'Verified': {
    next: null,
    color: '#22c55e',
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    desc: 'CivicFix field inspector verified photographic evidence and closed the ticket.'
  }
};

let nextIssueNum = 1045;
export function generateIssueId() {
  const id = `CF-KPG-${nextIssueNum}`;
  nextIssueNum++;
  return id;
}

export const issues = [
  // ── Ward 12: Subhash Nagar (High Concentration of complaints) ───────────────
  {
    id: 'CF-KPG-1001',
    category: 'Pothole',
    wardId: 'W12',
    description: 'Cluster of 8 deep potholes right near Subhash Nagar Primary School gate. Hazardous for children and two-wheelers during evening.',
    status: 'Reported',
    lat: 19.8850, lng: 74.4985,
    submittedDate: '2026-08-22',
    updatedDate: '2026-08-22',
    citizenName: 'Mahesh Kulkarni',
    isAnonymous: false,
    linkedAssetId: 'ROAD-KPG-1120'
  },
  {
    id: 'CF-KPG-1002',
    category: 'Drainage',
    wardId: 'W12',
    description: 'Secondary storm drain choked with plastic waste near Sai Baba temple lane in Subhash Nagar. Dirty water overflowing onto road.',
    status: 'Under Review',
    lat: 19.8842, lng: 74.4990,
    submittedDate: '2026-08-21',
    updatedDate: '2026-08-22',
    citizenName: 'Sunita Gaikwad',
    isAnonymous: false,
    linkedAssetId: 'DRAIN-KPG-0155'
  },
  {
    id: 'CF-KPG-1003',
    category: 'Street Light',
    wardId: 'W12',
    description: 'Four consecutive streetlights on Subhash Nagar East Main Lane are completely dead for the past 2 weeks.',
    status: 'Assigned',
    lat: 19.8858, lng: 74.4978,
    submittedDate: '2026-08-19',
    updatedDate: '2026-08-21',
    citizenName: 'Rahul Jadhav',
    isAnonymous: false,
    linkedAssetId: 'LIGHT-KPG-0465'
  },
  {
    id: 'CF-KPG-1004',
    category: 'Road Damage',
    wardId: 'W12',
    description: 'Major asphalt subsidence and trench left open after private water connection work on Kopargaon East link road.',
    status: 'In Progress',
    lat: 19.8838, lng: 74.4982,
    submittedDate: '2026-08-15',
    updatedDate: '2026-08-23',
    citizenName: 'Anonymous Citizen',
    isAnonymous: true,
    linkedAssetId: 'ROAD-KPG-1120'
  },
  {
    id: 'CF-KPG-1005',
    category: 'Water Problem',
    wardId: 'W12',
    description: 'Very low water pressure during morning municipal supply in Subhash Nagar Sector 3.',
    status: 'Under Review',
    lat: 19.8835, lng: 74.4980,
    submittedDate: '2026-08-20',
    updatedDate: '2026-08-21',
    citizenName: 'Pravin Deshmukh',
    isAnonymous: false,
    linkedAssetId: 'WATER-KPG-0245'
  },

  // ── Ward 1: Shivaji Chowk & Central Market ────────────────────────────────────
  {
    id: 'CF-KPG-1006',
    category: 'Pothole',
    wardId: 'W1',
    description: 'Road edge cratering near Shivaji Chowk junction causing traffic jam near vegetable market.',
    status: 'In Progress',
    lat: 19.8918, lng: 74.4792,
    submittedDate: '2026-08-14',
    updatedDate: '2026-08-22',
    citizenName: 'Vikas Shinde',
    isAnonymous: false,
    linkedAssetId: 'ROAD-KPG-1028'
  },
  {
    id: 'CF-KPG-1007',
    category: 'Garbage',
    wardId: 'W1',
    description: 'Commercial waste dumped on sidewalk near Municipal library corner.',
    status: 'Resolved',
    lat: 19.8910, lng: 74.4785,
    submittedDate: '2026-08-17',
    updatedDate: '2026-08-20',
    citizenName: 'Kishor Tambe',
    isAnonymous: false
  },
  {
    id: 'CF-KPG-1008',
    category: 'Public Infrastructure',
    wardId: 'W1',
    description: 'Broken handrail on the pedestrian steps leading to Municipal Council citizen facilitation center.',
    status: 'Verified',
    lat: 19.8914, lng: 74.4780,
    submittedDate: '2026-08-08',
    updatedDate: '2026-08-16',
    citizenName: 'Sanjay Patil',
    isAnonymous: false,
    linkedAssetId: 'BLDG-KPG-0312'
  },

  // ── Ward 2: Railway Station Road ──────────────────────────────────────────────
  {
    id: 'CF-KPG-1009',
    category: 'Street Light',
    wardId: 'W2',
    description: 'Flickering streetlights creating dark spots on Station Road near auto stand; unsafe for night train passengers.',
    status: 'Assigned',
    lat: 19.9020, lng: 74.4838,
    submittedDate: '2026-08-18',
    updatedDate: '2026-08-21',
    citizenName: 'Amit Salunkhe',
    isAnonymous: false,
    linkedAssetId: 'LIGHT-KPG-0412'
  },
  {
    id: 'CF-KPG-1010',
    category: 'Road Damage',
    wardId: 'W2',
    description: 'Broken paver blocks on pedestrian footpath leading from Railway station to main road.',
    status: 'Reported',
    lat: 19.9028, lng: 74.4842,
    submittedDate: '2026-08-23',
    updatedDate: '2026-08-23',
    citizenName: 'Rajesh Gorde',
    isAnonymous: false,
    linkedAssetId: 'ROAD-KPG-1044'
  },

  // ── Ward 3: Samata Nagar ──────────────────────────────────────────────────────
  {
    id: 'CF-KPG-1011',
    category: 'Drainage',
    wardId: 'W3',
    description: 'Open gutter near Somaiya college campus overflowed during yesterday’s rain, spreading mud across the road.',
    status: 'Under Review',
    lat: 19.8852, lng: 74.4895,
    submittedDate: '2026-08-21',
    updatedDate: '2026-08-22',
    citizenName: 'Pooja Borse',
    isAnonymous: false,
    linkedAssetId: 'DRAIN-KPG-0122'
  },
  {
    id: 'CF-KPG-1012',
    category: 'Pothole',
    wardId: 'W3',
    description: 'Multiple potholes near Samata Nagar garden gate causing skidding of two-wheelers.',
    status: 'Reported',
    lat: 19.8868, lng: 74.4888,
    submittedDate: '2026-08-23',
    updatedDate: '2026-08-23',
    citizenName: 'Ganesh More',
    isAnonymous: false,
    linkedAssetId: 'ROAD-KPG-1052'
  },

  // ── Ward 4: Godavari Riverfront & Ghat Area ──────────────────────────────────
  {
    id: 'CF-KPG-1013',
    category: 'Public Infrastructure',
    wardId: 'W4',
    description: 'Stone masonry railing damaged near Godavari Ghat entrance steps; safety hazard for pilgrims.',
    status: 'In Progress',
    lat: 19.8975, lng: 74.4730,
    submittedDate: '2026-08-16',
    updatedDate: '2026-08-22',
    citizenName: 'Deepak Kale',
    isAnonymous: false,
    linkedAssetId: 'BRIDGE-KPG-0105'
  },
  {
    id: 'CF-KPG-1014',
    category: 'Drainage',
    wardId: 'W4',
    description: 'Secondary drainage desilting check completed near river outfall.',
    status: 'Verified',
    lat: 19.8968, lng: 74.4740,
    submittedDate: '2026-07-25',
    updatedDate: '2026-08-15',
    citizenName: 'Nitin Pawar',
    isAnonymous: false,
    linkedAssetId: 'DRAIN-KPG-0138'
  },

  // ── Ward 5: Bet Kopargaon ────────────────────────────────────────────────────
  {
    id: 'CF-KPG-1015',
    category: 'Road Damage',
    wardId: 'W5',
    description: 'Severe erosion on Bet Kopargaon hill link slope; gravel scattered across 200 meters.',
    status: 'Reported',
    lat: 19.8975, lng: 74.4650,
    submittedDate: '2026-08-22',
    updatedDate: '2026-08-22',
    citizenName: 'Santosh Chavan',
    isAnonymous: false,
    linkedAssetId: 'ROAD-KPG-1065'
  },
  {
    id: 'CF-KPG-1016',
    category: 'Water Problem',
    wardId: 'W5',
    description: 'Pipeline pressure test verified in elevated ESR zone; continuous water flow restored.',
    status: 'Verified',
    lat: 19.8995, lng: 74.4678,
    submittedDate: '2026-07-10',
    updatedDate: '2026-08-14',
    citizenName: 'Suresh Patil',
    isAnonymous: false,
    linkedAssetId: 'WATER-KPG-0217'
  },

  // ── Ward 6: Yeola Naka ────────────────────────────────────────────────────────
  {
    id: 'CF-KPG-1017',
    category: 'Traffic',
    wardId: 'W6',
    description: 'Illegal parking of heavy sugarcane trucks blocking Yeola Naka highway intersection curve.',
    status: 'In Progress',
    lat: 19.8822, lng: 74.4712,
    submittedDate: '2026-08-19',
    updatedDate: '2026-08-23',
    citizenName: 'Balasaheb Jagtap',
    isAnonymous: false,
    linkedAssetId: 'ROAD-KPG-1070'
  },

  // ── Ward 7: Sai Nagar ────────────────────────────────────────────────────────
  {
    id: 'CF-KPG-1018',
    category: 'Street Light',
    wardId: 'W7',
    description: 'Smart LED solar grid working smoothly on Sai Nagar link road with zero failures.',
    status: 'Verified',
    lat: 19.8785, lng: 74.4825,
    submittedDate: '2026-08-05',
    updatedDate: '2026-08-20',
    citizenName: 'Rameshwar Shinde',
    isAnonymous: false,
    linkedAssetId: 'LIGHT-KPG-0451'
  },

  // ── Ward 8: Tilak Nagar ──────────────────────────────────────────────────────
  {
    id: 'CF-KPG-1019',
    category: 'Road Damage',
    wardId: 'W8',
    description: 'Sunken paver blocks in Tilak Nagar old bazaar lane near cloth market.',
    status: 'Assigned',
    lat: 19.8942, lng: 74.4870,
    submittedDate: '2026-08-18',
    updatedDate: '2026-08-21',
    citizenName: 'Ashok Bagmar',
    isAnonymous: false,
    linkedAssetId: 'ROAD-KPG-1090'
  },

  // ── Ward 9: APMC Market Yard ─────────────────────────────────────────────────
  {
    id: 'CF-KPG-1020',
    category: 'Garbage',
    wardId: 'W9',
    description: 'Compactor transfer station operational; zero open blackspot reported in market yard.',
    status: 'Verified',
    lat: 19.8895, lng: 74.4955,
    submittedDate: '2026-08-20',
    updatedDate: '2026-08-23',
    citizenName: 'Babasaheb Kolpe',
    isAnonymous: false,
    linkedAssetId: 'WASTE-KPG-0190'
  },

  // ── Ward 11: MIDC ────────────────────────────────────────────────────────────
  {
    id: 'CF-KPG-1021',
    category: 'Drainage',
    wardId: 'W11',
    description: 'Industrial stormwater drain stagnation near MIDC Plot B-12.',
    status: 'Under Review',
    lat: 19.8725, lng: 74.4925,
    submittedDate: '2026-08-22',
    updatedDate: '2026-08-23',
    citizenName: 'Nilesh Varma',
    isAnonymous: false,
    linkedAssetId: 'DRAIN-KPG-0145'
  },
  {
    id: 'CF-KPG-1022',
    category: 'Pothole',
    wardId: 'W11',
    description: 'Deep road potholes on MIDC heavy truck access road.',
    status: 'Reported',
    lat: 19.8710, lng: 74.4910,
    submittedDate: '2026-08-23',
    updatedDate: '2026-08-23',
    citizenName: 'Santosh Thorat',
    isAnonymous: false,
    linkedAssetId: 'ROAD-KPG-1110'
  }
];

export const getIssuesByWard = (wardId) => issues.filter(i => i.wardId === wardId);
export const getIssueById = (id) => issues.find(i => i.id === id);
export const getStatusStyle = (status) => STATUS_FLOW[status] || STATUS_FLOW['Reported'];
