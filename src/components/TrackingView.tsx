import React, { useState } from "react";
import { Vessel, Booking, Voyage } from "../types";
import { MarineMap } from "./MarineMap";
import { Search, Compass, Ship, Package, CheckCircle2, Clock, MapPin, Gauge, Shield, ArrowRight, Anchor, Info } from "lucide-react";
import { api, formatCurrencyIDR } from "../services/api";

interface TrackingViewProps {
  vessels: Vessel[];
  bookings: Booking[];
  voyages: Voyage[];
  onOpenNewBooking: () => void;
  onOpenBillOfLading: (booking: Booking) => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({
  vessels,
  bookings,
  voyages,
  onOpenNewBooking,
  onOpenBillOfLading
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVessel, setSelectedVessel] = useState<Vessel>(vessels[0] || null);
  const [trackedBooking, setTrackedBooking] = useState<Booking | null>(bookings[0] || null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchError(null);
    setIsSearching(true);

    try {
      const result = await api.searchTracking(searchQuery.trim());
      if (result.type === "booking") {
        setTrackedBooking(result.data);
        if (result.vessel) {
          setSelectedVessel(result.vessel);
        }
      } else if (result.type === "vessel") {
        setSelectedVessel(result.data);
        const relatedBooking = bookings.find((b) => b.vesselId === result.data.id);
        if (relatedBooking) setTrackedBooking(relatedBooking);
      }
    } catch (err: any) {
      setSearchError(err.message || "Pencarian tidak ditemukan. Masukkan nomor B/L, Resi, atau nama kapal yang valid.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectQuickTrack = (booking: Booking) => {
    setTrackedBooking(booking);
    const v = vessels.find((ves) => ves.id === booking.vesselId);
    if (v) setSelectedVessel(v);
  };

  return (
    <div className="space-y-6">
      {/* Top Search Bar with quick chips */}
      <div className="bg-white border border-[#E5E1DA] rounded-2xl p-5 shadow-sm">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-[#2D4B5A] tracking-tight flex items-center justify-center gap-2">
              <Compass className="w-6 h-6 text-[#8BA88E]" />
              Pelacakan Muatan Kargo & Armada Kapal Real-Time
            </h2>
            <p className="text-xs text-[#7A746F] mt-1">
              Lacak posisi kapal via AIS Maritim atau pantau status kontainer dengan Nomor Bill of Lading (B/L)
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#7A746F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Masukkan Nomor B/L (contoh: BL-NSM-99124) atau Nama Kapal (KM Nusantara Express I)..."
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#4A443F] placeholder-[#A19B95] focus:outline-none focus:border-[#2D4B5A]"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-[#2D4B5A] hover:bg-[#223A47] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md shadow-[#2D4B5A]/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSearching ? "Mencari..." : "Lacak Kargo"}
            </button>
          </form>

          {searchError && (
            <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-center">
              {searchError}
            </div>
          )}

          {/* Quick Tracking Sample Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs">
            <span className="text-[#7A746F] text-[11px] font-medium">Resi Contoh:</span>
            {bookings.slice(0, 3).map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleSelectQuickTrack(b)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all border cursor-pointer ${
                  trackedBooking?.id === b.id
                    ? "bg-[#2D4B5A] text-white border-[#2D4B5A]"
                    : "bg-[#F8F5F2] text-[#4A443F] border-[#E5E1DA] hover:bg-[#EAE7E2]"
                }`}
              >
                {b.blNumber} ({b.vesselName.split(" ")[1] || "Kapal"})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Marine Map */}
      <div>
        <MarineMap
          vessels={vessels}
          selectedVesselId={selectedVessel?.id}
          onSelectVessel={(v) => {
            setSelectedVessel(v);
            const b = bookings.find((bk) => bk.vesselId === v.id);
            if (b) setTrackedBooking(b);
          }}
          activeBooking={trackedBooking}
        />
      </div>

      {/* Tracking Details Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cargo Status & Milestones Timeline */}
        <div className="lg:col-span-2 bg-white border border-[#E5E1DA] rounded-2xl p-5 shadow-sm space-y-5">
          {trackedBooking ? (
            <>
              {/* Header Status Card */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[#E5E1DA]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#2D4B5A] font-bold bg-[#EAE7E2] px-2 py-0.5 rounded border border-[#DCD8D3]">
                      {trackedBooking.blNumber}
                    </span>
                    <span className="text-xs text-[#7A746F] font-mono">
                      Ref: {trackedBooking.bookingNumber}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#2D4B5A] mt-1">
                    {trackedBooking.cargoDescription}
                  </h3>
                  <p className="text-xs text-[#7A746F]">
                    Pengirim: <strong className="text-[#4A443F]">{trackedBooking.customerCompany}</strong> • Penerima: <strong className="text-[#4A443F]">{trackedBooking.consigneeName}</strong>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      trackedBooking.bookingStatus === "In Transit"
                        ? "bg-[#2D4B5A]/10 text-[#2D4B5A] border border-[#2D4B5A]/20"
                        : trackedBooking.bookingStatus === "Loaded"
                        ? "bg-[#8BA88E]/20 text-[#254428] border border-[#8BA88E]/40"
                        : trackedBooking.bookingStatus === "Delivered"
                        ? "bg-[#8BA88E] text-[#1A331C]"
                        : "bg-[#A19B95]/20 text-[#4A443F] border border-[#A19B95]/40"
                    }`}
                  >
                    {trackedBooking.bookingStatus === "In Transit" ? "🚢 Sedang Berlayar" : trackedBooking.bookingStatus}
                  </span>

                  <button
                    onClick={() => onOpenBillOfLading(trackedBooking)}
                    className="text-xs font-semibold text-[#2D4B5A] hover:text-[#223A47] bg-[#F8F5F2] hover:bg-[#EAE7E2] px-3 py-1.5 rounded-lg border border-[#E5E1DA] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5 text-[#8BA88E]" />
                    Lihat Dokumen B/L
                  </button>
                </div>
              </div>

              {/* Origin & Destination Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F8F5F2] p-4 rounded-xl border border-[#E5E1DA] text-xs">
                <div>
                  <span className="text-[10px] text-[#7A746F] uppercase block font-semibold">
                    Pelabuhan Muat (POL)
                  </span>
                  <div className="font-bold text-[#2D4B5A] text-sm mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8BA88E]" />
                    {trackedBooking.originPort}
                  </div>
                  <span className="text-[11px] text-[#7A746F]">{trackedBooking.pickupAddress || "Depo Logistik"}</span>
                </div>

                <div className="flex flex-col items-center justify-center py-2 sm:py-0 border-y sm:border-y-0 sm:border-x border-[#E5E1DA]">
                  <div className="text-[#2D4B5A] font-bold flex items-center gap-1">
                    <Ship className="w-4 h-4 text-[#8BA88E]" />
                    {trackedBooking.vesselName}
                  </div>
                  <span className="text-[10px] text-[#7A746F] mt-0.5 font-medium">
                    {trackedBooking.quantity}x {trackedBooking.cargoType} ({trackedBooking.weightTons} MT)
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] text-[#7A746F] uppercase block font-semibold">
                    Pelabuhan Tujuan (POD)
                  </span>
                  <div className="font-bold text-[#2D4B5A] text-sm mt-0.5 flex items-center sm:justify-end gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8BA88E]" />
                    {trackedBooking.destinationPort}
                  </div>
                  <span className="text-[11px] text-[#7A746F]">{trackedBooking.deliveryAddress || "Dermaga Tujuan"}</span>
                </div>
              </div>

              {/* Step-by-Step Cargo Timeline */}
              <div>
                <h4 className="text-xs font-bold text-[#2D4B5A] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8BA88E]" />
                  Kronologi Status Perjalanan Kargo (Milestone Timeline)
                </h4>

                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E1DA]">
                  {trackedBooking.trackingHistory.map((item, idx) => (
                    <div key={item.id} className="relative group">
                      {/* Node circle */}
                      <div
                        className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center ${
                          item.completed
                            ? "bg-[#2D4B5A] text-white shadow-sm"
                            : "bg-[#F8F5F2] text-[#A19B95] border border-[#DCD8D3]"
                        }`}
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#8BA88E]" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A19B95]" />
                        )}
                      </div>

                      <div className="bg-[#F8F5F2] p-3.5 rounded-xl border border-[#E5E1DA] group-hover:border-[#DCD8D3] transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#4A443F]">{item.title}</span>
                          <span className="text-[11px] font-mono text-[#2D4B5A] bg-[#EAE7E2] px-2 py-0.5 rounded font-semibold">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-[#7A746F] mt-1">{item.description}</p>
                        <div className="text-[11px] text-[#A19B95] mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#7A746F]" />
                          Lokasi: {item.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-[#7A746F]">
              <Package className="w-12 h-12 mx-auto text-[#A19B95] mb-3" />
              <p className="text-sm font-semibold text-[#4A443F]">Pilih kargo untuk melihat detail pelacakan</p>
              <p className="text-xs text-[#7A746F] mt-1">Gunakan kotak pencarian di atas untuk memasukkan nomor B/L.</p>
            </div>
          )}
        </div>

        {/* Right Col: Vessel AIS Telemetry & Specs */}
        <div className="bg-white border border-[#E5E1DA] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E1DA]">
            <div className="flex items-center gap-2">
              <Ship className="w-5 h-5 text-[#8BA88E]" />
              <h3 className="font-bold text-sm text-[#2D4B5A]">Telemetri Kapal Pengangkut</h3>
            </div>
            <span className="text-[10px] font-mono bg-[#8BA88E]/20 text-[#213C23] font-bold px-2 py-0.5 rounded-full border border-[#8BA88E]/30">
              AIS Aktif
            </span>
          </div>

          {selectedVessel ? (
            <div className="space-y-4">
              {/* Vessel Image */}
              <div className="relative h-36 rounded-xl overflow-hidden border border-[#E5E1DA]">
                <img
                  src={selectedVessel.photoUrl || "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600"}
                  alt={selectedVessel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                  <span className="text-xs font-bold text-white bg-[#2D4B5A]/80 px-2 py-0.5 rounded backdrop-blur-sm">
                    {selectedVessel.name}
                  </span>
                  <span className="text-[10px] text-slate-100 bg-[#2D4B5A]/80 px-1.5 py-0.5 rounded">
                    {selectedVessel.flag}
                  </span>
                </div>
              </div>

              {/* AIS Quick Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#F8F5F2] p-2.5 rounded-xl border border-[#E5E1DA]">
                  <span className="text-[10px] text-[#7A746F] block font-medium">Call Sign / MMSI</span>
                  <span className="font-bold text-[#4A443F] font-mono">
                    {selectedVessel.callSign} / {selectedVessel.mmsi}
                  </span>
                </div>
                <div className="bg-[#F8F5F2] p-2.5 rounded-xl border border-[#E5E1DA]">
                  <span className="text-[10px] text-[#7A746F] block font-medium">Nomor IMO</span>
                  <span className="font-bold text-[#4A443F] font-mono">{selectedVessel.imo}</span>
                </div>
                <div className="bg-[#F8F5F2] p-2.5 rounded-xl border border-[#E5E1DA]">
                  <span className="text-[10px] text-[#7A746F] block font-medium">Bobot Mati (DWT)</span>
                  <span className="font-bold text-[#4A443F]">{selectedVessel.dwt.toLocaleString()} MT</span>
                </div>
                <div className="bg-[#F8F5F2] p-2.5 rounded-xl border border-[#E5E1DA]">
                  <span className="text-[10px] text-[#7A746F] block font-medium">Kapasitas Maksimal</span>
                  <span className="font-bold text-[#4A443F]">
                    {selectedVessel.capacityTeu ? `${selectedVessel.capacityTeu} TEU` : `${selectedVessel.capacityTon} Ton`}
                  </span>
                </div>
              </div>

              {/* Real-Time Telemetry Bar */}
              <div className="p-3.5 bg-[#F8F5F2] rounded-xl border border-[#E5E1DA] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#4A443F]">
                  <span className="flex items-center gap-1 text-[#7A746F]">
                    <Gauge className="w-3.5 h-3.5 text-[#8BA88E]" />
                    Kecepatan Kapal:
                  </span>
                  <span className="font-bold text-[#2D4B5A] font-mono text-sm">
                    {selectedVessel.speedKnots} Knots
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#4A443F]">
                  <span className="flex items-center gap-1 text-[#7A746F]">
                    <Compass className="w-3.5 h-3.5 text-[#8BA88E]" />
                    Arah Haluan (Heading):
                  </span>
                  <span className="font-bold text-[#2D4B5A] font-mono">{selectedVessel.headingDeg}°</span>
                </div>

                <div className="flex items-center justify-between text-[#4A443F]">
                  <span className="text-[#7A746F]">BBM Kapal:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-[#EAE7E2] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#8BA88E] h-full rounded-full"
                        style={{ width: `${selectedVessel.fuelLevelPercent}%` }}
                      />
                    </div>
                    <span className="font-bold text-[#4A443F]">{selectedVessel.fuelLevelPercent}%</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5E1DA] text-[11px] text-[#7A746F]">
                  <div>Nahkoda: <strong className="text-[#4A443F]">{selectedVessel.captainName}</strong> ({selectedVessel.crewCount} ABK)</div>
                  <div className="mt-0.5">Posisi: <span className="text-[#4A443F] font-medium">{selectedVessel.currentLocationName}</span></div>
                  <div className="mt-0.5">ETA: <span className="text-[#2D4B5A] font-semibold">{selectedVessel.eta}</span></div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onOpenNewBooking}
                className="w-full bg-[#2D4B5A] hover:bg-[#223A47] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-[#2D4B5A]/20 transition-all cursor-pointer"
              >
                <Package className="w-4 h-4 text-[#8BA88E]" />
                Pesan Slot Muatan di Kapal Ini
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-[#A19B95] text-xs">Pilih kapal pada peta di atas</div>
          )}
        </div>
      </div>
    </div>
  );
};
