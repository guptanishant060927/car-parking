export type UserRole = 'driver' | 'operator' | 'city-operator';

export type VehicleCategory = 'EV' | 'Sedan' | 'SUV' | 'Hatchback' | 'Two-Wheeler';
export type FuelType = 'Electric' | 'Petrol' | 'Diesel' | 'Hybrid' | 'CNG';
export type SlotPreference = 'Standard' | 'EV Charging' | 'Accessible' | 'Wide Bay';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  vehicle_number: string;
  avatar_url?: string;
  avatar_color?: string;
  phone?: string;
  vehicle_model?: string;
  vehicle_type?: VehicleCategory;
  fuel_type?: FuelType;
  fastag_id?: string;
  fastag_bank?: string;
  fastag_balance?: number;
  auto_pay_enabled?: boolean;
  emergency_contact?: string;
  preferred_slot_type?: SlotPreference;
  notification_sms?: boolean;
  notification_whatsapp?: boolean;
}

export type ZoneStatus = 'Available' | 'Filling Soon' | 'Full';
export type SensorHealth = 'Healthy' | 'Degraded' | 'Offline';

export interface ParkingZone {
  id: string;
  name: string;
  block: string;
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
  available_spaces: number;
  total_spots?: number;
  occupancy: number; // percentage 0-100
  price_per_hour: number;
  status: ZoneStatus;
  distance_m: number;
  walking_time_min: number;
  eta_min: number;
  opening_probability: number; // percentage e.g. 72%
  expected_wait_min: number;
  has_ev: boolean;
  has_accessible: boolean;
  sensor_health: SensorHealth;
  turnover_rate: number; // cars per hour e.g. 14.5
  current_demand: 'Low' | 'Moderate' | 'High' | 'Surge';
  operating_hours: string;
  parking_type: 'Multi-Level Covered' | 'Surface Lot' | 'Underground' | 'Curbside Smart Zone' | string;
  trend_hourly: number[]; // 24-hr occupancy points
  last_updated: string;
}

export interface ParkingSensor {
  id: string;
  zone_id: string;
  zone_name: string;
  sensor_type: 'Ultrasonic' | 'Optical Camera' | 'Magnetometer' | 'In-Ground LoRaWAN';
  status: 'Online' | 'Offline' | 'Calibrating';
  battery_pct: number;
  last_updated: string;
}

export type ReservationStatus = 'Upcoming' | 'Active' | 'Completed' | 'Cancelled';

export interface Reservation {
  id: string;
  user_id: string;
  user_name: string;
  zone_id: string;
  zone_name: string;
  zone_address: string;
  latitude?: number;
  longitude?: number;
  date_str: string;
  arrival_time: string;
  duration_hours: number;
  status: ReservationStatus;
  amount: number;
  vehicle_number: string;
  qr_code_id: string;
  created_at: string;
  slot_number?: string;
  rating?: number;
  rating_review?: string;
  payment_method?: string;
  exit_time?: string;
}

export interface DriverGpsState {
  coords: [number, number]; // [latitude, longitude]
  accuracy: number | null; // accuracy in meters e.g. 5
  speed: number | null; // speed in km/h
  heading: number | null; // bearing degrees 0-360
  isRealGps: boolean;
  isStationary: boolean;
  status: 'idle' | 'requesting' | 'locked' | 'denied' | 'error' | 'timeout';
  errorMessage?: string | null;
  lastMovementTimestamp: number;
  locationName: string;
}

export type NotificationType = 'spot_opened' | 'shortage_predicted' | 'zone_full' | 'traffic_congestion' | 'system';

export interface NotificationItem {
  id: string;
  user_id?: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: 'success' | 'warning' | 'error' | 'info';
  zone_id?: string;
}

export type AlertSeverity = 'Critical' | 'Warning' | 'Info';
export type AlertStatus = 'Active' | 'Investigating' | 'Resolved';
export type AlertType = 
  | 'zone_full' 
  | 'sudden_congestion' 
  | 'sensor_malfunction' 
  | 'unusual_occupancy' 
  | 'predicted_shortage' 
  | 'reservation_issue';

export interface AlertItem {
  id: string;
  zone_id: string;
  zone_name: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  location: string;
  message?: string;
  timestamp: string;
  status: AlertStatus;
}

export type SystemAlert = AlertItem;

export interface ForecastItem {
  id: string;
  zone_id: string;
  zone_name: string;
  current_occupancy: number;
  predicted_occupancy: number;
  predicted_occupancy_1h?: number;
  predicted_occupancy_3h?: number;
  predicted_occupancy_6h?: number;
  shortage_probability: number;
  expected_available_spots: number;
  expected_available_1h?: number;
  peak_time: string;
  risk_level: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  ai_insight?: string;
  timeline?: { time: string; predicted: number; actual?: number }[];
}

export interface PricingRecommendation {
  id: string;
  zone_id: string;
  zone_name: string;
  current_price: number;
  recommended_price: number;
  reason: string;
  demand_surge_factor: string;
  status: 'Pending' | 'Applied' | 'Scheduled';
  timeline: { hour: string; expected_demand: number; suggested_price: number }[];
}

export interface ActivityFeedItem {
  id: string;
  text: string;
  type: 'occupancy_up' | 'reservation' | 'sensor_issue' | 'spaces_opened' | 'price_change';
  timestamp: string;
}

export interface ParkingTransaction {
  id: string;
  reservation_id: string;
  amount: number;
  payment_status: 'Paid' | 'Pending' | 'Refunded';
  timestamp: string;
  payment_method: 'UPI' | 'Card' | 'FASTag Wallet';
}

export type AppView = 'landing' | 'driver' | 'admin' | 'architecture' | 'auth';
export type DriverSubTab = 'find' | 'reservations' | 'notifications' | 'profile';
export type AdminTab = 
  | 'overview' 
  | 'live' 
  | 'analytics' 
  | 'forecasting' 
  | 'alerts' 
  | 'zones' 
  | 'reservations' 
  | 'pricing' 
  | 'reports' 
  | 'settings';
export type AdminSubTab = AdminTab;
