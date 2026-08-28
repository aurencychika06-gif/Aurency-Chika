import React from "react";
import { Booking } from "../types";
import { X, Printer, Download, Anchor, ShieldCheck, CheckCircle2 } from "lucide-react";
import { formatCurrencyIDR } from "../services/api";

interface BillOfLadingModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const BillOfLadingModal: React.FC<BillOfLadingModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white text-[#4A443F] rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-[#E5E1DA] relative my-8">
        {/* Modal Top Bar (Hidden on print) */}
        <div className="print:hidden bg-[#2D4B5A] text-white px-6 py-4 flex items-center justify-between border-b border-[#223A47]">
          <div className="flex items-center gap-2">
            <Anchor className="w-5 h-5 text-[#8BA88E]" />
            <h3 className="font-bold text-sm">Dokumen Resmi: Bill of Lading (Konosemen Laut)</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#8BA88E] hover:bg-[#79997C] text-[#1E3321] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / Simpan PDF
            </button>
            <button
              onClick={onClose}
              className="p-1 text-[#A19B95] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-8 bg-white font-sans text-xs space-y-4 print:p-0">
          {/* Header */}
          <div className="border-b-2 border-[#2D4B5A] pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-black tracking-wider text-[#2D4B5A] uppercase">
                PT SAMUDERA BAHARI NUSANTARA
              </h1>
              <p className="text-[11px] text-[#7A746F] mt-0.5">
                Head Office: Gedung Maritim Nusantara Lt. 8, Tanjung Priok, Jakarta Utara 14310
              </p>
              <p className="text-[11px] text-[#7A746F]">
                Tel: +62 21-4390-8800 • Email: info@samuderanusantara.co.id • SK Kemenhub: SIUPAL/2019/8812
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-extrabold text-[#2D4B5A] tracking-wide border-2 border-[#2D4B5A] px-3 py-1 rounded-lg inline-block">
                BILL OF LADING (B/L)
              </div>
              <div className="text-xs font-mono font-bold text-[#4A443F] mt-1">
                NO: {booking.blNumber}
              </div>
              <div className="text-[10px] text-[#7A746F]">Booking Ref: {booking.bookingNumber}</div>
            </div>
          </div>

          {/* Parties Grid */}
          <div className="grid grid-cols-2 gap-4 border border-[#E5E1DA] rounded-xl p-3 bg-[#F8F5F2]">
            <div className="space-y-1">
              <span className="font-bold text-[#2D4B5A] text-[10px] uppercase block tracking-wider">
                1. SHIPPER / PENGIRIM:
              </span>
              <p className="font-bold text-[#4A443F] text-sm">{booking.customerCompany}</p>
              <p className="text-[#7A746F]">Nama Kontak: {booking.customerName}</p>
              <p className="text-[#7A746F]">Telepon: {booking.customerPhone}</p>
              <p className="text-[#7A746F]">Alamat Muat: {booking.pickupAddress || "Depo Logistik Asal"}</p>
            </div>

            <div className="space-y-1 border-l border-[#E5E1DA] pl-4">
              <span className="font-bold text-[#2D4B5A] text-[10px] uppercase block tracking-wider">
                2. CONSIGNEE / PENERIMA:
              </span>
              <p className="font-bold text-[#4A443F] text-sm">{booking.consigneeName}</p>
              <p className="text-[#7A746F]">Telepon: {booking.consigneePhone}</p>
              <p className="text-[#7A746F]">Alamat Tujuan: {booking.deliveryAddress || "Dermaga Pelabuhan Tujuan"}</p>
            </div>
          </div>

          {/* Vessel & Voyage details */}
          <div className="grid grid-cols-4 gap-2 border border-[#E5E1DA] rounded-xl p-3 text-center bg-[#F8F5F2]">
            <div>
              <span className="text-[10px] text-[#7A746F] block uppercase font-medium">NAMA KAPAL (VESSEL)</span>
              <span className="font-bold text-[#2D4B5A]">{booking.vesselName}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#7A746F] block uppercase font-medium">PELABUHAN MUAT (POL)</span>
              <span className="font-bold text-[#4A443F]">{booking.originPort}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#7A746F] block uppercase font-medium">PELABUHAN BONGKAR (POD)</span>
              <span className="font-bold text-[#4A443F]">{booking.destinationPort}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#7A746F] block uppercase font-medium">STATUS MUATAN</span>
              <span className="font-bold text-[#2D4B5A]">{booking.bookingStatus}</span>
            </div>
          </div>

          {/* Cargo Table */}
          <div className="border border-[#E5E1DA] rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F5F2] border-b border-[#E5E1DA] text-[#2D4B5A] font-bold text-[10px] uppercase">
                  <th className="p-2.5">No. Kontainer / Segel</th>
                  <th className="p-2.5">Jenis Kargo</th>
                  <th className="p-2.5">Deskripsi Muatan Barang</th>
                  <th className="p-2.5 text-center">Jumlah</th>
                  <th className="p-2.5 text-right">Berat (Ton)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DA]">
                <tr>
                  <td className="p-2.5 font-mono font-semibold text-[#4A443F]">
                    SEAU-{Math.floor(100000 + Math.random() * 900000)} / SEAL-ID882
                  </td>
                  <td className="p-2.5 font-medium">{booking.cargoType}</td>
                  <td className="p-2.5 text-[#4A443F]">{booking.cargoDescription}</td>
                  <td className="p-2.5 text-center font-bold text-[#2D4B5A]">{booking.quantity} Unit</td>
                  <td className="p-2.5 text-right font-bold text-[#2D4B5A]">{booking.weightTons} MT</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financials & Freight Terms */}
          <div className="flex justify-between items-center bg-[#F8F5F2] border border-[#DCD8D3] rounded-xl p-3.5">
            <div>
              <span className="text-[10px] text-[#2D4B5A] font-bold uppercase tracking-wider block">
                FREIGHT TERMS & ASURANSI
              </span>
              <p className="text-[#4A443F] font-medium">
                Freight Prepaid • Asuransi Marine Cargo: {booking.hasInsurance ? "Tercakup (Covered)" : "Tidak"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#7A746F] block uppercase font-medium">TOTAL BIAYA ANGKUT</span>
              <span className="text-base font-bold text-[#2D4B5A]">
                {formatCurrencyIDR(booking.totalCost)}
              </span>
              <span className="block text-[10px] font-semibold text-[#2D4B5A]">
                Status: {booking.paymentStatus}
              </span>
            </div>
          </div>

          {/* Signatures & Stamps */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-[#E5E1DA]">
            <div className="text-center">
              <p className="text-[#7A746F] text-[10px] uppercase font-semibold">Diterima Pengirim (Shipper)</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[#A19B95] italic text-[11px]">[Tanda Tangan & Cap Pengirim]</span>
              </div>
              <p className="font-bold text-[#4A443F] border-t border-[#E5E1DA] pt-1">
                {booking.customerName}
              </p>
              <p className="text-[10px] text-[#7A746F]">{booking.customerCompany}</p>
            </div>

            <div className="text-center">
              <p className="text-[#7A746F] text-[10px] uppercase font-semibold">Untuk dan atas nama Pengangkut (Carrier)</p>
              <div className="h-16 flex items-center justify-center flex-col relative">
                <div className="absolute w-20 h-20 rounded-full border-2 border-dashed border-[#2D4B5A]/40 flex items-center justify-center rotate-12">
                  <span className="text-[8px] font-bold text-[#2D4B5A] uppercase">PT SAMUDERA BAHARI</span>
                </div>
                <span className="font-serif italic font-bold text-[#2D4B5A] text-sm z-10">Capt. Hendra Gunawan</span>
              </div>
              <p className="font-bold text-[#4A443F] border-t border-[#E5E1DA] pt-1">
                Master of Vessel / Authorized Agent
              </p>
              <p className="text-[10px] text-[#7A746F]">PT Samudera Bahari Nusantara</p>
            </div>
          </div>

          <div className="text-[9px] text-[#A19B95] text-center border-t border-[#E5E1DA] pt-2">
            Dokumen ini tunduk pada Ketentuan Konvensi Maritim Internasional (The Hague-Visby Rules) & UU Pelayaran RI No. 17/2008.
          </div>
        </div>
      </div>
    </div>
  );
};
