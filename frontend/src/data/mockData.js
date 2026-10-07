// High-quality waste & environmental sample images
const SAMPLE_IMAGES = {
  plasticDump: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
  streetLitter: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
  riverWaste: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
  constructionDebris: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80',
  overflowingBin: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
  electronicWaste: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
  organicFood: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
}

export const MOCK_USERS = {
  citizen: {
    id: 'usr_c01',
    name: 'Aarav Sharma',
    email: 'citizen@doonclean.ai',
    phone: '+91 98765 43210',
    role: 'citizen',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    address: 'Rajpur Road, Dehradun',
    points: 340,
    level: 'Eco Champion (Level 3)'
  },
  admin: {
    id: 'usr_a01',
    name: 'Priya Negi',
    email: 'admin@doonclean.ai',
    phone: '+91 98111 22334',
    role: 'admin',
    designation: 'Senior Municipal Sanitation Officer',
    department: 'Dehradun Municipal Corporation (NN Doon)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  },
  collector: {
    id: 'usr_t01',
    name: 'Vikram Singh',
    email: 'collector@doonclean.ai',
    phone: '+91 97234 56789',
    role: 'collector',
    teamId: 'team_01',
    teamName: 'Rapid Response Team - Zone 1 (Central)',
    vehicleNumber: 'UK-07-TA-4492',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80'
  }
}

export const MOCK_TEAMS = [
  {
    id: 'team_01',
    name: 'Zone 1 - Central Rapid Sanitation',
    zone: 'Central Dehradun (Clock Tower / Paltan Bazaar)',
    leader: 'Vikram Singh',
    phone: '+91 97234 56789',
    vehicle: 'Electric Tipper UK-07-TA-4492',
    activeTasks: 3,
    status: 'Available',
    capacity: '80%',
    avatar: '🚚'
  },
  {
    id: 'team_02',
    name: 'Zone 2 - North Eco Squad',
    zone: 'North (Rajpur Road / Jakhan)',
    leader: 'Ramesh Rawat',
    phone: '+91 98451 12345',
    vehicle: 'Compactor Truck UK-07-GA-1120',
    activeTasks: 2,
    status: 'In Transit',
    capacity: '60%',
    avatar: '🚛'
  },
  {
    id: 'team_03',
    name: 'Zone 3 - South Heavy Recovery',
    zone: 'South (ISBT / Clement Town / Majra)',
    leader: 'Suresh Chauhan',
    phone: '+91 98334 78901',
    vehicle: 'JCB Backhoe & Dumper UK-07-EA-7801',
    activeTasks: 4,
    status: 'Busy',
    capacity: '95%',
    avatar: '🚜'
  },
  {
    id: 'team_04',
    name: 'Zone 4 - River & Drain Cleaners',
    zone: 'South-East (Rispana & Bindal River Beds)',
    leader: 'Kavita Joshi',
    phone: '+91 98221 44556',
    vehicle: 'Special Eco Cruiser UK-07-ZA-9904',
    activeTasks: 1,
    status: 'Available',
    capacity: '35%',
    avatar: '🚐'
  }
]

export const INITIAL_REPORTS = [
  {
    id: 'DWN-1001',
    title: 'Plastic bottle dump near roadside corner',
    description: 'Heavy single-use plastic bottles, polypacks, and packaging dumped adjacent to the main walkway. Dogs and cattle are tearing through it.',
    imageUrl: SAMPLE_IMAGES.plasticDump,
    wasteType: 'Plastic Waste',
    aiConfidence: 94,
    severity: 'High',
    estimatedQuantity: 'Large (~120 kg)',
    priorityScore: 88,
    status: 'Assigned',
    location: {
      address: 'Near Ghanta Ghar, Rajpur Road Junction, Dehradun',
      landmark: 'Clock Tower North Exit',
      lat: 30.3255,
      lng: 78.0425,
      zone: 'Central'
    },
    citizen: {
      id: 'usr_c01',
      name: 'Aarav Sharma',
      phone: '+91 98765 43210',
      email: 'citizen@doonclean.ai'
    },
    assignedTeam: {
      id: 'team_01',
      name: 'Zone 1 - Central Rapid Sanitation',
      leader: 'Vikram Singh'
    },
    isDuplicate: false,
    duplicateCount: 0,
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    timeline: [
      { status: 'reported', time: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), note: 'Complaint submitted with geolocation and photo by citizen' },
      { status: 'ai_analyzed', time: new Date(Date.now() - 2.9 * 3600 * 1000).toISOString(), note: 'YOLOv8 classified Plastic (94% conf), Severity: High, Priority: 88/100' },
      { status: 'verified', time: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), note: 'Sanitation Officer verified report validity' },
      { status: 'assigned', time: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), note: 'Dispatched to Zone 1 Central Rapid Sanitation (Vikram Singh)' },
    ]
  },
  {
    id: 'DWN-1002',
    title: 'Overflowing public municipal bin with street litter',
    description: 'Primary community dustbin overflowing for over 3 days, spilling organic waste and packaging across pedestrian footpaths.',
    imageUrl: SAMPLE_IMAGES.overflowingBin,
    wasteType: 'Mixed Municipal Solid Waste',
    aiConfidence: 91,
    severity: 'High',
    estimatedQuantity: 'Medium-Large (~200 kg)',
    priorityScore: 82,
    status: 'In Progress',
    location: {
      address: 'Paltan Bazaar Lane 3, near Hanuman Chowk, Dehradun',
      landmark: 'Behind Clock Tower Bazaar',
      lat: 30.3195,
      lng: 78.0388,
      zone: 'Central'
    },
    citizen: {
      id: 'usr_c02',
      name: 'Sunita Rawat',
      phone: '+91 98112 33445',
      email: 'sunita.r@gmail.com'
    },
    assignedTeam: {
      id: 'team_01',
      name: 'Zone 1 - Central Rapid Sanitation',
      leader: 'Vikram Singh'
    },
    isDuplicate: true,
    duplicateCount: 2,
    createdAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    timeline: [
      { status: 'reported', time: new Date(Date.now() - 7 * 3600 * 1000).toISOString(), note: 'Reported by local shopkeeper association member' },
      { status: 'ai_analyzed', time: new Date(Date.now() - 6.9 * 3600 * 1000).toISOString(), note: 'AI detected mixed municipal solid waste with overflowing bin hazard' },
      { status: 'verified', time: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), note: 'Auto-verified with high confidence score' },
      { status: 'assigned', time: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), note: 'Assigned to Zone 1 tipper' },
      { status: 'in_progress', time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), note: 'Collection vehicle arrived at Paltan Bazaar' },
    ]
  },
  {
    id: 'DWN-1003',
    title: 'Illegal construction debris along Rispana river bank',
    description: 'Concrete blocks, plaster sacks, and demolition rubble dumped along Rispana bridge slope, creating risk of blockage during rain.',
    imageUrl: SAMPLE_IMAGES.constructionDebris,
    wasteType: 'Construction Debris (C&D)',
    aiConfidence: 96,
    severity: 'High',
    estimatedQuantity: 'Heavy (~1.5 tons)',
    priorityScore: 92,
    status: 'Verified',
    location: {
      address: 'Rispana Bridge Bank, Haridwar Bypass Road, Dehradun',
      landmark: 'Near Rispana Nagar Culvert',
      lat: 30.2974,
      lng: 78.0542,
      zone: 'South-East'
    },
    citizen: {
      id: 'usr_c01',
      name: 'Aarav Sharma',
      phone: '+91 98765 43210',
      email: 'citizen@doonclean.ai'
    },
    assignedTeam: null,
    isDuplicate: false,
    duplicateCount: 0,
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    timeline: [
      { status: 'reported', time: new Date(Date.now() - 14 * 3600 * 1000).toISOString(), note: 'Reported by citizen Aarav Sharma' },
      { status: 'ai_analyzed', time: new Date(Date.now() - 13.9 * 3600 * 1000).toISOString(), note: 'C&D debris identified. Ecological risk marked critical.' },
      { status: 'verified', time: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), note: 'Verified by Nagar Nigam inspector' },
    ]
  },
  {
    id: 'DWN-1004',
    title: 'Discarded computer monitors and battery casing',
    description: 'Cracked cathode ray tube monitors, power cables, and open battery casings dumped behind a commercial complex.',
    imageUrl: SAMPLE_IMAGES.electronicWaste,
    wasteType: 'E-Waste',
    aiConfidence: 89,
    severity: 'Medium',
    estimatedQuantity: 'Small-Medium (~40 kg)',
    priorityScore: 68,
    status: 'Resolved',
    location: {
      address: 'Behind Pacific Mall, Rajpur Road, Jakhan, Dehradun',
      landmark: 'Opposite Silver City Lane',
      lat: 30.3688,
      lng: 78.0739,
      zone: 'North'
    },
    citizen: {
      id: 'usr_c03',
      name: 'Mohit Bhatia',
      phone: '+91 99988 77665',
      email: 'mohit.bhatia@outlook.com'
    },
    assignedTeam: {
      id: 'team_02',
      name: 'Zone 2 - North Eco Squad',
      leader: 'Ramesh Rawat'
    },
    isDuplicate: false,
    duplicateCount: 0,
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    timeline: [
      { status: 'reported', time: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), note: 'Reported via mobile camera upload' },
      { status: 'ai_analyzed', time: new Date(Date.now() - 47.8 * 3600 * 1000).toISOString(), note: 'Classified E-Waste with hazardous heavy metal warning' },
      { status: 'verified', time: new Date(Date.now() - 40 * 3600 * 1000).toISOString(), note: 'Verified for safe e-waste protocol collection' },
      { status: 'assigned', time: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), note: 'Assigned to North Eco Squad' },
      { status: 'in_progress', time: new Date(Date.now() - 14 * 3600 * 1000).toISOString(), note: 'Team dispatched with protective hazardous collection bin' },
      { status: 'resolved', time: new Date(Date.now() - 10 * 3600 * 1000).toISOString(), note: 'Safely transported to Authorized Recycling Hub, Selaqui' },
    ]
  },
  {
    id: 'DWN-1005',
    title: 'Vegetable market organic waste piled on open ground',
    description: 'Rotting vegetable heaps, sugarcane bagasse, and rotting fruits attracting stray cattle and bad odor.',
    imageUrl: SAMPLE_IMAGES.organicFood,
    wasteType: 'Organic / Food Waste',
    aiConfidence: 95,
    severity: 'Medium',
    estimatedQuantity: 'Medium (~85 kg)',
    priorityScore: 64,
    status: 'Reported',
    location: {
      address: 'Mandi Road, Sahastradhara Crossing, Dehradun',
      landmark: 'Near Kisan Mandi Gate 2',
      lat: 30.3415,
      lng: 78.0768,
      zone: 'East'
    },
    citizen: {
      id: 'usr_c04',
      name: 'Deepak Joshi',
      phone: '+91 97111 55667',
      email: 'deepak.j@gmail.com'
    },
    assignedTeam: null,
    isDuplicate: false,
    duplicateCount: 0,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    timeline: [
      { status: 'reported', time: new Date(Date.now() - 45 * 60 * 1000).toISOString(), note: 'Submitted with GPS coordinates' },
    ]
  },
  {
    id: 'DWN-1006',
    title: 'Plastic carry bags and snack wrappers on drainage grate',
    description: 'Drain inlet completely choked with multi-layered plastic wrappers and bags, causing water stagnation.',
    imageUrl: SAMPLE_IMAGES.streetLitter,
    wasteType: 'Plastic Waste',
    aiConfidence: 92,
    severity: 'High',
    estimatedQuantity: 'Medium (~50 kg)',
    priorityScore: 85,
    status: 'Assigned',
    location: {
      address: 'Saharanpur Road, Near ISBT Flyover, Dehradun',
      landmark: 'Near Transport Nagar Turn',
      lat: 30.2721,
      lng: 78.0012,
      zone: 'South'
    },
    citizen: {
      id: 'usr_c05',
      name: 'Anjali Verma',
      phone: '+91 98989 12345',
      email: 'anjali.verma@yahoo.com'
    },
    assignedTeam: {
      id: 'team_03',
      name: 'Zone 3 - South Heavy Recovery',
      leader: 'Suresh Chauhan'
    },
    isDuplicate: false,
    duplicateCount: 0,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    timeline: [
      { status: 'reported', time: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), note: 'Reported by commuter' },
      { status: 'ai_analyzed', time: new Date(Date.now() - 4.8 * 3600 * 1000).toISOString(), note: 'AI flagged drainage blockage hazard. Priority elevated.' },
      { status: 'verified', time: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), note: 'Verified by Area Supervisor' },
      { status: 'assigned', time: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), note: 'Assigned to South Team' },
    ]
  },
  {
    id: 'DWN-1007',
    title: 'Bindal river channel floating debris and thermocol',
    description: 'Substantial deposit of thermocol packaging and PET bottles caught near culvert pillars in Bindal river bed.',
    imageUrl: SAMPLE_IMAGES.riverWaste,
    wasteType: 'Mixed Municipal Solid Waste',
    aiConfidence: 88,
    severity: 'High',
    estimatedQuantity: 'Heavy (~300 kg)',
    priorityScore: 90,
    status: 'Verified',
    location: {
      address: 'Bindal Bridge, Chakrata Road, Dehradun',
      landmark: 'Near Connaught Place junction',
      lat: 30.3302,
      lng: 78.0298,
      zone: 'Central'
    },
    citizen: {
      id: 'usr_c01',
      name: 'Aarav Sharma',
      phone: '+91 98765 43210',
      email: 'citizen@doonclean.ai'
    },
    assignedTeam: null,
    isDuplicate: false,
    duplicateCount: 0,
    createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    timeline: [
      { status: 'reported', time: new Date(Date.now() - 10 * 3600 * 1000).toISOString(), note: 'Citizen reported stream obstruction' },
      { status: 'ai_analyzed', time: new Date(Date.now() - 9.8 * 3600 * 1000).toISOString(), note: 'Riverbed ecosystem contamination risk calculated' },
      { status: 'verified', time: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), note: 'Confirmed high-priority cleaning action' },
    ]
  },
  {
    id: 'DWN-1008',
    title: 'Plastic cups and wrappers post-event near Parade Ground',
    description: 'Post-fair discarded plastic cups, leaf plates, and paper cartons spread across edge lawn.',
    imageUrl: SAMPLE_IMAGES.streetLitter,
    wasteType: 'Plastic Waste',
    aiConfidence: 93,
    severity: 'Low',
    estimatedQuantity: 'Small (~30 kg)',
    priorityScore: 45,
    status: 'Resolved',
    location: {
      address: 'Parade Ground South Gate, Subhash Road, Dehradun',
      landmark: 'Near Pavilion Ground',
      lat: 30.3228,
      lng: 78.0461,
      zone: 'Central'
    },
    citizen: {
      id: 'usr_c06',
      name: 'Tanvi Rawat',
      phone: '+91 97654 99887',
      email: 'tanvi.r@gmail.com'
    },
    assignedTeam: {
      id: 'team_01',
      name: 'Zone 1 - Central Rapid Sanitation',
      leader: 'Vikram Singh'
    },
    isDuplicate: false,
    duplicateCount: 0,
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    timeline: [
      { status: 'reported', time: new Date(Date.now() - 28 * 3600 * 1000).toISOString(), note: 'Reported after public event' },
      { status: 'ai_analyzed', time: new Date(Date.now() - 27.9 * 3600 * 1000).toISOString(), note: 'Assessed as low danger surface litter' },
      { status: 'verified', time: new Date(Date.now() - 25 * 3600 * 1000).toISOString(), note: 'Verified by zone patrol' },
      { status: 'assigned', time: new Date(Date.now() - 22 * 3600 * 1000).toISOString(), note: 'Assigned to Central sweep team' },
      { status: 'in_progress', time: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), note: 'Sweeping completed' },
      { status: 'resolved', time: new Date(Date.now() - 18 * 3600 * 1000).toISOString(), note: 'Area restored clean' },
    ]
  }
]

