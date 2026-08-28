import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { Vessel, Voyage, Booking, FinancialTransaction, User } from "./src/types";

const app = express();
const PORT = 3000;
app.use(express.json());

const DB_FILE = path.join(process.cwd(), "marine_data.json");

// Default initial dataset with Indonesian ports & shipping ecosystem
const getInitialData = () => {
  const users: User[] = [
    {
      id: "usr-owner-1",
      name: "Capt. Hendra Gunawan, M.Mar",
      email: "owner@samuderanusantara.co.id",
      role: "owner",
      companyName: "PT Samudera Bahari Nusantara",
      phone: "+62 811-9876-5432",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "usr-agent-1",
      name: "Siti Rahmawati, S.Log",
      email: "agen.priok@nusantaraship.id",
      role: "agent",
      companyName: "PT Mitra Logistik Maritim",
      phone: "+62 812-3456-7890",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "usr-customer-1",
      name: "Budi Santoso (Export-Import)",
      email: "budi@agroindoberkah.com",
      role: "customer",
      companyName: "PT Agro Makmur Sentosa",
      phone: "+62 813-8899-7711",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    }
  ];

  const vessels: Vessel[] = [
    {
      id: "ves-01",
      name: "KM Nusantara Express I",
      callSign: "YDB-4019",
      mmsi: "525009112",
      imo: "9821102",
      type: "Container",
      flag: "Indonesia 🇮🇩",
      dwt: 14500,
      capacityTeu: 850,
      yearBuilt: 2019,
      status: "Underway",
      speedKnots: 14.8,
      headingDeg: 82,
      currentLocationName: "Laut Jawa (Menuju Surabaya)",
      coordinates: { lat: -5.92, lng: 108.45 },
      captainName: "Capt. Bambang Subroto",
      crewCount: 22,
      fuelLevelPercent: 78,
      lastUpdated: new Date().toISOString(),
      destinationPort: "Tanjung Perak, Surabaya",
      eta: "2026-08-29 06:30 WIB",
      photoUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "ves-02",
      name: "KM Samudera Pioneer",
      callSign: "YDC-8821",
      mmsi: "525012349",
      imo: "9756621",
      type: "Container",
      flag: "Indonesia 🇮🇩",
      dwt: 22000,
      capacityTeu: 1400,
      yearBuilt: 2017,
      status: "Moored",
      speedKnots: 0.0,
      headingDeg: 12,
      currentLocationName: "Dermaga 102 Tanjung Priok",
      coordinates: { lat: -6.10, lng: 106.88 },
      captainName: "Capt. Reza Mahendra",
      crewCount: 26,
      fuelLevelPercent: 92,
      lastUpdated: new Date().toISOString(),
      destinationPort: "Belawan, Medan",
      eta: "2026-09-02 14:00 WIB",
      photoUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "ves-03",
      name: "LCT Borneo Perkasa VIII",
      callSign: "YDA-3108",
      mmsi: "525004455",
      imo: "9618842",
      type: "LCT",
      flag: "Indonesia 🇮🇩",
      dwt: 3200,
      capacityTon: 3000,
      yearBuilt: 2021,
      status: "Underway",
      speedKnots: 8.5,
      headingDeg: 45,
      currentLocationName: "Selat Makassar (Menuju Balikpapan)",
      coordinates: { lat: -1.25, lng: 117.15 },
      captainName: "Capt. Yohanis Palimbong",
      crewCount: 16,
      fuelLevelPercent: 64,
      lastUpdated: new Date().toISOString(),
      destinationPort: "Semayang, Balikpapan",
      eta: "2026-08-30 18:00 WITA",
      photoUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "ves-04",
      name: "TB. Bintang Timur & BG. Samudera 330",
      callSign: "YDE-9912",
      mmsi: "525019882",
      imo: "9512390",
      type: "Tug & Barge",
      flag: "Indonesia 🇮🇩",
      dwt: 8500,
      capacityTon: 8000,
      yearBuilt: 2018,
      status: "Anchored",
      speedKnots: 0.2,
      headingDeg: 195,
      currentLocationName: "Outer Anchorage Banjarmasin",
      coordinates: { lat: -3.55, lng: 114.48 },
      captainName: "Capt. Agus Supriyadi",
      crewCount: 12,
      fuelLevelPercent: 55,
      lastUpdated: new Date().toISOString(),
      destinationPort: "Cigading, Banten",
      eta: "2026-09-05 10:00 WIB",
      photoUrl: "https://images.unsplash.com/photo-1505705694340-019e1e335916?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "ves-05",
      name: "KM Celebes Star",
      callSign: "YDF-5501",
      mmsi: "525008771",
      imo: "9834412",
      type: "General Cargo",
      flag: "Indonesia 🇮🇩",
      dwt: 12000,
      capacityTeu: 650,
      yearBuilt: 2020,
      status: "Underway",
      speedKnots: 13.2,
      headingDeg: 110,
      currentLocationName: "Laut Flores (Menuju Makassar)",
      coordinates: { lat: -6.85, lng: 119.20 },
      captainName: "Capt. Irwan Basri",
      crewCount: 20,
      fuelLevelPercent: 82,
      lastUpdated: new Date().toISOString(),
      destinationPort: "Soekarno-Hatta, Makassar",
      eta: "2026-08-31 08:00 WITA",
      photoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80"
    }
  ];

  const voyages: Voyage[] = [
    {
      id: "voy-01",
      voyageNumber: "VOY-NX1-2608A",
      vesselId: "ves-01",
      vesselName: "KM Nusantara Express I",
      originPort: "Tanjung Priok, Jakarta",
      destinationPort: "Tanjung Perak, Surabaya",
      etd: "2026-08-27 16:00 WIB",
      eta: "2026-08-29 06:30 WIB",
      status: "En Route",
      totalCapacityTeu: 850,
      bookedCapacityTeu: 760,
      pricePerTeu: 4500000,
      pricePerTon: 350000,
      transitDays: 2,
      notes: "Direct express route, prioritized container handling"
    },
    {
      id: "voy-02",
      voyageNumber: "VOY-SP-2609B",
      vesselId: "ves-02",
      vesselName: "KM Samudera Pioneer",
      originPort: "Tanjung Priok, Jakarta",
      destinationPort: "Belawan, Medan",
      etd: "2026-08-30 20:00 WIB",
      eta: "2026-09-02 14:00 WIB",
      status: "Loading",
      totalCapacityTeu: 1400,
      bookedCapacityTeu: 1120,
      pricePerTeu: 6800000,
      pricePerTon: 480000,
      transitDays: 3,
      notes: "Open for dry containers and reefer perishables"
    },
    {
      id: "voy-03",
      voyageNumber: "VOY-BP8-2608C",
      vesselId: "ves-03",
      vesselName: "LCT Borneo Perkasa VIII",
      originPort: "Tanjung Perak, Surabaya",
      destinationPort: "Semayang, Balikpapan",
      etd: "2026-08-26 10:00 WIB",
      eta: "2026-08-30 18:00 WITA",
      status: "En Route",
      totalCapacityTeu: 120,
      bookedCapacityTeu: 115,
      pricePerTeu: 8200000,
      pricePerTon: 550000,
      transitDays: 4,
      notes: "Heavy equipment excavators & structural steel cargo"
    },
    {
      id: "voy-04",
      voyageNumber: "VOY-CS-2609D",
      vesselId: "ves-05",
      vesselName: "KM Celebes Star",
      originPort: "Tanjung Perak, Surabaya",
      destinationPort: "Soekarno-Hatta, Makassar",
      etd: "2026-08-28 22:00 WIB",
      eta: "2026-08-31 08:00 WITA",
      status: "En Route",
      totalCapacityTeu: 650,
      bookedCapacityTeu: 580,
      pricePerTeu: 5200000,
      pricePerTon: 390000,
      transitDays: 3,
      notes: "FMCG, Consumer goods, & electronics"
    },
    {
      id: "voy-05",
      voyageNumber: "VOY-NX1-2609E",
      vesselId: "ves-01",
      vesselName: "KM Nusantara Express I",
      originPort: "Tanjung Perak, Surabaya",
      destinationPort: "Bitung, Sulawesi Utara",
      etd: "2026-09-03 14:00 WIB",
      eta: "2026-09-07 10:00 WITA",
      status: "Scheduled",
      totalCapacityTeu: 850,
      bookedCapacityTeu: 310,
      pricePerTeu: 9500000,
      pricePerTon: 620000,
      transitDays: 4,
      notes: "Early bird booking discount 5% for >10 TEU"
    }
  ];

  const bookings: Booking[] = [
    {
      id: "bkg-01",
      bookingNumber: "BKG-2026-0881",
      blNumber: "BL-NSM-99124",
      customerId: "usr-customer-1",
      customerName: "Budi Santoso",
      customerCompany: "PT Agro Makmur Sentosa",
      customerPhone: "+62 813-8899-7711",
      customerEmail: "budi@agroindoberkah.com",
      agentId: "usr-agent-1",
      agentName: "Siti Rahmawati, S.Log",
      voyageId: "voy-01",
      vesselId: "ves-01",
      vesselName: "KM Nusantara Express I",
      originPort: "Tanjung Priok, Jakarta",
      destinationPort: "Tanjung Perak, Surabaya",
      cargoType: "Dry Container 20ft",
      cargoDescription: "Produk Olahan Kopi & Biji Kakao Premium",
      quantity: 4,
      weightTons: 68,
      volumeCbm: 132,
      hasInsurance: true,
      totalCost: 18900000,
      paymentStatus: "Paid in Full",
      bookingStatus: "In Transit",
      createdAt: "2026-08-25T09:30:00.000Z",
      consigneeName: "CV Jatim Kencana Mandiri (Surabaya)",
      consigneePhone: "+62 812-4455-6677",
      pickupAddress: "Kawasan Industri Pulo Gadung, Jakarta Timur",
      deliveryAddress: "Gudang Rungkut Industri III No. 45, Surabaya",
      trackingHistory: [
        {
          id: "trk-1",
          timestamp: "2026-08-25 14:00 WIB",
          title: "Booking Dikonfirmasi & DO Terbit",
          location: "Kantor Operasional Jakarta",
          description: "Dokumen pengiriman diverifikasi dan slot kontainer dialokasikan.",
          completed: true
        },
        {
          id: "trk-2",
          timestamp: "2026-08-26 11:30 WIB",
          title: "Gate In Container Yard (CY)",
          location: "Depo IPC Tanjung Priok",
          description: "4 Unit kontainer 20ft telah lolos penimbangan & inspeksi segel.",
          completed: true
        },
        {
          id: "trk-3",
          timestamp: "2026-08-27 15:45 WIB",
          title: "Pemuatan ke Kapal (Stevedoring)",
          location: "Dermaga 003 Tanjung Priok",
          description: "Kontainer telah dinaikkan ke atas dek KM Nusantara Express I (Bay 04 Row 02).",
          completed: true
        },
        {
          id: "trk-4",
          timestamp: "2026-08-27 17:10 WIB",
          title: "Kapal Berangkat (Cast Off)",
          location: "Laut Jawa",
          description: "Kapal dalam pelayaran menuju Pelabuhan Tanjung Perak.",
          completed: true
        },
        {
          id: "trk-5",
          timestamp: "Estimasi 2026-08-29 06:30 WIB",
          title: "Tiba di Pelabuhan Tujuan",
          location: "Tanjung Perak, Surabaya",
          description: "Kapal dijadwalkan sandar dan proses bongkar kargo.",
          completed: false
        },
        {
          id: "trk-6",
          timestamp: "Estimasi 2026-08-29 15:00 WIB",
          title: "Pengantaran Selesai (Delivery)",
          location: "Gudang Konsinyi Rungkut",
          description: "Serah terima kargo ke penerima barang.",
          completed: false
        }
      ]
    },
    {
      id: "bkg-02",
      bookingNumber: "BKG-2026-0882",
      blNumber: "BL-NSM-99125",
      customerId: "usr-customer-1",
      customerName: "Budi Santoso",
      customerCompany: "PT Agro Makmur Sentosa",
      customerPhone: "+62 813-8899-7711",
      customerEmail: "budi@agroindoberkah.com",
      agentId: "usr-agent-1",
      agentName: "Siti Rahmawati, S.Log",
      voyageId: "voy-02",
      vesselId: "ves-02",
      vesselName: "KM Samudera Pioneer",
      originPort: "Tanjung Priok, Jakarta",
      destinationPort: "Belawan, Medan",
      cargoType: "Dry Container 40ft",
      cargoDescription: "Mesin Industri Pertanian & Sparepart Traktor",
      quantity: 2,
      weightTons: 42,
      volumeCbm: 140,
      hasInsurance: true,
      totalCost: 21500000,
      paymentStatus: "Deposit Paid",
      bookingStatus: "Loaded",
      createdAt: "2026-08-26T11:00:00.000Z",
      consigneeName: "PT Sumatra Agro Perdana (Medan)",
      consigneePhone: "+62 811-6677-8899",
      pickupAddress: "Cikarang Dry Port, Jawa Barat",
      deliveryAddress: "Jl. Kolonel Yos Sudarso KM 12, Medan",
      trackingHistory: [
        {
          id: "trk-201",
          timestamp: "2026-08-26 13:00 WIB",
          title: "Booking Dikonfirmasi",
          location: "Jakarta HQ",
          description: "Pesanan masuk dan diverifikasi.",
          completed: true
        },
        {
          id: "trk-202",
          timestamp: "2026-08-27 10:15 WIB",
          title: "Gate In & Pemuatan",
          location: "Dermaga 102 Tanjung Priok",
          description: "Kontainer masuk dermaga dan dimuat ke KM Samudera Pioneer.",
          completed: true
        },
        {
          id: "trk-203",
          timestamp: "Estimasi 2026-08-30 20:00 WIB",
          title: "Jadwal Keberangkatan",
          location: "Tanjung Priok",
          description: "Kapal bersiap lepas tali menuju Selat Malaka.",
          completed: false
        }
      ]
    },
    {
      id: "bkg-03",
      bookingNumber: "BKG-2026-0883",
      blNumber: "BL-NSM-99126",
      customerId: "usr-cust-2",
      customerName: "H. Ridwan Kamiludin",
      customerCompany: "PT Kalimantan Prima Mining",
      customerPhone: "+62 821-5566-7788",
      customerEmail: "logistik@kalimantanprima.co.id",
      agentId: "usr-agent-1",
      agentName: "Siti Rahmawati, S.Log",
      voyageId: "voy-03",
      vesselId: "ves-03",
      vesselName: "LCT Borneo Perkasa VIII",
      originPort: "Tanjung Perak, Surabaya",
      destinationPort: "Semayang, Balikpapan",
      cargoType: "Heavy Equipment / Vehicles",
      cargoDescription: "2 Unit Excavator Komatsu PC200 & Dump Truck",
      quantity: 3,
      weightTons: 95,
      hasInsurance: true,
      totalCost: 52000000,
      paymentStatus: "Paid in Full",
      bookingStatus: "In Transit",
      createdAt: "2026-08-24T08:00:00.000Z",
      consigneeName: "Site Manager PT KPM Balikpapan",
      consigneePhone: "+62 813-1122-3344",
      pickupAddress: "Surabaya Industrial Estate Rungkut (SIER)",
      deliveryAddress: "Kariangau Logistics Hub, Balikpapan",
      trackingHistory: [
        {
          id: "trk-301",
          timestamp: "2026-08-24 10:00 WIB",
          title: "Lashing & Securing Muatan Alat Berat",
          location: "Dermaga Mirah Tanjung Perak",
          description: "Rantai pengikat baja dipasang ketat memenuhi standar keselamatan maritim.",
          completed: true
        },
        {
          id: "trk-302",
          timestamp: "2026-08-26 10:00 WIB",
          title: "LCT Bertolak",
          location: "Tanjung Perak Surabaya",
          description: "Kapal LCT memulai pelayaran melintasi Selat Makassar.",
          completed: true
        }
      ]
    },
    {
      id: "bkg-04",
      bookingNumber: "BKG-2026-0884",
      blNumber: "BL-NSM-99127",
      customerId: "usr-customer-1",
      customerName: "Budi Santoso",
      customerCompany: "PT Agro Makmur Sentosa",
      customerPhone: "+62 813-8899-7711",
      customerEmail: "budi@agroindoberkah.com",
      agentId: "usr-agent-1",
      agentName: "Siti Rahmawati, S.Log",
      voyageId: "voy-05",
      vesselId: "ves-01",
      vesselName: "KM Nusantara Express I",
      originPort: "Tanjung Perak, Surabaya",
      destinationPort: "Bitung, Sulawesi Utara",
      cargoType: "Reefer Container",
      cargoDescription: "Daging Beku & Ikan Olahan Suhu -20°C",
      quantity: 2,
      weightTons: 36,
      hasInsurance: true,
      totalCost: 28500000,
      paymentStatus: "Unpaid",
      bookingStatus: "Pending",
      createdAt: "2026-08-27T14:15:00.000Z",
      consigneeName: "Bitung Cold Storage Raya",
      consigneePhone: "+62 815-9988-7766",
      trackingHistory: [
        {
          id: "trk-401",
          timestamp: "2026-08-27 14:15 WIB",
          title: "Pengajuan Booking Baru",
          location: "Portal Web Samudera",
          description: "Menunggu konfirmasi slot reefer plug pada kapal.",
          completed: true
        }
      ]
    }
  ];

  const transactions: FinancialTransaction[] = [
    {
      id: "tx-01",
      transactionNumber: "TX-2026-0801",
      date: "2026-08-25",
      type: "Income",
      category: "Freight Payment",
      amount: 18900000,
      vesselId: "ves-01",
      vesselName: "KM Nusantara Express I",
      voyageId: "voy-01",
      bookingId: "bkg-01",
      description: "Pelunasan Ongkos Angkut 4x20ft BL-NSM-99124 (PT Agro Makmur Sentosa)",
      status: "Settled"
    },
    {
      id: "tx-02",
      transactionNumber: "TX-2026-0802",
      date: "2026-08-24",
      type: "Income",
      category: "Charter Contract",
      amount: 52000000,
      vesselId: "ves-03",
      vesselName: "LCT Borneo Perkasa VIII",
      voyageId: "voy-03",
      bookingId: "bkg-03",
      description: "Pembayaran Freight Alat Berat PC200 Surabaya - Balikpapan (PT KPM)",
      status: "Settled"
    },
    {
      id: "tx-03",
      transactionNumber: "TX-2026-0803",
      date: "2026-08-26",
      type: "Income",
      category: "Freight Payment",
      amount: 10750000,
      vesselId: "ves-02",
      vesselName: "KM Samudera Pioneer",
      voyageId: "voy-02",
      bookingId: "bkg-02",
      description: "Uang Muka 50% Pengiriman Kontainer 40ft Medan BL-NSM-99125",
      status: "Settled"
    },
    {
      id: "tx-04",
      transactionNumber: "TX-2026-0804",
      date: "2026-08-26",
      type: "Expense",
      category: "Fuel / Bunkering",
      amount: 42500000,
      vesselId: "ves-01",
      vesselName: "KM Nusantara Express I",
      voyageId: "voy-01",
      description: "Pengisian Bahan Bakar Marine Gas Oil (MGO) 3.500 Liter di Priok",
      status: "Settled"
    },
    {
      id: "tx-05",
      transactionNumber: "TX-2026-0805",
      date: "2026-08-26",
      type: "Expense",
      category: "Port Dues & Pilotage",
      amount: 8750000,
      vesselId: "ves-01",
      vesselName: "KM Nusantara Express I",
      voyageId: "voy-01",
      description: "Jasa Labuh, Tambat, dan Pandu/Tunda Pelindo Tanjung Priok",
      status: "Settled"
    },
    {
      id: "tx-06",
      transactionNumber: "TX-2026-0806",
      date: "2026-08-25",
      type: "Expense",
      category: "Crew Salaries & Meals",
      amount: 28000000,
      vesselId: "ves-01",
      vesselName: "KM Nusantara Express I",
      description: "Uang Makan & Insentif Pelayaran 22 Awak Kapal KM Nusantara Express I",
      status: "Settled"
    },
    {
      id: "tx-07",
      transactionNumber: "TX-2026-0807",
      date: "2026-08-24",
      type: "Expense",
      category: "Handling & Stevedoring",
      amount: 6400000,
      vesselId: "ves-03",
      vesselName: "LCT Borneo Perkasa VIII",
      voyageId: "voy-03",
      description: "Jasa Bongkar Muat Crane & Tim Lashing Alat Berat Surabaya",
      status: "Settled"
    },
    {
      id: "tx-08",
      transactionNumber: "TX-2026-0808",
      date: "2026-08-27",
      type: "Expense",
      category: "Fuel / Bunkering",
      amount: 38000000,
      vesselId: "ves-03",
      vesselName: "LCT Borneo Perkasa VIII",
      voyageId: "voy-03",
      description: "Pengisian Bunker Solar Industri HSD di Dermaga Mirah Surabaya",
      status: "Settled"
    },
    {
      id: "tx-09",
      transactionNumber: "TX-2026-0809",
      date: "2026-08-27",
      type: "Expense",
      category: "Vessel Maintenance & Dok",
      amount: 14500000,
      vesselId: "ves-02",
      vesselName: "KM Samudera Pioneer",
      description: "Servis Rutin Pompa Balas & Kalibrasi Kompas Gyro AIS",
      status: "Settled"
    },
    {
      id: "tx-10",
      transactionNumber: "TX-2026-0810",
      date: "2026-08-27",
      type: "Income",
      category: "Freight Payment",
      amount: 45000000,
      vesselId: "ves-05",
      vesselName: "KM Celebes Star",
      voyageId: "voy-04",
      description: "Pelunasan Muatan General Cargo Surabaya - Makassar (10 Konsinyi)",
      status: "Settled"
    }
  ];

  return { users, vessels, voyages, bookings, transactions };
};

