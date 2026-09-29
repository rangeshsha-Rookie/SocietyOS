import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DAY_MS = 24 * 60 * 60 * 1000;
const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * DAY_MS);

async function main() {
  console.log('🌱 Starting SocietyOS Database Seeding...');

  // Clean existing tables in reverse dependency order
  await prisma.resolution.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.resident.deleteMany();

  console.log('🧹 Cleaned existing tables.');

  // 1. Seed 10 Vendors
  const vendorData = [
    { name: 'AquaFlow Services', serviceType: 'Plumbing & Water Systems' },
    { name: 'Apex Elevators Ltd', serviceType: 'Elevator Maintenance' },
    { name: 'VoltGuard Electricals', serviceType: 'Electrical Infrastructure' },
    { name: 'CleanSpace Facility', serviceType: 'Housekeeping & Waste Management' },
    { name: 'ShieldSec Security Systems', serviceType: 'Security & Surveillance' },
    { name: 'GreenThumb Landscaping', serviceType: 'Gardening & Horticulture' },
    { name: 'FireSafe India Corp', serviceType: 'Fire Safety & Hydrants' },
    { name: 'PureWater RO Filters', serviceType: 'Water Treatment & Filtration' },
    { name: 'CivicPave Contractors', serviceType: 'Civil Works & Waterproofing' },
    { name: 'SunPower Solar Systems', serviceType: 'Solar Water Heaters' },
  ];

  const vendors = [];
  for (const v of vendorData) {
    const created = await prisma.vendor.create({ data: v });
    vendors.push(created);
  }
  console.log(`✅ Seeded ${vendors.length} Vendors.`);

  const aquaVendor = vendors[0];
  const apexVendor = vendors[1];
  const voltVendor = vendors[2];

  // 2. Seed 30 Residents
  const residentNames = [
    { name: 'Aarav Sharma', wing: 'B', flatNumber: 'B-402', phone: '9876543210' },
    { name: 'Priya Patel', wing: 'B', flatNumber: 'B-301', phone: '9876543211' },
    { name: 'Rohan Mehta', wing: 'B', flatNumber: 'B-504', phone: '9876543212' },
    { name: 'Sneha Deshmukh', wing: 'B', flatNumber: 'B-602', phone: '9876543213' },
    { name: 'Vikram Joshi', wing: 'B', flatNumber: 'B-203', phone: '9876543214' },
    { name: 'Ananya Iyer', wing: 'B', flatNumber: 'B-701', phone: '9876543215' },
    { name: 'Karan Malhotra', wing: 'B', flatNumber: 'B-102', phone: '9876543216' },
    { name: 'Neha Kulkarni', wing: 'B', flatNumber: 'B-405', phone: '9876543217' },
    // Wing A
    { name: 'Rahul Varma', wing: 'A', flatNumber: 'A-101', phone: '9820000001' },
    { name: 'Sunita Rao', wing: 'A', flatNumber: 'A-202', phone: '9820000002' },
    { name: 'Amitabh Sen', wing: 'A', flatNumber: 'A-303', phone: '9820000003' },
    { name: 'Deepa Shah', wing: 'A', flatNumber: 'A-404', phone: '9820000004' },
    { name: 'Gaurav Bhatia', wing: 'A', flatNumber: 'A-501', phone: '9820000005' },
    { name: 'Meera Nair', wing: 'A', flatNumber: 'A-602', phone: '9820000006' },
    { name: 'Kunal Kapoor', wing: 'A', flatNumber: 'A-703', phone: '9820000007' },
    // Wing C
    { name: 'Manish Tiwari', wing: 'C', flatNumber: 'C-101', phone: '9830000001' },
    { name: 'Pooja Hegde', wing: 'C', flatNumber: 'C-202', phone: '9830000002' },
    { name: 'Aditya Roy', wing: 'C', flatNumber: 'C-303', phone: '9830000003' },
    { name: 'Swati Jain', wing: 'C', flatNumber: 'C-404', phone: '9830000004' },
    { name: 'Rajesh Khanna', wing: 'C', flatNumber: 'C-501', phone: '9830000005' },
    { name: 'Divya Pillai', wing: 'C', flatNumber: 'C-602', phone: '9830000006' },
    { name: 'Siddharth Bose', wing: 'C', flatNumber: 'C-703', phone: '9830000007' },
    // Wing D
    { name: 'Varun Dhawan', wing: 'D', flatNumber: 'D-101', phone: '9840000001' },
    { name: 'Kavita Menon', wing: 'D', flatNumber: 'D-202', phone: '9840000002' },
    { name: 'Abhishek Das', wing: 'D', flatNumber: 'D-303', phone: '9840000003' },
    { name: 'Shreya Ghoshal', wing: 'D', flatNumber: 'D-404', phone: '9840000004' },
    { name: 'Tarun Saxena', wing: 'D', flatNumber: 'D-501', phone: '9840000005' },
    { name: 'Ritu Agarwal', wing: 'D', flatNumber: 'D-602', phone: '9840000006' },
    { name: 'Nikhil Kamath', wing: 'D', flatNumber: 'D-703', phone: '9840000007' },
    { name: 'Tanvi Bansal', wing: 'D', flatNumber: 'D-801', phone: '9840000008' },
  ];

  const residents = [];
  for (const r of residentNames) {
    const created = await prisma.resident.create({ data: r });
    residents.push(created);
  }
  console.log(`✅ Seeded ${residents.length} Residents.`);

  // 3. Seed 15 Assets
  const assetData = [
    { name: 'B-Wing Water Pump (B-WP-01)', type: 'Water Pump', location: 'B-Wing Basement Pump Room', vendorId: aquaVendor.id },
    { name: 'A-Wing Water Pump (A-WP-01)', type: 'Water Pump', location: 'A-Wing Basement Pump Room', vendorId: aquaVendor.id },
    { name: 'C-Wing Water Pump (C-WP-01)', type: 'Water Pump', location: 'C-Wing Basement Pump Room', vendorId: aquaVendor.id },
    { name: 'B-Wing Passenger Lift 1', type: 'Elevator', location: 'B-Wing', vendorId: apexVendor.id },
    { name: 'B-Wing Service Lift', type: 'Elevator', location: 'B-Wing', vendorId: apexVendor.id },
    { name: 'A-Wing Passenger Lift', type: 'Elevator', location: 'A-Wing', vendorId: apexVendor.id },
    { name: 'Main Diesel Generator (GEN-01)', type: 'Generator', location: 'Utility Yard', vendorId: voltVendor.id },
    { name: 'Sewage Treatment Plant (STP-01)', type: 'STP', location: 'Basement 2', vendorId: aquaVendor.id },
    { name: 'B-Wing Lobby CCTV System', type: 'Security Surveillance', location: 'B-Wing Lobby', vendorId: vendors[4].id },
    { name: 'B-Wing Solar Water Heater', type: 'Solar Heater', location: 'B-Wing Terrace', vendorId: vendors[9].id },
    { name: 'A-Wing Solar Water Heater', type: 'Solar Heater', location: 'A-Wing Terrace', vendorId: vendors[9].id },
    { name: 'Main Fire Hydrant Pump', type: 'Fire Hydrant', location: 'Basement 1', vendorId: vendors[6].id },
    { name: 'Main Gate Automatic Boom Barrier', type: 'Access Control', location: 'Main Gate', vendorId: vendors[4].id },
    { name: 'Clubhouse Central AC Unit', type: 'HVAC', location: 'Clubhouse', vendorId: vendors[3].id },
    { name: 'B-Wing Overhead Tank Sensor (B-OVERHEAD-01)', type: 'Level Sensor', location: 'B-Wing Terrace', vendorId: aquaVendor.id },
  ];

  const assets = [];
  for (const a of assetData) {
    const created = await prisma.asset.create({ data: a });
    assets.push(created);
  }
  console.log(`✅ Seeded ${assets.length} Assets.`);

  const bWaterPumpAsset = assets[0]; // B-Wing Water Pump

  // 4. Seed 15 Incidents (with deliberate 3 for B-Wing Water Supply)
  const incidentData = [
    // 3 Incidents for B-Wing Water Supply:
    {
      title: 'Recurring Low Water Pressure in B-Wing',
      category: 'Water Supply',
      location: 'B-Wing',
      status: 'REOPENED',
      complaintCount: 4,
      reopenCount: 1,
      firstReportedAt: daysAgo(61),
      lastReportedAt: daysAgo(43), // 43 days ago!
    },
    {
      title: 'B-Wing Header Pipe Cavitation & Vibration',
      category: 'Water Supply',
      location: 'B-Wing',
      status: 'REOPENED',
      complaintCount: 2,
      reopenCount: 1,
      firstReportedAt: daysAgo(95),
      lastReportedAt: daysAgo(78),
    },
    {
      title: 'Water Supply Interruption B-Wing Floors 4-7',
      category: 'Water Supply',
      location: 'B-Wing',
      status: 'RESOLVED',
      complaintCount: 1,
      reopenCount: 0,
      firstReportedAt: daysAgo(140),
      lastReportedAt: daysAgo(130),
    },
    // 12 Other Incidents:
    {
      title: 'B-Wing Passenger Lift Jerking & Floor Misalignment',
      category: 'Elevator',
      location: 'B-Wing',
      status: 'RESOLVED',
      complaintCount: 5,
      reopenCount: 0,
      firstReportedAt: daysAgo(30),
      lastReportedAt: daysAgo(25),
    },
    {
      title: 'Diesel Generator Auto-transfer Switch Failure',
      category: 'Electrical',
      location: 'Utility Yard',
      status: 'RESOLVED',
      complaintCount: 3,
      reopenCount: 0,
      firstReportedAt: daysAgo(50),
      lastReportedAt: daysAgo(48),
    },
    {
      title: 'Main Gate Boom Barrier Motor Jam',
      category: 'Access Control',
      location: 'Main Gate',
      status: 'ACTIVE',
      complaintCount: 4,
      reopenCount: 1,
      firstReportedAt: daysAgo(5),
      lastReportedAt: daysAgo(2),
    },
    {
      title: 'A-Wing Solar Water Temperature Drop',
      category: 'Solar Heater',
      location: 'A-Wing',
      status: 'RESOLVED',
      complaintCount: 2,
      reopenCount: 0,
      firstReportedAt: daysAgo(70),
      lastReportedAt: daysAgo(65),
    },
    {
      title: 'Clubhouse AC Gas Leakage',
      category: 'HVAC',
      location: 'Clubhouse',
      status: 'ACTIVE',
      complaintCount: 2,
      reopenCount: 0,
      firstReportedAt: daysAgo(12),
      lastReportedAt: daysAgo(10),
    },
    {
      title: 'Basement 2 Stormwater Drain Blockage',
      category: 'Plumbing',
      location: 'Basement 2',
      status: 'RESOLVED',
      complaintCount: 6,
      reopenCount: 0,
      firstReportedAt: daysAgo(85),
      lastReportedAt: daysAgo(80),
    },
    {
      title: 'C-Wing Corridor Emergency Lights Inoperative',
      category: 'Electrical',
      location: 'C-Wing',
      status: 'RESOLVED',
      complaintCount: 3,
      reopenCount: 0,
      firstReportedAt: daysAgo(40),
      lastReportedAt: daysAgo(38),
    },
    {
      title: 'D-Wing Waste Chute Odor Issue',
      category: 'Cleanliness',
      location: 'D-Wing',
      status: 'ACTIVE',
      complaintCount: 4,
      reopenCount: 1,
      firstReportedAt: daysAgo(8),
      lastReportedAt: daysAgo(3),
    },
    {
      title: 'CCTV Blindspot in B-Wing Fire Exit',
      category: 'Security',
      location: 'B-Wing',
      status: 'RESOLVED',
      complaintCount: 2,
      reopenCount: 0,
      firstReportedAt: daysAgo(90),
      lastReportedAt: daysAgo(88),
    },
    {
      title: 'Fire Hydrant Pressure Gauge Malfunction',
      category: 'Fire Safety',
      location: 'Basement 1',
      status: 'RESOLVED',
      complaintCount: 1,
      reopenCount: 0,
      firstReportedAt: daysAgo(110),
      lastReportedAt: daysAgo(108),
    },
    {
      title: 'A-Wing Lift Inverter Battery Degradation',
      category: 'Elevator',
      location: 'A-Wing',
      status: 'ACTIVE',
      complaintCount: 3,
      reopenCount: 0,
      firstReportedAt: daysAgo(15),
      lastReportedAt: daysAgo(14),
    },
    {
      title: 'C-Wing Terrace Seepage after Monsoon Heavy Rain',
      category: 'Civil Works',
      location: 'C-Wing',
      status: 'RESOLVED',
      complaintCount: 4,
      reopenCount: 0,
      firstReportedAt: daysAgo(100),
      lastReportedAt: daysAgo(92),
    },
  ];

  const incidents = [];
  for (const inc of incidentData) {
    const created = await prisma.incident.create({ data: inc });
    incidents.push(created);
  }
  console.log(`✅ Seeded ${incidents.length} Incidents.`);

  const bWingWaterIncidents = [incidents[0], incidents[1], incidents[2]];

  // 5. Seed Resolutions
  // Note: Incident 0 (Recurring Low Water Pressure in B-Wing) resolution:
  // "Pump servicing", "Issue returned after 18 days", recurrenceDays: 18, resolvedAt: 43 days ago!
  await prisma.resolution.create({
    data: {
      incidentId: bWingWaterIncidents[0].id,
      actionTaken: 'Pump servicing',
      outcome: 'Issue returned after 18 days',
      recurrenceDays: 18,
      residentVerified: false,
      resolvedAt: daysAgo(43),
    },
  });

  await prisma.resolution.create({
    data: {
      incidentId: bWingWaterIncidents[1].id,
      actionTaken: 'Impeller valve check',
      outcome: 'Partial flow restored temporarily',
      recurrenceDays: 14,
      residentVerified: false,
      resolvedAt: daysAgo(78),
    },
  });

  await prisma.resolution.create({
    data: {
      incidentId: bWingWaterIncidents[2].id,
      actionTaken: 'Motor rewinding and phase check',
      outcome: 'Completed successfully',
      recurrenceDays: null,
      residentVerified: true,
      resolvedAt: daysAgo(130),
    },
  });

  // 6. Seed 80 Complaints:
  // EXACTLY 7 related complaints for B-Wing Water Supply:
  const bWingWaterComplaints = [
    {
      residentId: residents[0].id, // Aarav Sharma
      description: 'Pani ka pressure 4th floor pe bohot kam hai, geezer on nahi ho raha',
      category: 'Water Supply',
      urgency: 'HIGH',
      wing: 'B',
      flatNumber: 'B-402',
      status: 'REOPENED',
      incidentId: bWingWaterIncidents[0].id,
      assetId: bWaterPumpAsset.id,
      vendorId: aquaVendor.id,
      createdAt: daysAgo(45),
    },
    {
      residentId: residents[1].id, // Priya Patel
      description: 'Low water flow in master bedroom bathroom taps',
      category: 'Water Supply',
      urgency: 'HIGH',
      wing: 'B',
      flatNumber: 'B-301',
      status: 'ACTIVE',
      incidentId: bWingWaterIncidents[0].id,
      assetId: bWaterPumpAsset.id,
      vendorId: aquaVendor.id,
      createdAt: daysAgo(44),
    },
    {
      residentId: residents[2].id, // Rohan Mehta
      description: 'Water pressure dropping severely during morning peak hours (7-9 AM)',
      category: 'Water Supply',
      urgency: 'HIGH',
      wing: 'B',
      flatNumber: 'B-504',
      status: 'ACTIVE',
      incidentId: bWingWaterIncidents[0].id,
      assetId: bWaterPumpAsset.id,
      vendorId: aquaVendor.id,
      createdAt: daysAgo(43),
    },
    {
      residentId: residents[3].id, // Sneha Deshmukh
      description: 'Flush tank taking over 20 minutes to refill due to low pressure',
      category: 'Water Supply',
      urgency: 'HIGH',
      wing: 'B',
      flatNumber: 'B-602',
      status: 'ACTIVE',
      incidentId: bWingWaterIncidents[0].id,
      assetId: bWaterPumpAsset.id,
      vendorId: aquaVendor.id,
      createdAt: daysAgo(42),
    },
    {
      residentId: residents[4].id, // Vikram Joshi
      description: 'Kitchen tap water trickling very slowly, RO system showing low feed pressure',
      category: 'Water Supply',
      urgency: 'HIGH',
      wing: 'B',
      flatNumber: 'B-203',
      status: 'RESOLVED',
      incidentId: bWingWaterIncidents[1].id,
      assetId: bWaterPumpAsset.id,
      vendorId: aquaVendor.id,
      createdAt: daysAgo(82),
      resolvedAt: daysAgo(78),
    },
    {
      residentId: residents[5].id, // Ananya Iyer
      description: 'Inconsistent water pressure across all taps on 7th floor',
      category: 'Water Supply',
      urgency: 'HIGH',
      wing: 'B',
      flatNumber: 'B-701',
      status: 'RESOLVED',
      incidentId: bWingWaterIncidents[1].id,
      assetId: bWaterPumpAsset.id,
      vendorId: aquaVendor.id,
      createdAt: daysAgo(80),
      resolvedAt: daysAgo(78),
    },
    {
      residentId: residents[6].id, // Karan Malhotra
      description: 'Water pump making unusual vibrating noise and water delivery is weak',
      category: 'Water Supply',
      urgency: 'HIGH',
      wing: 'B',
      flatNumber: 'B-102',
      status: 'RESOLVED',
      incidentId: bWingWaterIncidents[2].id,
      assetId: bWaterPumpAsset.id,
      vendorId: aquaVendor.id,
      createdAt: daysAgo(135),
      resolvedAt: daysAgo(130),
    },
  ];

  for (const c of bWingWaterComplaints) {
    await prisma.complaint.create({ data: c });
  }
  console.log(`✅ Seeded 7 B-Wing Water Supply Complaints.`);

  // 73 Complaints across other categories & wings (Total = 80)
  const otherComplaintTemplates = [
    { cat: 'Elevator', desc: 'Lift door sensor gets stuck on 4th floor', urg: 'HIGH', wing: 'B', flat: 'B-405' },
    { cat: 'Elevator', desc: 'Passenger lift 1 buttons not lighting up', urg: 'MEDIUM', wing: 'B', flat: 'B-203' },
    { cat: 'Elevator', desc: 'Sudden jerk when lift stops at ground floor', urg: 'HIGH', wing: 'A', flat: 'A-303' },
    { cat: 'Electrical', desc: 'Corridor light fixture flickering near flat entrance', urg: 'LOW', wing: 'B', flat: 'B-504' },
    { cat: 'Electrical', desc: 'Common meter tripping during heavy load', urg: 'HIGH', wing: 'C', flat: 'C-202' },
    { cat: 'Electrical', desc: 'Staircase lights on 6th floor fused', urg: 'LOW', wing: 'D', flat: 'D-602' },
    { cat: 'Cleanliness', desc: 'Dry waste garbage collection missed today', urg: 'LOW', wing: 'A', flat: 'A-101' },
    { cat: 'Cleanliness', desc: 'Staircase cleaning required near fire exit', urg: 'LOW', wing: 'B', flat: 'B-102' },
    { cat: 'Cleanliness', desc: 'Lobby floor needs scrubbing after delivery spills', urg: 'LOW', wing: 'C', flat: 'C-101' },
    { cat: 'Security', desc: 'Visitor vehicle parked in assigned parking slot', urg: 'MEDIUM', wing: 'D', flat: 'D-303' },
    { cat: 'Security', desc: 'Intercom connection having excessive static noise', urg: 'LOW', wing: 'A', flat: 'A-501' },
    { cat: 'Plumbing', desc: 'Rainwater downpipe loose fitting on terrace', urg: 'MEDIUM', wing: 'C', flat: 'C-703' },
    { cat: 'Plumbing', desc: 'Garden sprinkler head cracked and overflowing', urg: 'LOW', wing: 'A', flat: 'A-202' },
    { cat: 'Civil Works', desc: 'Paver blocks uneven near podium walkway', urg: 'LOW', wing: 'D', flat: 'D-101' },
  ];

  let remainingCount = 73;
  let templateIndex = 0;
  let residentIndex = 7; // Start from resident 8 onwards

  while (remainingCount > 0) {
    const t = otherComplaintTemplates[templateIndex % otherComplaintTemplates.length];
    const r = residents[residentIndex % residents.length];
    const isResolved = remainingCount % 3 === 0;

    await prisma.complaint.create({
      data: {
        residentId: r.id,
        description: `${t.desc} (Unit #${remainingCount})`,
        category: t.cat,
        urgency: t.urg,
        wing: r.wing,
        flatNumber: r.flatNumber,
        status: isResolved ? 'RESOLVED' : 'ACTIVE',
        createdAt: daysAgo(5 + (remainingCount % 60)),
        resolvedAt: isResolved ? daysAgo(2 + (remainingCount % 20)) : null,
      },
    });

    remainingCount--;
    templateIndex++;
    residentIndex++;
  }

  const totalComplaints = await prisma.complaint.count();
  console.log(`✅ Total Seeded Complaints: ${totalComplaints} (Target: 80).`);

  // Verify deliberate historical counts for B-Wing Water Supply:
  const bWingWaterCount = await prisma.complaint.count({
    where: { category: 'Water Supply', wing: 'B' },
  });
  const bWingIncidents = await prisma.incident.findMany({
    where: { category: 'Water Supply', location: { contains: 'B' } },
  });
  const reopenedIncidents = bWingIncidents.filter((i) => i.status === 'REOPENED' || i.reopenCount > 0);

  console.log('----------------------------------------------------');
  console.log('📊 SocietyOS Seed Verification:');
  console.log(`• B-Wing Water Supply Complaints: ${bWingWaterCount} (Target: 7)`);
  console.log(`• B-Wing Water Incidents: ${bWingIncidents.length} (Target: 3)`);
  console.log(`• Reopened Incidents: ${reopenedIncidents.length} (Target: 2)`);
  console.log(`• Related Asset: ${bWaterPumpAsset.name} (${bWaterPumpAsset.id})`);
  console.log('----------------------------------------------------');
  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
