import React, { useState } from "react";
import { FinancialTransaction, FinancialSummary, Vessel, User } from "../types";
import { DollarSign, Plus, Download, Filter, TrendingUp, TrendingDown, Ship, FileText, Trash2, Edit3, PieChart as PieIcon, CheckCircle2, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Legend } from "recharts";
import { formatCurrencyIDR } from "../services/api";

interface FinanceViewProps {
  summary: FinancialSummary | null;
  transactions: FinancialTransaction[];
  vessels: Vessel[];
  currentUser: User | null;
  onOpenNewTransaction: () => void;
  onEditTransaction: (tx: FinancialTransaction) => void;
  onDeleteTransaction: (id: string) => Promise<void>;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  summary,
  transactions,
  vessels,
  currentUser,
  onOpenNewTransaction,
  onEditTransaction,
  onDeleteTransaction
}) => {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterVessel, setFilterVessel] = useState<string>("ALL");

  const filteredTransactions = transactions.filter((tx) => {
    const matchType = filterType === "ALL" || tx.type === filterType;
    const matchVessel = filterVessel === "ALL" || tx.vesselId === filterVessel;
    return matchType && matchVessel;
  });

  const exportCSV = () => {
    const headers = ["No Transaksi", "Tanggal", "Tipe", "Kategori", "Kapal", "Keterangan", "Nominal (IDR)", "Status"];
    const rows = transactions.map((t) => [
      t.transactionNumber,
      t.date,
      t.type,
      t.category,
      t.vesselName || "-",
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      t.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Keuangan_Maritim_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus catatan transaksi ini?")) {
      await onDeleteTransaction(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#E5E1DA] rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-[#8BA88E]" />
            <h2 className="text-xl font-bold text-[#2D4B5A]">
              Laporan Keuangan & Biaya Operasional Maritim (Financial Ledger)
            </h2>
          </div>
          <p className="text-xs text-[#7A746F] mt-1">
            Analisis arus kas pendapatan angkutan kargo, biaya bahan bakar (bunkering), jasa pelabuhan, gaji ABK, dan margin laba bersih kapal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="bg-[#F8F5F2] hover:bg-[#EAE7E2] text-[#4A443F] text-xs font-bold px-4 py-2.5 rounded-xl border border-[#E5E1DA] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#2D4B5A]" />
            Ekspor CSV / Excel
          </button>
          {(currentUser?.role === "owner" || currentUser?.role === "agent") && (
            <button
              onClick={onOpenNewTransaction}
              className="bg-[#2D4B5A] hover:bg-[#223A47] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-[#2D4B5A]/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#8BA88E]" />
              Catat Transaksi Baru
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue */}
          <div className="bg-white border border-[#E5E1DA] p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#7A746F] block uppercase">
                Total Pendapatan (Revenue)
              </span>
              <div className="text-xl font-bold text-[#2D4B5A] mt-1">
                {formatCurrencyIDR(summary.totalRevenue)}
              </div>
              <span className="text-[11px] text-[#2D4B5A] font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#8BA88E]" /> +14.2% MoM
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#8BA88E]/20 border border-[#8BA88E]/40 flex items-center justify-center text-[#213C23]">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white border border-[#E5E1DA] p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#7A746F] block uppercase">
                Beban Operasional Kapal (OPEX)
              </span>
              <div className="text-xl font-bold text-rose-700 mt-1">
                {formatCurrencyIDR(summary.totalExpense)}
              </div>
              <span className="text-[11px] text-[#7A746F] font-medium flex items-center gap-1 mt-1">
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" /> BBM & Jasa Pelabuhan
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <ArrowDownRight className="w-6 h-6" />
            </div>
          </div>

          {/* Net Profit */}
          <div className="bg-white border border-[#E5E1DA] p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#7A746F] block uppercase">
                Laba Bersih (Net Profit)
              </span>
              <div className="text-xl font-bold text-[#2D4B5A] mt-1">
                {formatCurrencyIDR(summary.netProfit)}
              </div>
              <span className="text-[11px] text-[#2D4B5A] font-medium mt-1 block">
                Profit Margin: <strong>{summary.profitMarginPercent}%</strong>
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#2D4B5A]/10 border border-[#2D4B5A]/20 flex items-center justify-center text-[#2D4B5A]">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          {/* Unpaid Receivables */}
          <div className="bg-white border border-[#E5E1DA] p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#7A746F] block uppercase">
                Piutang Freight Belum Lunas
              </span>
              <div className="text-xl font-bold text-amber-800 mt-1">
                {formatCurrencyIDR(summary.unpaidReceivables)}
              </div>
              <span className="text-[11px] text-[#7A746F] mt-1 block">
                Menunggu pelunasan konsinyi
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Analytics Charts */}
      {summary && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Revenue vs Expense (2 cols) */}
          <div className="lg:col-span-2 bg-white border border-[#E5E1DA] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#2D4B5A]">Tren Pendapatan & Beban Maritim Bulanan</h3>
                <p className="text-xs text-[#7A746F]">Pemasukan freight versus pengeluaran operasional armada</p>
              </div>
              <span className="text-[10px] font-mono text-[#2D4B5A] bg-[#EAE7E2] px-2 py-0.5 rounded border border-[#DCD8D3] font-bold">
                Tahun 2026
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.monthlyData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8BA88E" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#8BA88E" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E1DA" opacity={0.6} />
                  <XAxis dataKey="month" stroke="#7A746F" fontSize={11} />
                  <YAxis
                    stroke="#7A746F"
                    fontSize={10}
                    tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(0)}Jt`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E5E1DA", borderRadius: "12px", fontSize: "11px", color: "#4A443F" }}
                    formatter={(val: any) => [formatCurrencyIDR(val), ""]}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Area type="monotone" dataKey="revenue" name="Pendapatan (Revenue)" stroke="#8BA88E" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expense" name="Beban (Expense)" stroke="#e11d48" fillOpacity={1} fill="url(#colorExp)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Breakdown Categories */}
          <div className="bg-white border border-[#E5E1DA] rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#2D4B5A]">Struktur Biaya Operasional (OPEX)</h3>
              <p className="text-xs text-[#7A746F]">Komposisi pengeluaran bunker, dok, & pelabuhan</p>
            </div>

            <div className="space-y-3">
              {summary.expenseBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#4A443F] font-medium">{item.category}</span>
                    <span className="text-[#2D4B5A] font-mono font-bold">{formatCurrencyIDR(item.amount)}</span>
                  </div>
                  <div className="w-full bg-[#EAE7E2] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2D4B5A] rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-right text-[#7A746F]">{item.percentage}% dari total pengeluaran</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vessel Profitability Matrix */}
      {summary && (
        <div className="bg-white border border-[#E5E1DA] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D4B5A] flex items-center gap-2">
              <Ship className="w-4 h-4 text-[#8BA88E]" />
              Profitabilitas per Armada Kapal (Vessel Margin Analysis)
            </h3>
            <span className="text-xs text-[#7A746F]">Pendapatan vs Pengeluaran per Unit Kapal</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summary.vesselProfitability.map((vp) => (
              <div key={vp.vesselId} className="bg-[#F8F5F2] p-4 rounded-xl border border-[#E5E1DA] space-y-2">
                <div className="font-bold text-[#2D4B5A] text-xs">{vp.vesselName}</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#7A746F] block">Pendapatan</span>
                    <span className="font-bold text-[#213C23] font-mono">{formatCurrencyIDR(vp.revenue)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A746F] block">Beban Kapal</span>
                    <span className="font-bold text-rose-700 font-mono">{formatCurrencyIDR(vp.expense)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#E5E1DA] flex justify-between items-center text-xs">
                  <span className="text-[#7A746F]">Margin Laba:</span>
                  <span className={`font-bold font-mono ${vp.profit >= 0 ? "text-[#213C23]" : "text-rose-700"}`}>
                    {formatCurrencyIDR(vp.profit)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction Ledger Table */}
      <div className="bg-white border border-[#E5E1DA] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#2D4B5A]">Buku Besar Transaksi (Ledger Keuangan)</h3>
            <p className="text-xs text-[#7A746F]">Daftar entri jurnal pemasukan dan pengeluaran maritim</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-1.5 text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
            >
              <option value="ALL">Semua Jenis Transaksi</option>
              <option value="Income">Pemasukan Freight</option>
              <option value="Expense">Pengeluaran OPEX</option>
            </select>

            <select
              value={filterVessel}
              onChange={(e) => setFilterVessel(e.target.value)}
              className="bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-1.5 text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
            >
              <option value="ALL">Semua Kapal</option>
              {vessels.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5F2] border-b border-[#E5E1DA] text-[#7A746F] font-semibold">
                <th className="p-3">No. Transaksi</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Kategori & Kapal</th>
                <th className="p-3">Keterangan Transaksi</th>
                <th className="p-3 text-right">Nominal (IDR)</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1DA] text-[#4A443F]">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#F8F5F2]/60 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#2D4B5A]">{tx.transactionNumber}</td>
                  <td className="p-3 font-mono text-[#7A746F]">{tx.date}</td>
                  <td className="p-3">
                    <span className="font-semibold text-[#4A443F] block">{tx.category}</span>
                    <span className="text-[10px] text-[#7A746F]">{tx.vesselName || "Umum Operasional"}</span>
                  </td>
                  <td className="p-3 max-w-xs">{tx.description}</td>
                  <td className="p-3 text-right font-mono font-bold">
                    <span className={tx.type === "Income" ? "text-[#213C23]" : "text-rose-700"}>
                      {tx.type === "Income" ? "+" : "-"} {formatCurrencyIDR(tx.amount)}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8BA88E]/20 text-[#213C23] border border-[#8BA88E]/40">
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEditTransaction(tx)}
                        className="p-1 text-[#7A746F] hover:text-[#2D4B5A] rounded transition-colors cursor-pointer"
                        title="Edit Transaksi"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="p-1 text-[#7A746F] hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