// Hotspot cluster demo data around key areas in Dehradun
export const MOCK_HOTSPOTS = [
  {
    id: 'cluster_01',
    name: 'Paltan Bazaar & Clock Tower Corridor',
    center: [30.3222, 78.0405],
    radius: 450, // in meters
    reportCount: 38,
    averagePriority: 86,
    priorityLevel: 'High',
    dominantWaste: 'Plastic Waste',
    cleanFrequency: 'Daily x2',
    zone: 'Central',
    description: 'High pedestrian density and commercial market waste accumulation around evening hours.'
  },
  {
    id: 'cluster_02',
    name: 'Rispana River Bridge & Bypass',
    center: [30.2982, 78.0531],
    radius: 600,
    reportCount: 29,
    averagePriority: 91,
    priorityLevel: 'Critical',
    dominantWaste: 'Construction Debris (C&D)',
    cleanFrequency: 'Daily',
    zone: 'South-East',
    description: 'Chronic illegal tipping zone near river embankments. High environmental and flood hazard.'
  },
  {
    id: 'cluster_03',
    name: 'ISBT & Majra Terminal Surroundings',
    center: [30.2715, 78.0005],
    radius: 500,
    reportCount: 22,
    averagePriority: 78,
    priorityLevel: 'High',
    dominantWaste: 'Mixed Municipal Solid Waste',
    cleanFrequency: 'Daily',
    zone: 'South',
    description: 'High transit passenger litter and commercial food stall wrappers.'
  },
  {
    id: 'cluster_04',
    name: 'Sahastradhara Road Vegetable Mandi',
    center: [30.3421, 78.0772],
    radius: 400,
    reportCount: 16,
    averagePriority: 62,
    priorityLevel: 'Medium',
    dominantWaste: 'Organic / Food Waste',
    cleanFrequency: 'Alternate Days',
    zone: 'East',
    description: 'Perishable organic produce piles and packaging near morning wholesale market.'
  },
  {
    id: 'cluster_05',
    name: 'Prem Nagar University Circle',
    center: [30.3341, 77.9575],
    radius: 550,
    reportCount: 19,
    averagePriority: 70,
    priorityLevel: 'Medium',
    dominantWaste: 'Plastic Waste',
    cleanFrequency: 'Tri-weekly',
    zone: 'West',
    description: 'Student hostel corridor with high food packaging and beverage container litter.'
  }
]

