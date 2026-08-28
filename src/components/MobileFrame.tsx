import React from "react";
import { Compass, Package, Anchor, Ship, DollarSign, Smartphone, Wifi, Battery, Signal } from "lucide-react";
import { User } from "../types";

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: "tracking" | "bookings" | "vessels" | "voyages" | "finance";
  setActiveTab: (tab: "tracking" | "bookings" | "vessels" | "voyages" | "finance") => void;
  currentUser: User | null;
  onCloseMobileMode: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeTab,
  setActiveTab,
  currentUser,
  onCloseMobileMode
}) => {
  return (
    <div className="py-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] animate-fadeIn">
      {/* Device frame header control */}
      <div className="mb-4 flex items-center justify-between w-full max-w-sm px-2 text-xs text-[#7A746F]">
        <span className="flex items-center gap-1.5 font-semibold text-[#2D4B5A]">
          <Smartphone className="w-4 h-4 text-[#8BA88E]" />
          Simulasi Tampilan Mobile App (Android / iOS)
        </span>
        <button
          onClick={onCloseMobileMode}
          className="text-xs text-[#2D4B5A] hover:underline font-bold cursor-pointer"
        >
          Kembali ke Mode Web
        </button>
      </div>

      {/* Realistic Smartphone Shell */}
      <div className="w-full max-w-[390px] h-[780px] bg-[#F8F5F2] rounded-[44px] border-[10px] border-[#2D4B5A] shadow-2xl overflow-hidden flex flex-col relative">
        {/* Dynamic Island / Speaker Notch */}
        <div className="bg-[#2D4B5A] pt-2 pb-1.5 px-6 flex items-center justify-between z-30 select-none text-white">
          <span className="text-[11px] font-bold font-mono">09:41</span>
          <div className="w-20 h-3.5 bg-black/40 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-white/90">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Mobile App Header */}
        <div className="bg-white px-4 py-2.5 border-b border-[#E5E1DA] flex items-center justify-between text-[#4A443F] z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2D4B5A] flex items-center justify-center text-white">
              <Ship className="w-4 h-4 text-[#8BA88E]" />
            </div>
            <div>
              <div className="text-xs font-bold leading-none text-[#2D4B5A]">Nusantara Marine</div>
              <div className="text-[9px] text-[#7A746F]">Freight Mobile</div>
            </div>
          </div>

          <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8BA88E]/20 text-[#2D4B5A] border border-[#8BA88E]/40">
            {currentUser ? currentUser.role.toUpperCase() : "GUEST"}
          </div>
        </div>

        {/* Scrollable Mobile Content View */}
        <div className="flex-1 overflow-y-auto p-3 bg-[#F8F5F2] space-y-4 text-[#4A443F]">
          {children}
        </div>

        {/* Native Mobile Bottom Navigation Bar */}
        <div className="bg-white border-t border-[#E5E1DA] px-2 py-2 flex items-center justify-around z-30 select-none shadow-sm">
          <button
            onClick={() => setActiveTab("tracking")}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-all ${
              activeTab === "tracking" ? "text-[#2D4B5A] font-bold" : "text-[#7A746F] hover:text-[#2D4B5A]"
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span className="text-[9px]">Lacak AIS</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-all ${
              activeTab === "bookings" ? "text-[#2D4B5A] font-bold" : "text-[#7A746F] hover:text-[#2D4B5A]"
            }`}
          >
            <Package className="w-5 h-5 mb-0.5" />
            <span className="text-[9px]">Pemesanan</span>
          </button>

          <button
            onClick={() => setActiveTab("voyages")}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-all ${
              activeTab === "voyages" ? "text-[#2D4B5A] font-bold" : "text-[#7A746F] hover:text-[#2D4B5A]"
            }`}
          >
            <Anchor className="w-5 h-5 mb-0.5" />
            <span className="text-[9px]">Jadwal</span>
          </button>

          <button
            onClick={() => setActiveTab("vessels")}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-all ${
              activeTab === "vessels" ? "text-[#2D4B5A] font-bold" : "text-[#7A746F] hover:text-[#2D4B5A]"
            }`}
          >
            <Ship className="w-5 h-5 mb-0.5" />
            <span className="text-[9px]">Armada</span>
          </button>

          <button
            onClick={() => setActiveTab("finance")}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-all ${
              activeTab === "finance" ? "text-[#2D4B5A] font-bold" : "text-[#7A746F] hover:text-[#2D4B5A]"
            }`}
          >
            <DollarSign className="w-5 h-5 mb-0.5" />
            <span className="text-[9px]">Keuangan</span>
          </button>
        </div>

        {/* Home Indicator bar */}
        <div className="w-32 h-1 bg-[#DCD8D3] rounded-full mx-auto my-1.5" />
      </div>
    </div>
  );
};
