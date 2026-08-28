import React, { useState, useEffect } from "react";
import { Voyage, Vessel } from "../types";
import { X, Anchor, Check, Calendar, MapPin, DollarSign } from "lucide-react";
import { INDONESIAN_PORTS } from "../services/api";

interface VoyageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (voyageData: Partial<Voyage>) => Promise<void>;
  editVoyage?: Voyage | null;
  vessels: Vessel[];
}

export const VoyageModal: React.FC<VoyageModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editVoyage,
  vessels
}) => {
  const [voyageNumber, setVoyageNumber] = useState("");
  const [vesselId, setVesselId] = useState("");
  const [originPort, setOriginPort] = useState(INDONESIAN_PORTS[0]);
  const [destinationPort, setDestinationPort] = useState(INDONESIAN_PORTS[1]);
  const [etd, setEtd] = useState("");
  const [eta, setEta] = useState("");
  const [status, setStatus] = useState<Voyage["status"]>("Scheduled");
  const [totalCapacityTeu, setTotalCapacityTeu] = useState(850);
  const [bookedCapacityTeu, setBookedCapacityTeu] = useState(0);
  const [pricePerTeu, setPricePerTeu] = useState(4500000);
  const [pricePerTon, setPricePerTon] = useState(350000);
  const [transitDays, setTransitDays] = useState(2);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editVoyage) {
      setVoyageNumber(editVoyage.voyageNumber);
      setVesselId(editVoyage.vesselId);
      setOriginPort(editVoyage.originPort);
      setDestinationPort(editVoyage.destinationPort);
      setEtd(editVoyage.etd);
      setEta(editVoyage.eta);
      setStatus(editVoyage.status);
      setTotalCapacityTeu(editVoyage.totalCapacityTeu);
      setBookedCapacityTeu(editVoyage.bookedCapacityTeu);
      setPricePerTeu(editVoyage.pricePerTeu);
      setPricePerTon(editVoyage.pricePerTon);
      setTransitDays(editVoyage.transitDays);
      setNotes(editVoyage.notes || "");
    } else {
      setVoyageNumber(`VOY-ID-${Math.floor(1000 + Math.random() * 9000)}`);
      if (vessels.length > 0) {
        setVesselId(vessels[0].id);
        setTotalCapacityTeu(vessels[0].capacityTeu || 600);
      }
      setOriginPort(INDONESIAN_PORTS[0]);
      setDestinationPort(INDONESIAN_PORTS[1]);
      setEtd("2026-09-01 16:00 WIB");
      setEta("2026-09-03 08:00 WIB");
      setStatus("Scheduled");
      setBookedCapacityTeu(0);
      setPricePerTeu(4800000);
      setPricePerTon(360000);
      setTransitDays(2);
      setNotes("Jalur reguler antar pulau, prioritas kontainer");
    }
  }, [editVoyage, vessels, isOpen]);

  if (!isOpen) return null;

  const handleVesselSelect = (vId: string) => {
    setVesselId(vId);
    const v = vessels.find((ves) => ves.id === vId);
    if (v && v.capacityTeu) {
      setTotalCapacityTeu(v.capacityTeu);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedVessel = vessels.find((v) => v.id === vesselId);
      const payload: Partial<Voyage> = {
        voyageNumber,
        vesselId,
        vesselName: selectedVessel ? selectedVessel.name : "KM Samudera",
        originPort,
        destinationPort,
        etd,
        eta,
        status,
        totalCapacityTeu: Number(totalCapacityTeu),
        bookedCapacityTeu: Number(bookedCapacityTeu),
        pricePerTeu: Number(pricePerTeu),
        pricePerTon: Number(pricePerTon),
        transitDays: Number(transitDays),
        notes
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
      <div className="bg-white border border-[#E5E1DA] rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden text-[#4A443F] my-8">
        <div className="bg-[#F8F5F2] p-5 border-b border-[#E5E1DA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D4B5A] flex items-center justify-center text-white shadow-md">
              <Anchor className="w-5 h-5 text-[#8BA88E]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2D4B5A]">
                {editVoyage ? `Edit Jadwal Pelayaran (${editVoyage.voyageNumber})` : "Tambah Jadwal & Rute Pelayaran Baru"}
              </h3>
              <p className="text-xs text-[#7A746F]">Pengaturan Alokasi Kapal & Tarif Angkutan Laut</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Nomor Pelayaran (Voyage No.)</label>
              <input
                type="text"
                required
                value={voyageNumber}
                onChange={(e) => setVoyageNumber(e.target.value)}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Pilih Kapal Bertugas</label>
              <select
                value={vesselId}
                onChange={(e) => handleVesselSelect(e.target.value)}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A] font-semibold"
              >
                {vessels.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Pelabuhan Muat Asal (POL)</label>
              <select
                value={originPort}
                onChange={(e) => setOriginPort(e.target.value)}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              >
                {INDONESIAN_PORTS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Pelabuhan Bongkar Tujuan (POD)</label>
              <select
                value={destinationPort}
                onChange={(e) => setDestinationPort(e.target.value)}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              >
                {INDONESIAN_PORTS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Jadwal Berangkat (ETD)</label>
              <input
                type="text"
                required
                value={etd}
                onChange={(e) => setEtd(e.target.value)}
                placeholder="2026-09-01 16:00 WIB"
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Estimasi Tiba (ETA)</label>
              <input
                type="text"
                required
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                placeholder="2026-09-03 08:00 WIB"
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Status Pelayaran</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              >
                <option value="Scheduled">Terjadwal (Scheduled)</option>
                <option value="Loading">Sedang Muat (Loading)</option>
                <option value="En Route">Dalam Pelayaran (En Route)</option>
                <option value="Discharging">Proses Bongkar (Discharging)</option>
                <option value="Completed">Selesai (Completed)</option>
                <option value="Delayed">Tertunda Cuaca (Delayed)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Total Kapasitas (TEU)</label>
              <input
                type="number"
                required
                value={totalCapacityTeu}
                onChange={(e) => setTotalCapacityTeu(Number(e.target.value))}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Lama Berlayar (Hari)</label>
              <input
                type="number"
                value={transitDays}
                onChange={(e) => setTransitDays(Number(e.target.value))}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Tarif Freight / TEU (IDR)</label>
              <input
                type="number"
                value={pricePerTeu}
                onChange={(e) => setPricePerTeu(Number(e.target.value))}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Tarif Freight / Ton (IDR)</label>
              <input
                type="number"
                value={pricePerTon}
                onChange={(e) => setPricePerTon(Number(e.target.value))}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A443F] mb-1">Catatan Operasional Pelayaran</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Rute pelayaran prioritas express peti kemas"
              className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3.5 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
            />
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
              {submitting ? "Menyimpan..." : editVoyage ? "Perbarui Jadwal" : "Terbitkan Jadwal Pelayaran"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
