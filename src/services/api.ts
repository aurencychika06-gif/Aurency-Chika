import { Vessel, Voyage, Booking, FinancialTransaction, FinancialSummary, User, UserRole } from "../types";

const BASE_URL = "/api";

export const api = {
  // Auth
  async login(email: string, role?: UserRole): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role })
    });
    if (!res.ok) throw new Error("Gagal login");
    return res.json();
  },

  async register(data: Partial<User>): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Gagal mendaftar");
    return res.json();
  },

  // Vessels CRUD
  async getVessels(): Promise<Vessel[]> {
    const res = await fetch(`${BASE_URL}/vessels`);
    if (!res.ok) throw new Error("Gagal memuat data kapal");
    return res.json();
  },

  async createVessel(data: Partial<Vessel>): Promise<Vessel> {
    const res = await fetch(`${BASE_URL}/vessels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Gagal menambahkan armada kapal");
    return res.json();
  },

  async updateVessel(id: string, data: Partial<Vessel>): Promise<Vessel> {
    const res = await fetch(`${BASE_URL}/vessels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Gagal memperbarui data kapal");
    return res.json();
  },

  async deleteVessel(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/vessels/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Gagal menghapus kapal");
    return true;
  },

  // Voyages CRUD
  async getVoyages(): Promise<Voyage[]> {
    const res = await fetch(`${BASE_URL}/voyages`);
    if (!res.ok) throw new Error("Gagal memuat jadwal pelayaran");
    return res.json();
  },

  async createVoyage(data: Partial<Voyage>): Promise<Voyage> {
    const res = await fetch(`${BASE_URL}/voyages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Gagal menambahkan jadwal pelayaran");
    return res.json();
  },

  async updateVoyage(id: string, data: Partial<Voyage>): Promise<Voyage> {
    const res = await fetch(`${BASE_URL}/voyages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Gagal memperbarui jadwal");
    return res.json();
  },

  async deleteVoyage(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/voyages/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Gagal menghapus jadwal");
    return true;
  },

  // Bookings CRUD
  async getBookings(): Promise<Booking[]> {
    const res = await fetch(`${BASE_URL}/bookings`);
    if (!res.ok) throw new Error("Gagal memuat daftar pemesanan");
    return res.json();
  },

  async createBooking(data: Partial<Booking>): Promise<Booking> {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Gagal membuat pemesanan kargo");
    return res.json();
  },

  async updateBooking(id: string, data: Partial<Booking>): Promise<Booking> {
    const res = await fetch(`${BASE_URL}/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Gagal memperbarui data pemesanan");
    return res.json();
  },

  async deleteBooking(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/bookings/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Gagal menghapus pemesanan");
    return true;
  },

  // Finance CRUD & Analytics
  async getTransactions(): Promise<FinancialTransaction[]> {
    const res = await fetch(`${BASE_URL}/finance/transactions`);
    if (!res.ok) throw new Error("Gagal memuat transaksi keuangan");
    return res.json();
  },

  async createTransaction(data: Partial<FinancialTransaction>): Promise<FinancialTransaction> {
    const res = await fetch(`${BASE_URL}/finance/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Gagal mencatat transaksi");
    return res.json();
  },

  async updateTransaction(id: string, data: Partial<FinancialTransaction>): Promise<FinancialTransaction> {
    const res = await fetch(`${BASE_URL}/finance/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Gagal memperbarui transaksi");
    return res.json();
  },

  async deleteTransaction(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/finance/transactions/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Gagal menghapus transaksi");
    return true;
  },

  async getFinancialSummary(): Promise<FinancialSummary> {
    const res = await fetch(`${BASE_URL}/finance/summary`);
    if (!res.ok) throw new Error("Gagal memuat ringkasan keuangan");
    return res.json();
  },

  // Tracking Query
  async searchTracking(query: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/tracking/${encodeURIComponent(query)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Data tidak ditemukan" }));
      throw new Error(err.error || "Pencarian tidak ditemukan");
    }
    return res.json();
  },

  // Database Seed
  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/seed`, { method: "POST" });
    if (!res.ok) throw new Error("Gagal mereset database");
    return res.json();
  }
};

export const INDONESIAN_PORTS = [
  "Tanjung Priok, Jakarta",
  "Tanjung Perak, Surabaya",
  "Belawan, Medan",
  "Soekarno-Hatta, Makassar",
  "Semayang, Balikpapan",
  "Trisakti, Banjarmasin",
  "Bitung, Sulawesi Utara",
  "Batu Ampar, Batam",
  "Teluk Bayur, Padang",
  "Panjang, Lampung",
  "Sorong, Papua Barat Daya",
  "Tanjung Emas, Semarang"
];

export const formatCurrencyIDR = (val: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(val);
};
