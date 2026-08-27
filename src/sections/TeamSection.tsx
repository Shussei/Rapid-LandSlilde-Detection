import React from 'react';
import { Users } from 'lucide-react';

export const TeamSection: React.FC = () => {
  const teamMembers = [
    { name: 'ARJUN BAIJU', id: 'MEMBER 01' },
    { name: 'SAYANTH S KUMAR', id: 'MEMBER 02' },
    { name: 'VASUDEV SHIBU', id: 'MEMBER 03' },
    { name: 'ANADHAKRISHNAN TG', id: 'MEMBER 04' },
  ];

  return (
    <section id="team" className="py-24 bg-[#070a0f] border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>PROJECT CREATORS & RESEARCH TEAM</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-mono">
            Engineering Team
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            CSE / Engineering Project — Micro-Controlled Embedded Systems (MCES) Project-Based Learning (PBL).
          </p>
        </div>

        {/* 4 Team Member Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/40 transition-all text-center space-y-4 group"
            >
              {/* Profile Avatar Placeholder Icon */}
              <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all">
                <Users className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 tracking-widest uppercase block">
                  {member.id}
                </span>
                <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wide mt-1">
                  {member.name}
                </h3>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[10px] font-mono text-cyan-400">
                MCES ENGINEERING TEAM
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
