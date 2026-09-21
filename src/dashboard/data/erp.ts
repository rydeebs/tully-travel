export type SystemConnection = {
  [key: string]: unknown;
  baseSyncSeconds: number;
  errors: number;
  id: string;
  name: string;
  recordsPerTick: number;
  recordsSyncedToday: number;
  role: string;
  status: "Healthy" | "1 warning";
  statusTone: "ink" | "gold";
};

export type BookingStatus = {
  highlight?: boolean;
  label: string;
  note: string;
  value: number;
};

export type DepartureStatus = "Ready" | "Docs outstanding" | "Awaiting supplier";

export type Departure = {
  [key: string]: unknown;
  client: string;
  collection: string;
  departs: string;
  designer: string;
  id: string;
  journey: string;
  readiness: number;
  status: DepartureStatus;
  value: number;
};

export type SupplierReliability = {
  [key: string]: unknown;
  bookingsYtd: number;
  commissionPaidOnTime: number;
  confirmationDays: number;
  id: string;
  issuesPer100: number;
  isLeader?: boolean;
  score: number;
  supplier: string;
};

export const systemConnections: SystemConnection[] = [
  {
    id: "clientbase",
    name: "ClientBase",
    role: "client records",
    baseSyncSeconds: 24,
    recordsSyncedToday: 1284,
    recordsPerTick: 3,
    errors: 0,
    status: "Healthy",
    statusTone: "ink",
  },
  {
    id: "trams",
    name: "Trams",
    role: "accounting & commissions",
    baseSyncSeconds: 37,
    recordsSyncedToday: 912,
    recordsPerTick: 2,
    errors: 1,
    status: "1 warning",
    statusTone: "gold",
  },
  {
    id: "travefy",
    name: "Travefy",
    role: "itineraries",
    baseSyncSeconds: 31,
    recordsSyncedToday: 604,
    recordsPerTick: 2,
    errors: 0,
    status: "Healthy",
    statusTone: "ink",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    role: "CRM",
    baseSyncSeconds: 42,
    recordsSyncedToday: 488,
    recordsPerTick: 1,
    errors: 0,
    status: "Healthy",
    statusTone: "ink",
  },
  {
    id: "supplier-extranets",
    name: "Supplier extranets",
    role: "14 connected",
    baseSyncSeconds: 55,
    recordsSyncedToday: 355,
    recordsPerTick: 4,
    errors: 2,
    status: "1 warning",
    statusTone: "gold",
  },
];

export const bookingStatusItems: BookingStatus[] = [
  { label: "Quoted", value: 86, note: "pricing with suppliers" },
  { label: "Deposit received", value: 72, note: "client funds secured" },
  { label: "Supplier confirmed", value: 124, note: "rooms and services held", highlight: true },
  { label: "Final payment due", value: 45, note: "inside 45 days" },
  { label: "Documents issued", value: 65, note: "ready for departure" },
  { label: "Travelling now", value: 20, note: "active in destination" },
];

