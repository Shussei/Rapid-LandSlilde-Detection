import React from 'react';
import { SimulationProvider } from './context/SimulationContext';
import { Navigation } from './components/ui/Navigation';
import { AlertModal } from './components/ui/AlertModal';
import { HeroSection } from './sections/HeroSection';
import { ProblemSection } from './sections/ProblemSection';
import { ArchitectureSection } from './sections/ArchitectureSection';
import { LiveMonitorSection } from './sections/LiveMonitorSection';
import { EventSimulationSection } from './sections/EventSimulationSection';
import { CorrelationSection } from './sections/CorrelationSection';
import { TechnologySection } from './sections/TechnologySection';
import { WayanadSection } from './sections/WayanadSection';
import { AdvantagesSection } from './sections/AdvantagesSection';
import { FutureScopeSection } from './sections/FutureScopeSection';
import { TeamSection } from './sections/TeamSection';
import { FooterSection } from './sections/FooterSection';

export const App: React.FC = () => {
  return (
    <SimulationProvider>
      <div className="min-h-screen bg-[#05080e] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans antialiased">
        <Navigation />
        <AlertModal />
        <main>
          <HeroSection />
          <ProblemSection />
          <ArchitectureSection />
          <LiveMonitorSection />
          <EventSimulationSection />
          <CorrelationSection />
          <TechnologySection />
          <WayanadSection />
          <AdvantagesSection />
          <FutureScopeSection />
          <TeamSection />
        </main>
        <FooterSection />
      </div>
    </SimulationProvider>
  );
};

export default App;
