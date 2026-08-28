import React, { useState, useEffect } from "react";
import { Booking, CargoType, PaymentStatus, BookingStatus, Voyage, Vessel, User } from "../types";
import { X, Package, DollarSign, Ship, MapPin, Shield, Check, Calendar } from "lucide-react";
import { INDONESIAN_PORTS, formatCurrencyIDR } from "../services/api";

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookingData: Partial<Booking>) => Promise<void>;
  editBooking?: Booking | null;
  voyages: Voyage[];
  vessels: Vessel[];
  currentUser: User | null;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editBooking,
  voyages,
  vessels,
  currentUser
}) => {
  const [voyageId, setVoyageId] = useState("");
  const [cargoType, setCargoType] = useState<CargoType>("Dry Container 20ft");
  const [cargoDescription, setCargoDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [weightTons, setWeightTons] = useState(18);
  const [volumeCbm, setVolumeCbm] = useState(30);
  const [hasInsurance, setHasInsurance] = useState(true);
  const [originPort, setOriginPort] = useState(INDONESIAN_PORTS[0]);
  const [destinationPort, setDestinationPort] = useState(INDONESIAN_PORTS[1]);
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [consigneeName, setConsigneeName] = useState("");
  const [consigneePhone, setConsigneePhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("Unpaid");
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>("Pending");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editBooking) {
      setVoyageId(editBooking.voyageId);
      setCargoType(editBooking.cargoType);
      setCargoDescription(editBooking.cargoDescription);
      setQuantity(editBooking.quantity);
      setWeightTons(editBooking.weightTons);
      setVolumeCbm(editBooking.volumeCbm || 30);
      setHasInsurance(editBooking.hasInsurance);
      setOriginPort(editBooking.originPort);
      setDestinationPort(editBooking.destinationPort);
      setPickupAddress(editBooking.pickupAddress || "");
      setDeliveryAddress(editBooking.deliveryAddress || "");
      setConsigneeName(editBooking.consigneeName);
      setConsigneePhone(editBooking.consigneePhone);
      setCustomerName(editBooking.customerName);
      setCustomerCompany(editBooking.customerCompany);
      setCustomerPhone(editBooking.customerPhone);
      setCustomerEmail(editBooking.customerEmail);
      setPaymentStatus(editBooking.paymentStatus);
      setBookingStatus(editBooking.bookingStatus);
    } else {
      // Defaults from current user
      if (currentUser) {
        setCustomerName(currentUser.name);
        setCustomerCompany(currentUser.companyName || "PT Kargo Mandiri");
        setCustomerPhone(currentUser.phone || "+62 812-3456-7890");
        setCustomerEmail(currentUser.email);
      }
      setCargoDescription("Komoditas Hasil Bumi & Manufaktur");
      setConsigneeName("Penerima Gudang Pelabuhan");
      setConsigneePhone("+62 811-9988-7766");
      setPickupAddress("Depo Logistik Jakarta");
      setDeliveryAddress("Area Industri Surabaya");
      if (voyages.length > 0) {
        setVoyageId(voyages[0].id);
        setOriginPort(voyages[0].originPort);
        setDestinationPort(voyages[0].destinationPort);
      }
    }
  }, [editBooking, currentUser, voyages, isOpen]);

  if (!isOpen) return null;

  // Selected voyage lookup
  const selectedVoyage = voyages.find((v) => v.id === voyageId) || voyages[0];

  // Calculate freight estimation
  const calculateTotalCost = () => {
    let baseRate = 4500000;
    if (selectedVoyage) {
      baseRate = selectedVoyage.pricePerTeu;
    }

    let multiplier = 1;
    if (cargoType === "Dry Container 40ft") multiplier = 1.8;
    if (cargoType === "Reefer Container") multiplier = 2.2;
    if (cargoType === "Heavy Equipment / Vehicles") multiplier = 2.5;
    if (cargoType === "Bulk Cargo (Curah)") multiplier = 1.2;

    let total = baseRate * multiplier * quantity;
    if (hasInsurance) total += 500000 * quantity;
    return total;
  };

  const totalCost = calculateTotalCost();

  const handleVoyageChange = (vId: string) => {
    setVoyageId(vId);
    const voy = voyages.find((v) => v.id === vId);
    if (voy) {
      setOriginPort(voy.originPort);
      setDestinationPort(voy.destinationPort);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Partial<Booking> = {
        voyageId: selectedVoyage ? selectedVoyage.id : voyageId,
        vesselId: selectedVoyage ? selectedVoyage.vesselId : "ves-01",
        vesselName: selectedVoyage ? selectedVoyage.vesselName : "KM Nusantara Express I",
        originPort,
        destinationPort,
        cargoType,
        cargoDescription,
        quantity: Number(quantity),
        weightTons: Number(weightTons),
        volumeCbm: Number(volumeCbm),
        hasInsurance,
        totalCost,
        paymentStatus,
        bookingStatus,
        customerName,
        customerCompany,
        customerPhone,
        customerEmail,
        consigneeName,
        consigneePhone,
        pickupAddress,
        deliveryAddress
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
        {/* Modal Header */}
        <div className="bg-[#F8F5F2] p-5 border-b border-[#E5E1DA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D4B5A] flex items-center justify-center text-white shadow-md">
              <Package className="w-5 h-5 text-[#8BA88E]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2D4B5A]">
                {editBooking ? `Edit Pemesanan (${editBooking.bookingNumber})` : "Buat Pemesanan Kargo Baru"}
              </h3>
              <p className="text-xs text-[#7A746F]">Pengapalan Muatan Laut Terintegrasi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#7A746F] hover:text-[#2D4B5A] rounded-lg hover:bg-[#EAE7E2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Voyage & Ship Selection */}
          <div>
            <label className="block text-xs font-bold text-[#2D4B5A] mb-1.5 flex items-center gap-1.5">
              <Ship className="w-3.5 h-3.5 text-[#8BA88E]" />
              Pilih Rute & Jadwal Pelayaran Kapal
            </label>
            <select
              value={voyageId}
              onChange={(e) => handleVoyageChange(e.target.value)}
              className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3.5 py-2.5 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A] font-semibold"
            >
              {voyages.map((voy) => (
                <option key={voy.id} value={voy.id}>
                  {voy.voyageNumber} - {voy.vesselName} ({voy.originPort.split(",")[0]} ➔ {voy.destinationPort.split(",")[0]}) • ETD: {voy.etd}
                </option>
              ))}
            </select>
          </div>

          {/* Ports */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Pelabuhan Asal (POL)</label>
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
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Pelabuhan Tujuan (POD)</label>
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

          {/* Cargo Details */}
          <div className="p-4 bg-[#F8F5F2] rounded-xl border border-[#E5E1DA] space-y-3">
            <span className="text-xs font-bold text-[#2D4B5A] uppercase tracking-wider block">
              Spesifikasi Kargo & Kontainer
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A443F] mb-1">Tipe Kargo</label>
                <select
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value as CargoType)}
                  className="w-full bg-white border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
                >
                  <option value="Dry Container 20ft">Dry Container 20ft (FCL)</option>
                  <option value="Dry Container 40ft">Dry Container 40ft (FCL)</option>
                  <option value="Reefer Container">Reefer Container (Muatan Beku)</option>
                  <option value="Heavy Equipment / Vehicles">Alat Berat / Kendaraan (LCT/Roro)</option>
                  <option value="General Cargo">General Cargo (LCL / Pallet)</option>
                  <option value="Bulk Cargo (Curah)">Bulk Cargo (Curah Kering / Basah)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443F] mb-1">Jumlah Unit / Kontainer</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A443F] mb-1">Total Berat (Ton / MT)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={weightTons}
                  onChange={(e) => setWeightTons(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4A443F] mb-1">Volume (CBM)</label>
                <input
                  type="number"
                  value={volumeCbm}
                  onChange={(e) => setVolumeCbm(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Deskripsi Muatan Barang</label>
              <input
                type="text"
                required
                value={cargoDescription}
                onChange={(e) => setCargoDescription(e.target.value)}
                placeholder="Contoh: Komoditas Kopi, Mesin Traktor, Baja Profil"
                className="w-full bg-white border border-[#E5E1DA] rounded-xl px-3.5 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="insurance"
                checked={hasInsurance}
                onChange={(e) => setHasInsurance(e.target.checked)}
                className="rounded text-[#2D4B5A] focus:ring-[#2D4B5A] h-4 w-4 bg-white border-[#E5E1DA]"
              />
              <label htmlFor="insurance" className="text-xs text-[#4A443F] cursor-pointer flex items-center gap-1.5 font-medium">
                <Shield className="w-3.5 h-3.5 text-[#8BA88E]" />
                Sertakan Asuransi Marine Cargo All-Risk (+ Rp 500.000 / unit)
              </label>
            </div>
          </div>

          {/* Shipper & Consignee Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#2D4B5A] uppercase">Informasi Pengirim (Shipper)</span>
              <input
                type="text"
                required
                value={customerCompany}
                onChange={(e) => setCustomerCompany(e.target.value)}
                placeholder="Nama Perusahaan Pengirim"
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama Kontak Pengirim"
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
              <input
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Alamat Penjemputan / Depo Asal"
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#2D4B5A] uppercase">Informasi Penerima (Consignee)</span>
              <input
                type="text"
                required
                value={consigneeName}
                onChange={(e) => setConsigneeName(e.target.value)}
                placeholder="Nama Perusahaan / Penerima"
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
              <input
                type="text"
                required
                value={consigneePhone}
                onChange={(e) => setConsigneePhone(e.target.value)}
                placeholder="No. Telepon / WA Penerima"
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Alamat Pengantaran / Gudang Tujuan"
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
            </div>
          </div>

          {/* Admin / Agent Role Status Controls */}
          {(currentUser?.role === "owner" || currentUser?.role === "agent" || editBooking) && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#F8F5F2] rounded-xl border border-[#E5E1DA]">
              <div>
                <label className="block text-xs font-semibold text-[#4A443F] mb-1">Status Pemesanan</label>
                <select
                  value={bookingStatus}
                  onChange={(e) => setBookingStatus(e.target.value as BookingStatus)}
                  className="w-full bg-white border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
                >
                  <option value="Pending">Menunggu Konfirmasi (Pending)</option>
                  <option value="Confirmed">Dikonfirmasi (Confirmed)</option>
                  <option value="Port Gate-In">Masuk Depo (Port Gate-In)</option>
                  <option value="Loaded">Dimuat di Kapal (Loaded)</option>
                  <option value="In Transit">Sedang Berlayar (In Transit)</option>
                  <option value="Arrived">Tiba di Pelabuhan (Arrived)</option>
                  <option value="Delivered">Terkirim ke Konsinyi (Delivered)</option>
                  <option value="Cancelled">Dibatalkan (Cancelled)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443F] mb-1">Status Pembayaran</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full bg-white border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
                >
                  <option value="Unpaid">Belum Dibayar (Unpaid)</option>
                  <option value="Deposit Paid">Uang Muka 50% (Deposit Paid)</option>
                  <option value="Paid in Full">Lunas (Paid in Full)</option>
                  <option value="Overdue">Jatuh Tempo (Overdue)</option>
                </select>
              </div>
            </div>
          )}

          {/* Pricing Estimation Summary */}
          <div className="bg-[#F8F5F2] p-4 rounded-xl border border-[#DCD8D3] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#7A746F] block">Estimasi Ongkos Angkut Laut</span>
              <span className="text-xs text-[#2D4B5A] font-bold">
                {quantity}x {cargoType} ({weightTons} MT)
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-[#2D4B5A]">
                {formatCurrencyIDR(totalCost)}
              </div>
              <span className="text-[10px] text-[#7A746F]">Include PPN 1.1% & Port Handling</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#7A746F] hover:bg-[#EAE7E2] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#2D4B5A] hover:bg-[#223A47] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-[#2D4B5A]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-[#8BA88E]" />
              {submitting ? "Menyimpan..." : editBooking ? "Perbarui Pemesanan" : "Kirim Pengajuan Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
