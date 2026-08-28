import React, { useState } from "react";
import { Booking, BookingStatus, PaymentStatus, User } from "../types";
import { Package, Search, Plus, Filter, FileText, Trash2, Edit3, CheckCircle2, ArrowRight, Shield, MapPin, DollarSign, Clock } from "lucide-react";
import { formatCurrencyIDR } from "../services/api";

interface BookingsViewProps {
  bookings: Booking[];
  currentUser: User | null;
  onOpenNewBooking: () => void;
  onEditBooking: (booking: Booking) => void;
  onDeleteBooking: (id: string) => Promise<void>;
  onUpdateStatus: (id: string, status: BookingStatus, payment?: PaymentStatus) => Promise<void>;
  onOpenBillOfLading: (booking: Booking) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  currentUser,
  onOpenNewBooking,
  onEditBooking,
  onDeleteBooking,
  onUpdateStatus,
  onOpenBillOfLading
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    // If customer role, only show own bookings or all if demo
    const matchesSearch =
      b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.blNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.cargoDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vesselName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || b.bookingStatus === statusFilter;
    const matchesPayment = paymentFilter === "ALL" || b.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "In Transit":
        return "bg-[#2D4B5A]/10 text-[#2D4B5A] border-[#2D4B5A]/20";
      case "Loaded":
        return "bg-[#8BA88E]/20 text-[#213C23] border-[#8BA88E]/40";
      case "Port Gate-In":
        return "bg-[#EAE7E2] text-[#4A443F] border-[#DCD8D3]";
      case "Confirmed":
        return "bg-[#8BA88E]/15 text-[#2D4B5A] border-[#8BA88E]/30";
      case "Delivered":
        return "bg-[#8BA88E] text-[#142816] border-transparent";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Pending":
      default:
        return "bg-amber-50 text-amber-800 border-amber-200";
    }
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case "Paid in Full":
        return "bg-[#8BA88E]/20 text-[#213C23] border-[#8BA88E]/40 font-bold";
      case "Deposit Paid":
        return "bg-[#2D4B5A]/10 text-[#2D4B5A] border-[#2D4B5A]/20";
      case "Overdue":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Unpaid":
      default:
        return "bg-amber-50 text-amber-800 border-amber-200";
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data pemesanan kargo ini?")) {
      setDeletingId(id);
      try {
        await onDeleteBooking(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-white border border-[#E5E1DA] rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-[#8BA88E]" />
            <h2 className="text-xl font-bold text-[#2D4B5A]">
              Manajemen Pemesanan Kargo (Cargo Bookings & Manifest)
            </h2>
          </div>
          <p className="text-xs text-[#7A746F] mt-1">
            Kelola pengajuan slot kontainer kapal, surat jalan Bill of Lading (B/L), dan pembayaran muatan laut.
          </p>
        </div>

        <button
          onClick={onOpenNewBooking}
          className="bg-[#2D4B5A] hover:bg-[#223A47] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-[#2D4B5A]/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#8BA88E]" />
          Buat Pemesanan Kargo Baru
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E5E1DA] rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#7A746F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari B/L, Booking Ref, Shipper, atau Nama Kapal..."
            className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl pl-9 pr-3 py-2 text-[#4A443F] placeholder-[#A19B95] focus:outline-none focus:border-[#2D4B5A]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#7A746F] font-medium">Status Muatan:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
          >
            <option value="ALL">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Port Gate-In">Port Gate-In</option>
            <option value="Loaded">Loaded (Dimuat)</option>
            <option value="In Transit">In Transit (Berlayar)</option>
            <option value="Arrived">Arrived (Sandar)</option>
            <option value="Delivered">Delivered (Selesai)</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#7A746F] font-medium">Pembayaran:</span>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
          >
            <option value="ALL">Semua Pembayaran</option>
            <option value="Paid in Full">Lunas (Paid in Full)</option>
            <option value="Deposit Paid">Uang Muka (Deposit Paid)</option>
            <option value="Unpaid">Belum Dibayar (Unpaid)</option>
            <option value="Overdue">Jatuh Tempo</option>
          </select>
        </div>
      </div>

      {/* Bookings Table / Grid List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-[#E5E1DA] hover:border-[#DCD8D3] rounded-2xl p-5 shadow-sm transition-all space-y-4"
            >
              {/* Top Row: Ref, BL, Badges, Actions */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[#E5E1DA]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2D4B5A] flex items-center justify-center text-white font-mono font-bold text-xs shadow-sm">
                    {b.quantity}x
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#2D4B5A]">{b.blNumber}</span>
                      <span className="text-xs font-mono text-[#7A746F]">({b.bookingNumber})</span>
                    </div>
                    <p className="text-xs text-[#4A443F] font-semibold mt-0.5">
                      {b.customerCompany} • <span className="text-[#7A746F] font-normal">{b.customerName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(
                      b.bookingStatus
                    )}`}
                  >
                    {b.bookingStatus}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getPaymentBadge(
                      b.paymentStatus
                    )}`}
                  >
                    {b.paymentStatus}
                  </span>

                  {/* Actions Dropdown / Buttons */}
                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      onClick={() => onOpenBillOfLading(b)}
                      title="Cetak Bill of Lading (Konosemen)"
                      className="p-2 text-[#2D4B5A] hover:text-[#223A47] bg-[#F8F5F2] hover:bg-[#EAE7E2] rounded-lg border border-[#E5E1DA] transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#8BA88E]" />
                      <span className="hidden sm:inline">B/L Dokumen</span>
                    </button>
                    <button
                      onClick={() => onEditBooking(b)}
                      title="Edit Data Pemesanan"
                      className="p-2 text-[#7A746F] hover:text-[#2D4B5A] bg-[#F8F5F2] hover:bg-[#EAE7E2] rounded-lg border border-[#E5E1DA] transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      disabled={deletingId === b.id}
                      title="Hapus Pemesanan"
                      className="p-2 text-[#7A746F] hover:text-rose-600 bg-[#F8F5F2] hover:bg-rose-50 rounded-lg border border-[#E5E1DA] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Middle Grid: Cargo & Route Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#F8F5F2] p-3 rounded-xl border border-[#E5E1DA]">
                  <span className="text-[10px] text-[#7A746F] block uppercase font-medium">Muatan Barang</span>
                  <div className="font-bold text-[#4A443F] mt-0.5">{b.cargoDescription}</div>
                  <span className="text-[11px] text-[#7A746F] block mt-0.5">
                    {b.cargoType} • {b.weightTons} MT
                  </span>
                </div>

                <div className="bg-[#F8F5F2] p-3 rounded-xl border border-[#E5E1DA]">
                  <span className="text-[10px] text-[#7A746F] block uppercase font-medium">Kapal Pengangkut</span>
                  <div className="font-bold text-[#2D4B5A] mt-0.5">{b.vesselName}</div>
                  <span className="text-[11px] text-[#7A746F] block mt-0.5">
                    Agen: {b.agentName || "PT Samudera Logistik"}
                  </span>
                </div>

                <div className="bg-[#F8F5F2] p-3 rounded-xl border border-[#E5E1DA]">
                  <span className="text-[10px] text-[#7A746F] block uppercase font-medium">Rute Pelabuhan</span>
                  <div className="font-bold text-[#4A443F] mt-0.5 flex items-center gap-1">
                    {b.originPort.split(",")[0]}
                    <ArrowRight className="w-3 h-3 text-[#8BA88E]" />
                    {b.destinationPort.split(",")[0]}
                  </div>
                  <span className="text-[11px] text-[#7A746F] block mt-0.5 truncate">
                    Penerima: {b.consigneeName}
                  </span>
                </div>

                <div className="bg-[#F8F5F2] p-3 rounded-xl border border-[#E5E1DA]">
                  <span className="text-[10px] text-[#7A746F] block uppercase font-medium">Total Ongkos Angkut</span>
                  <div className="font-bold text-[#2D4B5A] text-sm mt-0.5">
                    {formatCurrencyIDR(b.totalCost)}
                  </div>
                  <span className="text-[10px] text-[#7A746F] block mt-0.5 font-medium">
                    {b.hasInsurance ? "🛡️ Asuransi Aktif" : "Non-Asuransi"}
                  </span>
                </div>
              </div>

              {/* Bottom Row: Quick Status Pipeline Updater (Owner & Agent can quick update) */}
              {(currentUser?.role === "owner" || currentUser?.role === "agent") && (
                <div className="pt-2 border-t border-[#E5E1DA] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#7A746F] text-[11px] font-semibold">Ubah Status Operasional:</span>
                    <div className="flex flex-wrap gap-1">
                      {["Confirmed", "Port Gate-In", "Loaded", "In Transit", "Arrived", "Delivered"].map(
                        (st) => (
                          <button
                            key={st}
                            onClick={() => onUpdateStatus(b.id, st as BookingStatus)}
                            className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                              b.bookingStatus === st
                                ? "bg-[#2D4B5A] text-white"
                                : "bg-[#F8F5F2] text-[#7A746F] hover:text-[#2D4B5A] hover:bg-[#EAE7E2] border border-[#E5E1DA]"
                            }`}
                          >
                            {st}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#7A746F] text-[11px] font-semibold">Status Bayar:</span>
                    <button
                      onClick={() =>
                        onUpdateStatus(
                          b.id,
                          b.bookingStatus,
                          b.paymentStatus === "Paid in Full" ? "Unpaid" : "Paid in Full"
                        )
                      }
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all border cursor-pointer ${
                        b.paymentStatus === "Paid in Full"
                          ? "bg-[#8BA88E]/20 text-[#213C23] border-[#8BA88E]/40"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {b.paymentStatus === "Paid in Full" ? "✓ Lunas" : "Set Lunas"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white border border-[#E5E1DA] rounded-2xl p-12 text-center text-[#7A746F] shadow-sm">
            <Package className="w-12 h-12 mx-auto text-[#A19B95] mb-3" />
            <h3 className="text-base font-bold text-[#4A443F]">Tidak ada data pemesanan kargo</h3>
            <p className="text-xs text-[#7A746F] mt-1">Coba sesuaikan kata kunci pencarian atau buat booking kargo baru.</p>
            <button
              onClick={onOpenNewBooking}
              className="mt-4 inline-flex items-center gap-2 bg-[#2D4B5A] hover:bg-[#223A47] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-[#2D4B5A]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#8BA88E]" />
              Buat Pemesanan Sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
