import React, { useState, useEffect } from "react";
import { Vessel, VesselType, VesselStatus } from "../types";
import { X, Ship, Check, MapPin, Gauge } from "lucide-react";
import { INDONESIAN_PORTS } from "../services/api";

interface VesselModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vesselData: Partial<Vessel>) => Promise<void>;
  editVessel?: Vessel | null;
}

export const VesselModal: React.FC<VesselModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editVessel
}) => {
  const [name, setName] = useState("");
  const [callSign, setCallSign] = useState("");
  const [mmsi, setMmsi] = useState("");
  const [imo, setImo] = useState("");
  const [type, setType] = useState<VesselType>("Container");
  const [flag, setFlag] = useState("Indonesia 🇮🇩");
  const [dwt, setDwt] = useState(15000);
  const [capacityTeu, setCapacityTeu] = useState(800);
  const [capacityTon, setCapacityTon] = useState(12000);
  const [yearBuilt, setYearBuilt] = useState(2020);
  const [status, setStatus] = useState<VesselStatus>("Underway");
  const [speedKnots, setSpeedKnots] = useState(14.5);
  const [headingDeg, setHeadingDeg] = useState(85);
  const [currentLocationName, setCurrentLocationName] = useState("Laut Jawa");
  const [lat, setLat] = useState(-5.9);
  const [lng, setLng] = useState(108.5);
  const [captainName, setCaptainName] = useState("");
  const [crewCount, setCrewCount] = useState(22);
  const [fuelLevelPercent, setFuelLevelPercent] = useState(80);
  const [destinationPort, setDestinationPort] = useState(INDONESIAN_PORTS[1]);
  const [eta, setEta] = useState("2026-08-30 08:00 WIB");
  const [photoUrl, setPhotoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editVessel) {
      setName(editVessel.name);
      setCallSign(editVessel.callSign);
      setMmsi(editVessel.mmsi);
      setImo(editVessel.imo);
      setType(editVessel.type);
      setFlag(editVessel.flag);
      setDwt(editVessel.dwt);
      setCapacityTeu(editVessel.capacityTeu || 0);
      setCapacityTon(editVessel.capacityTon || 0);
      setYearBuilt(editVessel.yearBuilt);
      setStatus(editVessel.status);
      setSpeedKnots(editVessel.speedKnots);
      setHeadingDeg(editVessel.headingDeg);
      setCurrentLocationName(editVessel.currentLocationName);
      setLat(editVessel.coordinates.lat);
      setLng(editVessel.coordinates.lng);
      setCaptainName(editVessel.captainName);
      setCrewCount(editVessel.crewCount);
      setFuelLevelPercent(editVessel.fuelLevelPercent);
      setDestinationPort(editVessel.destinationPort);
      setEta(editVessel.eta);
      setPhotoUrl(editVessel.photoUrl || "");
    } else {
      setName("KM Nusantara Bahari VI");
      setCallSign("YDH-" + Math.floor(1000 + Math.random() * 9000));
      setMmsi("525" + Math.floor(100000 + Math.random() * 900000));
      setImo("98" + Math.floor(10000 + Math.random() * 90000));
      setType("Container");
      setFlag("Indonesia 🇮🇩");
      setDwt(16000);
      setCapacityTeu(950);
      setCapacityTon(14000);
      setYearBuilt(2021);
      setStatus("Underway");
      setSpeedKnots(14.2);
      setHeadingDeg(90);
      setCurrentLocationName("Selat Sunda");
      setLat(-5.9);
      setLng(105.8);
      setCaptainName("Capt. Suhendro, M.Mar");
      setCrewCount(24);
      setFuelLevelPercent(85);
      setDestinationPort(INDONESIAN_PORTS[0]);
      setEta("2026-08-30 12:00 WIB");
      setPhotoUrl("https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&auto=format&fit=crop&q=80");
    }
  }, [editVessel, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Partial<Vessel> = {
        name,
        callSign,
        mmsi,
        imo,
        type,
        flag,
        dwt: Number(dwt),
        capacityTeu: Number(capacityTeu) || undefined,
        capacityTon: Number(capacityTon) || undefined,
        yearBuilt: Number(yearBuilt),
        status,
        speedKnots: Number(speedKnots),
        headingDeg: Number(headingDeg),
        currentLocationName,
        coordinates: { lat: Number(lat), lng: Number(lng) },
        captainName,
        crewCount: Number(crewCount),
        fuelLevelPercent: Number(fuelLevelPercent),
        destinationPort,
        eta,
        photoUrl
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-[#E5E1DA] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden text-[#4A443F] my-8">
        <div className="bg-[#F8F5F2] p-5 border-b border-[#E5E1DA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D4B5A] flex items-center justify-center text-white shadow-md">
              <Ship className="w-5 h-5 text-[#8BA88E]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2D4B5A]">
                {editVessel ? `Edit Spesifikasi Kapal (${editVessel.name})` : "Tambah Kapal Baru ke Armada"}
              </h3>
              <p className="text-xs text-[#7A746F]">Registrasi Data AIS & Spesifikasi Teknis Kapal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#7A746F] hover:text-[#2D4B5A] rounded-lg hover:bg-[#EAE7E2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Identitas Kapal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Nama Kapal</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Tipe Kapal</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as VesselType)}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              >
                <option value="Container">Container Ship (Kapal Peti Kemas)</option>
                <option value="LCT">LCT (Landing Craft Tank)</option>
                <option value="Tug & Barge">Tugboat & Barge (Tongkang)</option>
                <option value="General Cargo">General Cargo</option>
                <option value="Bulk Carrier">Bulk Carrier (Curah)</option>
                <option value="Tanker">Oil / Chemical Tanker</option>
              </select>
            </div>
          </div>

          {/* Maritim Identifiers */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Call Sign</label>
              <input
                type="text"
                required
                value={callSign}
                onChange={(e) => setCallSign(e.target.value)}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">MMSI (AIS)</label>
              <input
                type="text"
                required
                value={mmsi}
                onChange={(e) => setMmsi(e.target.value)}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Nomor IMO</label>
              <input
                type="text"
                required
                value={imo}
                onChange={(e) => setImo(e.target.value)}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A] font-mono"
              />
            </div>
          </div>

          {/* Capacities */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">DWT (Bobot Mati - Ton)</label>
              <input
                type="number"
                required
                value={dwt}
                onChange={(e) => setDwt(Number(e.target.value))}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Kapasitas TEU</label>
              <input
                type="number"
                value={capacityTeu}
                onChange={(e) => setCapacityTeu(Number(e.target.value))}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Tahun Pembuatan</label>
              <input
                type="number"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(Number(e.target.value))}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
            </div>
          </div>

          {/* Operasional & AIS Telemetri */}
          <div className="p-4 bg-[#F8F5F2] rounded-xl border border-[#E5E1DA] space-y-3">
            <span className="text-xs font-bold text-[#2D4B5A] uppercase tracking-wider block">
              Status Operasional & Telemetri AIS
            </span>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A443F] mb-1">Status Kapal</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as VesselStatus)}
                  className="w-full bg-white border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
                >
                  <option value="Underway">Berlayar (Underway)</option>
                  <option value="Moored">Sandar Dermaga (Moored)</option>
                  <option value="Anchored">Labuh Jangkar (Anchored)</option>
                  <option value="Docking">Docking Galangan</option>
                  <option value="Maintenance">Perbaikan Mesin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443F] mb-1">Kecepatan (Knots)</label>
                <input
                  type="number"
                  step="0.1"
                  value={speedKnots}
                  onChange={(e) => setSpeedKnots(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443F] mb-1">Haluan / Heading (°)</label>
                <input
                  type="number"
                  value={headingDeg}
                  onChange={(e) => setHeadingDeg(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A443F] mb-1">Posisi / Nama Perairan</label>
                <input
                  type="text"
                  value={currentLocationName}
                  onChange={(e) => setCurrentLocationName(e.target.value)}
                  className="w-full bg-white border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4A443F] mb-1">Pelabuhan Tujuan & ETA</label>
                <input
                  type="text"
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  className="w-full bg-white border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A443F] mb-1">Nama Nahkoda (Captain)</label>
                <input
                  type="text"
                  value={captainName}
                  onChange={(e) => setCaptainName(e.target.value)}
                  className="w-full bg-white border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4A443F] mb-1">Jumlah ABK (Crew)</label>
                <input
                  type="number"
                  value={crewCount}
                  onChange={(e) => setCrewCount(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4A443F] mb-1">BBM Tersisa (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={fuelLevelPercent}
                  onChange={(e) => setFuelLevelPercent(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#7A746F] hover:bg-[#EAE7E2] rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#2D4B5A] hover:bg-[#223A47] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-[#2D4B5A]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-[#8BA88E]" />
              {submitting ? "Menyimpan..." : editVessel ? "Perbarui Data Kapal" : "Simpan Kapal Baru"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