// Database persistence helper
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading database file, resetting to defaults", err);
  }
  const init = getInitialData();
  saveDB(init);
  return init;
}

function saveDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving database file", err);
  }
}

// REST API ROUTES
// 1. Auth & Current User
app.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, role } = req.body;
  const db = loadDB();
  let user = db.users.find((u: User) => u.email.toLowerCase() === (email || "").toLowerCase());
  
  // If matched by role for quick demo login
  if (!user && role) {
    user = db.users.find((u: User) => u.role === role);
  }

  if (!user) {
    // Create guest/new user
    user = {
      id: "usr-" + Date.now(),
      name: email ? email.split("@")[0].toUpperCase() : "Pengguna Maritim",
      email: email || "user@maritim.id",
      role: (role as any) || "customer",
      companyName: "PT Pengguna Baru Logistik",
      phone: "+62 812-0000-1111",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
    };
    db.users.push(user);
    saveDB(db);
  }

  res.json({ success: true, user });
});

app.post("/api/auth/register", (req: Request, res: Response) => {
  const { name, email, role, companyName, phone } = req.body;
  const db = loadDB();
  const newUser: User = {
    id: "usr-" + Date.now(),
    name: name || "Pengguna Baru",
    email: email || `user_${Date.now()}@logistik.id`,
    role: role || "customer",
    companyName: companyName || "Perusahaan Mandiri",
    phone: phone || "+62 812-3344-5566",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  };
  db.users.push(newUser);
  saveDB(db);
  res.json({ success: true, user: newUser });
});

