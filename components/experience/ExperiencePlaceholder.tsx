import React from 'react';
import { Construction } from 'lucide-react';
import { ExperienceShell } from './ExperienceShell';

interface ExperiencePlaceholderProps {
  title: string;
  plannedFeatures: string[];
  onBack: () => void;
}

/**
 * Temporary screen for experience modes that are routed but not built yet.
 * States plainly that nothing here is interactive, instead of showing
 * controls that do nothing.
 */
export const ExperiencePlaceholder: React.FC<ExperiencePlaceholderProps> = ({
  title,
  plannedFeatures,
  onBack,
}) => (
  <ExperienceShell eyebrow="TΛVY Concert Experience" title={title} backLabel="All experiences" onBack={onBack}>
    <section className="p-6 sm:p-8 rounded-3xl bg-[#141520] border border-stone-800/90 space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <Construction className="w-6 h-6 text-amber-400" aria-hidden="true" />
        <h2 className="text-lg font-bold">In development</h2>
      </div>
      <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
        This mode is not interactive yet. It will include:
      </p>
      <ul className="space-y-2 text-sm text-stone-400">
        {plannedFeatures.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  </ExperienceShell>
);
