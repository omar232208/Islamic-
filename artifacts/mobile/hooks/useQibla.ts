import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export function calculateQiblaDirection(lat: number, lng: number): number {
  const lat1 = (lat * Math.PI) / 180;
  const lat2 = (KAABA_LAT * Math.PI) / 180;
  const dLng = ((KAABA_LNG - lng) * Math.PI) / 180;
  const x = Math.cos(lat2) * Math.sin(dLng);
  const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  let bearing = (Math.atan2(x, y) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useQibla() {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [distance, setDistance] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(true);
  const sub = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    setup();
    return () => { sub.current?.remove(); };
  }, []);

  async function setup() {
    try {
      let lat = 0, lng = 0;

      if (Platform.OS === 'web') {
        try {
          const pos = await new Promise<GeolocationPosition>((res, rej) =>
            navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 })
          );
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          setPermissionGranted(true);
        } catch { /* web geolocation failed */ }
      } else {
        // Lazy import to avoid crashing on web
        try {
          const Location = require('expo-location');
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            setPermissionGranted(true);
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            lat = loc.coords.latitude;
            lng = loc.coords.longitude;

            try {
              const { Magnetometer } = require('expo-sensors');
              Magnetometer.setUpdateInterval(150);
              sub.current = Magnetometer.addListener(({ x, y }: { x: number; y: number }) => {
                let h = Math.atan2(y, x) * (180 / Math.PI);
                if (h < 0) h += 360;
                setDeviceHeading(h);
              });
            } catch { /* Magnetometer not available */ }
          }
        } catch { /* Location not available */ }
      }

      if (lat !== 0 || lng !== 0) {
        setQiblaDirection(calculateQiblaDirection(lat, lng));
        setDistance(haversineKm(lat, lng, KAABA_LAT, KAABA_LNG));
      }
    } catch { /* silent */ }
    setLoading(false);
  }

  const needleAngle = qiblaDirection !== null ? (qiblaDirection - deviceHeading + 360) % 360 : 0;

  return { qiblaDirection, deviceHeading, needleAngle, distance, permissionGranted, loading };
}