export const upcomingDepartures: Departure[] = [
  {
    id: "harcourt-amalfi",
    departs: "22 Sep",
    client: "The Harcourt family",
    journey: "Amalfi villas and private coast",
    collection: "Cruise & Coastline",
    designer: "Elena Rossi",
    value: 148000,
    readiness: 96,
    status: "Ready",
  },
  {
    id: "okafor-kyoto",
    departs: "24 Sep",
    client: "M. Okafor",
    journey: "Kyoto, Naoshima and the Inland Sea",
    collection: "Eastern Soul",
    designer: "Priya Shah",
    value: 92000,
    readiness: 88,
    status: "Docs outstanding",
  },
  {
    id: "leclerc-tuscany",
    departs: "27 Sep",
    client: "The Leclerc party",
    journey: "Tuscan estates and cellar doors",
    collection: "Vintage & Vineyard",
    designer: "Marc Tremblay",
    value: 117000,
    readiness: 93,
    status: "Ready",
  },
  {
    id: "ashford-safari",
    departs: "30 Sep",
    client: "C. Ashford",
    journey: "Botswana camps with helicopter transfer",
    collection: "Wild & Untamed",
    designer: "Nadia Clarke",
    value: 184000,
    readiness: 74,
    status: "Awaiting supplier",
  },
  {
    id: "singh-alps",
    departs: "03 Oct",
    client: "The Singh family",
    journey: "Engadine chalets and private guides",
    collection: "Peak & Panorama",
    designer: "Thomas Grant",
    value: 132000,
    readiness: 90,
    status: "Ready",
  },
  {
    id: "m-dupont-riviera",
    departs: "07 Oct",
    client: "M. Dupont",
    journey: "Riviera yacht week and Belmond rail",
    collection: "Grand Tour",
    designer: "Claire Nguyen",
    value: 208000,
    readiness: 83,
    status: "Docs outstanding",
  },
  {
    id: "r-alvarez-japan",
    departs: "11 Oct",
    client: "R. Alvarez",
    journey: "Tokyo dining rooms and ryokan circuit",
    collection: "Epicurean Worlds",
    designer: "Priya Shah",
    value: 86000,
    readiness: 79,
    status: "Awaiting supplier",
  },
  {
    id: "the-bellamy-party",
    departs: "16 Oct",
    client: "The Bellamy party",
    journey: "Paris ateliers and Loire estates",
    collection: "Noble Estates",
    designer: "Elena Rossi",
    value: 124000,
    readiness: 95,
    status: "Ready",
  },
  {
    id: "n-ibrahim-galapagos",
    departs: "20 Oct",
    client: "N. Ibrahim",
    journey: "Galapagos expedition and Quito residence",
    collection: "Cruise & Coastline",
    designer: "Marc Tremblay",
    value: 156000,
    readiness: 86,
    status: "Docs outstanding",
  },
];

export const supplierReliability: SupplierReliability[] = [
  {
    id: "aman",
    supplier: "Aman",
    bookingsYtd: 38,
    confirmationDays: 0.9,
    commissionPaidOnTime: 0.98,
    issuesPer100: 0.7,
    score: 97,
    isLeader: true,
  },
  {
    id: "four-seasons",
    supplier: "Four Seasons",
    bookingsYtd: 86,
    confirmationDays: 1.2,
    commissionPaidOnTime: 0.96,
    issuesPer100: 1.1,
    score: 94,
  },
  {
    id: "singita",
    supplier: "Singita",
    bookingsYtd: 27,
    confirmationDays: 1.4,
    commissionPaidOnTime: 0.95,
    issuesPer100: 1.3,
    score: 92,
  },
  {
    id: "rosewood",
    supplier: "Rosewood",
    bookingsYtd: 42,
    confirmationDays: 1.5,
    commissionPaidOnTime: 0.93,
    issuesPer100: 1.6,
    score: 89,
  },
  {
    id: "belmond",
    supplier: "Belmond",
    bookingsYtd: 51,
    confirmationDays: 1.7,
    commissionPaidOnTime: 0.91,
    issuesPer100: 1.8,
    score: 86,
  },
  {
    id: "andbeyond",
    supplier: "&Beyond",
    bookingsYtd: 33,
    confirmationDays: 1.8,
    commissionPaidOnTime: 0.9,
    issuesPer100: 2,
    score: 84,
  },
  {
    id: "great-plains",
    supplier: "Great Plains Conservation",
    bookingsYtd: 24,
    confirmationDays: 2.1,
    commissionPaidOnTime: 0.88,
    issuesPer100: 2.4,
    score: 80,
  },
  {
    id: "explora",
    supplier: "Explora Journeys",
    bookingsYtd: 46,
    confirmationDays: 2.3,
    commissionPaidOnTime: 0.86,
    issuesPer100: 2.9,
    score: 77,
  },
  {
    id: "wilderness",
    supplier: "Wilderness Safaris",
    bookingsYtd: 29,
    confirmationDays: 2.5,
    commissionPaidOnTime: 0.84,
    issuesPer100: 3.1,
    score: 74,
  },
  {
    id: "crystal",
    supplier: "Crystal",
    bookingsYtd: 31,
    confirmationDays: 2.8,
    commissionPaidOnTime: 0.82,
    issuesPer100: 3.6,
    score: 70,
  },
];
