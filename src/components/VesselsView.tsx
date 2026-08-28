import React, { useState } from "react";
import { Vessel, VesselStatus, User } from "../types";
import { Ship, Plus, Edit3, Trash2, Gauge, Compass, MapPin, Anchor, RefreshCw, AlertCircle } from "lucide-react";

interface VesselsViewProps {
  vessels: Vessel[];
  currentUser: User | null;
  onOpenNewVessel: () => void;
  onEditVessel: (vessel: Vessel) => void;
  onDeleteVessel: (id: string) => Promise<void>;
  onSimulateAIS: (vesselId: string) => Promise<void>;
}

export const VesselsView: React.FC<VesselsViewProps> = ({
  vessels,
  currentUser,
  onOpenNewVessel,
  onEditVessel,
  onDeleteVessel,
  onSimulateAIS
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [simulatingId, setSimulatingId] = useState<string | null>(null);

  const filteredVessels = vessels.filter((v) => {
    const matchStatus = filterStatus === "ALL" || v.status === filterStatus;
    const matchType = filterType === "ALL" || v.type === filterType;
    return matchStatus && matchType;
  });

  const getStatusBadge = (status: VesselStatus) => {
    switch (status) {
      case "Underway":
        return "bg-[#8BA88E]/20 text-[#213C23] border-[#8BA88E]/40";
      case "Moored":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Anchored":
        return "bg-[#2D4B5A]/10 text-[#2D4B5A] border-[#2D4B5A]/20";
      case "Docking":
      case "Maintenance":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-[#EAE7E2] text-[#4A443F] border-[#DCD8D3]";
    }
  };

  const handleSimulate = async (id: string) => {
    setSimulatingId(id);
    try {
      await onSimulateAIS(id);
    } finally {
      setSimulatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kapal ini dari daftar armada?")) {
      await onDeleteVessel(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E5E1DA] rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Ship className="w-6 h-6 text-[#8BA88E]" />
            <h2 className="text-xl font-bold text-[#2D4B5A]">
              Manajemen Armada Kapal (Fleet & AIS Vessel Operations)
            </h2>
          </div>
          <p className="text-xs text-[#7A746F] mt-1">
            Data teknis spesifikasi kapal, transponder AIS, muatan DWT, jumlah awak kapal, dan status pelayaran.
          </p>
        </div>

        {(currentUser?.role === "owner" || currentUser?.role === "agent") && (
          <button
            onClick={onOpenNewVessel}
            className="bg-[#2D4B5A] hover:bg-[#223A47] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-[#2D4B5A]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#8BA88E]" />
            Tambah Kapal Baru
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E5E1DA] rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#7A746F] font-medium">Tipe Kapal:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
          >
            <option value="ALL">Semua Tipe Kapal</option>
            <option value="Container">Container</option>
            <option value="LCT">LCT</option>
            <option value="Tug & Barge">Tug & Barge</option>
            <option value="General Cargo">General Cargo</option>
            <option value="Bulk Carrier">Bulk Carrier</option>
            <option value="Tanker">Tanker</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#7A746F] font-medium">Status Operasi:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
          >
            <option value="ALL">Semua Status</option>
            <option value="Underway">Berlayar (Underway)</option>
            <option value="Moored">Sandar (Moored)</option>
            <option value="Anchored">Labuh Jangkar (Anchored)</option>
            <option value="Docking">Docking Galangan</option>
            <option value="Maintenance">Perbaikan</option>
          </select>
        </div>
      </div>

      {/* Vessels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVessels.map((v) => (
          <div
            key={v.id}
            className="bg-white border border-[#E5E1DA] hover:border-[#DCD8D3] rounded-2xl overflow-hidden shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              {/* Photo Banner */}
              <div className="relative h-44 bg-[#EAE7E2] overflow-hidden">
                <img
                  src={v.photoUrl || "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600"}
                  alt={v.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border backdrop-blur-md ${getStatusBadge(
                      v.status
                    )}`}
                  >
                    {v.status === "Underway" ? "🚢 Berlayar" : v.status}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-base font-bold text-white leading-tight drop-shadow">
                    {v.name}
                  </h3>
                  <div className="text-xs text-slate-100 flex items-center gap-2 mt-0.5">
                    <span>{v.type}</span>
                    <span>•</span>
                    <span>DWT {v.dwt.toLocaleString()} MT</span>
                    <span>•</span>
                    <span>Tahun {v.yearBuilt}</span>
                  </div>
                </div>
              </div>

              {/* Body details */}
              <div className="p-4 space-y-3 text-xs">
                {/* AIS Specs Box */}
                <div className="grid grid-cols-3 gap-2 bg-[#F8F5F2] p-2.5 rounded-xl border border-[#E5E1DA] text-center">
                  <div>
                    <span className="text-[10px] text-[#7A746F] block font-medium">Call Sign</span>
                    <span className="font-mono font-bold text-[#4A443F]">{v.callSign}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A746F] block font-medium">MMSI</span>
                    <span className="font-mono font-bold text-[#4A443F]">{v.mmsi}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A746F] block font-medium">IMO</span>
                    <span className="font-mono font-bold text-[#4A443F]">{v.imo}</span>
                  </div>
                </div>

                {/* Telemetry live */}
                <div className="space-y-1.5 text-[#4A443F]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#7A746F] flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-[#8BA88E]" /> Kecepatan AIS:
                    </span>
                    <span className="font-bold text-[#2D4B5A] font-mono">{v.speedKnots} Knots</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#7A746F] flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-[#8BA88E]" /> Arah Haluan:
                    </span>
                    <span className="font-bold text-[#2D4B5A] font-mono">{v.headingDeg}°</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#7A746F] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8BA88E]" /> Lokasi:
                    </span>
                    <span className="font-medium text-[#4A443F] truncate max-w-[150px]">
                      {v.currentLocationName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#7A746F]">Tujuan & ETA:</span>
                    <span className="font-medium text-[#2D4B5A] truncate max-w-[150px]">
                      {v.destinationPort.split(",")[0]} ({v.eta.split(" ")[0]})
                    </span>
                  </div>
                </div>

                {/* Fuel & Crew */}
                <div className="pt-2 border-t border-[#E5E1DA] flex items-center justify-between text-[11px] text-[#7A746F]">
                  <div>
                    Nahkoda: <strong className="text-[#4A443F]">{v.captainName}</strong> ({v.crewCount} Awak)
                  </div>
                  <div className="flex items-center gap-1">
                    <span>BBM:</span>
                    <strong className="text-[#2D4B5A]">{v.fuelLevelPercent}%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-3 bg-[#F8F5F2] border-t border-[#E5E1DA] flex items-center justify-between gap-2">
              <button
                onClick={() => handleSimulate(v.id)}
                disabled={simulatingId === v.id}
                className="flex items-center gap-1 text-xs font-semibold text-[#2D4B5A] hover:text-[#223A47] bg-white hover:bg-[#EAE7E2] px-2.5 py-1.5 rounded-lg border border-[#E5E1DA] transition-colors cursor-pointer disabled:opacity-50"
                title="Simulasikan pergerakan posisi AIS dan telemetri kapal"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#8BA88E] ${simulatingId === v.id ? "animate-spin" : ""}`} />
                Update AIS
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEditVessel(v)}
                  title="Edit Data Kapal"
                  className="p-1.5 text-[#7A746F] hover:text-[#2D4B5A] hover:bg-white rounded-lg transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  title="Hapus Kapal"
                  className="p-1.5 text-[#7A746F] hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
