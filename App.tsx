/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppMode, BrandName } from './types';
import { GlobalNavbar } from './components/GlobalNavbar';
import { HomePortal } from './components/HomePortal';
import { AtHomeStage } from './components/AtHomeStage';
import { LiveVenue } from './components/LiveVenue';
import { PersistentDemoStrip } from './components/PersistentDemoStrip';
import { audioSynth } from './services/audioSynth';

export const App: React.FC = () => {
  const [brandName, setBrandName] = useState<BrandName>('SYNQ');
  const [mode, setMode] = useState<AppMode>('home');
  const [sponsorActive, setSponsorActive] = useState<boolean>(false);
  const [sosTriggered, setSosTriggered] = useState<boolean>(false);
  const [decibelAlertActive, setDecibelAlertActive] = useState<boolean>(true);
  const [beatTick, setBeatTick] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [contactNotification, setContactNotification] = useState<string | null>(null);

  // Background beat engine (128 BPM = ~468ms interval)
  useEffect(() => {
    const beatInterval = setInterval(() => {
      setBeatTick(prev => prev + 1);
      // Play subtle acoustic kick every 2 beats
      if (Math.random() > 0.4) {
        audioSynth.playKick(0.35);
      }
    }, 468);
    return () => clearInterval(beatInterval);
  }, []);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioSynth.isMuted = nextMuted;
  };

  // Demo Control Handlers
  const handleBeatDrop = () => {
    setBeatTick(prev => prev + 1);
    audioSynth.playBeatDrop();
    audioSynth.triggerHaptic([120, 60, 240]);
  };

  const handleTriggerSOS = () => {
    setSosTriggered(true);
    // If not already in live arena, switch to live arena so user sees the 10m red halo
    if (mode === 'home') {
      setMode('in-venue');
    }
  };

  const handleCancelSOS = () => {
    setSosTriggered(false);
  };

  const handleToggleDecibelAlert = () => {
    setDecibelAlertActive(prev => !prev);
    audioSynth.playTap();
  };

  const handleToggleSponsor = () => {
    setSponsorActive(prev => !prev);
    audioSynth.playTap();
  };

  const handleBumpConnect = () => {
    setContactNotification('Contact Exchanged: @maya — BLE Pair Authenticated');
    setTimeout(() => {
      setContactNotification(null);
    }, 4000);
  };

  const handleResetAll = () => {
    setSponsorActive(false);
    setSosTriggered(false);
    setDecibelAlertActive(false);
    setContactNotification(null);
  };

  return (
    <div
      className={`min-h-screen text-slate-100 flex flex-col justify-between selection:bg-cyan-400 selection:text-black overflow-x-hidden transition-colors duration-700 ${
        sponsorActive ? 'bg-[#060814]' : 'bg-[#07090e]'
      }`}
    >
      {/* Background ambient lighting blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 transition-all duration-700"
          style={{
            backgroundColor: sponsorActive
              ? '#dc0032'
              : sosTriggered
              ? '#ef4444'
              : mode === 'in-venue'
              ? '#ff007a'
              : '#00f2fe',
          }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 transition-all duration-700"
          style={{
            backgroundColor: sponsorActive ? '#003882' : '#3b82f6',
          }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full blur-[160px] opacity-15"
          style={{
            backgroundColor: '#8b5cf6',
          }}
        />
      </div>

      {/* 1. Global Top Navigation Bar (Always Visible) */}
      <GlobalNavbar
        mode={mode}
        onSelectMode={setMode}
        brandName={brandName}
        onSelectBrandName={setBrandName}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        sponsorActive={sponsorActive}
      />

      {/* Main Content Area */}
      <main className="relative z-10 pt-20 pb-24 flex-1">
        {mode === 'home' && (
          <HomePortal
            onSelectMode={setMode}
            brandName={brandName}
            sponsorActive={sponsorActive}
          />
        )}

        {mode === 'at-home' && (
          <AtHomeStage
            sponsorActive={sponsorActive}
            onTriggerBeatPulse={() => setBeatTick(prev => prev + 1)}
            beatTick={beatTick}
            brandName={brandName}
          />
        )}

        {mode === 'in-venue' && (
          <LiveVenue
            sponsorActive={sponsorActive}
            onSetSponsorActive={setSponsorActive}
            sosTriggered={sosTriggered}
            onTriggerSOS={handleTriggerSOS}
            onCancelSOS={handleCancelSOS}
            decibelAlertActive={decibelAlertActive}
            beatTick={beatTick}
            brandName={brandName}
          />
        )}
      </main>

      {/* 5. Persistent System Control Strip (Always Visible) */}
      <PersistentDemoStrip
        onBeatDrop={handleBeatDrop}
        onTriggerSOS={handleTriggerSOS}
        onToggleDecibelAlert={handleToggleDecibelAlert}
        decibelAlertActive={decibelAlertActive}
        onToggleSponsor={handleToggleSponsor}
        sponsorActive={sponsorActive}
        onBumpConnect={handleBumpConnect}
        onResetAll={handleResetAll}
        contactNotification={contactNotification}
      />
    </div>
  );
};

export default App;