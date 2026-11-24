/**
 * Geolocation and Google Maps Navigation Utilities
 * Adheres strictly to the Google Maps Directions URL standard:
 * https://www.google.com/maps/dir/?api=1&destination=LATITUDE,LONGITUDE
 */

/**
 * Calculates geographic distance in meters using the Haversine formula
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's mean radius in meters
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Formats distance in meters according to standard UX specifications:
 * - `< 1000m` -> `350 m away`
 * - `>= 1000m` -> `1.2 km away`
 */
export function formatDistance(meters: number | null | undefined): string {
  if (meters == null || isNaN(meters)) return 'Distance unavailable';
  if (meters < 1000) {
    return `${Math.max(1, Math.round(meters))} m away`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${km} km away`;
}

/**
 * Formats coordinates for clean display (e.g. 28.6304° N, 77.2177° E)
 */
export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}

/**
 * Generates the official Google Maps Navigation/Directions URL
 * format: https://www.google.com/maps/dir/?api=1&destination=LATITUDE,LONGITUDE
 */
export function getGoogleMapsNavigationUrl(
  destinationLat: number,
  destinationLon: number,
  originCoords?: [number, number] | null
): string {
  let url = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLon}`;
  if (originCoords && originCoords[0] != null && originCoords[1] != null) {
    url += `&origin=${originCoords[0]},${originCoords[1]}`;
  }
  return url;
}

/**
 * Opens Google Maps Navigation directly using exact latitude and longitude coordinates.
 * On mobile devices, this universal link prioritizes launching the Google Maps app;
 * otherwise falls back smoothly to the web browser. On desktop, opens in a new tab.
 */
export function openGoogleMapsNavigation(
  destinationLat: number,
  destinationLon: number,
  originCoords?: [number, number] | null
): void {
  const url = getGoogleMapsNavigationUrl(destinationLat, destinationLon, originCoords);
  window.open(url, '_blank', 'noopener,noreferrer');
}
