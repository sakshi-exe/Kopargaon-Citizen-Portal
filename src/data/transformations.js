// Real Infrastructure Transformation Showcase (BEFORE → AFTER)
// Grounded in Kopargaon municipal infrastructure reality

export const transformations = [
  {
    id: 'TRANS-01',
    category: 'Road Improvement',
    assetId: 'ROAD-KPG-1028',
    title: 'Main Road Improvement — Kopargaon',
    location: 'Kopargaon, Maharashtra',
    wardId: 'W1',
    projectRef: 'PROJECT-KPG-2026-01',
    workType: 'Road Resurfacing & Improvement',
    budget: '₹2.45 Cr',
    contractor: 'Sahyadri Infrastructure & Highway Developers',
    startDate: '12 June 2026',
    completedDate: '15 Aug 2026',
    progress: 100,
    status: 'COMPLETED',
    verifiedBy: 'Er. Sandeep Patil (Field Inspection Team)',

    story:
      'Original poor road condition on Kopargaon Main Road had multiple potholes, standing waterlogging, uneven asphalt surface, and safety risks. Kopargaon Fix tracked 23 citizen complaints and executed high-grade bituminous macadam resurfacing with thermoplastic lane markings and improved storm runoff drainage.',

    before: {
      image: '/before-road.jpg',
      label: 'BEFORE OUR PROJECT',
      caption:
        'Original poor road condition with severe potholes, waterlogging, damaged asphalt, and uneven surface prior to intervention.',
      condition: 'Poor Condition',
      conditionScore: 2.8,
      potholes: 18,
      citizenReports: 23,
      issues: 'Potholes • Waterlogging • Uneven Surface',
      riskLevel: 'High (Accident Hazard)',
      status: 'Poor Condition',
    },

    after: {
      image: '/after-road.jpg',
      label: 'AFTER OUR PROJECT',
      caption:
        'Completed road improvement with new smooth asphalt surface, crisp thermoplastic lane markings, improved drainage, and safer traffic flow.',
      condition: 'Improved Condition',
      conditionScore: 9.6,
      potholes: 0,
      inspection: 'Verified Project Evidence',
      status: 'Improved Condition',

      improvements: [
        'New Road Surface',
        'Smooth Pavement',
        'Proper Road Markings',
        'Improved Drainage',
        'Safer for Traffic',
      ],
    },

    metrics: [
      {
        label: 'Travel Time Reduction',
        before: '18 mins',
        after: '6 mins (-66%)',
      },
      {
        label: 'Pothole Remediation',
        before: '18 major craters',
        after: '0 (100% repaired)',
      },
      {
        label: 'Citizen Satisfaction',
        before: '14% approval',
        after: '96% positive',
      },
      {
        label: 'Drainage & Surface Quality',
        before: 'Waterlogged & Rutted',
        after: 'Optimal Runoff & Level',
      },
    ],
  },

  {
    id: 'TRANS-02',
    category: 'Water & Drainage',
    assetId: 'DRAIN-KPG-0138',
    title: 'Godavari Riverfront Storm Water Drainage & Silt Remediation',
    location: 'Ward 4 — Godavari Ghat & Riverfront Sector',
    wardId: 'W4',
    projectRef: 'PROJECT-KPG-2026-04',
    budget: '₹1.80 Cr',
    contractor: 'Kopargaon Jal Kalyan Projects Ltd.',
    completedDate: '28 Jul 2026',
    verifiedBy: 'Shri V. R. Deshmukh (Chief Sanitation Officer)',

    story:
      'Silt deposits and debris blockages in the primary drainage canal caused annual flooding during Godavari surge periods. CivicFix mapped flood prone zones and executed an engineered RCC box drain with automated desilting screens.',

    before: {
      image:
        'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1000&q=80',
      caption:
        'Blocked earthen channel with silt accumulation and standing stagnant water (May 2026)',
      condition: 'Critical',
      conditionScore: 2.1,
      waterloggingHours: '72 hrs post-rain',
      citizenReports: 31,
      riskLevel: 'Severe (Vector Disease Risk)',
      status: 'Flooding Hazard',
    },

    after: {
      image:
        'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1000&q=80',
      caption:
        'Covered RCC twin-cell stormwater channel with high-velocity discharge into Godavari (July 2026)',
      condition: 'Excellent',
      conditionScore: 9.4,
      waterloggingHours: '< 15 mins',
      inspection: 'Hydraulic Tested & Approved',
      status: 'Commissioned',
    },

    metrics: [
      {
        label: 'Discharge Capacity',
        before: '420 LPS',
        after: '1,850 LPS (+340%)',
      },
      {
        label: 'Waterlogging Inundation',
        before: 'Up to 3 feet',
        after: 'Zero street standing water',
      },
      {
        label: 'Affected Households',
        before: '420 families at risk',
        after: 'Protected',
      },
      {
        label: 'Vector Complaints',
        before: '31 in monsoon',
        after: '0 active complaints',
      },
    ],
  },

  {
    id: 'TRANS-03',
    category: 'Street Lighting & Public Safety',
    assetId: 'LIGHT-KPG-0451',
    title: 'Sai Nagar Link Road Smart LED Solar-Hybrid Lighting Grid',
    location: 'Ward 7 — Sai Nagar Shirdi Link Corridor',
    wardId: 'W7',
    projectRef: 'PROJECT-KPG-2026-07',
    budget: '₹85 Lakhs',
    contractor: 'Mahalaxmi Electricals & Smart Grids',
    completedDate: '04 Aug 2026',
    verifiedBy: 'Smt. Anjali Kulkarni (Municipal Electrical Inspector)',

    story:
      'Dilapidated 70W sodium vapour lamps had an 82% failure rate along the pilgrim route from Kopargaon Station toward Sai Nagar, leading to pedestrian accidents and safety alerts. Upgraded to 90W centralized telemetry LED fixtures with automated lux sensing.',

    before: {
      image:
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
      caption:
        'Dark highway stretch with non-operational lighting poles and zero night visibility (June 2026)',
      condition: 'Poor',
      conditionScore: 3.0,
      luxLevel: '1.8 Lux (Hazardous)',
      citizenReports: 27,
      riskLevel: 'High (Night Safety)',
      status: 'Safety Alert Active',
    },

    after: {
      image:
        'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80',
      caption:
        'Full 3.2km corridor illuminated with energy-efficient 5500K LED luminaires with 99.8% uptime (August 2026)',
      condition: 'Excellent',
      conditionScore: 9.6,
      luxLevel: '28.5 Lux (Standard Compliant)',
      inspection: 'Illuminance Audit Passed',
      status: 'Live & Monitored',
    },

    metrics: [
      {
        label: 'Operational Uptime',
        before: '18% working poles',
        after: '99.8% continuous uptime',
      },
      {
        label: 'Energy Consumption',
        before: '14.2 kWh/day',
        after: '5.8 kWh/day (-59%)',
      },
      {
        label: 'Average Road Illuminance',
        before: '1.8 Lux',
        after: '28.5 Lux',
      },
      {
        label: 'Night Incident Reports',
        before: '9 per month',
        after: '0 in last 45 days',
      },
    ],
  },

  {
    id: 'TRANS-04',
    category: 'Water Supply Infrastructure',
    assetId: 'WATER-KPG-0217',
    title: 'Bet Kopargaon Overhead Reservoir & Booster Pumping Station',
    location: 'Ward 5 — Bet Kopargaon Elevated Zone',
    wardId: 'W5',
    projectRef: 'PROJECT-KPG-2026-05',
    budget: '₹3.10 Cr',
    contractor: 'Godavari Water Works & Urban Infra',
    completedDate: '12 Jul 2026',
    verifiedBy: 'Er. R. S. Shinde (Hydraulic Engineer, KMC)',

    story:
      'Bet Kopargaon faced acute water pressure drops and pipe leakage across older AC pipelines. Replaced 4.8 km distribution pipelines with ductile iron pipes and commissioned a 10-lakh litre elevated reservoir connected to the Godavari intake station.',

    before: {
      image:
        'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1000&q=80',
      caption:
        'Leaking distribution valve and inadequate low-pressure tanker dependence (April 2026)',
      condition: 'Poor',
      conditionScore: 3.2,
      supplyDuration: '45 mins alternate day',
      citizenReports: 42,
      riskLevel: 'High (Water Scarcity)',
      status: 'Low Pressure Zone',
    },

    after: {
      image:
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      caption:
        'New 1.0 MLD elevated water reservoir with SCADA pressure monitoring (July 2026)',
      condition: 'Good',
      conditionScore: 9.1,
      supplyDuration: '3.5 hours daily pressurized',
      inspection: 'Water Quality & Pressure Certified',
      status: 'Commissioned',
    },

    metrics: [
      {
        label: 'Daily Water Supply',
        before: '45 mins alternate day',
        after: '3.5 hours daily morning/evening',
      },
      {
        label: 'Household Coverage',
        before: '1,200 connections',
        after: '3,850 connections (+220%)',
      },
      {
        label: 'Non-Revenue Water (Leaks)',
        before: '38% loss',
        after: '8% loss (SCADA tracked)',
      },
      {
        label: 'Citizen Tanker Requests',
        before: '18 daily trips',
        after: '0 regular tanker requirement',
      },
    ],
  },

  {
    id: 'TRANS-05',
    category: 'Waste Management & Public Sanitation',
    assetId: 'WASTE-KPG-0190',
    title: 'Market Yard (APMC) Clean Civic Waste Transfer Station',
    location: 'Ward 9 — APMC Market Yard Complex',
    wardId: 'W9',
    projectRef: 'PROJECT-KPG-2026-09',
    budget: '₹95 Lakhs',
    contractor: 'Nirmal Urban Cleanliness Solutions',
    completedDate: '22 Aug 2026',
    verifiedBy: 'Dr. Suresh Gaikwad (Sanitary Inspector)',

    story:
      'Open garbage accumulation near the busy onion and grain trading market was generating foul odor, rodent issues, and health hazards. Built an enclosed compactor-based solid waste transfer facility with wet/dry automated segregation.',

    before: {
      image:
        'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1000&q=80',
      caption:
        'Open dump point with overflow waste and stray animal infestation (May 2026)',
      condition: 'Critical',
      conditionScore: 1.8,
      unsegregatedDump: '12.5 tonnes open',
      citizenReports: 38,
      riskLevel: 'Critical Health Hazard',
      status: 'Open Blackspot',
    },

    after: {
      image:
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1000&q=80',
      caption:
        'Enclosed semi-automated waste transfer station with bio-sanitization spray (August 2026)',
      condition: 'Excellent',
      conditionScore: 9.3,
      unsegregatedDump: '0 (100% daily evacuated)',
      inspection: 'ISO 14001 Sanitation Verified',
      status: 'Certified Zero-Blackspot',
    },

    metrics: [
      {
        label: 'Daily Processing Volume',
        before: 'Uncontrolled open dump',
        after: '14 metric tonnes/day compressed',
      },
      {
        label: 'Segregation at Source',
        before: '12%',
        after: '88% segregated waste',
      },
      {
        label: 'Blackspot Clearance',
        before: '1,400 sq.m blighted area',
        after: 'Clean sanitized paved zone',
      },
      {
        label: 'Merchant & Public Rating',
        before: '1.2 / 5.0 stars',
        after: '4.8 / 5.0 stars',
      },
    ],
  },

  {
    id: 'TRANS-06',
    category: 'Public Health Infrastructure',
    assetId: 'HOSP-KPG-0512',
    title: 'Kopargaon Sub-District Hospital OPD & Emergency Diagnostic Wing',
    location: 'Ward 1 — Station Road & Municipal Complex',
    wardId: 'W1',
    projectRef: 'PROJECT-KPG-2026-02',
    budget: '₹4.20 Cr',
    contractor: 'Dhanvantari Healthcare Builders & Engineers',
    completedDate: '10 Aug 2026',
    verifiedBy: 'Dr. Meena Tambe (Civil Surgeon, Ahmednagar Dist.)',

    story:
      'Outdated OPD facilities with leaking roofs and insufficient triage capacity forced local citizens to travel 60 km to Ahmednagar for basic diagnostic scans. CivicFix prioritized the modernization of the 100-bed hospital emergency ward with digital X-Ray and pathology labs.',

    before: {
      image:
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
      caption:
        'Crowded, dilapidated diagnostic room with damaged flooring and outdated equipment (March 2026)',
      condition: 'Poor',
      conditionScore: 3.5,
      dailyOPDCapacity: '180 patients max',
      citizenReports: 19,
      riskLevel: 'Moderate to High',
      status: 'Structural Renovation Due',
    },

    after: {
      image:
        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=80',
      caption:
        'Modern ISO-grade municipal diagnostic center with central AC, digital queue tokens, and 24x7 trauma care (August 2026)',
      condition: 'Good',
      conditionScore: 9.5,
      dailyOPDCapacity: '650 patients daily',
      inspection: 'NABH Healthcare Standards Passed',
      status: 'Fully Operational',
    },

    metrics: [
      {
        label: 'Daily Patient Handling',
        before: '180 patients/day',
        after: '650+ patients/day (+260%)',
      },
      {
        label: 'Average Triage Wait Time',
        before: '115 minutes',
        after: '18 minutes',
      },
      {
        label: 'Diagnostic Turnaround',
        before: '3 - 5 days referral',
        after: 'Same-day digital reports',
      },
      {
        label: 'Emergency Trauma Beds',
        before: '4 beds',
        after: '18 ICU-equipped beds',
      },
    ],
  },
];