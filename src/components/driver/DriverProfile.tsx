import React, { useState, useEffect } from 'react';
import { 
  User, 
  Car, 
  Mail, 
  Phone, 
  CreditCard, 
  ShieldCheck, 
  Bell, 
  MapPin, 
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Save,
  Zap,
  Check,
  AlertCircle,
  QrCode,
  Sliders,
  Smartphone,
  Fuel,
  Plus
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import { VehicleCategory, FuelType, SlotPreference } from '../../types';

const AVATAR_GRADIENTS = [
  { id: 'cyan', label: 'Cyan Teal', class: 'from-cyan-500 to-blue-600' },
  { id: 'emerald', label: 'Emerald Mint', class: 'from-emerald-500 to-teal-600' },
  { id: 'indigo', label: 'Indigo Purple', class: 'from-indigo-500 to-purple-600' },
  { id: 'amber', label: 'Amber Orange', class: 'from-amber-500 to-orange-600' },
  { id: 'rose', label: 'Rose Crimson', class: 'from-rose-500 to-pink-600' },
];

export const DriverProfile: React.FC = () => {
  const { currentUser, updateCurrentUser, resetUserProfile, showToast } = useParking();

  // Form State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '+91 98765 43210');
  const [emergencyContact, setEmergencyContact] = useState(currentUser.emergency_contact || '+91 98111 55667');
  
  // Vehicle State
  const [plate, setPlate] = useState(currentUser.vehicle_number);
  const [vehicleModel, setVehicleModel] = useState(currentUser.vehicle_model || 'Tata Nexon EV Max');
  const [vehicleType, setVehicleType] = useState<VehicleCategory>(currentUser.vehicle_type || 'EV');
  const [fuelType, setFuelType] = useState<FuelType>(currentUser.fuel_type || 'Electric');
  const [preferredSlot, setPreferredSlot] = useState<SlotPreference>(currentUser.preferred_slot_type || 'EV Charging');

  // FASTag & Payment
  const [fastagId, setFastagId] = useState(currentUser.fastag_id || 'FT-ICICI-884102');
  const [fastagBank, setFastagBank] = useState(currentUser.fastag_bank || 'ICICI Bank');
  const [fastagBalance, setFastagBalance] = useState<number>(currentUser.fastag_balance ?? 1450);
  const [autoPayEnabled, setAutoPayEnabled] = useState(currentUser.auto_pay_enabled ?? true);

  // Notification Preferences
  const [notificationSms, setNotificationSms] = useState(currentUser.notification_sms ?? true);
  const [notificationWhatsapp, setNotificationWhatsapp] = useState(currentUser.notification_whatsapp ?? true);

  // Styling / Avatar
  const [avatarColor, setAvatarColor] = useState(currentUser.avatar_color || 'from-cyan-500 to-blue-600');
  
  // UI Status
  const [activeSubTab, setActiveSubTab] = useState<'details' | 'vehicle' | 'fastag' | 'notifications'>('details');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Keep local state synced if currentUser changes externally
  useEffect(() => {
    setName(currentUser.name);
    setEmail(currentUser.email);
    setPhone(currentUser.phone || '+91 98765 43210');
    setEmergencyContact(currentUser.emergency_contact || '+91 98111 55667');
    setPlate(currentUser.vehicle_number);
    setVehicleModel(currentUser.vehicle_model || 'Tata Nexon EV Max');
    setVehicleType(currentUser.vehicle_type || 'EV');
    setFuelType(currentUser.fuel_type || 'Electric');
    setPreferredSlot(currentUser.preferred_slot_type || 'EV Charging');
    setFastagId(currentUser.fastag_id || 'FT-ICICI-884102');
    setFastagBank(currentUser.fastag_bank || 'ICICI Bank');
    setFastagBalance(currentUser.fastag_balance ?? 1450);
    setAutoPayEnabled(currentUser.auto_pay_enabled ?? true);
    setNotificationSms(currentUser.notification_sms ?? true);
    setNotificationWhatsapp(currentUser.notification_whatsapp ?? true);
    setAvatarColor(currentUser.avatar_color || 'from-cyan-500 to-blue-600');
  }, [currentUser]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Validation
    if (!name.trim()) {
      setErrorMessage('Full name is required');
      showToast('Please enter your full name');
      return;
    }
    if (!plate.trim()) {
      setErrorMessage('Vehicle license plate number is required');
      showToast('Please enter your vehicle plate number');
      return;
    }

    // Standardize license plate formatting (clean spaces and uppercase)
    const formattedPlate = plate.trim().toUpperCase();

    updateCurrentUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      emergency_contact: emergencyContact.trim(),
      vehicle_number: formattedPlate,
      vehicle_model: vehicleModel.trim(),
      vehicle_type: vehicleType,
      fuel_type: fuelType,
      preferred_slot_type: preferredSlot,
      fastag_id: fastagId.trim(),
      fastag_bank: fastagBank,
      fastag_balance: fastagBalance,
      auto_pay_enabled: autoPayEnabled,
      notification_sms: notificationSms,
      notification_whatsapp: notificationWhatsapp,
      avatar_color: avatarColor
    });

    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
    }, 3500);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset your profile back to default demo settings?')) {
      resetUserProfile();
      setIsSavedSuccess(false);
    }
  };

  const handleAddBalance = (amount: number) => {
    const newBal = fastagBalance + amount;
    setFastagBalance(newBal);
    updateCurrentUser({ fastag_balance: newBal });
    showToast(`Recharged ₹${amount} to FASTag wallet. New balance: ₹${newBal}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner with Driver ID & Live Status */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Dynamic Avatar */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${avatarColor} flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-cyan-500/10 shrink-0`}>
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="font-display font-bold text-xl text-white truncate">{name || 'Your Name'}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
                  Verified Driver
                </span>
                {isSavedSuccess && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1 animate-pulse">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Saved Locally
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 truncate">{email}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 mt-1.5">
                <span className="text-cyan-300 flex items-center gap-1 font-semibold">
                  <Car className="w-3.5 h-3.5 text-cyan-400" /> {plate || 'No Plate'}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> FASTag: ₹{fastagBalance}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Reset profile to demo defaults"
              id="profile-reset-btn"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
              id="profile-save-top-btn"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </div>

        {/* Local Storage Auto-Persist Alert Banner */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Profile persists across page refreshes and updates your parking passes & gate receipts automatically.</span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 hidden md:inline">Storage: Device Browser</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('details')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'details'
              ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          id="profile-tab-details"
        >
          <User className="w-3.5 h-3.5" />
          <span>Personal Info</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('vehicle')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'vehicle'
              ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          id="profile-tab-vehicle"
        >
          <Car className="w-3.5 h-3.5" />
          <span>Vehicle & Plate</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('fastag')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'fastag'
              ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          id="profile-tab-fastag"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>FASTag & Wallet</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('notifications')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'notifications'
              ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          id="profile-tab-notifications"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Alerts & Passes</span>
        </button>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TAB 1: PERSONAL DETAILS */}
        {activeSubTab === 'details' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span>Driver Personal Details</span>
              </h3>
              <p className="text-xs text-slate-400">Manage your driver identity and emergency contact credentials</p>
            </div>

            {/* Avatar Theme Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Profile Avatar Accent Color
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {AVATAR_GRADIENTS.map((grad) => (
                  <button
                    key={grad.id}
                    type="button"
                    onClick={() => setAvatarColor(grad.class)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                      avatarColor === grad.class 
                        ? 'border-cyan-400 bg-slate-800 text-white shadow-sm' 
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${grad.class}`} />
                    <span>{grad.label}</span>
                    {avatarColor === grad.class && <Check className="w-3 h-3 text-cyan-400 ml-1" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-cyan-400" /> Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 outline-none transition-colors"
                  id="profile-name-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="driver@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 outline-none transition-colors"
                  id="profile-email-input"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" /> Primary Mobile Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-cyan-500 outline-none transition-colors"
                  id="profile-phone-input"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Used for barrier pass SMS & WhatsApp alerts</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-rose-400" /> Emergency Contact Number
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="+91 98111 55667"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-cyan-500 outline-none transition-colors"
                  id="profile-emergency-input"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Notified if vehicle is blocked or garage closes</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VEHICLE & LICENSE PLATE */}
        {activeSubTab === 'vehicle' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                <Car className="w-4 h-4 text-cyan-400" />
                <span>Vehicle Profile & Smart Plate</span>
              </h3>
              <p className="text-xs text-slate-400">Configure your primary vehicle to guarantee matching bay dimensions and EV chargers</p>
            </div>

            {/* License Plate Display Preview in Indian High Security format */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-white block">Official High-Security Number Plate (HSRP)</span>
                <span className="text-[11px] text-slate-400">Scanned by ANPR camera sensors at parking garage entry gates</span>
              </div>

              {/* Plate Visual */}
              <div className="flex items-center border-2 border-slate-400 rounded-lg bg-white overflow-hidden shadow-md">
                <div className="bg-blue-700 text-white px-2 py-1 flex flex-col items-center justify-center text-[9px] font-bold tracking-tight">
                  <span>IND</span>
                  <div className="w-2 h-2 rounded-full border border-blue-400" />
                </div>
                <div className="px-4 py-1 text-slate-950 font-mono font-black text-lg tracking-wider">
                  {plate || 'DL-04-AB-1234'}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-cyan-400" /> License Plate Number *
                </label>
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  placeholder="e.g. DL-04-AB-1234"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 text-sm font-mono font-bold uppercase tracking-wider focus:border-cyan-500 outline-none transition-colors"
                  id="profile-plate-input"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Format: State Code - District - Series - Unique No.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Vehicle Model & Make
                </label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="e.g. Tata Nexon EV Max / Hyundai Ioniq 5"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 outline-none transition-colors"
                  id="profile-model-input"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Vehicle Category</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 outline-none"
                  id="profile-vehicle-category-select"
                >
                  <option value="EV">EV (Electric Car)</option>
                  <option value="SUV">SUV / Compact SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Two-Wheeler">Two-Wheeler / Motorbike</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Fuel / Engine Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as FuelType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 outline-none"
                  id="profile-fuel-type-select"
                >
                  <option value="Electric">⚡ Electric (EV)</option>
                  <option value="Hybrid">🔋 Hybrid</option>
                  <option value="Petrol">⛽ Petrol</option>
                  <option value="Diesel">🛢️ Diesel</option>
                  <option value="CNG">🟢 Clean CNG</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Bay Type</label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value as SlotPreference)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 outline-none"
                  id="profile-slot-pref-select"
                >
                  <option value="EV Charging">⚡ EV Fast Charging Bay</option>
                  <option value="Standard">🚗 Standard Bay</option>
                  <option value="Wide Bay">🚙 Extra Wide Bay</option>
                  <option value="Accessible">♿ Accessible (Ground Level)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FASTAG & TOLL AUTOMATION */}
        {activeSubTab === 'fastag' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>FASTag & Auto-Barrier RFID Billing</span>
              </h3>
              <p className="text-xs text-slate-400">Enables zero-touch contactless entry and exit at smart parking boom barriers</p>
            </div>

            {/* FASTag Wallet Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Prepaid Parking Balance</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">₹{fastagBalance}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Linked to {fastagBank} • {fastagId}</div>
                </div>
              </div>

              {/* Quick Top-Up Simulator */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddBalance(500)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/20 text-xs font-mono font-semibold flex items-center gap-1 transition-colors"
                  id="btn-topup-500"
                >
                  <Plus className="w-3.5 h-3.5" /> ₹500
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBalance(1000)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/20 text-xs font-mono font-semibold flex items-center gap-1 transition-colors"
                  id="btn-topup-1000"
                >
                  <Plus className="w-3.5 h-3.5" /> ₹1,000
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">FASTag RFID Identifier</label>
                <input
                  type="text"
                  value={fastagId}
                  onChange={(e) => setFastagId(e.target.value)}
                  placeholder="e.g. FT-ICICI-884102"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 outline-none"
                  id="profile-fastag-id-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Issuing Bank</label>
                <select
                  value={fastagBank}
                  onChange={(e) => setFastagBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 outline-none"
                  id="profile-fastag-bank-select"
                >
                  <option value="ICICI Bank">ICICI Bank FASTag</option>
                  <option value="HDFC Bank">HDFC Bank FASTag</option>
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="Paytm Payments Bank">Paytm Payments Bank</option>
                  <option value="Axis Bank">Axis Bank FASTag</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                </select>
              </div>
            </div>

            {/* Auto Barrier Lift Toggle */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Automatic RFID Boom-Barrier Lift</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  When enabled, parking barriers automatically detect your vehicle RFID tag and debit the exact stay duration on exit without manual cash handling.
                </p>
              </div>

              <input
                type="checkbox"
                checked={autoPayEnabled}
                onChange={() => setAutoPayEnabled(!autoPayEnabled)}
                className="w-5 h-5 accent-cyan-500 cursor-pointer shrink-0"
                id="profile-autopay-checkbox"
              />
            </div>
          </div>
        )}

        {/* TAB 4: ALERTS & PASSES */}
        {activeSubTab === 'notifications' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <span>Driver Notification Preferences</span>
              </h3>
              <p className="text-xs text-slate-400">Choose how digital gate passes and vacancy alerts are dispatched</p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-white">WhatsApp Digital Passes & Invoices</div>
                  <div className="text-[11px] text-slate-400">Receive QR entry pass and GST tax invoice on WhatsApp ({phone})</div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationWhatsapp}
                  onChange={() => setNotificationWhatsapp(!notificationWhatsapp)}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                  id="notif-whatsapp-toggle"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-white">SMS Gate Passage Confirmations</div>
                  <div className="text-[11px] text-slate-400">Instant SMS confirmation when vehicle crosses barrier entry/exit</div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSms}
                  onChange={() => setNotificationSms(!notificationSms)}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                  id="notif-sms-toggle"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-white">15-Minute Expiry Reminder</div>
                  <div className="text-[11px] text-slate-400">Notifies you 15 minutes before your booked bay duration expires</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  disabled
                  className="w-4 h-4 accent-cyan-500 cursor-not-allowed opacity-60"
                />
              </div>
            </div>
          </div>
        )}

        {/* Global Save Changes Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {isSavedSuccess ? (
              <span className="text-emerald-400 flex items-center gap-1.5 font-bold animate-pulse">
                <CheckCircle2 className="w-4 h-4" /> Changes saved to device storage
              </span>
            ) : (
              <span className="text-slate-400">Make sure to save changes before creating new bookings.</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Reset
            </button>

            <button
              type="submit"
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition-all"
              id="profile-save-bottom-btn"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
