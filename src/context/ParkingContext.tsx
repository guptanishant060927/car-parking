import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ParkingZone, 
  Reservation, 
  NotificationItem, 
  AlertItem, 
  ForecastItem, 
  PricingRecommendation, 
  ActivityFeedItem, 
  User,
  AlertStatus,
  UserRole,
  AppView,
  DriverSubTab,
  AdminTab,
  DriverGpsState
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_ZONES, 
  INITIAL_RESERVATIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_ALERTS, 
  INITIAL_FORECASTS, 
  INITIAL_PRICING, 
  INITIAL_ACTIVITY_FEED,
  CITY_KPI_DATA 
} from '../data/mockData';
import { calculateDistanceMeters } from '../utils/geo';
export { calculateDistanceMeters };

export interface ParkingFilter {
  searchQuery: string;
  availableOnly: boolean;
  evOnly: boolean;
  accessibleOnly: boolean;
  sortBy: 'distance' | 'price' | 'availability' | 'walking';
}

export type AuthMode = 'login' | 'signup' | 'forgot-password';

interface ParkingContextType {
  // Navigation & User
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  driverTab: DriverSubTab;
  setDriverTab: (tab: DriverSubTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  currentUser: User;
  updateCurrentUser: (updates: Partial<User>) => void;
  resetUserProfile: () => void;
  switchUserRole: (role: 'driver' | 'operator') => void;
  setCurrentRole: (role: UserRole) => void;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;

  // Real-time GPS Telemetry
  gpsState: DriverGpsState;
  requestRealGps: () => void;
  setCustomLocation: (name: string, coords: [number, number]) => void;
  
  // Data Entities
  zones: ParkingZone[];
  selectedZone: ParkingZone | null;
  setSelectedZoneId: (id: string | null) => void;
  
  // Modals & Flows
  isDetailOpen: boolean;
  setIsDetailOpen: (open: boolean) => void;
  isReservationOpen: boolean;
  setIsReservationOpen: (open: boolean) => void;
  isPassOpen: boolean;
  setIsPassOpen: (open: boolean) => void;
  isNavigatingOpen: boolean;
  setIsNavigatingOpen: (open: boolean) => void;
  activePass: Reservation | null;
  setActivePass: (res: Reservation | null) => void;
  
  // Reservations & History
  reservations: Reservation[];
  createReservation: (booking: {
    zoneId: string;
    date: string;
    time: string;
    durationHours: number;
    vehicleNumber: string;
  }) => Reservation;
  cancelReservation: (id: string) => void;
  rateReservation: (id: string, rating: number, review?: string) => void;
  rebookReservation: (res: Reservation) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // Alerts
  alerts: AlertItem[];
  updateAlertStatus: (id: string, status: AlertStatus) => void;

  // Forecasts & Pricing
  forecasts: ForecastItem[];
  forecast: ForecastItem[];
  pricingList: PricingRecommendation[];
  applyPricingRecommendation: (id: string) => void;
  modifyPricingRecommendation: (id: string, newPrice: number) => void;

  // Zones Management
  addNewZone: (zone: Partial<ParkingZone>) => void;
  addParkingZone: (zone: ParkingZone) => void;
  updateParkingZone: (id: string, updates: Partial<ParkingZone>) => void;
  toggleZoneStatus: (id: string) => void;

  // Activity Feed
  activityFeed: ActivityFeedItem[];

  // Simulation & KPIs
  simulationActive: boolean;
  setSimulationActive: (active: boolean) => void;
  lastUpdatedSeconds: number;
  triggerLivePulse: () => void;
  cityKpi: typeof CITY_KPI_DATA;

  // Filter
  filters: ParkingFilter;
  setFilters: React.Dispatch<React.SetStateAction<ParkingFilter>>;
  filteredZones: ParkingZone[];

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
  hideToast: () => void;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

const STORAGE_KEY_USER_PROFILE = 'parksmart_driver_profile_v2';

const loadInitialUser = (): User => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER_PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.name && parsed.vehicle_number) {
          return {
            ...INITIAL_USERS[0],
            ...parsed
          };
        }
      }
    } catch (err) {
      console.warn('Failed to load driver profile from localStorage:', err);
    }
  }
  return INITIAL_USERS[0];
};

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [driverTab, setDriverTab] = useState<DriverSubTab>('find');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [currentUser, setCurrentUser] = useState<User>(loadInitialUser);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Data
  const [zones, setZones] = useState<ParkingZone[]>(INITIAL_ZONES);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [forecasts] = useState<ForecastItem[]>(INITIAL_FORECASTS);
  const [pricingList, setPricingList] = useState<PricingRecommendation[]>(INITIAL_PRICING);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>(INITIAL_ACTIVITY_FEED);
  
  // Modals
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isPassOpen, setIsPassOpen] = useState(false);
  const [isNavigatingOpen, setIsNavigatingOpen] = useState(false);
  const [activePass, setActivePass] = useState<Reservation | null>(INITIAL_RESERVATIONS[0]);

  // Simulation & Live Ticker
  const [simulationActive, setSimulationActive] = useState(true);
  const [lastUpdatedSeconds, setLastUpdatedSeconds] = useState(2);
  const [cityKpi, setCityKpi] = useState(CITY_KPI_DATA);

  // Filters
  const [filters, setFilters] = useState<ParkingFilter>({
    searchQuery: '',
    availableOnly: false,
    evOnly: false,
    accessibleOnly: false,
    sortBy: 'distance'
  });

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  }, []);

  // Real Working GPS State
  const [gpsState, setGpsState] = useState<DriverGpsState>({
    coords: [28.6304, 77.2177],
    accuracy: 5,
    speed: 0,
    heading: 0,
    isRealGps: false,
    isStationary: true,
    status: 'idle',
    lastMovementTimestamp: Date.now(),
    locationName: 'Connaught Central Hub'
  });

  // Request device hardware GPS
  const requestRealGps = useCallback(() => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.');
      return;
    }
    setGpsState(prev => ({ ...prev, status: 'requesting', errorMessage: null }));
    showToast('Requesting high-accuracy GPS position from device...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed, heading } = position.coords;
        setGpsState({
          coords: [latitude, longitude],
          accuracy: accuracy ? Math.round(accuracy) : 5,
          speed: speed ? Math.round(speed * 3.6) : 0,
          heading: heading || 0,
          isRealGps: true,
          isStationary: true,
          status: 'locked',
          errorMessage: null,
          lastMovementTimestamp: Date.now(),
          locationName: 'Current Device Location'
        });
        showToast(`🛰️ GPS Locked: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E (±${Math.round(accuracy || 5)}m)`);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        let errorMsg = 'Could not acquire GPS fix. Please try again.';
        let statusType: 'denied' | 'error' | 'timeout' = 'error';

        if (error.code === 1) { // PERMISSION_DENIED
          statusType = 'denied';
          errorMsg = 'Location permission denied. Please allow location access in your browser settings to see nearby parking.';
        } else if (error.code === 3) { // TIMEOUT
          statusType = 'timeout';
          errorMsg = 'GPS request timed out (10s). Please check your GPS signal and retry.';
        } else if (error.code === 2) { // POSITION_UNAVAILABLE
          statusType = 'error';
          errorMsg = 'GPS location unavailable. Please ensure your device location services are enabled.';
        }

        setGpsState(prev => ({
          ...prev,
          status: statusType,
          errorMessage: errorMsg
        }));
        showToast(errorMsg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [showToast]);

  // Set preset location
  const setCustomLocation = useCallback((name: string, coords: [number, number]) => {
    setGpsState({
      coords,
      accuracy: 4,
      speed: 0,
      heading: 0,
      isRealGps: false,
      isStationary: true,
      status: 'locked',
      lastMovementTimestamp: Date.now(),
      locationName: name
    });
    showToast(`📍 GPS pin relocated to ${name}`);
  }, [showToast]);

  // Watch position: ONLY moves when device actually moves beyond noise jitter (4m)
  useEffect(() => {
    if (!gpsState.isRealGps || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed, heading } = position.coords;

        setGpsState(prev => {
          const distMoved = calculateDistanceMeters(
            prev.coords[0],
            prev.coords[1],
            latitude,
            longitude
          );

          // Strictly stationary: disregard micro-jitter < 4 meters
          if (distMoved < 4) {
            return {
              ...prev,
              accuracy: accuracy ? Math.round(accuracy) : prev.accuracy,
              isStationary: true,
              speed: 0
            };
          }

          // Real physical movement detected
          return {
            ...prev,
            coords: [latitude, longitude],
            accuracy: accuracy ? Math.round(accuracy) : prev.accuracy,
            speed: speed !== null ? Math.round(speed * 3.6) : Math.round((distMoved / 3) * 3.6),
            heading: heading !== null ? heading : prev.heading,
            isStationary: false,
            lastMovementTimestamp: Date.now()
          };
        });
      },
      (err) => {
        console.warn('GPS Watch error', err);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [gpsState.isRealGps]);

  // Dynamic zones with mathematical distance to user GPS coords
  const dynamicZones = useMemo(() => {
    return zones.map(zone => {
      const dist = calculateDistanceMeters(
        gpsState.coords[0],
        gpsState.coords[1],
        zone.latitude,
        zone.longitude
      );
      const walkingTime = Math.max(1, Math.round(dist / 80));
      const drivingEta = Math.max(1, Math.round(dist / 450));
      return {
        ...zone,
        distance_m: dist,
        walking_time_min: walkingTime,
        eta_min: drivingEta
      };
    });
  }, [zones, gpsState.coords]);

  const updateCurrentUser = useCallback((updates: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = {
        ...prev,
        ...updates
      };
      if (typeof window !== 'undefined' && updated.role === 'driver') {
        try {
          localStorage.setItem(STORAGE_KEY_USER_PROFILE, JSON.stringify(updated));
        } catch (err) {
          console.error('Failed to persist user profile to localStorage:', err);
        }
      }
      return updated;
    });

    // Automatically sync reservations for this driver with updated name or vehicle plate
    if (updates.name || updates.vehicle_number) {
      setReservations(prev => prev.map(res => {
        if (!res.user_id || res.user_id === currentUser.id) {
          return {
            ...res,
            user_name: updates.name || res.user_name,
            vehicle_number: updates.vehicle_number || res.vehicle_number
          };
        }
        return res;
      }));
    }

    showToast('Profile updated & saved to local storage!');
  }, [currentUser.id, showToast]);

  const resetUserProfile = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY_USER_PROFILE);
      } catch (err) {
        console.warn('Failed to clear stored profile:', err);
      }
    }
    setCurrentUser(INITIAL_USERS[0]);
    showToast('Reset profile to default demo settings');
  }, [showToast]);

  const switchUserRole = useCallback((role: 'driver' | 'operator') => {
    if (role === 'driver') {
      const driverUser = loadInitialUser();
      setCurrentUser(driverUser);
      setCurrentView('driver');
      showToast(`Switched to Driver mode (${driverUser.name})`);
    } else {
      setCurrentUser(INITIAL_USERS[1]);
      setCurrentView('admin');
      showToast('Switched to City Operator mode (Admin S. Sharma)');
    }
  }, [showToast]);

  const setCurrentRole = useCallback((role: UserRole) => {
    if (role === 'driver') {
      setCurrentUser(loadInitialUser());
    } else {
      setCurrentUser(INITIAL_USERS[1]);
    }
  }, []);

  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const selectedZone = useMemo(() => {
    return dynamicZones.find(z => z.id === selectedZoneId) || null;
  }, [dynamicZones, selectedZoneId]);

  // Second ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdatedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger live pulse simulation
  const triggerLivePulse = useCallback(() => {
    let targetZoneInfo: { name: string; block: string; available: number; occupancy: number } | null = null;

    setZones(prevZones => {
      if (!prevZones || prevZones.length === 0) return prevZones;
      // Pick 2 random zones to perturb
      const randomIndex = Math.floor(Math.random() * prevZones.length);
      const randomDelta = Math.random() > 0.45 ? (Math.random() > 0.5 ? 1 : -1) : 0;
      
      const newZones = prevZones.map((zone, idx) => {
        if (idx !== randomIndex && idx !== (randomIndex + 2) % prevZones.length) return zone;
        const delta = idx === randomIndex ? randomDelta : (randomDelta * -1);
        const newAvailable = Math.max(0, Math.min(zone.capacity, zone.available_spaces + delta));
        const newOccupancy = Math.round(((zone.capacity - newAvailable) / zone.capacity) * 100);
        
        let newStatus: ParkingZone['status'] = 'Available';
        if (newAvailable === 0) newStatus = 'Full';
        else if (newAvailable <= 8) newStatus = 'Filling Soon';

        return {
          ...zone,
          available_spaces: newAvailable,
          occupancy: newOccupancy,
          status: newStatus,
          last_updated: 'Just now'
        };
      });

      const alteredZone = newZones[randomIndex];
      if (alteredZone) {
        targetZoneInfo = {
          name: alteredZone.name,
          block: alteredZone.block,
          available: alteredZone.available_spaces,
          occupancy: alteredZone.occupancy
        };
      }

      return newZones;
    });

    // Update activity feed outside of setZones to prevent StrictMode duplicate state side-effects
    const uniqueId = `act-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const zoneName = targetZoneInfo ? (targetZoneInfo as any).name : 'Connaught Hub';
    const zoneBlock = targetZoneInfo ? (targetZoneInfo as any).block : 'Block B';
    const zoneAvailable = targetZoneInfo ? (targetZoneInfo as any).available : 12;
    const zoneOccupancy = targetZoneInfo ? (targetZoneInfo as any).occupancy : 78;

    const feedTexts = [
      `Zone ${zoneName} occupancy updated to ${zoneOccupancy}%`,
      `${zoneAvailable} vacant spots detected at ${zoneName}`,
      `IoT LoRaWAN sensor sync completed for ${zoneName}`,
      `Dynamic route load balanced near ${zoneBlock}`
    ];
    const randomFeedText = feedTexts[Math.floor(Math.random() * feedTexts.length)];
    
    setActivityFeed(feed => {
      if (feed.some(item => item.id === uniqueId)) return feed;
      return [
        {
          id: uniqueId,
          text: randomFeedText,
          type: zoneAvailable > 0 ? 'spaces_opened' : 'occupancy_up',
          timestamp: 'Just now'
        },
        ...feed.filter(item => item.id !== uniqueId).slice(0, 14)
      ];
    });

    // Recompute total KPI
    setCityKpi(prev => {
      const delta = Math.floor(Math.random() * 5) - 2;
      const newOccupied = Math.max(8000, Math.min(12000, prev.occupiedSpaces + delta));
      const newAvailable = prev.totalParkingSpaces - newOccupied;
      return {
        ...prev,
        occupiedSpaces: newOccupied,
        availableSpaces: newAvailable,
        overallOccupancyPercent: parseFloat(((newOccupied / prev.totalParkingSpaces) * 100).toFixed(1))
      };
    });

    setLastUpdatedSeconds(0);
  }, []);

  // Periodic simulation
  useEffect(() => {
    if (!simulationActive) return;
    const interval = setInterval(() => {
      triggerLivePulse();
    }, 4500);
    return () => clearInterval(interval);
  }, [simulationActive, triggerLivePulse]);

  // Create Reservation
  const createReservation = useCallback((booking: {
    zoneId: string;
    date: string;
    time: string;
    durationHours: number;
    vehicleNumber: string;
  }) => {
    const targetZone = zones.find(z => z.id === booking.zoneId) || zones[0];
    const cost = targetZone.price_per_hour * booking.durationHours;
    const resId = `RES-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomBay = `Bay ${String.fromCharCode(65 + Math.floor(Math.random() * 4))}-${Math.floor(10 + Math.random() * 30)}`;

    const newRes: Reservation = {
      id: resId,
      user_id: currentUser.id,
      user_name: currentUser.name,
      zone_id: targetZone.id,
      zone_name: targetZone.name,
      zone_address: targetZone.address,
      latitude: targetZone.latitude,
      longitude: targetZone.longitude,
      date_str: booking.date,
      arrival_time: booking.time,
      duration_hours: booking.durationHours,
      status: 'Upcoming',
      amount: cost,
      vehicle_number: booking.vehicleNumber || currentUser.vehicle_number,
      qr_code_id: `PS-${targetZone.name.substring(0, 4).toUpperCase()}-${resId}-${booking.vehicleNumber}`,
      slot_number: randomBay,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setReservations(prev => [newRes, ...prev]);
    setActivePass(newRes);
    setIsReservationOpen(false);
    setIsPassOpen(true);

    // Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'system',
        title: '🎟️ Smart Reservation Confirmed',
        message: `Reserved ${targetZone.name} for ${booking.time} (${booking.date}). Pass #${resId} generated.`,
        timestamp: 'Just now',
        read: false,
        severity: 'success',
        zone_id: targetZone.id
      },
      ...prev
    ]);

    // Update target zone available spots
    setZones(prev => prev.map(z => {
      if (z.id !== targetZone.id) return z;
      const newAvail = Math.max(0, z.available_spaces - 1);
      return {
        ...z,
        available_spaces: newAvail,
        occupancy: Math.round(((z.capacity - newAvail) / z.capacity) * 100)
      };
    }));

    showToast(`Reservation Confirmed for ${targetZone.name}!`);
    return newRes;
  }, [zones, currentUser, showToast]);

  const cancelReservation = useCallback((id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'Cancelled' as const } : r));
    showToast('Reservation has been cancelled');
  }, [showToast]);

  const rateReservation = useCallback((id: string, rating: number, review?: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, rating, rating_review: review || r.rating_review } : r));
    showToast(`Thank you! Rated ${rating}★ for your parking session.`);
  }, [showToast]);

  const rebookReservation = useCallback((res: Reservation) => {
    setSelectedZoneId(res.zone_id);
    setIsReservationOpen(true);
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  }, [showToast]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const updateAlertStatus = useCallback((id: string, status: AlertStatus) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    showToast(`Alert #${id} marked as ${status}`);
  }, [showToast]);

  const applyPricingRecommendation = useCallback((id: string) => {
    setPricingList(prev => prev.map(p => {
      if (p.id !== id) return p;
      // also update zone price!
      setZones(zList => zList.map(z => z.id === p.zone_id ? { ...z, price_per_hour: p.recommended_price } : z));
      return { ...p, status: 'Applied' as const };
    }));
    showToast('Dynamic pricing recommendation applied successfully');
  }, [showToast]);

  const modifyPricingRecommendation = useCallback((id: string, newPrice: number) => {
    setPricingList(prev => prev.map(p => {
      if (p.id !== id) return p;
      setZones(zList => zList.map(z => z.id === p.zone_id ? { ...z, price_per_hour: newPrice } : z));
      return { ...p, recommended_price: newPrice, status: 'Applied' as const };
    }));
    showToast(`Pricing updated to ₹${newPrice}/hour`);
  }, [showToast]);

  const addNewZone = useCallback((newZone: Partial<ParkingZone>) => {
    const id = `zone-${Date.now()}`;
    const fullZone: ParkingZone = {
      id,
      name: newZone.name || 'New Smart Parking Zone',
      block: newZone.block || 'Block A',
      address: newZone.address || 'Smart Mobility Avenue, Delhi-NCR',
      latitude: newZone.latitude || 28.6320,
      longitude: newZone.longitude || 77.2180,
      capacity: newZone.capacity || 200,
      available_spaces: newZone.available_spaces ?? Math.round((newZone.capacity || 200) * 0.4),
      occupancy: 60,
      price_per_hour: newZone.price_per_hour || 40,
      status: 'Available',
      distance_m: 800,
      walking_time_min: 10,
      eta_min: 6,
      opening_probability: 88,
      expected_wait_min: 1,
      has_ev: !!newZone.has_ev,
      has_accessible: true,
      sensor_health: 'Healthy',
      turnover_rate: 15.0,
      current_demand: 'Moderate',
      operating_hours: newZone.operating_hours || '24/7',
      parking_type: newZone.parking_type || 'Multi-Level Covered',
      trend_hourly: [30, 20, 15, 10, 20, 45, 70, 80, 85, 80, 75, 70, 68, 65, 70, 75, 80, 82, 70, 55, 45, 38, 32, 28],
      last_updated: 'Just now'
    };
    setZones(prev => [fullZone, ...prev]);
    showToast(`Added new parking zone: ${fullZone.name}`);
  }, [showToast]);

  const addParkingZone = useCallback((zone: ParkingZone) => {
    setZones(prev => [zone, ...prev]);
    showToast(`Zone "${zone.name}" created successfully`);
  }, [showToast]);

  const updateParkingZone = useCallback((id: string, updates: Partial<ParkingZone>) => {
    setZones(prev => prev.map(z => z.id === id ? { ...z, ...updates } : z));
  }, []);

  const toggleZoneStatus = useCallback((id: string) => {
    setZones(prev => prev.map(z => {
      if (z.id !== id) return z;
      const newStatus = z.status === 'Full' ? 'Available' : 'Full';
      const newAvail = newStatus === 'Full' ? 0 : Math.round(z.capacity * 0.2);
      return {
        ...z,
        status: newStatus,
        available_spaces: newAvail,
        occupancy: newStatus === 'Full' ? 100 : 80
      };
    }));
    showToast(`Toggled zone status`);
  }, [showToast]);

  // Filtered zones
  const filteredZones = useMemo(() => {
    let result = [...dynamicZones];

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(z => 
        z.name.toLowerCase().includes(q) || 
        z.block.toLowerCase().includes(q) || 
        z.address.toLowerCase().includes(q)
      );
    }

    if (filters.availableOnly) {
      result = result.filter(z => z.available_spaces > 0);
    }

    if (filters.evOnly) {
      result = result.filter(z => z.has_ev);
    }

    if (filters.accessibleOnly) {
      result = result.filter(z => z.has_accessible);
    }

    if (filters.sortBy === 'distance') {
      result.sort((a, b) => a.distance_m - b.distance_m);
    } else if (filters.sortBy === 'price') {
      result.sort((a, b) => a.price_per_hour - b.price_per_hour);
    } else if (filters.sortBy === 'availability') {
      result.sort((a, b) => b.available_spaces - a.available_spaces);
    } else if (filters.sortBy === 'walking') {
      result.sort((a, b) => a.walking_time_min - b.walking_time_min);
    }

    return result;
  }, [dynamicZones, filters]);

  return (
    <ParkingContext.Provider value={{
      currentView,
      setCurrentView,
      driverTab,
      setDriverTab,
      adminTab,
      setAdminTab,
      currentUser,
      updateCurrentUser,
      resetUserProfile,
      switchUserRole,
      setCurrentRole,
      authMode,
      setAuthMode,
      gpsState,
      requestRealGps,
      setCustomLocation,
      zones: dynamicZones,
      selectedZone,
      setSelectedZoneId,
      isDetailOpen,
      setIsDetailOpen,
      isReservationOpen,
      setIsReservationOpen,
      isPassOpen,
      setIsPassOpen,
      isNavigatingOpen,
      setIsNavigatingOpen,
      activePass,
      setActivePass,
      reservations,
      createReservation,
      cancelReservation,
      rateReservation,
      rebookReservation,
      notifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      unreadNotificationsCount,
      alerts,
      updateAlertStatus,
      forecasts,
      forecast: forecasts,
      pricingList,
      applyPricingRecommendation,
      modifyPricingRecommendation,
      addNewZone,
      addParkingZone,
      updateParkingZone,
      toggleZoneStatus,
      activityFeed,
      simulationActive,
      setSimulationActive,
      lastUpdatedSeconds,
      triggerLivePulse,
      cityKpi,
      filters,
      setFilters,
      filteredZones,
      toastMessage,
      showToast,
      hideToast
    }}>
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
