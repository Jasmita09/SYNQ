/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { GlobalNavbar } from './components/GlobalNavbar';
import { HomePortal } from './components/HomePortal';
import { HaloDetailModal } from './components/HaloDetailModal';
import { TavyCompanionApp } from './components/TavyCompanionApp';
import { ExperienceSelect } from './components/experience/ExperienceSelect';
import { ExperiencePlaceholder } from './components/experience/ExperiencePlaceholder';
import { useAppView } from './hooks/useAppView';

const AppContent: React.FC = () => {
  const { view, navigate } = useAppView();
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);

  // If in companion app view, render interactive mobile simulation
  if (view === 'companion-app') {
    return (
      <TavyCompanionApp
        onBackToWebsite={() => navigate('website')}
        onEnterExperience={() => navigate('experience')}
      />
    );
  }

  if (view === 'experience') {
    return (
      <ExperienceSelect
        onSelectLiveVenue={() => navigate('live-venue')}
        onSelectAtHome={() => navigate('at-home')}
        onOpenCompanionApp={() => navigate('companion-app')}
        onBackToWebsite={() => navigate('website')}
      />
    );
  }

  if (view === 'live-venue') {
    return (
      <ExperiencePlaceholder
        title="Live Venue"
        plannedFeatures={[
          'Digital lightstick with on/off, color and beat animations',
          'Simulated beat cue timeline with optional vibration on supported devices',
          'Start, pause, stop and exit controls',
          'Existing safety tools kept within reach',
        ]}
        onBack={() => navigate('experience')}
      />
    );
  }

  if (view === 'at-home') {
    return (
      <ExperiencePlaceholder
        title="At-home Concert"
        plannedFeatures={[
          'Playable sample video with pause and seek',
          'Lyrics and captions synchronized to the video timeline',
          'Wave with the Music prompts, with a tap-based alternative',
          'Timing-based demo scoring',
          'Camera angles clearly labeled as real or simulated',
        ]}
        onBack={() => navigate('experience')}
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
        onOpenDownloadApp={() => navigate('companion-app')}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
        onEnterExperience={() => navigate('experience')}
      />

      {/* Main Showcase Landing Page (Flush with top for cinematic backdrop) */}
      <main className="relative z-10 flex-1">
        <HomePortal
          onOpenDownloadApp={() => navigate('companion-app')}
          onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
          onEnterExperience={() => navigate('experience')}
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

// reducedMotion="user" makes every framer-motion animation honor prefers-reduced-motion
export const App: React.FC = () => (
  <MotionConfig reducedMotion="user">
    <AppContent />
  </MotionConfig>
);

export default App;
