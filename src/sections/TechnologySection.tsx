import React from 'react';
import { Activity, Zap, Cpu, CheckCircle } from 'lucide-react';

export const TechnologySection: React.FC = () => {
  const coreTech = [
    {
      name: 'ADXL335 ACCELEROMETER',
      subtitle: 'Tri-Axial MEMS Motion Sensor',
      icon: Activity,
      accent: 'border-cyan-500/40 text-cyan-400',
      specs: [
        '3-Axis Acceleration Sensing (X, Y, Z)',
        'Sub-degree static slope tilt measurement',
        'High-frequency micro-vibration detection',
        'Low-cost surface & subsurface mounting',
      ],
      details:
        'Acts as the primary geological movement transducer. Converts soil displacement into continuous analog voltages.',
    },
    {
      name: 'LM358 OPERATIONAL AMPLIFIER',
      subtitle: 'Analog Signal Conditioning',
      icon: Zap,
      accent: 'border-amber-500/40 text-amber-400',
      specs: [
        'Dual high-gain signal amplification channels',
        'Analog noise filtering & impedance matching',
        'Enhanced ADC input voltage range',
        'Low power consumption for remote nodes',
      ],
      details:
        'Prevents signal degradation over long sensor probe wires before reaching the digital conversion stage.',
    },
    {
      name: 'ESP32 MICROCONTROLLER',
      subtitle: 'Edge Processing & Wireless Hub',
      icon: Cpu,
      accent: 'border-teal-500/40 text-teal-400',
      specs: [
        '32-bit dual-core processing @ 240MHz',
        'Multi-channel 12-bit ADC data acquisition',
        'Predefined threshold & moving average algorithm',
        'Sub-GHz / Wi-Fi / ESP-NOW wireless telemetry',
      ],
      details:
        'Processes analog inputs at the edge, checks threshold criteria, and transmits emergency alert packets.',
    },
  ];

  return (
    <section id="technology" className="py-24 bg-[#070a0f] border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>HARDWARE STACK</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-mono">
            Hardware Technology
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Engineered with off-the-shelf, low-cost microelectronics for rapid field deployment in economically constrained, landslide-prone regions.
          </p>
        </div>

        {/* 3 Premium Hardware Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreTech.map((tech, i) => {
            const Icon = tech.icon;
            return (
              <div
                key={i}
                className="glass-panel-interactive p-8 rounded-3xl border flex flex-col justify-between group space-y-6"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3.5 rounded-2xl bg-slate-900/90 border ${tech.accent}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 tracking-widest uppercase">
                      HARDWARE 0{i + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white font-mono uppercase tracking-wide">
                      {tech.name}
                    </h3>
                    <span className="text-xs font-mono text-cyan-400 block mt-0.5">
                      {tech.subtitle}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {tech.details}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                    KEY CAPABILITIES
                  </span>
                  <ul className="space-y-2">
                    {tech.specs.map((spec, sIdx) => (
                      <li key={sIdx} className="flex items-start space-x-2 text-xs font-mono text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