export const MOCK_ANALYTICS = {
  summary: {
    totalReports: 142,
    pendingReports: 28,
    highPriority: 36,
    resolved: 114,
    resolutionRate: '80.3%',
    avgResolutionHours: 4.8,
    activeHotspots: 5,
    collectionEfficiency: '92.4%'
  },
  reportsOverTime: [
    { date: 'Mon', reports: 18, resolved: 15 },
    { date: 'Tue', reports: 22, resolved: 19 },
    { date: 'Wed', reports: 16, resolved: 14 },
    { date: 'Thu', reports: 27, resolved: 21 },
    { date: 'Fri', reports: 24, resolved: 20 },
    { date: 'Sat', reports: 19, resolved: 17 },
    { date: 'Sun', reports: 16, resolved: 8 }
  ],
  wasteDistribution: [
    { name: 'Plastic', count: 58, percentage: 41, fill: '#3b82f6' },
    { name: 'Mixed Municipal', count: 34, percentage: 24, fill: '#10b981' },
    { name: 'Organic / Food', count: 24, percentage: 17, fill: '#f59e0b' },
    { name: 'Construction (C&D)', count: 16, percentage: 11, fill: '#78716c' },
    { name: 'E-Waste', count: 10, percentage: 7, fill: '#8b5cf6' }
  ],
  statusDistribution: [
    { name: 'Reported', count: 8, fill: '#94a3b8' },
    { name: 'AI Analyzed', count: 6, fill: '#6366f1' },
    { name: 'Verified', count: 5, fill: '#3b82f6' },
    { name: 'Assigned', count: 9, fill: '#f59e0b' },
    { name: 'In Progress', count: 7, fill: '#06b6d4' },
    { name: 'Resolved', count: 107, fill: '#10b981' }
  ],
  priorityDistribution: [
    { name: 'High Priority', count: 36, fill: '#ef4444' },
    { name: 'Medium Priority', count: 68, fill: '#f59e0b' },
    { name: 'Low Priority', count: 38, fill: '#10b981' }
  ],
  zoneBreakdown: [
    { zone: 'Central (Clock Tower / Paltan)', reports: 46, resolved: 39, rate: '85%' },
    { zone: 'South-East (Rispana / Bypass)', reports: 34, resolved: 24, rate: '71%' },
    { zone: 'South (ISBT / Majra)', reports: 26, resolved: 22, rate: '85%' },
    { zone: 'North (Rajpur Road / Jakhan)', reports: 20, resolved: 18, rate: '90%' },
    { zone: 'West (Prem Nagar / Chakrata)', reports: 16, resolved: 11, rate: '69%' }
  ]
}

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'High Priority Waste Flagged',
    message: 'Report DWN-1003 in Rispana Nagar has severity high (Score: 92). Immediate action advised.',
    time: '15m ago',
    type: 'alert',
    read: false
  },
  {
    id: 'notif_2',
    title: 'Pickup Completed',
    message: 'Team Zone 1 marked task DWN-1008 (Parade Ground) as resolved.',
    time: '1h ago',
    type: 'success',
    read: true
  },
  {
    id: 'notif_3',
    title: 'Hotspot Area Alert',
    message: 'Paltan Bazaar cluster exceeded 35 reports this week.',
    time: '3h ago',
    type: 'warning',
    read: true
  }
]
