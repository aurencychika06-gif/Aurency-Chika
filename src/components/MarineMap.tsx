import React, { useState } from "react";
import { Vessel, Booking } from "../types";
import { Ship, Anchor, Navigation, Wind, Compass, MapPin, Gauge, ShieldAlert } from "lucide-react";

interface MarineMapProps {
  vessels: Vessel[];
  selectedVesselId?: string;
  onSelectVessel: (vessel: Vessel) => void;
  activeBooking?: Booking | null;
}

// Major Indonesian Ports with Coordinates for SVG Map representation
const PORTS = [
  { name: "Tanjung Priok, Jakarta", x: 260, y: 320, code: "IDJKT" },
  { name: "Tanjung Perak, Surabaya", x: 380, y: 340, code: "IDSUB" },
  { name: "Belawan, Medan", x: 120, y: 130, code: "IDBLW" },
  { name: "Soekarno-Hatta, Makassar", x: 570, y: 300, code: "IDMAK" },
  { name: "Semayang, Balikpapan", x: 500, y: 220, code: "IDBPN" },
  { name: "Trisakti, Banjarmasin", x: 440, y: 270, code: "IDBDJ" },
  { name: "Bitung, Sulawesi Utara", x: 670, y: 140, code: "IDBIT" },
  { name: "Batu Ampar, Batam", x: 200, y: 200, code: "IDBTH" },
  { name: "Sorong, Papua", x: 800, y: 240, code: "IDSOQ" }
];

// Helper to convert lat/lng to SVG map coordinates (Indonesia bounding box: Lat 6°N to 11°S, Lng 95°E to 141°E)
const geoToSvg = (lat: number, lng: number) => {
  const minLng = 94;
  const maxLng = 142;
  const minLat = -11.5;
  const maxLat = 6.5;

  const x = ((lng - minLng) / (maxLng - minLng)) * 900;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 480;
  return { x: Math.max(30, Math.min(870, x)), y: Math.max(30, Math.min(450, y)) };
};

