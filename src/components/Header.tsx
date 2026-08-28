import React from "react";
import { User, UserRole } from "../types";
import { Ship, Anchor, Package, Compass, DollarSign, Smartphone, Monitor, UserCheck, LogOut, RotateCcw, Shield } from "lucide-react";

interface HeaderProps {
  currentUser: User | null;
  activeTab: "tracking" | "bookings" | "vessels" | "voyages" | "finance";
  setActiveTab: (tab: "tracking" | "bookings" | "vessels" | "voyages" | "finance") => void;
  isMobileSimulation: boolean;
  setIsMobileSimulation: (val: boolean) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onQuickSwitchRole: (role: UserRole) => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  isMobileSimulation,
  setIsMobileSimulation,
  onOpenAuth,
  onLogout,
  onQuickSwitchRole,
  onResetData
}) => {
  const getRoleLabel = (role?: UserRole) => {
    switch (role) {
      case "owner":
        return { title: "Pemilik Kapal (Ship Owner)", badge: "bg-[#2D4B5A] text-white" };
      case "agent":
        return { title: "Agen Logistik Maritim", badge: "bg-[#D97757] text-white" };
      case "customer":
        return { title: "Pelanggan / Shipper", badge: "bg-[#8BA88E] text-white" };
      default:
        return { title: "Tamu (Guest)", badge: "bg-[#A19B95] text-white" };
    }
  };

  const roleInfo = getRoleLabel(currentUser?.role);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E1DA] text-[#4A443F] shadow-sm">
      {/* Top Banner / Ticker */}
      <div className="bg-[#EAE7E2] px-4 py-1.5 text-xs border-b border-[#E5E1DA] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#2D4B5A] font-bold">
            <Anchor className="w-3.5 h-3.5 text-[#2D4B5A]" />
            SAMUDERA MARINE FREIGHT OS
          </span>
          <span className="hidden sm:inline text-[#A19B95]">|</span>
          <span className="hidden md:inline text-[#7A746F]">
            Sistem Angkutan Laut & Pelacakan Kargo Terintegrasi Indonesia
          </span>
        </div>

        {/* Demo Role Switcher & Device Frame Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#F8F5F2] p-0.5 rounded-lg border border-[#E5E1DA]">
            <span className="text-[11px] text-[#7A746F] px-1.5 hidden sm:inline font-medium">Role Cepat:</span>
            <button
              onClick={() => onQuickSwitchRole("owner")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                currentUser?.role === "owner"
                  ? "bg-[#2D4B5A] text-white shadow-sm"
                  : "text-[#4A443F] hover:bg-[#EAE7E2]"
              }`}
              title="Masuk sebagai Pemilik Kapal (Akses Finansial & Armada Penuh)"
            >
              👑 Pemilik Kapal
            </button>
            <button
              onClick={() => onQuickSwitchRole("agent")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                currentUser?.role === "agent"
                  ? "bg-[#D97757] text-white shadow-sm"
                  : "text-[#4A443F] hover:bg-[#EAE7E2]"
              }`}
              title="Masuk sebagai Agen (Manajemen Booking & Manifes)"
            >
              📋 Agen
            </button>
            <button
              onClick={() => onQuickSwitchRole("customer")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                currentUser?.role === "customer"
                  ? "bg-[#8BA88E] text-white shadow-sm"
                  : "text-[#4A443F] hover:bg-[#EAE7E2]"
              }`}
              title="Masuk sebagai Pelanggan (Pesan Muatan & Lacak Kargo)"
            >
              📦 Pelanggan
            </button>
          </div>

          {/* Reset DB Button */}
          <button
            onClick={onResetData}
            title="Reset Data Maritim Default"
            className="p-1 text-[#7A746F] hover:text-[#2D4B5A] hover:bg-[#F3EFEA] rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Mobile Preview Frame */}
          <button
            onClick={() => setIsMobileSimulation(!isMobileSimulation)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all border ${
              isMobileSimulation
                ? "bg-[#8BA88E]/20 text-[#2D4B5A] border-[#8BA88E]"
                : "bg-white text-[#4A443F] border-[#E5E1DA] hover:bg-[#F8F5F2]"
            }`}
            title="Ubah antara Mode Desktop Web dan Tampilan Simulasi Mobile Smartphone"
          >
            {isMobileSimulation ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#2D4B5A]" />
                <span className="hidden sm:inline">Mode Mobile ON</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#7A746F]" />
                <span className="hidden sm:inline">Mode Web Desktop</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("tracking")}>
            <div className="w-10 h-10 rounded-xl bg-[#2D4B5A] flex items-center justify-center text-white shadow-md shadow-[#2D4B5A]/20">
              <Ship className="w-5 h-5 text-[#8BA88E]" />
            </div>
            <div>
              <div className="font-bold text-lg leading-tight tracking-tight text-[#2D4B5A] flex items-center gap-2">
                Nusantara Freight
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#8BA88E]/20 text-[#2D4B5A] border border-[#8BA88E]/40 font-semibold">
                  Maritim ID
                </span>
              </div>
              <p className="text-xs text-[#7A746F]">Angkutan Laut & Logistik Pelabuhan</p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F8F5F2] p-1 rounded-xl border border-[#E5E1DA]">
            <button
              onClick={() => setActiveTab("tracking")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "tracking"
                  ? "bg-[#2D4B5A] text-white shadow-sm"
                  : "text-[#7A746F] hover:text-[#2D4B5A] hover:bg-[#EAE7E2]"
              }`}
            >
              <Compass className="w-4 h-4" />
              Pelacakan Kapal & Resi
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "bookings"
                  ? "bg-[#2D4B5A] text-white shadow-sm"
                  : "text-[#7A746F] hover:text-[#2D4B5A] hover:bg-[#EAE7E2]"
              }`}
            >
              <Package className="w-4 h-4" />
              Pemesanan Kargo
            </button>

            <button
              onClick={() => setActiveTab("voyages")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "voyages"
                  ? "bg-[#2D4B5A] text-white shadow-sm"
                  : "text-[#7A746F] hover:text-[#2D4B5A] hover:bg-[#EAE7E2]"
              }`}
            >
              <Anchor className="w-4 h-4" />
              Jadwal Pelayaran
            </button>

            <button
              onClick={() => setActiveTab("vessels")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "vessels"
                  ? "bg-[#2D4B5A] text-white shadow-sm"
                  : "text-[#7A746F] hover:text-[#2D4B5A] hover:bg-[#EAE7E2]"
              }`}
            >
              <Ship className="w-4 h-4" />
              Armada Kapal
            </button>

            {/* Keuangan: Available for all, but specially featured for owner & agent */}
            <button
              onClick={() => setActiveTab("finance")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "finance"
                  ? "bg-[#2D4B5A] text-white shadow-sm"
                  : "text-[#7A746F] hover:text-[#2D4B5A] hover:bg-[#EAE7E2]"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Laporan Keuangan
            </button>
          </nav>

          {/* User Profile & Auth Trigger */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-[#F8F5F2] pl-2 pr-3 py-1.5 rounded-xl border border-[#E5E1DA]">
                <img
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover border border-[#DCD8D3]"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-[#2D4B5A] truncate max-w-[140px]">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${roleInfo.badge}`}>
                      {currentUser.role.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-[#7A746F] truncate max-w-[100px]">
                      {currentUser.companyName}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onOpenAuth}
                  title="Ganti Akun atau Masuk"
                  className="p-1.5 text-[#7A746F] hover:text-[#2D4B5A] hover:bg-[#EAE7E2] rounded-lg transition-colors ml-1"
                >
                  <UserCheck className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 bg-[#2D4B5A] hover:bg-[#223A47] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-[#2D4B5A]/20 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-[#8BA88E]" />
                Masuk / Daftar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Tab Bar (when viewing in standard browser on small screens) */}
      <div className="lg:hidden flex items-center justify-around border-t border-[#E5E1DA] px-2 py-2 bg-white overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab("tracking")}
          className={`flex flex-col items-center px-2 py-1 rounded text-[11px] font-semibold ${
            activeTab === "tracking" ? "text-[#2D4B5A] font-bold" : "text-[#7A746F]"
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          Lacak
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex flex-col items-center px-2 py-1 rounded text-[11px] font-semibold ${
            activeTab === "bookings" ? "text-[#2D4B5A] font-bold" : "text-[#7A746F]"
          }`}
        >
          <Package className="w-4 h-4 mb-0.5" />
          Pemesanan
        </button>
        <button
          onClick={() => setActiveTab("voyages")}
          className={`flex flex-col items-center px-2 py-1 rounded text-[11px] font-semibold ${
            activeTab === "voyages" ? "text-[#2D4B5A] font-bold" : "text-[#7A746F]"
          }`}
        >
          <Anchor className="w-4 h-4 mb-0.5" />
          Jadwal
        </button>
        <button
          onClick={() => setActiveTab("vessels")}
          className={`flex flex-col items-center px-2 py-1 rounded text-[11px] font-semibold ${
            activeTab === "vessels" ? "text-[#2D4B5A] font-bold" : "text-[#7A746F]"
          }`}
        >
          <Ship className="w-4 h-4 mb-0.5" />
          Armada
        </button>
        <button
          onClick={() => setActiveTab("finance")}
          className={`flex flex-col items-center px-2 py-1 rounded text-[11px] font-semibold ${
            activeTab === "finance" ? "text-[#2D4B5A] font-bold" : "text-[#7A746F]"
          }`}
        >
          <DollarSign className="w-4 h-4 mb-0.5" />
          Keuangan
        </button>
      </div>
    </header>
  );
};
