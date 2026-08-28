import React, { useState } from "react";
import { Voyage, Vessel, User } from "../types";
import { Anchor, Plus, Search, Calendar, MapPin, DollarSign, ArrowRight, Edit3, Trash2, Ship, Clock } from "lucide-react";
import { formatCurrencyIDR } from "../services/api";

interface VoyagesViewProps {
  voyages: Voyage[];
  vessels: Vessel[];
  currentUser: User | null;
  onOpenNewVoyage: () => void;
  onEditVoyage: (voyage: Voyage) => void;
  onDeleteVoyage: (id: string) => Promise<void>;
  onBookVoyage: (voyage: Voyage) => void;
}

export const VoyagesView: React.FC<VoyagesViewProps> = ({
  voyages,
  vessels,
  currentUser,
  onOpenNewVoyage,
  onEditVoyage,
  onDeleteVoyage,
  onBookVoyage
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredVoyages = voyages.filter((voy) => {
    const matchSearch =
      voy.voyageNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voy.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voy.originPort.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voy.destinationPort.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === "ALL" || voy.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: Voyage["status"]) => {
    switch (status) {
      case "En Route":
        return "bg-[#2D4B5A]/10 text-[#2D4B5A] border-[#2D4B5A]/20";
      case "Loading":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Scheduled":
        return "bg-[#8BA88E]/20 text-[#213C23] border-[#8BA88E]/40";
      case "Discharging":
        return "bg-[#EAE7E2] text-[#4A443F] border-[#DCD8D3]";
      case "Completed":
        return "bg-[#8BA88E] text-[#142816] border-transparent";
      case "Delayed":
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jadwal pelayaran ini?")) {
      await onDeleteVoyage(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E5E1DA] rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Anchor className="w-6 h-6 text-[#8BA88E]" />
            <h2 className="text-xl font-bold text-[#2D4B5A]">
              Jadwal & Rute Pelayaran Kapal (Schedules & Voyages)
            </h2>
          </div>
          <p className="text-xs text-[#7A746F] mt-1">
            Informasi waktu keberangkatan (ETD), estimasi tiba (ETA), sisa slot kapasitas kontainer TEU, dan tarif angkutan.
          </p>
        </div>

        {(currentUser?.role === "owner" || currentUser?.role === "agent") && (
          <button
            onClick={onOpenNewVoyage}
            className="bg-[#2D4B5A] hover:bg-[#223A47] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-[#2D4B5A]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#8BA88E]" />
            Tambah Jadwal Pelayaran
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-[#E5E1DA] rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#7A746F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari rute, pelabuhan, atau nama kapal..."
            className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl pl-9 pr-3 py-2 text-[#4A443F] placeholder-[#A19B95] focus:outline-none focus:border-[#2D4B5A]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#7A746F] font-medium">Status Pelayaran:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
          >
            <option value="ALL">Semua Status</option>
            <option value="Scheduled">Scheduled (Terjadwal)</option>
            <option value="Loading">Loading (Sedang Muat)</option>
            <option value="En Route">En Route (Berlayar)</option>
            <option value="Discharging">Discharging (Bongkar)</option>
            <option value="Completed">Completed (Selesai)</option>
            <option value="Delayed">Delayed (Tertunda)</option>
          </select>
        </div>
      </div>

      {/* Voyages Cards */}
      <div className="space-y-4">
        {filteredVoyages.map((voy) => {
          const percentCapacity = Math.min(100, Math.round((voy.bookedCapacityTeu / voy.totalCapacityTeu) * 100));
          const availableSlots = Math.max(0, voy.totalCapacityTeu - voy.bookedCapacityTeu);

          return (
            <div
              key={voy.id}
              className="bg-white border border-[#E5E1DA] hover:border-[#DCD8D3] rounded-2xl p-5 shadow-sm transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[#E5E1DA]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#2D4B5A] bg-[#EAE7E2] px-2 py-0.5 rounded border border-[#DCD8D3]">
                      {voy.voyageNumber}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(voy.status)}`}>
                      {voy.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#2D4B5A] flex items-center gap-2 mt-1">
                    <Ship className="w-4 h-4 text-[#8BA88E]" />
                    {voy.vesselName}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onBookVoyage(voy)}
                    className="bg-[#2D4B5A] hover:bg-[#223A47] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-[#2D4B5A]/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Pesan Muatan di Rute Ini</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8BA88E]" />
                  </button>

                  {(currentUser?.role === "owner" || currentUser?.role === "agent") && (
                    <>
                      <button
                        onClick={() => onEditVoyage(voy)}
                        className="p-2 text-[#7A746F] hover:text-[#2D4B5A] bg-[#F8F5F2] hover:bg-[#EAE7E2] rounded-lg border border-[#E5E1DA] transition-colors cursor-pointer"
                        title="Edit Jadwal"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(voy.id)}
                        className="p-2 text-[#7A746F] hover:text-rose-600 bg-[#F8F5F2] hover:bg-rose-50 rounded-lg border border-[#E5E1DA] transition-colors cursor-pointer"
                        title="Hapus Jadwal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Middle Section: Route Ports & Times */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F8F5F2] p-4 rounded-xl border border-[#E5E1DA] text-xs">
                {/* Departure */}
                <div>
                  <span className="text-[10px] text-[#7A746F] uppercase font-semibold block">
                    Pelabuhan Asal & Keberangkatan (ETD)
                  </span>
                  <div className="font-bold text-[#4A443F] text-sm mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8BA88E]" />
                    {voy.originPort}
                  </div>
                  <div className="text-[#7A746F] flex items-center gap-1 mt-1 font-mono">
                    <Clock className="w-3 h-3 text-[#8BA88E]" />
                    {voy.etd}
                  </div>
                </div>

                {/* Transit Days & Arrow */}
                <div className="flex flex-col items-center justify-center py-2 md:py-0 border-y md:border-y-0 md:border-x border-[#E5E1DA]">
                  <div className="text-[#7A746F] text-[11px] font-medium">Estimasi Waktu Tempuh</div>
                  <div className="text-sm font-bold text-[#2D4B5A] mt-0.5">
                    ~ {voy.transitDays} Hari Berlayar
                  </div>
                  <div className="w-24 h-0.5 bg-[#8BA88E]/50 mt-1 relative flex items-center justify-end">
                    <ArrowRight className="w-3.5 h-3.5 text-[#8BA88E] -mr-1" />
                  </div>
                </div>

                {/* Arrival */}
                <div className="md:text-right">
                  <span className="text-[10px] text-[#7A746F] uppercase font-semibold block">
                    Pelabuhan Tujuan & Estimasi Sandar (ETA)
                  </span>
                  <div className="font-bold text-[#4A443F] text-sm mt-0.5 flex items-center md:justify-end gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8BA88E]" />
                    {voy.destinationPort}
                  </div>
                  <div className="text-[#7A746F] flex items-center md:justify-end gap-1 mt-1 font-mono">
                    <Clock className="w-3 h-3 text-[#8BA88E]" />
                    {voy.eta}
                  </div>
                </div>
              </div>

              {/* Bottom: Capacity & Rates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                {/* TEU Capacity Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[#4A443F]">
                    <span>
                      Kapasitas Terisi: <strong>{voy.bookedCapacityTeu}</strong> / {voy.totalCapacityTeu} TEU
                    </span>
                    <span className="font-bold text-[#2D4B5A]">{percentCapacity}%</span>
                  </div>
                  <div className="w-full bg-[#EAE7E2] h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        percentCapacity > 90 ? "bg-rose-500" : percentCapacity > 70 ? "bg-amber-500" : "bg-[#8BA88E]"
                      }`}
                      style={{ width: `${percentCapacity}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[#7A746F] block">
                    Sisa Slot Tersedia: <strong className="text-[#2D4B5A]">{availableSlots} TEU</strong>
                  </span>
                </div>

                {/* Pricing Badges */}
                <div className="flex flex-wrap items-center sm:justify-end gap-3">
                  <div className="bg-[#F8F5F2] px-3 py-2 rounded-xl border border-[#E5E1DA] text-right">
                    <span className="text-[10px] text-[#7A746F] block font-medium">Tarif per TEU (Kontainer)</span>
                    <span className="font-bold text-[#2D4B5A] text-sm">
                      {formatCurrencyIDR(voy.pricePerTeu)}
                    </span>
                  </div>
                  <div className="bg-[#F8F5F2] px-3 py-2 rounded-xl border border-[#E5E1DA] text-right">
                    <span className="text-[10px] text-[#7A746F] block font-medium">Tarif per Ton (General)</span>
                    <span className="font-bold text-[#2D4B5A] text-sm">
                      {formatCurrencyIDR(voy.pricePerTon)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