// 2. Vessels (CRUD)
app.get("/api/vessels", (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.vessels);
});

app.post("/api/vessels", (req: Request, res: Response) => {
  const db = loadDB();
  const newVessel: Vessel = {
    id: "ves-" + Date.now(),
    name: req.body.name || "Kapal Motor Baru",
    callSign: req.body.callSign || "YD-" + Math.floor(1000 + Math.random() * 9000),
    mmsi: req.body.mmsi || "525" + Math.floor(100000 + Math.random() * 900000),
    imo: req.body.imo || "98" + Math.floor(10000 + Math.random() * 90000),
    type: req.body.type || "Container",
    flag: req.body.flag || "Indonesia 🇮🇩",
    dwt: Number(req.body.dwt) || 5000,
    capacityTeu: req.body.capacityTeu ? Number(req.body.capacityTeu) : undefined,
    capacityTon: req.body.capacityTon ? Number(req.body.capacityTon) : undefined,
    yearBuilt: Number(req.body.yearBuilt) || new Date().getFullYear(),
    status: req.body.status || "Moored",
    speedKnots: Number(req.body.speedKnots) || 0,
    headingDeg: Number(req.body.headingDeg) || 0,
    currentLocationName: req.body.currentLocationName || "Pelabuhan Tanjung Priok",
    coordinates: req.body.coordinates || { lat: -6.1, lng: 106.88 },
    captainName: req.body.captainName || "Capt. Nahkoda",
    crewCount: Number(req.body.crewCount) || 18,
    fuelLevelPercent: Number(req.body.fuelLevelPercent) || 80,
    lastUpdated: new Date().toISOString(),
    destinationPort: req.body.destinationPort || "Tanjung Perak, Surabaya",
    eta: req.body.eta || "TBD",
    photoUrl: req.body.photoUrl || "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&auto=format&fit=crop&q=80"
  };
  db.vessels.push(newVessel);
  saveDB(db);
  res.status(201).json(newVessel);
});

