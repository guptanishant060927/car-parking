import React from 'react';
import { 
  Car, 
  MapPin, 
  LayoutDashboard, 
  Cpu, 
  Radio, 
  Activity, 
  Zap, 
  Clock, 
  Leaf, 
  ShieldCheck, 
  TrendingUp, 
  Navigation, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  QrCode,
  Layers,
  Database,
  BarChart3,
  Flame,
  Award
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setDriverTab, zones, cityKpi, setSelectedZoneId, setIsDetailOpen } = useParking();

  const handleStartDriver = (zoneId?: string) => {
    setCurrentView('driver');
    setDriverTab('find');
    if (zoneId) {
      setSelectedZoneId(zoneId);
      setIsDetailOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-radial-gradient">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Next-Gen Smart City Mobility Platform</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Smart Parking for <br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  Smarter Cities
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                Find available parking in real time, predict parking availability, and reduce the time spent circling for a spot.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => handleStartDriver()}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2 group transition-all transform hover:-translate-y-0.5"
                  id="hero-cta-find-parking"
                >
                  <MapPin className="w-4 h-4 text-slate-950" />
                  <span>Find Parking</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setCurrentView('admin')}
                  className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700/80 hover:border-indigo-500/50 flex items-center gap-2 transition-all"
                  id="hero-cta-city-dashboard"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                  <span>View City Dashboard</span>
                </button>
              </div>

              {/* Live Statistics Counter Row */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                    {cityKpi.availableSpaces.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Available Spots</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">
                    {cityKpi.occupiedSpaces.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Occupied Spots</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-300">
                    {zones.length}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Parking Zones</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300">
                    {cityKpi.avgSearchTimeMin} min
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Avg Search Time</div>
                </div>
              </div>
            </div>

            {/* Right Column: Futuristic City Parking Map Visualization */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-md overflow-hidden">
                {/* Header of Map Card */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-semibold text-slate-200">
                      DELHI-NCR DOWNTOWN GRID • LIVE SENSORS
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Available
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Filling
                    </span>
                    <span className="flex items-center gap-1 text-rose-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Full
                    </span>
                  </div>
                </div>

                {/* Simulated Radar Scanner Line & Street Map SVG */}
                <div className="relative h-80 w-full mt-3 rounded-xl bg-slate-950 overflow-hidden border border-slate-800/80">
                  {/* Radar sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent w-full h-full animate-[pulse_4s_ease-in-out_infinite]" />

                  {/* SVG Street Grid & Transit Roads */}
                  <svg className="absolute inset-0 w-full h-full text-slate-800 stroke-current opacity-80" viewBox="0 0 400 320" fill="none">
                    <path d="M 0 60 Q 200 40 400 60" strokeWidth="6" stroke="#1e293b" />
                    <path d="M 0 160 L 400 160" strokeWidth="8" stroke="#1e293b" />
                    <path d="M 0 250 Q 200 270 400 250" strokeWidth="6" stroke="#1e293b" />
                    <path d="M 80 0 L 80 320" strokeWidth="6" stroke="#1e293b" />
                    <path d="M 210 0 L 210 320" strokeWidth="8" stroke="#1e293b" />
                    <path d="M 330 0 L 330 320" strokeWidth="6" stroke="#1e293b" />
                    {/* Ring Road connector */}
                    <circle cx="210" cy="160" r="45" stroke="#334155" strokeWidth="3" strokeDasharray="4 4" fill="none" />
                  </svg>

                  {/* Zone Markers Overlay */}
                  {/* Main Street - 3 spots (Green) */}
                  <div 
                    onClick={() => handleStartDriver('zone-main-street')}
                    className="absolute top-16 left-16 z-10 cursor-pointer transform hover:scale-110 transition-transform"
                  >
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/90 border border-emerald-500 text-emerald-400 text-[11px] font-mono font-bold shadow-lg shadow-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Main St: 3 spots</span>
                    </div>
                  </div>

                  {/* Central Avenue - 5 spots (Yellow) */}
                  <div 
                    onClick={() => handleStartDriver('zone-central-avenue')}
                    className="absolute top-28 right-12 z-10 cursor-pointer transform hover:scale-110 transition-transform"
                  >
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/90 border border-amber-500 text-amber-400 text-[11px] font-mono font-bold shadow-lg shadow-amber-500/20">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>Central Ave: 5 spots</span>
                    </div>
                  </div>

                  {/* Market Road - Full (Red) */}
                  <div 
                    onClick={() => handleStartDriver('zone-market-road')}
                    className="absolute bottom-12 left-20 z-10 cursor-pointer transform hover:scale-110 transition-transform"
                  >
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/90 border border-rose-500 text-rose-400 text-[11px] font-mono font-bold shadow-lg shadow-rose-500/20">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <span>Market Rd: Full</span>
                    </div>
                  </div>

                  {/* City Mall - 84 spots (Green) */}
                  <div 
                    onClick={() => handleStartDriver('zone-city-mall')}
                    className="absolute bottom-16 right-16 z-10 cursor-pointer transform hover:scale-110 transition-transform"
                  >
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/90 border border-emerald-500 text-emerald-400 text-[11px] font-mono font-bold shadow-lg shadow-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>City Mall: 84 spots</span>
                    </div>
                  </div>

                  {/* Center Pulse Indicator */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center animate-pulse">
                      <Compass className="w-6 h-6 text-cyan-300" />
                    </div>
                  </div>
                </div>

                {/* Footer Insight in Hero Map */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>Downtown Congestion Level: <strong className="text-amber-400">Moderate</strong></span>
                  <span className="text-cyan-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Predictive AI Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Problem Section */}
      <section className="py-20 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-rose-400 font-mono text-xs font-semibold uppercase tracking-wider">
              The Urban Mobility Dilemma
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Why Traditional City Parking Fails
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Outdated, disconnected parking infrastructure wastes fuel, stalls economies, and frustrates millions of commuters every day.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Drivers Waste Time Cruising</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Drivers circle city blocks for an average of 15 to 20 minutes just looking for an available curb or lot, causing massive lost productivity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Zero Real-Time Visibility</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Drivers arrive blindly at full garages with no prior warning, while under-utilized parking structures three blocks away sit half empty.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Uneven Parking Utilization</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Static tariffs fail to adapt to peak demand surges, causing gridlock in core commercial strips and revenue leakage in peripheral zones.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Severe Emissions & Pollution</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Up to 30% of downtown traffic congestion is caused solely by vehicles cruising for parking, spewing excess carbon dioxide and particulates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Driver Stress & Road Rage</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Unexpected full lots lead to missed appointments, erratic driving, double parking, and unsafe maneuvers on congested urban corridors.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Blind Urban Planning</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Municipal operators lack the granular sensor telemetrics needed to formulate evidence-based zoning, pricing, and infrastructure policies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Solution Pipeline Section */}
      <section className="py-20 relative border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
              The Architecture
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              End-to-End Intelligent Pipeline
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              How ParkSmart connects field edge sensors to cloud predictive intelligence and responsive apps in sub-second latency.
            </p>
          </div>

          {/* Animated Pipeline Pipeline: Sensors -> Ingestion -> Processing -> Prediction -> Apps */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center text-center relative group hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold mb-1">Step 01</span>
              <h4 className="font-semibold text-white text-sm mb-1">Sensors & Cameras</h4>
              <p className="text-xs text-slate-400">Ultrasonic, optical cameras & LoRaWAN surface pucks</p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center text-center relative group hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                <Database className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase text-blue-400 font-semibold mb-1">Step 02</span>
              <h4 className="font-semibold text-white text-sm mb-1">Cloud Ingestion</h4>
              <p className="text-xs text-slate-400">MQTT brokers, IoT Core message queues & streaming bus</p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center text-center relative group hover:border-indigo-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold mb-1">Step 03</span>
              <h4 className="font-semibold text-white text-sm mb-1">Real-Time Processing</h4>
              <p className="text-xs text-slate-400">Stream aggregation, event deduplication & state sync</p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center text-center relative group hover:border-purple-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase text-purple-400 font-semibold mb-1">Step 04</span>
              <h4 className="font-semibold text-white text-sm mb-1">Prediction Engine</h4>
              <p className="text-xs text-slate-400">AI forecasting models predicting availability & shortage</p>
            </div>

            {/* Step 5 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center text-center relative group hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Navigation className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold mb-1">Step 05</span>
              <h4 className="font-semibold text-white text-sm mb-1">Driver & City Apps</h4>
              <p className="text-xs text-slate-400">Instant turn-by-turn guidance and municipal controls</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setCurrentView('architecture')}
              className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Explore deep interactive cloud architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Features Section (8 Key Features) */}
      <section className="py-20 border-t border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
              System Capabilities
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Designed for Commuters & City Operators
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              A comprehensive intelligent mobility suite combining high-precision detection, user-friendly reservation, and executive analytics.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Feature 1 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-base mb-1">1. Real-Time Detection</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Optical and ultrasonic sensors constantly monitor spot status with sub-second change propagation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-base mb-1">2. Live Parking Map</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interactive city map with color-coded markers (Green = Available, Yellow = Filling, Red = Full).
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-base mb-1">3. Availability Prediction</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates opening probability (e.g. "72% probability of a vacant spot upon your arrival").
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Navigation className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-base mb-1">4. ETA & Walking Distance</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Accurate driving ETA plus last-mile walking distance from parking bay to destination.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                <QrCode className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-base mb-1">5. Smart Reservations</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pre-book spots with instant digital parking passes, bay allocations, and QR-code barrier access.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-base mb-1">6. Personalized Alerts</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Push alerts for nearby spot openings, predicted shortages, route congestion, and zone saturation.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-base mb-1">7. City Analytics</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Granular hourly occupancy graphs, zone turnover rates, revenue metrics, and sensor health logs.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-base mb-1">8. Demand Forecasting</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                1h, 3h, and 6h predictive models with dynamic pricing recommendations for optimal city flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Impact Section */}
      <section className="py-20 border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">
              Quantifiable Urban Impact
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Measuring the Real-World Difference
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Verified telemetry improvements observed across pilot smart districts with ParkSmart deployed.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 mb-1">-35%</div>
              <h5 className="font-semibold text-white text-xs sm:text-sm mb-1">Cruising Time</h5>
              <p className="text-[11px] text-slate-400">Search time dropped from 16.5m to 4.8m</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-400 mb-1">-28%</div>
              <h5 className="font-semibold text-white text-xs sm:text-sm mb-1">Congestion</h5>
              <p className="text-[11px] text-slate-400">Reduced bottlenecking on key corridors</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-teal-400 mb-1">-22%</div>
              <h5 className="font-semibold text-white text-xs sm:text-sm mb-1">Emissions</h5>
              <p className="text-[11px] text-slate-400">1,420 kg CO2 saved daily per district</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-indigo-400 mb-1">+40%</div>
              <h5 className="font-semibold text-white text-xs sm:text-sm mb-1">Turnover</h5>
              <p className="text-[11px] text-slate-400">Dynamic pricing maximizes bay utilization</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center col-span-2 md:col-span-1">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-purple-400 mb-1">100%</div>
              <h5 className="font-semibold text-white text-xs sm:text-sm mb-1">Urban Data</h5>
              <p className="text-[11px] text-slate-400">Real-time visibility for policy makers</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Final Call to Action */}
      <section className="py-20 border-t border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Car className="w-3.5 h-3.5" />
            <span>Ready for Smarter Commutes?</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to park smarter?
          </h2>

          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Experience real-time parking discovery, guaranteed reservations, and zero circling anxiety.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleStartDriver()}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-base shadow-xl shadow-cyan-500/20 flex items-center gap-2 transition-all transform hover:scale-105"
              id="final-cta-find-parking"
            >
              <MapPin className="w-5 h-5 text-slate-950" />
              <span>Find Parking</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base border border-slate-700 flex items-center gap-2 transition-all"
              id="final-cta-city-ops"
            >
              <LayoutDashboard className="w-5 h-5 text-indigo-400" />
              <span>Open City Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer & Hackathon Credits */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-200">ParkSmart</span>
            <span>— Find. Park. Move. Smarter.</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <span>Project: <strong>Smart Parking Availability System</strong></span>
            <span>•</span>
            <span>Team: <strong className="text-cyan-400">Code Warrior's</strong></span>
            <span>•</span>
            <span>Hackathon: <strong>Cloud Wars (AWS Cloud Club, SRMIST Delhi-NCR)</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
};
