import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface NextPrayerInfo {
  name: string;
  time: string;
  timeUntil: number; // seconds
}

const DISPLAY_PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

function parseTime12h(timeStr: string): number {
  const clean = timeStr.split(' ')[0];
  const [h, m] = clean.split(':').map(Number);
  return h * 3600 + m * 60;
}

export function getNextPrayer(times: PrayerTimesData): NextPrayerInfo {
  const now = new Date();
  const currentSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  for (const name of DISPLAY_PRAYERS) {
    const prayerSec = parseTime12h(times[name]);
    if (prayerSec > currentSec) {
      return { name, time: times[name], timeUntil: prayerSec - currentSec };
    }
  }
  const fajrSec = parseTime12h(times['Fajr']);
  return { name: 'Fajr', time: times['Fajr'], timeUntil: 86400 - currentSec + fajrSec };
}

export function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function usePrayerTimes(method: number = 4) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>('');

  useEffect(() => { fetchPrayerTimes(); }, [method]);

  async function reverseGeocodeWeb(lat: number, lng: number): Promise<string> {
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ar,en`, {
        headers: { 'User-Agent': 'IslamicApp/1.0' },
      });
      const data = await resp.json();
      if (data?.address) {
        return data.address.city || data.address.town || data.address.village || data.address.state || data.address.country || 'Your Location';
      }
    } catch { /* silent */ }
    return 'Your Location';
  }

  async function fetchPrayerTimes() {
    try {
      setLoading(true);
      setError(null);

      let lat = 21.3891;
      let lng = 39.8579;
      let locName = 'Mecca';

      if (Platform.OS !== 'web') {
        try {
          const Location = require('expo-location');
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            lat = loc.coords.latitude;
            lng = loc.coords.longitude;
            try {
              const [geo] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
              locName = geo.street
                ? `${geo.street}, ${geo.city || geo.region || geo.country || ''}`
                : geo.city || geo.region || geo.country || 'Your Location';
            } catch { locName = 'Your Location'; }
          }
        } catch { /* Location not available */ }
      } else {
        try {
          const pos = await new Promise<GeolocationPosition>((res, rej) =>
            navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 })
          );
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          locName = await reverseGeocodeWeb(lat, lng);
        } catch { /* use defaults */ }
      }

      setLocationName(locName);

      const today = new Date().toISOString().split('T')[0];
      const cacheKey = `prayers_v3_${today}_${lat.toFixed(2)}_${lng.toFixed(2)}_${method}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) { setPrayerTimes(JSON.parse(cached)); setLoading(false); return; }

      const ts = Math.floor(Date.now() / 1000);
      const url = `https://api.aladhan.com/v1/timings/${ts}?latitude=${lat}&longitude=${lng}&method=${method}`;
      const resp = await fetch(url);
      const json = await resp.json();

      if (json.code === 200) {
        const times = json.data.timings as PrayerTimesData;
        await AsyncStorage.setItem(cacheKey, JSON.stringify(times));
        setPrayerTimes(times);
      } else {
        setError('Could not load prayer times');
      }
    } catch {
      setError('Network error. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return { prayerTimes, loading, error, locationName, refetch: fetchPrayerTimes };
}
