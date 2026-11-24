import React, { useState } from 'react';
import { 
  Cpu, 
  Wifi, 
  Cloud, 
  Sparkles, 
  Smartphone, 
  ArrowRight, 
  Activity, 
  Database, 
  Server, 
  Radio, 
  ShieldCheck, 
  CheckCircle2, 
  Layers,
  ArrowDown
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';

export const ArchitecturePage: React.FC = () => {
  const { setCurrentView } = useParking();
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const pipelineSteps = [
    {
      num: 1,
      name: 'IoT Sensor Node Layer',
      icon: Cpu,
      tech: 'Ultrasonic & Geomagnetic Surface Nodes',
      description: 'Ultra-low-power BLE & sub-GHz sensors mounted in each parking bay detect vehicle presence with 99.4% accuracy via magnetic flux shift.',
      specs: ['Battery life: 5+ years', 'Sampling rate: 500ms', 'Dual-mode ultrasonic verify', 'IP68 weatherproof'],
      badge: 'Edge Hardware'
    },
    {
      num: 2,
      name: 'Edge Gateway Ingestion',
      icon: Wifi,
      tech: 'LoRaWAN & 5G Narrowband Gateway',
      description: 'Local concentrators collect telemetry packets from up to 1,200 sensors, applying micro-batch compression and AES-128 payload encryption.',
      specs: ['MQTT over TLS v1.3', 'Range: 8km Line-of-sight', 'Sub-millisecond deduplication', 'Offline failover buffer'],
      badge: 'Network Layer'
    },
    {
      num: 3,
      name: 'AWS Cloud Processing Core',
      icon: Cloud,
      tech: 'AWS IoT Core, Lambda & DynamoDB',
      description: 'AWS IoT Core subscribes to MQTT streams, routing state changes to serverless AWS Lambda workers and low-latency Amazon DynamoDB global tables.',
      specs: ['AWS IoT Core Message Broker', 'Lambda execution: <35ms', 'DynamoDB continuous stream', 'Kinesis real-time analytics'],
      badge: 'Cloud Backbone'
    },
    {
      num: 4,
      name: 'AI & ML Predictive Horizon',
      icon: Sparkles,
      tech: 'Amazon SageMaker & Temporal Regressors',
      description: 'Deep Learning models process historical trends, meteorological forecasts, and road sensors to predict spot shortage up to 6 hours ahead.',
      specs: ['SageMaker endpoints', 'LSTM / XGBoost ensemble', 'Dynamic tariff elasticity', 'Spatial heat mapping'],
      badge: 'Intelligence'
    },
    {
      num: 5,
      name: 'Real-Time User Interfaces',
      icon: Smartphone,
      tech: 'Driver Web/PWA & City Control Center',
      description: 'Sub-second WebSocket feeds broadcast live availability, automated FASTag parking passes, and municipal dispatch control.',
      specs: ['Driver navigation & reservation', 'Live municipal GIS console', 'FASTag boom barrier trigger', 'Automated SMS/push alerts'],
      badge: 'Application'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>CLOUD WARS HACKATHON • TECHNICAL ARCHITECTURE</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            End-to-End IoT & Cloud Architecture
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            How ParkSmart ingests ground telemetry, computes predictive shortages in AWS Cloud, and empowers both drivers and city planners.
          </p>
        </div>

        {/* Interactive Dataflow Pipeline Diagram */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-white text-center">
            The 5-Stage Intelligent Mobility Pipeline
          </h2>

          <div className="grid md:grid-cols-5 gap-4 relative">
            {pipelineSteps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === step.num;

              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(isSelected ? null : step.num)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-500/40 shadow-xl shadow-cyan-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    {/* Top step number and badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center border border-cyan-500/30">
                        0{step.num}
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {step.badge}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 mb-3">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="font-display font-bold text-sm text-white leading-snug">
                      {step.name}
                    </h3>
                    <div className="text-[11px] font-mono text-cyan-300 font-medium mt-1">
                      {step.tech}
                    </div>

                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Specs list */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1 text-[11px] font-mono text-slate-400">
                    {step.specs.map((s, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AWS Cloud Architecture Deep-Dive Specs */}
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h3 className="font-display text-2xl font-bold text-white">
                Cloud Wars AWS Stack Implementation
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Optimized for high throughput, zero-maintenance scale, and sub-100ms roundtrip delivery
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>AWS Region: ap-south-1 (Mumbai)</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center font-bold text-xs font-mono">
                AWS
              </div>
              <h4 className="font-semibold text-white text-sm">AWS IoT Core & Rule Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Processes tens of thousands of telemetry payloads per minute over mutual TLS. Automatically filters spurious noise and dispatches to serverless pipelines.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
                ML
              </div>
              <h4 className="font-semibold text-white text-sm">SageMaker Availability Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Trained on city traffic patterns, weather radar, and public transit schedules to produce calibrated shortage warnings 1 to 6 hours into the future.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-xs font-mono">
                DB
              </div>
              <h4 className="font-semibold text-white text-sm">DynamoDB & ElastiCache</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provides single-digit millisecond reads for drivers querying nearby vacancies and instant updates to FASTag gate authorization systems.
              </p>
            </div>
          </div>

          {/* Hackathon Team Credits */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              <span className="text-white font-semibold">Team: Code Warrior's</span> • Cloud Wars Hackathon
            </div>
            <div>
              AWS Cloud Club — SRMIST Delhi-NCR
            </div>
          </div>
        </div>

        {/* Bottom CTA to explore live apps */}
        <div className="text-center pt-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setCurrentView('driver')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all"
            >
              Test Driver Live App
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-800 transition-colors"
            >
              Open City Control Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
