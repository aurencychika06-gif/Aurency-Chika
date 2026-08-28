import React, { useState } from "react";
import { UserRole, User } from "../types";
import { X, Ship, UserCheck, ShieldCheck, Mail, Lock, Building, Phone, ArrowRight, Sparkles } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onQuickRoleSelect: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onQuickRoleSelect
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<UserRole>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role, companyName, phone })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Pendaftaran gagal");
        onLoginSuccess(data.user);
        onClose();
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, role })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login gagal");
        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan pada sistem autentikasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#E5E1DA] rounded-2xl shadow-xl w-full max-w-md overflow-hidden text-[#4A443F] relative">
        {/* Header */}
        <div className="bg-[#F8F5F2] p-5 border-b border-[#E5E1DA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D4B5A] flex items-center justify-center text-white shadow-md">
              <Ship className="w-5 h-5 text-[#8BA88E]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2D4B5A]">
                {isRegister ? "Pendaftaran Akun Baru" : "Masuk ke Sistem Maritim"}
              </h3>
              <p className="text-xs text-[#7A746F]">Nusantara Marine Freight Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#7A746F] hover:text-[#2D4B5A] rounded-lg hover:bg-[#EAE7E2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Role Selection Preset */}
        <div className="p-4 bg-[#F8F5F2]/60 border-b border-[#E5E1DA]">
          <div className="flex items-center gap-1.5 text-xs text-[#2D4B5A] font-bold mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#8BA88E]" />
            Login Cepat Akun Demo (1-Klik):
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                onQuickRoleSelect("owner");
                onClose();
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#2D4B5A]/10 border border-[#2D4B5A]/30 hover:bg-[#2D4B5A]/20 transition-all text-center group cursor-pointer"
            >
              <span className="text-base mb-1">👨‍✈️</span>
              <span className="text-[11px] font-bold text-[#2D4B5A]">
                Pemilik Kapal
              </span>
              <span className="text-[9px] text-[#7A746F] mt-0.5">Capt. Hendra</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onQuickRoleSelect("agent");
                onClose();
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#D97757]/10 border border-[#D97757]/30 hover:bg-[#D97757]/20 transition-all text-center group cursor-pointer"
            >
              <span className="text-base mb-1">📋</span>
              <span className="text-[11px] font-bold text-[#D97757]">
                Agen Logistik
              </span>
              <span className="text-[9px] text-[#7A746F] mt-0.5">Siti Rahmawati</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onQuickRoleSelect("customer");
                onClose();
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#8BA88E]/20 border border-[#8BA88E]/40 hover:bg-[#8BA88E]/30 transition-all text-center group cursor-pointer"
            >
              <span className="text-base mb-1">📦</span>
              <span className="text-[11px] font-bold text-[#2E4E32]">
                Pelanggan
              </span>
              <span className="text-[9px] text-[#7A746F] mt-0.5">Budi Santoso</span>
            </button>
          </div>
        </div>

        {/* Tab switcher: Login or Register */}
        <div className="flex border-b border-[#E5E1DA]">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
              !isRegister
                ? "border-[#2D4B5A] text-[#2D4B5A] bg-[#F8F5F2]"
                : "border-transparent text-[#7A746F] hover:text-[#2D4B5A]"
            }`}
          >
            Form Login Manual
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
              isRegister
                ? "border-[#2D4B5A] text-[#2D4B5A] bg-[#F8F5F2]"
                : "border-transparent text-[#7A746F] hover:text-[#2D4B5A]"
            }`}
          >
            Daftar Akun Baru
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#4A443F] mb-1">Nama Lengkap</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Capt. Sukardi / Andi Wijaya"
                    className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3.5 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#4A443F] mb-1">Nama Perusahaan</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="PT Samudera Logistik"
                    className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A443F] mb-1">Nomor Telepon / WA</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62 812-xxxx"
                    className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
                  />
                </div>
              </div>
            </>
          )}

          {/* Role selector */}
          <div>
            <label className="block text-xs font-semibold text-[#4A443F] mb-1">Tipe Hak Akses (Role)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
            >
              <option value="customer">📦 Pelanggan / Pemilik Barang (Shipper)</option>
              <option value="agent">📋 Agen Logistik & Keagenan Kapal</option>
              <option value="owner">👨‍✈️ Pemilik Kapal (Ship Owner / Fleet Director)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A443F] mb-1">Alamat Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.co.id"
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3.5 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A443F] mb-1">Kata Sandi</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-3.5 py-2 text-xs text-[#4A443F] focus:outline-none focus:border-[#2D4B5A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D4B5A] hover:bg-[#223A47] text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-[#2D4B5A]/20 transition-all mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Memproses...</span>
            ) : (
              <>
                <span>{isRegister ? "Daftarkan Akun Maritim" : "Masuk ke Dashboard"}</span>
                <ArrowRight className="w-4 h-4 text-[#8BA88E]" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-[#7A746F] pt-1">
            Data tersimpan aman pada sistem basis data maritim nasional.
          </p>
        </form>
      </div>
    </div>
  );
};