app.put("/api/vessels/:id", (req: Request, res: Response) => {
  const db = loadDB();
  const idx = db.vessels.findIndex((v: Vessel) => v.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Kapal tidak ditemukan" });
  
  db.vessels[idx] = {
    ...db.vessels[idx],
    ...req.body,
    lastUpdated: new Date().toISOString()
  };
  saveDB(db);
  res.json(db.vessels[idx]);
});

app.delete("/api/vessels/:id", (req: Request, res: Response) => {
  const db = loadDB();
  db.vessels = db.vessels.filter((v: Vessel) => v.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// 3. Voyages / Schedules (CRUD)
app.get("/api/voyages", (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.voyages);
});

app.post("/api/voyages", (req: Request, res: Response) => {
  const db = loadDB();
  const vessel = db.vessels.find((v: Vessel) => v.id === req.body.vesselId);
  const newVoyage: Voyage = {
    id: "voy-" + Date.now(),
    voyageNumber: req.body.voyageNumber || `VOY-${Date.now().toString().slice(-4)}`,
    vesselId: req.body.vesselId,
    vesselName: vessel ? vessel.name : req.body.vesselName || "KM Armada",
    originPort: req.body.originPort,
    destinationPort: req.body.destinationPort,
    etd: req.body.etd,
    eta: req.body.eta,
    status: req.body.status || "Scheduled",
    totalCapacityTeu: Number(req.body.totalCapacityTeu) || 500,
    bookedCapacityTeu: Number(req.body.bookedCapacityTeu) || 0,
    pricePerTeu: Number(req.body.pricePerTeu) || 5000000,
    pricePerTon: Number(req.body.pricePerTon) || 400000,
    transitDays: Number(req.body.transitDays) || 3,
    notes: req.body.notes || ""
  };
  db.voyages.push(newVoyage);
  saveDB(db);
  res.status(201).json(newVoyage);
});

app.put("/api/voyages/:id", (req: Request, res: Response) => {
  const db = loadDB();
  const idx = db.voyages.findIndex((v: Voyage) => v.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Jadwal pelayaran tidak ditemukan" });
  
  db.voyages[idx] = { ...db.voyages[idx], ...req.body };
  saveDB(db);
  res.json(db.voyages[idx]);
});

app.delete("/api/voyages/:id", (req: Request, res: Response) => {
  const db = loadDB();
  db.voyages = db.voyages.filter((v: Voyage) => v.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// 4. Bookings / Pemesanan (CRUD)
app.get("/api/bookings", (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.bookings);
});

app.post("/api/bookings", (req: Request, res: Response) => {
  const db = loadDB();
  const now = new Date();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const bookingNumber = `BKG-${now.getFullYear()}-${randomNum}`;
  const blNumber = `BL-NSM-${Math.floor(10000 + Math.random() * 90000)}`;

  const newBooking: Booking = {
    id: "bkg-" + Date.now(),
    bookingNumber,
    blNumber,
    customerId: req.body.customerId || "usr-cust-new",
    customerName: req.body.customerName || "Pelanggan Terdaftar",
    customerCompany: req.body.customerCompany || "PT Mitra Niaga",
    customerPhone: req.body.customerPhone || "+62 812-9988-7766",
    customerEmail: req.body.customerEmail || "customer@niaga.id",
    agentId: req.body.agentId || "usr-agent-1",
    agentName: req.body.agentName || "Siti Rahmawati, S.Log",
    voyageId: req.body.voyageId || "",
    vesselId: req.body.vesselId || "",
    vesselName: req.body.vesselName || "KM Nusantara Express I",
    originPort: req.body.originPort || "Tanjung Priok, Jakarta",
    destinationPort: req.body.destinationPort || "Tanjung Perak, Surabaya",
    cargoType: req.body.cargoType || "Dry Container 20ft",
    cargoDescription: req.body.cargoDescription || "General Cargo",
    quantity: Number(req.body.quantity) || 1,
    weightTons: Number(req.body.weightTons) || 15,
    volumeCbm: req.body.volumeCbm ? Number(req.body.volumeCbm) : undefined,
    hasInsurance: Boolean(req.body.hasInsurance),
    totalCost: Number(req.body.totalCost) || 5000000,
    paymentStatus: req.body.paymentStatus || "Unpaid",
    bookingStatus: req.body.bookingStatus || "Pending",
    createdAt: now.toISOString(),
    consigneeName: req.body.consigneeName || "Penerima Barang di Pelabuhan",
    consigneePhone: req.body.consigneePhone || "+62 811-0000-2222",
    pickupAddress: req.body.pickupAddress || "",
    deliveryAddress: req.body.deliveryAddress || "",
    trackingHistory: [
      {
        id: "trk-" + Date.now(),
        timestamp: `${now.toLocaleDateString("id-ID")} ${now.toLocaleTimeString("id-ID")} WIB`,
        title: "Pemesanan Masuk (Pending Verifikasi)",
        location: req.body.originPort || "Pelabuhan Asal",
        description: "Permintaan muatan telah didaftarkan dan menunggu verifikasi manifes & konfirmasi kapal.",
        completed: true
      }
    ]
  };

  db.bookings.unshift(newBooking);

  // Also create a pending financial invoice
  const newTx: FinancialTransaction = {
    id: "tx-" + Date.now(),
    transactionNumber: `TX-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: now.toISOString().split("T")[0],
    type: "Income",
    category: "Freight Payment",
    amount: newBooking.totalCost,
    vesselId: newBooking.vesselId,
    vesselName: newBooking.vesselName,
    voyageId: newBooking.voyageId,
    bookingId: newBooking.id,
    description: `Ongkos Angkut Pemesanan ${newBooking.bookingNumber} (${newBooking.customerCompany})`,
    status: newBooking.paymentStatus === "Paid in Full" ? "Settled" : "Pending"
  };
  db.transactions.unshift(newTx);

  saveDB(db);
  res.status(201).json(newBooking);
});

app.put("/api/bookings/:id", (req: Request, res: Response) => {
  const db = loadDB();
  const idx = db.bookings.findIndex((b: Booking) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Pemesanan tidak ditemukan" });

  const existing = db.bookings[idx];
  const updated = { ...existing, ...req.body };

  // If status changed, auto append tracking event
  if (req.body.bookingStatus && req.body.bookingStatus !== existing.bookingStatus) {
    const now = new Date();
    const eventTitles: Record<string, string> = {
      "Confirmed": "Booking Dikonfirmasi & Slot Disetujui",
      "Port Gate-In": "Kargo Gate-In di Depo / Container Yard",
      "Loaded": "Kargo Selesai Dimuat ke Kapal (Stevedoring)",
      "In Transit": "Kapal Sedang Berlayar (Sea Voyage)",
      "Arrived": "Kapal Sandar di Pelabuhan Tujuan",
      "Delivered": "Kargo Berhasil Diterima oleh Konsinyi",
      "Cancelled": "Pemesanan Dibatalkan"
    };

    updated.trackingHistory = [
      ...updated.trackingHistory,
      {
        id: "trk-" + Date.now(),
        timestamp: `${now.toLocaleDateString("id-ID")} ${now.toLocaleTimeString("id-ID")} WIB`,
        title: eventTitles[req.body.bookingStatus] || `Status diperbarui ke ${req.body.bookingStatus}`,
        location: updated.destinationPort || "Pelabuhan Maritim",
        description: `Status pengiriman diubah menjadi ${req.body.bookingStatus} oleh operator logistik.`,
        completed: true
      }
    ];
  }

  db.bookings[idx] = updated;
  saveDB(db);
  res.json(updated);
});

app.delete("/api/bookings/:id", (req: Request, res: Response) => {
  const db = loadDB();
  db.bookings = db.bookings.filter((b: Booking) => b.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// 5. Financial Transactions (CRUD) & Analytics
app.get("/api/finance/transactions", (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.transactions);
});

app.post("/api/finance/transactions", (req: Request, res: Response) => {
  const db = loadDB();
  const now = new Date();
  const newTx: FinancialTransaction = {
    id: "tx-" + Date.now(),
    transactionNumber: `TX-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: req.body.date || now.toISOString().split("T")[0],
    type: req.body.type || "Expense",
    category: req.body.category || "Other",
    amount: Number(req.body.amount) || 0,
    vesselId: req.body.vesselId,
    vesselName: req.body.vesselName,
    voyageId: req.body.voyageId,
    bookingId: req.body.bookingId,
    description: req.body.description || "Transaksi Keuangan",
    status: req.body.status || "Approved"
  };
  db.transactions.unshift(newTx);
  saveDB(db);
  res.status(201).json(newTx);
});

app.put("/api/finance/transactions/:id", (req: Request, res: Response) => {
  const db = loadDB();
  const idx = db.transactions.findIndex((t: FinancialTransaction) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Transaksi tidak ditemukan" });

  db.transactions[idx] = { ...db.transactions[idx], ...req.body };
  saveDB(db);
  res.json(db.transactions[idx]);
});

app.delete("/api/finance/transactions/:id", (req: Request, res: Response) => {
  const db = loadDB();
  db.transactions = db.transactions.filter((t: FinancialTransaction) => t.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

app.get("/api/finance/summary", (req: Request, res: Response) => {
  const db = loadDB();
  const transactions: FinancialTransaction[] = db.transactions;
  const bookings: Booking[] = db.bookings;
  const vessels: Vessel[] = db.vessels;

  let totalRevenue = 0;
  let totalExpense = 0;
  let unpaidReceivables = 0;

  transactions.forEach((tx) => {
    if (tx.status === "Settled" || tx.status === "Approved") {
      if (tx.type === "Income") totalRevenue += tx.amount;
      if (tx.type === "Expense") totalExpense += tx.amount;
    }
  });

  bookings.forEach((b) => {
    if (b.paymentStatus === "Unpaid") unpaidReceivables += b.totalCost;
    if (b.paymentStatus === "Deposit Paid") unpaidReceivables += b.totalCost * 0.5;
  });

  const netProfit = totalRevenue - totalExpense;
  const profitMarginPercent = totalRevenue > 0 ? Number(((netProfit / totalRevenue) * 100).toFixed(1)) : 0;

  // Monthly trends
  const monthlyData = [
    { month: "Apr 2026", revenue: 145000000, expense: 98000000, profit: 47000000 },
    { month: "Mei 2026", revenue: 168000000, expense: 112000000, profit: 56000000 },
    { month: "Jun 2026", revenue: 195000000, expense: 124000000, profit: 71000000 },
    { month: "Jul 2026", revenue: 210000000, expense: 135000000, profit: 75000000 },
    { month: "Agu 2026", revenue: totalRevenue, expense: totalExpense, profit: netProfit }
  ];

  // Expense categories
  const expenseCatMap: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "Expense")
    .forEach((t) => {
      expenseCatMap[t.category] = (expenseCatMap[t.category] || 0) + t.amount;
    });

  const expenseBreakdown = Object.entries(expenseCatMap).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalExpense > 0 ? Number(((amount / totalExpense) * 100).toFixed(1)) : 0
  }));

  // Vessel profitability
  const vesselProfitability = vessels.map((v) => {
    const vIncome = transactions
      .filter((t) => t.vesselId === v.id && t.type === "Income")
      .reduce((sum, t) => sum + t.amount, 0);
    const vExpense = transactions
      .filter((t) => t.vesselId === v.id && t.type === "Expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      vesselId: v.id,
      vesselName: v.name,
      revenue: vIncome,
      expense: vExpense,
      profit: vIncome - vExpense
    };
  });

  res.json({
    totalRevenue,
    totalExpense,
    netProfit,
    profitMarginPercent,
    unpaidReceivables,
    monthlyData,
    expenseBreakdown,
    vesselProfitability
  });
});

// 6. Tracking Lookup
app.get("/api/tracking/:query", (req: Request, res: Response) => {
  const db = loadDB();
  const query = (req.params.query || "").trim().toLowerCase();

  // Search in bookings
  const booking = db.bookings.find(
    (b: Booking) =>
      b.blNumber.toLowerCase() === query ||
      b.bookingNumber.toLowerCase() === query ||
      b.id.toLowerCase() === query
  );

  // Search vessel
  const vessel = db.vessels.find(
    (v: Vessel) =>
      v.id.toLowerCase() === query ||
      v.name.toLowerCase().includes(query) ||
      v.mmsi === query ||
      v.callSign.toLowerCase() === query
  );

  if (booking) {
    const linkedVessel = db.vessels.find((v: Vessel) => v.id === booking.vesselId);
    return res.json({ type: "booking", data: booking, vessel: linkedVessel });
  }

  if (vessel) {
    const activeVoyages = db.voyages.filter((voy: Voyage) => voy.vesselId === vessel.id);
    const activeBookings = db.bookings.filter((b: Booking) => b.vesselId === vessel.id);
    return res.json({ type: "vessel", data: vessel, voyages: activeVoyages, bookings: activeBookings });
  }

  res.status(404).json({ error: "Nomor resi, B/L, atau kapal tidak ditemukan." });
});

// 7. Reset / Re-seed database
app.post("/api/seed", (req: Request, res: Response) => {
  const init = getInitialData();
  saveDB(init);
  res.json({ success: true, message: "Basis data berhasil direset ke data default maritim." });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Marine Freight Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
