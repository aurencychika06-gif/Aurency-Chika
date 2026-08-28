import React, { useState, useEffect } from "react";
import { FinancialTransaction, TransactionType, ExpenseCategory, IncomeCategory, Vessel, Voyage } from "../types";
import { X, DollarSign, Check, Calendar } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (txData: Partial<FinancialTransaction>) => Promise<void>;
  editTransaction?: FinancialTransaction | null;
  vessels: Vessel[];
  voyages: Voyage[];
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editTransaction,
  vessels,
  voyages
}) => {
  const [type, setType] = useState<TransactionType>("Expense");
  const [category, setCategory] = useState<string>("Fuel / Bunkering");
  const [amount, setAmount] = useState(25000000);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [vesselId, setVesselId] = useState("");
  const [voyageId, setVoyageId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Pending" | "Approved" | "Settled">("Settled");
  const [submitting, setSubmitting] = useState(false);

  const expenseCategories: ExpenseCategory[] = [
    "Fuel / Bunkering",
    "Port Dues & Pilotage",
    "Crew Salaries & Meals",
    "Vessel Maintenance & Dok",
    "Handling & Stevedoring",
    "Agency Commission",
    "Insurance & Licensing",
    "Other"
  ];

  const incomeCategories: IncomeCategory[] = [
    "Freight Payment",
    "Charter Contract",
    "Demurrage / Detention",
    "Handling Fee",
    "Other Income"
  ];

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setCategory(editTransaction.category);
      setAmount(editTransaction.amount);
      setDate(editTransaction.date);
      setVesselId(editTransaction.vesselId || "");
      setVoyageId(editTransaction.voyageId || "");
      setDescription(editTransaction.description);
      setStatus(editTransaction.status);
    } else {
      setType("Expense");
      setCategory("Fuel / Bunkering");
      setAmount(35000000);
      setDate(new Date().toISOString().split("T")[0]);
      if (vessels.length > 0) setVesselId(vessels[0].id);
      setDescription("Pengisian Bunker Solar Industri HSD");
      setStatus("Settled");
    }
  }, [editTransaction, vessels, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedVessel = vessels.find((v) => v.id === vesselId);
      const payload: Partial<FinancialTransaction> = {
        type,
        category: category as any,
        amount: Number(amount),
        date,
        vesselId,
        vesselName: selectedVessel ? selectedVessel.name : undefined,
        voyageId: voyageId || undefined,
        description,
        status
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
              <DollarSign className="w-5 h-5 text-[#8BA88E]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2D4B5A]">
                {editTransaction ? "Edit Entri Transaksi Keuangan" : "Catat Transaksi Keuangan Maritim"}
              </h3>
              <p className="text-xs text-[#7A746F]">Beban Operasional Kapal & Penerimaan Freight</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#7A746F] hover:text-[#2D4B5A] rounded-lg hover:bg-[#EAE7E2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Jenis Transaksi</label>
              <select
                value={type}
                onChange={(e) => {
                  const t = e.target.value as TransactionType;
                  setType(t);
                  setCategory(t === "Income" ? "Freight Payment" : "Fuel / Bunkering");
                }}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A] font-bold"
              >
                <option value="Expense">Pengeluaran / Biaya Operasional (Expense)</option>
                <option value="Income">Pemasukan / Pendapatan Freight (Income)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              >
                {type === "Expense"
                  ? expenseCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))
                  : incomeCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Nominal (IDR)</label>
              <input
                type="number"
                required
                min="0"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3.5 py-2 text-[#2D4B5A] focus:outline-none focus:border-[#2D4B5A] font-mono text-base font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Tanggal Transaksi</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3.5 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Kapal Terkait (Opsional)</label>
              <select
                value={vesselId}
                onChange={(e) => setVesselId(e.target.value)}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              >
                <option value="">-- Tidak Terkait Kapal Khusus --</option>
                {vessels.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A443F] mb-1">Status Pembukuan</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              >
                <option value="Settled">Tuntas & Lunas (Settled)</option>
                <option value="Approved">Disetujui Owner (Approved)</option>
                <option value="Pending">Menunggu Verifikasi (Pending)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A443F] mb-1">Deskripsi / Keterangan Transaksi</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Pembelian Bahan Bakar Solar Industri 3.500 Liter di Pelabuhan Priok"
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
              {submitting ? "Menyimpan..." : editTransaction ? "Perbarui Transaksi" : "Catat Transaksi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
