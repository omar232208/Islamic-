import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
let LinearGradient: any = ({ children, ...props }: any) => {
  try { const LG = require('expo-linear-gradient').LinearGradient; if (LG) return <LG {...props}>{children}</LG>; } catch {}
  return <View style={[props.style, { backgroundColor: '#2D7A4F' }]}>{children}</View>;
};
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';
import { useApp } from '@/context/AppContext';
import { usePrayerTimes, getNextPrayer, formatCountdown, NextPrayerInfo } from '@/hooks/usePrayerTimes';
import { toHijri } from '@/hooks/useHijriDate';
import { VERSE_OF_THE_DAY_POOL } from '@/constants/quranData';
import { HADITH_OF_THE_DAY_POOL } from '@/constants/hadithData';
import { SURAHS } from '@/constants/quranData';

const PRAYER_NAMES_AR: Record<string, string> = {
  Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر',
  Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء',
};

const dayOfYear = () => Math.floor(
  (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
);

const QUICK_ITEMS = [
  { id: 'quran', icon: 'book-open', labelEn: 'Quran', labelAr: 'القرآن', color: '#2D7A4F', route: '/(tabs)/quran' },
  { id: 'adhkar', icon: 'heart', labelEn: 'Adhkar', labelAr: 'الأذكار', color: '#6366F1', route: '/(tabs)/adhkar' },
  { id: 'qibla', icon: 'navigation', labelEn: 'Qibla', labelAr: 'القبلة', color: '#F59E0B', route: '/(tabs)/prayer' },
  { id: 'names', icon: 'star', labelEn: '99 Names', labelAr: 'أسماء الله', color: '#EC4899', route: '/more/names' },
  { id: 'duas', icon: 'wind', labelEn: 'Duas', labelAr: 'الأدعية', color: '#059669', route: '/more/duas' },
  { id: 'calendar', icon: 'calendar', labelEn: 'Calendar', labelAr: 'التقويم', color: '#8B5CF6', route: '/more/calendar' },
] as const;

export default function HomeScreen() {
  const colors = useColors();
  const { isRTL } = useTranslation();
  const { prayerMethod, lastReadSurah, lastReadVerse } = useApp();
  const { prayerTimes, loading, locationName } = usePrayerTimes(prayerMethod);
  const insets = useSafeAreaInsets();

  const [countdown, setCountdown] = useState('00:00:00');
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo | null>(null);

  const hijri = toHijri();
  const d = dayOfYear();
  const verse = VERSE_OF_THE_DAY_POOL[d % VERSE_OF_THE_DAY_POOL.length];
  const hadith = HADITH_OF_THE_DAY_POOL[d % HADITH_OF_THE_DAY_POOL.length];
  const lastSurah = lastReadSurah > 0 ? SURAHS.find((s) => s.number === lastReadSurah) : null;

  const greeting = () => {
    const h = new Date().getHours();
    if (isRTL) return h < 12 ? 'صباح الخير' : h < 17 ? 'مساء النور' : 'مساء الخير';
    return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
  };

  useEffect(() => {
    if (!prayerTimes) return;
    const tick = () => {
      const next = getNextPrayer(prayerTimes);
      setNextPrayer(next);
      setCountdown(formatCountdown(next.timeUntil));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [prayerTimes]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
    >
      {/* Header gradient */}
      <LinearGradient
        colors={[colors.emerald, '#1B4D30']}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <Text style={styles.greeting}>{greeting()}</Text>
        <Text style={styles.hijriDate}>
          {hijri.day} {isRTL ? hijri.monthNameAr : hijri.monthNameEn} {hijri.year} AH
        </Text>
        <Text style={styles.gregorianDate}>
          {new Date().toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
          })}
        </Text>
        {!!locationName && (
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={12} color="rgba(255,255,255,0.75)" />
            <Text style={styles.locationText}>{locationName}</Text>
          </View>
        )}
      </LinearGradient>

      {/* Next Prayer Card */}
      <View style={[styles.prayerCard, { backgroundColor: colors.card, shadowColor: colors.emerald }]}>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ padding: 24 }} />
        ) : prayerTimes && nextPrayer ? (
          <>
            <View style={styles.prayerCardTop}>
              <View>
                <Text style={[styles.nextLabel, { color: colors.mutedForeground }]}>
                  {isRTL ? 'الصلاة القادمة' : 'Next Prayer'}
                </Text>
                <Text style={[styles.nextPrayerName, { color: colors.primary }]}>
                  {isRTL ? PRAYER_NAMES_AR[nextPrayer.name] : nextPrayer.name}
                </Text>
              </View>
              <View style={styles.countdownBox}>
                <Text style={[styles.countdown, { color: colors.foreground }]}>{countdown}</Text>
                <Text style={[styles.prayerTime, { color: colors.accent }]}>{nextPrayer.time}</Text>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => {
                const isNext = nextPrayer.name === p;
                return (
                  <View
                    key={p}
                    style={[
                      styles.prayerChip,
                      { backgroundColor: isNext ? colors.primary : colors.secondary },
                    ]}
                  >
                    <Text style={[styles.chipName, { color: isNext ? '#fff' : colors.mutedForeground }]}>
                      {isRTL ? PRAYER_NAMES_AR[p] : p}
                    </Text>
                    <Text style={[styles.chipTime, { color: isNext ? '#E0FFE8' : colors.foreground }]}>
                      {prayerTimes[p].split(' ')[0]}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </>
        ) : (
          <Text style={{ color: colors.mutedForeground, textAlign: 'center', padding: 16 }}>
            {isRTL ? 'لم يتم تحديد موقعك' : 'Enable location for prayer times'}
          </Text>
        )}
      </View>

      {/* Last Read Banner */}
      {lastSurah ? (
        <TouchableOpacity
          style={[styles.lastReadCard, { backgroundColor: colors.primary }]}
          onPress={() => router.push(`/quran/${lastSurah.number}` as any)}
          activeOpacity={0.8}
        >
          <Feather name="bookmark" size={18} color="#fff" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.lastReadLabel}>{isRTL ? 'متابعة القراءة' : 'Continue Reading'}</Text>
            <Text style={styles.lastReadSurah}>
              {isRTL ? lastSurah.name : lastSurah.englishName}
              {lastReadVerse > 0 ? ` · ${isRTL ? 'آية' : 'Verse'} ${lastReadVerse}` : ''}
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color="#fff" />
        </TouchableOpacity>
      ) : null}

      {/* Verse of Day */}
      <View style={[styles.card, { backgroundColor: colors.card, borderLeftColor: colors.gold, borderLeftWidth: 4 }]}>
        <View style={styles.cardHeader}>
          <Feather name="book-open" size={15} color={colors.gold} />
          <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>
            {isRTL ? 'آية اليوم' : 'Verse of the Day'}
          </Text>
        </View>
        <Text style={[styles.arabicText, { color: colors.foreground }]}>{verse.arabic}</Text>
        <Text style={[styles.translationText, { color: colors.mutedForeground }]}>{verse.translation}</Text>
        <Text style={[styles.refText, { color: colors.gold }]}>
          {isRTL ? `القرآن ${verse.surah}:${verse.ayah}` : `Quran ${verse.surah}:${verse.ayah}`}
        </Text>
      </View>

      {/* Hadith of Day */}
      <View style={[styles.card, { backgroundColor: colors.card, borderLeftColor: colors.primary, borderLeftWidth: 4 }]}>
        <View style={styles.cardHeader}>
          <Feather name="message-circle" size={15} color={colors.primary} />
          <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>
            {isRTL ? 'حديث اليوم' : 'Hadith of the Day'}
          </Text>
        </View>
        <Text style={[styles.arabicText, { color: colors.foreground, fontSize: 17 }]}>{hadith.arabic}</Text>
        <Text style={[styles.translationText, { color: colors.mutedForeground }]}>{hadith.english}</Text>
        <Text style={[styles.refText, { color: colors.primary }]}>{hadith.source}</Text>
      </View>

      {/* Quick Access */}
      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        <Text style={[styles.sectionHeading, { color: colors.foreground }]}>
          {isRTL ? 'وصول سريع' : 'Quick Access'}
        </Text>
        <View style={styles.quickGrid}>
          {QUICK_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.quickCard, { backgroundColor: colors.card }]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.quickIconBg, { backgroundColor: item.color + '22' }]}>
                <Feather name={item.icon as any} size={22} color={item.color} />
              </View>
              <Text style={[styles.quickLabel, { color: colors.foreground }]}>
                {isRTL ? item.labelAr : item.labelEn}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 28 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular', marginBottom: 2 },
  hijriDate: { fontSize: 22, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  gregorianDate: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2, fontFamily: 'Inter_400Regular' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
  locationText: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular' },
  prayerCard: {
    margin: 16, borderRadius: 16, padding: 16,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 4,
  },
  prayerCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  nextLabel: { fontSize: 12, fontFamily: 'Inter_400Regular', marginBottom: 2 },
  nextPrayerName: { fontSize: 24, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  countdownBox: { alignItems: 'flex-end' },
  countdown: { fontSize: 28, fontWeight: '700', fontFamily: 'Inter_700Bold', letterSpacing: 1 },
  prayerTime: { fontSize: 14, fontFamily: 'Inter_500Medium', marginTop: 2 },
  prayerChip: { marginRight: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, alignItems: 'center', minWidth: 68 },
  chipName: { fontSize: 11, fontFamily: 'Inter_500Medium', marginBottom: 2 },
  chipTime: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  lastReadCard: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 8,
    padding: 14, borderRadius: 14,
  },
  lastReadLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_400Regular' },
  lastReadSurah: { fontSize: 15, fontWeight: '600', color: '#fff', fontFamily: 'Inter_600SemiBold' },
  card: {
    marginHorizontal: 16, marginBottom: 12, borderRadius: 14, padding: 16,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  cardLabel: { fontSize: 12, fontFamily: 'Inter_500Medium', textTransform: 'uppercase', letterSpacing: 0.5 },
  arabicText: { fontSize: 20, fontWeight: '600', textAlign: 'right', writingDirection: 'rtl', lineHeight: 36, marginBottom: 8 },
  translationText: { fontSize: 14, lineHeight: 22, fontFamily: 'Inter_400Regular', fontStyle: 'italic', marginBottom: 8 },
  refText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  sectionHeading: { fontSize: 16, fontWeight: '600', fontFamily: 'Inter_600SemiBold', marginBottom: 12 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: {
    width: '30.5%', padding: 14, borderRadius: 14, alignItems: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06,
    shadowRadius: 6, elevation: 2,
  },
  quickIconBg: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  quickLabel: { fontSize: 12, fontFamily: 'Inter_500Medium', textAlign: 'center' },
});