export const MarineMap: React.FC<MarineMapProps> = ({
  vessels,
  selectedVesselId,
  onSelectVessel,
  activeBooking
}) => {
  const [hoveredVessel, setHoveredVessel] = useState<Vessel | null>(null);
  const [showSeaLanes, setShowSeaLanes] = useState(true);
  const [showWeatherLayer, setShowWeatherLayer] = useState(true);

  const selectedVessel = vessels.find((v) => v.id === selectedVesselId) || vessels[0];

  return (
    <div className="relative w-full bg-white rounded-2xl border border-[#E5E1DA] shadow-sm overflow-hidden text-[#4A443F]">
      {/* Top Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#F8F5F2] border-b border-[#E5E1DA] gap-3 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#2D4B5A]/10 text-[#2D4B5A] border border-[#2D4B5A]/20 flex items-center justify-center">
            <Compass className="w-5 h-5 text-[#2D4B5A]" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#2D4B5A] flex items-center gap-2">
              Peta Maritim & Pelacakan AIS Nusantara
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#8BA88E]/20 text-[#36543A] border border-[#8BA88E]/40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8BA88E] animate-ping mr-1.5" />
                Live AIS Feed
              </span>
            </div>
            <div className="text-xs text-[#7A746F]">
              ALKI I, II, III • Perairan Teritorial Republik Indonesia
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowSeaLanes(!showSeaLanes)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors border cursor-pointer ${
              showSeaLanes
                ? "bg-[#2D4B5A] text-white border-[#2D4B5A]"
                : "bg-white text-[#7A746F] border-[#E5E1DA] hover:bg-[#F3EFEA]"
            }`}
          >
            Alur Pelayaran (ALKI)
          </button>
          <button
            onClick={() => setShowWeatherLayer(!showWeatherLayer)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors border cursor-pointer ${
              showWeatherLayer
                ? "bg-[#8BA88E] text-white border-[#8BA88E]"
                : "bg-white text-[#7A746F] border-[#E5E1DA] hover:bg-[#F3EFEA]"
            }`}
          >
            Cuaca & Gelombang (BMKG)
          </button>
        </div>
      </div>

      {/* Main Nautical SVG Interactive Canvas */}
      <div className="relative w-full h-[420px] md:h-[480px] bg-[#1E3541] select-none overflow-hidden">
        {/* Radar concentric circles background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#8BA88E]/40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#8BA88E]/40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#8BA88E]/40" />
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#8BA88E]/30" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#8BA88E]/30" />
        </div>

        <svg
          viewBox="0 0 900 480"
          className="w-full h-full"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="marine-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(139, 168, 142, 0.15)" strokeWidth="0.5" />
            </pattern>
            {/* Sea Lane Dash */}
            <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8BA88E" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#2D4B5A" stopOpacity="0.4" />
            </linearGradient>
            {/* Pulse Glow */}
            <radialGradient id="vessel-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8BA88E" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2D4B5A" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="900" height="480" fill="url(#marine-grid)" />

          {/* Simplified Stylized Archipelago Coastlines (Indonesia) */}
          {/* Sumatera */}
          <path
            d="M 60 80 Q 90 90 140 160 T 210 270 Q 230 300 210 320 Q 180 300 130 220 T 70 120 Z"
            fill="#2D4B5A"
            stroke="#416375"
            strokeWidth="1.5"
            opacity="0.9"
          />
          {/* Jawa */}
          <path
            d="M 220 325 Q 310 325 410 345 T 460 360 Q 420 375 320 365 T 225 340 Z"
            fill="#2D4B5A"
            stroke="#416375"
            strokeWidth="1.5"
            opacity="0.9"
          />
          {/* Kalimantan */}
          <path
            d="M 370 170 Q 470 150 510 200 T 520 280 Q 450 300 390 270 T 360 210 Z"
            fill="#2D4B5A"
            stroke="#416375"
            strokeWidth="1.5"
            opacity="0.9"
          />
          {/* Sulawesi */}
          <path
            d="M 580 180 Q 640 140 680 140 Q 670 180 620 200 Q 650 250 630 300 Q 590 320 570 270 Q 560 220 580 180 Z"
            fill="#2D4B5A"
            stroke="#416375"
            strokeWidth="1.5"
            opacity="0.9"
          />
          {/* Maluku & Papua */}
          <path
            d="M 720 190 Q 760 170 780 210 T 730 250 Z"
            fill="#2D4B5A"
            stroke="#416375"
            strokeWidth="1.5"
            opacity="0.9"
          />
          <path
            d="M 780 230 Q 860 220 890 260 T 850 350 Q 810 330 780 280 Z"
            fill="#2D4B5A"
            stroke="#416375"
            strokeWidth="1.5"
            opacity="0.9"
          />

          {/* Sea Lane Routes (ALKI) */}
          {showSeaLanes && (
            <g opacity="0.75">
              {/* Route Jakarta - Surabaya */}
              <path
                d="M 260 320 Q 320 315 380 340"
                fill="none"
                stroke="#8BA88E"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              {/* Route Jakarta - Medan */}
              <path
                d="M 260 320 Q 180 240 120 130"
                fill="none"
                stroke="#8BA88E"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              {/* Route Surabaya - Balikpapan */}
              <path
                d="M 380 340 Q 460 300 500 220"
                fill="none"
                stroke="#8BA88E"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              {/* Route Surabaya - Makassar */}
              <path
                d="M 380 340 Q 480 330 570 300"
                fill="none"
                stroke="#8BA88E"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              {/* Route Makassar - Bitung */}
              <path
                d="M 570 300 Q 640 220 670 140"
                fill="none"
                stroke="#8BA88E"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
            </g>
          )}

          {/* Weather Wave simulation overlay */}
          {showWeatherLayer && (
            <g opacity="0.6">
              <text x="310" y="270" fill="#EAE7E2" fontSize="10" className="select-none font-mono">
                🌊 Gelombang: 0.8m (Tenang)
              </text>
              <text x="520" y="260" fill="#EAE7E2" fontSize="10" className="select-none font-mono">
                🌊 Gelombang: 1.2m (Sedang)
              </text>
              <text x="140" y="170" fill="#EAE7E2" fontSize="10" className="select-none font-mono">
                💨 Angin: 12 kts (Barat Laut)
              </text>
            </g>
          )}

          {/* Indonesian Ports Markers */}
          {PORTS.map((port) => (
            <g key={port.name} className="cursor-pointer group">
              <circle cx={port.x} cy={port.y} r="4.5" fill="#D97757" stroke="#ffffff" strokeWidth="1.5" />
              <text
                x={port.x + 8}
                y={port.y + 4}
                fill="#F8F5F2"
                fontSize="11"
                fontWeight="600"
                className="select-none group-hover:fill-[#8BA88E] transition-all"
              >
                {port.name.split(",")[0]}
              </text>
            </g>
          ))}

          {/* Active Vessels Markers */}
          {vessels.map((vessel) => {
            const pos = geoToSvg(vessel.coordinates.lat, vessel.coordinates.lng);
            const isSelected = vessel.id === selectedVesselId;
            const isUnderway = vessel.status === "Underway";

            return (
              <g
                key={vessel.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer"
                onClick={() => onSelectVessel(vessel)}
                onMouseEnter={() => setHoveredVessel(vessel)}
                onMouseLeave={() => setHoveredVessel(null)}
              >
                {/* Active Ripple Animation */}
                {isUnderway && (
                  <circle r="16" fill="url(#vessel-glow)" className="animate-ping opacity-75" />
                )}

                {/* Selection Ring */}
                {isSelected && (
                  <circle r="14" fill="none" stroke="#8BA88E" strokeWidth="2.5" strokeDasharray="3,3" />
                )}

                {/* Vessel Icon / Heading Arrow */}
                <g transform={`rotate(${vessel.headingDeg})`}>
                  <path
                    d="M 0 -9 L 7 7 L 0 4 L -7 7 Z"
                    fill={
                      isSelected
                        ? "#8BA88E"
                        : isUnderway
                        ? "#8BA88E"
                        : vessel.status === "Moored"
                        ? "#D97757"
                        : "#A19B95"
                    }
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </g>

                {/* Vessel Label */}
                <text
                  x="0"
                  y="-14"
                  textAnchor="middle"
                  fill={isSelected ? "#8BA88E" : "#F8F5F2"}
                  fontSize="10"
                  fontWeight="700"
                  className="select-none bg-[#2D4B5A] px-1 py-0.5 rounded"
                >
                  {vessel.name.replace("KM ", "").replace("LCT ", "").replace("TB. ", "")}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered or Selected Vessel Info Floating Badge */}
        {(hoveredVessel || selectedVessel) && (
          <div className="absolute bottom-3 left-3 right-3 md:right-auto md:max-w-md bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#E5E1DA] shadow-xl z-20 text-[#4A443F]">
            {(() => {
              const v = hoveredVessel || selectedVessel;
              return (
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#2D4B5A]">{v.name}</span>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            v.status === "Underway"
                              ? "bg-[#8BA88E]/20 text-[#36543A] border border-[#8BA88E]/40"
                              : v.status === "Moored"
                              ? "bg-[#D97757]/20 text-[#9C3818] border border-[#D97757]/40"
                              : "bg-[#EAE7E2] text-[#7A746F]"
                          }`}
                        >
                          {v.status === "Underway" ? "Berlayar" : v.status === "Moored" ? "Sandar di Pelabuhan" : v.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#7A746F] mt-0.5 flex items-center gap-2">
                        <span>Call Sign: {v.callSign}</span>
                        <span>•</span>
                        <span>MMSI: {v.mmsi}</span>
                        <span>•</span>
                        <span>DWT: {v.dwt.toLocaleString()} Ton</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E5E1DA] text-xs">
                    <div className="bg-[#F8F5F2] p-2 rounded-lg border border-[#E5E1DA]/60">
                      <div className="text-[#7A746F] flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-[#2D4B5A]" />
                        Kecepatan
                      </div>
                      <div className="font-bold text-[#2D4B5A] mt-0.5">{v.speedKnots} Knots</div>
                    </div>
                    <div className="bg-[#F8F5F2] p-2 rounded-lg border border-[#E5E1DA]/60">
                      <div className="text-[#7A746F] flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5 text-[#2D4B5A]" />
                        Haluan
                      </div>
                      <div className="font-bold text-[#2D4B5A] mt-0.5">{v.headingDeg}°</div>
                    </div>
                    <div className="bg-[#F8F5F2] p-2 rounded-lg border border-[#E5E1DA]/60">
                      <div className="text-[#7A746F] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#8BA88E]" />
                        Tujuan
                      </div>
                      <div className="font-bold text-[#2D4B5A] mt-0.5 truncate">{v.destinationPort.split(",")[0]}</div>
                    </div>
                  </div>

                  <div className="mt-2.5 text-[11px] text-[#4A443F] flex items-center justify-between">
                    <span className="text-[#7A746F]">Posisi: {v.currentLocationName}</span>
                    <span className="text-[#2D4B5A] font-bold">ETA: {v.eta}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Marine Legend Footer */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#F8F5F2] border-t border-[#E5E1DA] text-xs text-[#7A746F] gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8BA88E]" />
            <span className="text-[#4A443F] font-medium">Kapal Berlayar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97757]" />
            <span className="text-[#4A443F] font-medium">Sandar / Labuh</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2D4B5A]" />
            <span className="text-[#4A443F] font-medium">Kapal Dipilih</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97757]" />
            <span className="text-[#4A443F] font-medium">Pelabuhan Utama</span>
          </div>
        </div>
        <div className="font-mono text-[11px] text-[#A19B95]">
          AIS Transponder WGS84 • Update Otomatis Tiap 30 Detik
        </div>
      </div>
    </div>
  );
};
