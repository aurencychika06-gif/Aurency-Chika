/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { User, UserRole, Vessel, Voyage, Booking, FinancialTransaction, FinancialSummary, BookingStatus, PaymentStatus } from "./types";
import { api } from "./services/api";
import { Header } from "./components/Header";
import { TrackingView } from "./components/TrackingView";
import { BookingsView } from "./components/BookingsView";
import { VesselsView } from "./components/VesselsView";
import { VoyagesView } from "./components/VoyagesView";
import { FinanceView } from "./components/FinanceView";
import { AuthModal } from "./components/AuthModal";
import { NewBookingModal } from "./components/NewBookingModal";
import { BillOfLadingModal } from "./components/BillOfLadingModal";
import { VesselModal } from "./components/VesselModal";
import { VoyageModal } from "./components/VoyageModal";
import { TransactionModal } from "./components/TransactionModal";
import { MobileFrame } from "./components/MobileFrame";
import { Ship, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function App() {
  // State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"tracking" | "bookings" | "vessels" | "voyages" | "finance">("tracking");
  const [isMobileSimulation, setIsMobileSimulation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Entities Data from Backend REST API
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);

  // Modal States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBookingForEdit, setSelectedBookingForEdit] = useState<Booking | null>(null);
  const [activeBillOfLading, setActiveBillOfLading] = useState<Booking | null>(null);

  const [isVesselModalOpen, setIsVesselModalOpen] = useState(false);
  const [selectedVesselForEdit, setSelectedVesselForEdit] = useState<Vessel | null>(null);

  const [isVoyageModalOpen, setIsVoyageModalOpen] = useState(false);
  const [selectedVoyageForEdit, setSelectedVoyageForEdit] = useState<Voyage | null>(null);

  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [selectedTxForEdit, setSelectedTxForEdit] = useState<FinancialTransaction | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial Data Fetching
  const refreshAllData = async () => {
    try {
      setLoading(true);
      const [vData, voyData, bkgData, txData, sumData] = await Promise.all([
        api.getVessels(),
        api.getVoyages(),
        api.getBookings(),
        api.getTransactions(),
        api.getFinancialSummary()
      ]);
      setVessels(vData);
      setVoyages(voyData);
      setBookings(bkgData);
      setTransactions(txData);
      setFinancialSummary(sumData);
    } catch (err) {
      console.error("Gagal memuat data maritim:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial auto-login as Ship Owner for full demo access
    api
      .login("owner@samuderanusantara.co.id", "owner")
      .then((res) => {
        if (res.user) setCurrentUser(res.user);
      })
      .catch(console.error);

    refreshAllData();
  }, []);

  // Quick Role Switcher
  const handleQuickSwitchRole = async (role: UserRole) => {
    try {
      const res = await api.login("", role);
      if (res.user) {
        setCurrentUser(res.user);
        showToast(`Beralih akun ke: ${res.user.name} (${res.user.role.toUpperCase()})`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reset database handler
  const handleResetData = async () => {
    if (window.confirm("Kembalikan seluruh basis data ke kondisi default awal maritim?")) {
      try {
        await api.resetDatabase();
        await refreshAllData();
        showToast("Basis data berhasil direset ke data default maritim.");
      } catch (err) {
        console.error(err);
      }
    }
  };

  // CRUD Handlers: Bookings
  const handleSaveBooking = async (bookingData: Partial<Booking>) => {
    try {
      if (selectedBookingForEdit) {
        await api.updateBooking(selectedBookingForEdit.id, bookingData);
        showToast(`Pemesanan ${selectedBookingForEdit.bookingNumber} berhasil diperbarui.`);
      } else {
        const created = await api.createBooking(bookingData);
        showToast(`Pemesanan ${created.bookingNumber} berhasil diajukan (B/L: ${created.blNumber}).`);
      }
      setSelectedBookingForEdit(null);
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan pemesanan");
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await api.deleteBooking(id);
      showToast("Data pemesanan kargo berhasil dihapus.");
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus pemesanan");
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: BookingStatus, payment?: PaymentStatus) => {
    try {
      const payload: Partial<Booking> = { bookingStatus: status };
      if (payment) payload.paymentStatus = payment;
      await api.updateBooking(id, payload);
      showToast(`Status kargo berhasil diubah menjadi: ${status}`);
      await refreshAllData();
    } catch (err: any) {
      console.error(err);
    }
  };

  // CRUD Handlers: Vessels
  const handleSaveVessel = async (vesselData: Partial<Vessel>) => {
    try {
      if (selectedVesselForEdit) {
        await api.updateVessel(selectedVesselForEdit.id, vesselData);
        showToast(`Data kapal ${selectedVesselForEdit.name} berhasil diperbarui.`);
      } else {
        const created = await api.createVessel(vesselData);
        showToast(`Kapal ${created.name} berhasil didaftarkan ke armada.`);
      }
      setSelectedVesselForEdit(null);
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan kapal");
    }
  };

  const handleDeleteVessel = async (id: string) => {
    try {
      await api.deleteVessel(id);
      showToast("Kapal berhasil dihapus dari armada.");
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus kapal");
    }
  };

  const handleSimulateAIS = async (vesselId: string) => {
    const v = vessels.find((ves) => ves.id === vesselId);
    if (!v) return;

    // Simulate minor movement, speed fluctuation and fuel decrease
    const deltaLat = (Math.random() - 0.5) * 0.15;
    const deltaLng = (Math.random() - 0.5) * 0.25;
    const newSpeed = Number((12 + Math.random() * 4).toFixed(1));
    const newHeading = Math.floor((v.headingDeg + (Math.random() - 0.5) * 20 + 360) % 360);
    const newFuel = Math.max(10, v.fuelLevelPercent - 1);

    try {
      await api.updateVessel(vesselId, {
        speedKnots: newSpeed,
        headingDeg: newHeading,
        fuelLevelPercent: newFuel,
        coordinates: {
          lat: Number((v.coordinates.lat + deltaLat).toFixed(3)),
          lng: Number((v.coordinates.lng + deltaLng).toFixed(3))
        }
      });
      showToast(`Telemetri AIS ${v.name} diperbarui: ${newSpeed} Kts, Haluan ${newHeading}°`);
      await refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // CRUD Handlers: Voyages
  const handleSaveVoyage = async (voyageData: Partial<Voyage>) => {
    try {
      if (selectedVoyageForEdit) {
        await api.updateVoyage(selectedVoyageForEdit.id, voyageData);
        showToast(`Jadwal pelayaran ${selectedVoyageForEdit.voyageNumber} diperbarui.`);
      } else {
        const created = await api.createVoyage(voyageData);
        showToast(`Jadwal pelayaran ${created.voyageNumber} berhasil diterbitkan.`);
      }
      setSelectedVoyageForEdit(null);
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan jadwal");
    }
  };

  const handleDeleteVoyage = async (id: string) => {
    try {
      await api.deleteVoyage(id);
      showToast("Jadwal pelayaran berhasil dihapus.");
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus jadwal");
    }
  };

  // CRUD Handlers: Transactions
  const handleSaveTransaction = async (txData: Partial<FinancialTransaction>) => {
    try {
      if (selectedTxForEdit) {
        await api.updateTransaction(selectedTxForEdit.id, txData);
        showToast(`Entri transaksi ${selectedTxForEdit.transactionNumber} diperbarui.`);
      } else {
        const created = await api.createTransaction(txData);
        showToast(`Transaksi keuangan ${created.transactionNumber} berhasil dicatat.`);
      }
      setSelectedTxForEdit(null);
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || "Gagal mencatat transaksi");
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await api.deleteTransaction(id);
      showToast("Catatan transaksi keuangan berhasil dihapus.");
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus transaksi");
    }
  };

  // Main Active View Content renderer
  const renderActiveView = () => {
    switch (activeTab) {
      case "tracking":
        return (
          <TrackingView
            vessels={vessels}
            bookings={bookings}
            voyages={voyages}
            onOpenNewBooking={() => {
              setSelectedBookingForEdit(null);
              setIsBookingModalOpen(true);
            }}
            onOpenBillOfLading={(b) => setActiveBillOfLading(b)}
          />
        );
      case "bookings":
        return (
          <BookingsView
            bookings={bookings}
            currentUser={currentUser}
            onOpenNewBooking={() => {
              setSelectedBookingForEdit(null);
              setIsBookingModalOpen(true);
            }}
            onEditBooking={(b) => {
              setSelectedBookingForEdit(b);
              setIsBookingModalOpen(true);
            }}
            onDeleteBooking={handleDeleteBooking}
            onUpdateStatus={handleUpdateBookingStatus}
            onOpenBillOfLading={(b) => setActiveBillOfLading(b)}
          />
        );
      case "vessels":
        return (
          <VesselsView
            vessels={vessels}
            currentUser={currentUser}
            onOpenNewVessel={() => {
              setSelectedVesselForEdit(null);
              setIsVesselModalOpen(true);
            }}
            onEditVessel={(v) => {
              setSelectedVesselForEdit(v);
              setIsVesselModalOpen(true);
            }}
            onDeleteVessel={handleDeleteVessel}
            onSimulateAIS={handleSimulateAIS}
          />
        );
      case "voyages":
        return (
          <VoyagesView
            voyages={voyages}
            vessels={vessels}
            currentUser={currentUser}
            onOpenNewVoyage={() => {
              setSelectedVoyageForEdit(null);
              setIsVoyageModalOpen(true);
            }}
            onEditVoyage={(voy) => {
              setSelectedVoyageForEdit(voy);
              setIsVoyageModalOpen(true);
            }}
            onDeleteVoyage={handleDeleteVoyage}
            onBookVoyage={(voy) => {
              setSelectedBookingForEdit(null);
              setIsBookingModalOpen(true);
            }}
          />
        );
      case "finance":
        return (
          <FinanceView
            summary={financialSummary}
            transactions={transactions}
            vessels={vessels}
            currentUser={currentUser}
            onOpenNewTransaction={() => {
              setSelectedTxForEdit(null);
              setIsTxModalOpen(true);
            }}
            onEditTransaction={(tx) => {
              setSelectedTxForEdit(tx);
              setIsTxModalOpen(true);
            }}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#4A443F] font-sans flex flex-col selection:bg-[#2D4B5A] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2D4B5A] border border-[#8BA88E]/60 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#8BA88E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileSimulation={isMobileSimulation}
        setIsMobileSimulation={setIsMobileSimulation}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => setCurrentUser(null)}
        onQuickSwitchRole={handleQuickSwitchRole}
        onResetData={handleResetData}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-[#7A746F] space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#2D4B5A]" />
            <p className="text-sm font-medium">Menghubungkan ke Sistem Maritim Terpadu...</p>
          </div>
        ) : isMobileSimulation ? (
          <MobileFrame
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            onCloseMobileMode={() => setIsMobileSimulation(false)}
          >
            {renderActiveView()}
          </MobileFrame>
        ) : (
          renderActiveView()
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Berhasil masuk sebagai: ${user.name}`);
        }}
        onQuickRoleSelect={handleQuickSwitchRole}
      />

      <NewBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedBookingForEdit(null);
        }}
        onSave={handleSaveBooking}
        editBooking={selectedBookingForEdit}
        voyages={voyages}
        vessels={vessels}
        currentUser={currentUser}
      />

      <BillOfLadingModal
        booking={activeBillOfLading}
        onClose={() => setActiveBillOfLading(null)}
      />

      <VesselModal
        isOpen={isVesselModalOpen}
        onClose={() => {
          setIsVesselModalOpen(false);
          setSelectedVesselForEdit(null);
        }}
        onSave={handleSaveVessel}
        editVessel={selectedVesselForEdit}
      />

      <VoyageModal
        isOpen={isVoyageModalOpen}
        onClose={() => {
          setIsVoyageModalOpen(false);
          setSelectedVoyageForEdit(null);
        }}
        onSave={handleSaveVoyage}
        editVoyage={selectedVoyageForEdit}
        vessels={vessels}
      />

      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setSelectedTxForEdit(null);
        }}
        onSave={handleSaveTransaction}
        editTransaction={selectedTxForEdit}
        vessels={vessels}
        voyages={voyages}
      />

      {/* Footer */}
      <footer className="border-t border-[#E5E1DA] bg-[#EAE7E2] py-6 text-center text-xs text-[#7A746F]">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#2D4B5A] font-medium">
            <Ship className="w-4 h-4 text-[#2D4B5A]" />
            <span>Nusantara Marine Freight & Logistics Management System</span>
          </div>
          <div>
            Terhubung ke Real Database • Pemilik Kapal • Agen Ekspedisi • Pelanggan Kargo
          </div>
        </div>
      </footer>
    </div>
  );
}
