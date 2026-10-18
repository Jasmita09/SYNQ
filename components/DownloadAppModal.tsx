import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Smartphone, 
  QrCode, 
  Check, 
  Bluetooth, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Download
} from 'lucide-react';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulatePair?: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({
  isOpen,
  onClose,
  onSimulatePair
}) => {
  const [paired, setPaired] = useState(false);
  const [pairingLoading, setPairingLoading] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  const handlePairSim = () => {
    setPairingLoading(true);
    setTimeout(() => {
      setPairingLoading(false);
      setPaired(true);
      if (onSimulatePair) onSimulatePair();
    }, 1200);
  };

  const handleDownloadClick = (platform: string) => {
    setDownloadSuccessMessage(`TΛVY Companion App link sent for ${platform}`);
    setTimeout(() => setDownloadSuccessMessage(null), 3500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#141312]/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-[#faf7f2] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-[#141312]"
        >
          {/* Top Bar with Close Button */}
          <div className="p-6 pb-3 flex items-center justify-between border-b border-stone-200/60 bg-white/70">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-[#141312]">TΛVY</span>
              <span className="text-stone-300">·</span>
              <span className="font-editorial-serif italic text-lg text-stone-700">Companion App</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-200/60 text-stone-500 hover:text-[#141312] transition-colors cursor-pointer border-0 bg-transparent"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Header info */}
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase bg-amber-100/70 text-[#b45309] border border-amber-200">
                Official Companion App
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#141312] tracking-tight">
                Download TΛVY
              </h3>
              <p className="text-stone-600 text-sm font-light leading-relaxed max-w-sm mx-auto">
                Pair with your <span className="font-editorial-serif italic font-normal text-[#b45309]">Halo</span> wearable, unlock full-screen lightstick mode, and connect to offline festival meshes.
              </p>
            </div>

            {/* QR Code and Stores */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="w-28 h-28 p-2 rounded-xl bg-stone-50 border border-stone-200 flex flex-col items-center justify-center shrink-0 text-center">
                <QrCode className="w-16 h-16 text-stone-800 stroke-[1.5]" />
                <span className="text-[10px] font-medium text-stone-500 mt-1">SCAN TO INSTALL</span>
              </div>

              <div className="space-y-3 flex-1 text-center sm:text-left">
                <p className="text-xs uppercase text-stone-400 tracking-wider font-semibold">
                  Available for iOS &amp; Android
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleDownloadClick('iOS')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#141312] hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer border-0 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download on App Store</span>
                  </button>
                  <button
                    onClick={() => handleDownloadClick('Android')}
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer border border-stone-200 transition-colors"
                  >
                    <Smartphone className="w-4 h-4 text-stone-600" />
                    <span>Get it on Google Play</span>
                  </button>
                </div>
              </div>
            </div>

            {downloadSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-medium">
                {downloadSuccessMessage}
              </div>
            )}

            {/* Simulated Bluetooth Hardware Pairing */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                  <Bluetooth className="w-4 h-4 text-amber-700" />
                  <span>BLUETOOTH HALO PAIRING</span>
                </div>
                <span className="text-[11px] font-medium text-amber-700">
                  {paired ? 'PAIRED · 35Hz ACTIVE' : 'READY TO PAIR'}
                </span>
              </div>

              <p className="text-xs text-amber-900/80 leading-relaxed font-light">
                Hold your <span className="font-editorial-serif italic text-[#141312]">Halo</span> wristband near your device. The app auto-detects the 10m BLE mesh cluster.
              </p>

              <button
                onClick={handlePairSim}
                disabled={pairingLoading || paired}
                className={`w-full py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-0 cursor-pointer ${
                  paired
                    ? 'bg-emerald-600 text-white'
                    : pairingLoading
                    ? 'bg-amber-300 text-amber-900 animate-pulse'
                    : 'bg-[#b45309] hover:bg-[#c2410c] text-white shadow-sm'
                }`}
              >
                {paired ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Halo Connected (ID: TAVY-HALO-01)</span>
                  </>
                ) : pairingLoading ? (
                  <span>Searching for Halo Devices...</span>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Simulate Halo Bluetooth Pair</span>
                  </>
                )}
              </button>
            </div>

            {/* Key App Features */}
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
                Included In Companion App
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b45309]" />
                  <span>Arm-Angle Screen Lightstick</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b45309]" />
                  <span>110 dB Big Text Chat</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b45309]" />
                  <span>Offline 10m Mesh Radar</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b45309]" />
                  <span>Live Decibel Dosimeter</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
