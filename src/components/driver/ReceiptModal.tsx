import React from 'react';
import { 
  X, 
  Receipt, 
  Download, 
  Printer, 
  CheckCircle2, 
  Car, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CreditCard,
  QrCode
} from 'lucide-react';
import { Reservation } from '../../types';

interface ReceiptModalProps {
  reservation: Reservation | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ reservation, onClose }) => {
  if (!reservation) return null;

  const baseFare = Math.round(reservation.amount / 1.18);
  const gstAmount = reservation.amount - baseFare;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base">E-Tax Invoice & Receipt</h3>
              <p className="text-xs text-slate-400 font-mono">Invoice #{reservation.id}-INV</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Header Info */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-800">
            <div>
              <span className="font-display font-black text-xl tracking-tight text-white">
                PARK<span className="text-cyan-400">SMART</span>
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">Municipal Smart Urban Parking System</p>
              <p className="text-[10px] text-slate-500 font-mono">GSTIN: 07AAACP9214F1Z8</p>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                PAID IN FULL
              </span>
              <p className="text-[11px] text-slate-400 font-mono mt-1">Date: {reservation.date_str}</p>
            </div>
          </div>

          {/* Parking & Vehicle Details */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 font-mono text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">PARKING FACILITY</span>
              <span className="text-white font-bold">{reservation.zone_name}</span>
              <span className="text-slate-400 block text-[11px] mt-0.5">{reservation.zone_address}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">ALLOCATED BAY</span>
              <span className="text-cyan-300 font-bold text-sm">{reservation.slot_number || 'Bay B-14'}</span>
              <span className="text-slate-400 block text-[11px] mt-0.5">Sensor Status: Calibrated</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">VEHICLE NUMBER</span>
              <span className="text-white font-bold">{reservation.vehicle_number}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">PAYMENT METHOD</span>
              <span className="text-white font-bold">{reservation.payment_method || 'FASTag Auto-Debit'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">ARRIVAL CHECK-IN</span>
              <span className="text-slate-200">{reservation.arrival_time}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">EXIT CHECK-OUT</span>
              <span className="text-slate-200">{reservation.exit_time || `${reservation.duration_hours}h session`}</span>
            </div>
          </div>

          {/* Pricing Ledger Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Fare Breakdown</h4>
            <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800 text-xs">
              <div className="flex justify-between p-3 bg-slate-950/40">
                <span className="text-slate-300">Smart Bay Parking Tariff ({reservation.duration_hours} hrs)</span>
                <span className="font-mono text-white font-medium">₹{baseFare}.00</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950/40">
                <span className="text-slate-300">GST (18% SGST + CGST)</span>
                <span className="font-mono text-white font-medium">₹{gstAmount}.00</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950/40">
                <span className="text-slate-300">FASTag Seamless Gateway Fee</span>
                <span className="font-mono text-emerald-400 font-bold">FREE (₹0.00)</span>
              </div>
              <div className="flex justify-between p-3 bg-cyan-950/20 font-bold text-sm">
                <span className="text-white">Total Amount Paid</span>
                <span className="font-mono text-cyan-300">₹{reservation.amount}.00</span>
              </div>
            </div>
          </div>

          {/* FASTag Verification Footer */}
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-400">Verified by NPCI FASTag Netc National Toll & Parking Hub</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500">TXN-{reservation.id.slice(-6)}</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Electronic proof of payment valid for tax exemption.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
