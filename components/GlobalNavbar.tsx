import React, { useState, useEffect } from 'react';
import { ArrowRight, Music2 } from 'lucide-react';

interface GlobalNavbarProps {
  onOpenDownloadApp: () => void;
  onOpenArchitecture: () => void;
  onEnterExperience: () => void;
}

export const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  onOpenDownloadApp,
  onOpenArchitecture,
  onEnterExperience,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-20 px-4 sm:px-8 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#faf7f2]/95 backdrop-blur-md border-b border-stone-200/70 text-[#141312] shadow-sm'
          : 'bg-black/40 backdrop-blur-md border-b border-white/10 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
        {/* Left: TΛVY Brand & Product Name */}
        <div className="flex items-center gap-8 shrink-0">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2.5 bg-transparent border-0 cursor-pointer p-0 text-left"
            title="TΛVY — Return to top"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#b45309] transition-transform group-hover:scale-125 duration-300 shadow-sm" />
            <span
              className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors ${
                isScrolled ? 'text-[#141312] group-hover:text-[#b45309]' : 'text-white group-hover:text-amber-300'
              }`}
            >
              TΛVY
            </span>
          </button>

          {/* Clean Whoop/Oura Style Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-8 text-sm font-medium tracking-normal transition-colors ${
              isScrolled ? 'text-stone-600' : 'text-stone-300'
            }`}
          >
            <button
              onClick={() => scrollToSection('ecosystem')}
              className={`bg-transparent border-0 cursor-pointer transition-colors ${
                isScrolled ? 'hover:text-[#141312]' : 'hover:text-white'
              }`}
            >
              Ecosystem
            </button>
            <button
              onClick={() => scrollToSection('architecture')}
              className={`bg-transparent border-0 cursor-pointer transition-colors ${
                isScrolled ? 'hover:text-[#141312]' : 'hover:text-white'
              }`}
            >
              Architecture
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`bg-transparent border-0 cursor-pointer transition-colors ${
                isScrolled ? 'hover:text-[#141312]' : 'hover:text-white'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={`bg-transparent border-0 cursor-pointer transition-colors ${
                isScrolled ? 'hover:text-[#141312]' : 'hover:text-white'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('tech-specs')}
              className={`bg-transparent border-0 cursor-pointer transition-colors ${
                isScrolled ? 'hover:text-[#141312]' : 'hover:text-white'
              }`}
            >
              Tech Specs
            </button>
          </nav>
        </div>

        {/* Right Section: Concert Experience entry + [ DOWNLOAD APP -> ] button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onEnterExperience}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all cursor-pointer flex items-center gap-2 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
              isScrolled
                ? 'bg-transparent hover:bg-stone-200/60 text-[#141312] border-stone-300 focus-visible:ring-offset-[#faf7f2]'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/30 focus-visible:ring-offset-black'
            }`}
          >
            <Music2 className={`w-3.5 h-3.5 ${isScrolled ? 'text-[#b45309]' : 'text-amber-300'}`} aria-hidden="true" />
            <span className="hidden sm:inline">Enter Concert Experience</span>
            <span className="sm:hidden">Experience</span>
          </button>
          <button
            onClick={onOpenDownloadApp}
            className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer border-0 flex items-center gap-2 group ${
              isScrolled
                ? 'bg-[#141312] hover:bg-stone-800 text-[#faf7f2]'
                : 'bg-white hover:bg-stone-200 text-[#141312]'
            }`}
          >
            <span className="hidden sm:inline">Download App</span>
            <span className="sm:hidden">Get App</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
