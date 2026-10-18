/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GlobalNavbar } from './components/GlobalNavbar';
import { HomePortal } from './components/HomePortal';
import { DownloadAppModal } from './components/DownloadAppModal';
import { HaloDetailModal } from './components/HaloDetailModal';
import { TavyCompanionApp } from './components/TavyCompanionApp';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'website' | 'companion-app'>('website');
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);

  // If in companion app view, render interactive mobile simulation
  if (currentView === 'companion-app') {
    return (
      <TavyCompanionApp
        onBackToWebsite={() => {
          setCurrentView('website');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-200 selection:text-stone-900 overflow-x-hidden bg-[#faf7f2] text-[#141312] relative">
      {/* Subtle Warm Ivory & Sand Ambient Lighting (No neon, pure editorial warmth) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25"
          style={{ backgroundColor: '#fed7aa' }}
        />
        <div
          className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20"
          style={{ backgroundColor: '#e9d5ff' }}
        />
        <div
          className="absolute bottom-10 left-1/3 w-[600px] h-[600px] rounded-full blur-[160px] opacity-20"
          style={{ backgroundColor: '#fef08a' }}
        />
      </div>

      {/* Clean Editorial Top Navigation Bar (Adaptive scroll transparency) */}
      <GlobalNavbar
        onOpenDownloadApp={() => setCurrentView('companion-app')}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
      />

      {/* Main Showcase Landing Page (Flush with top for cinematic backdrop) */}
      <main className="relative z-10 flex-1">
        <HomePortal
          onOpenDownloadApp={() => setCurrentView('companion-app')}
          onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
        />
      </main>

      {/* Technical Architecture Modal */}
      <HaloDetailModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </div>
  );
};

export default App;