import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';
import { useApp } from '@/context/AppContext';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { toHijri, isRamadan, daysUntilRamadan } from '@/hooks/useHijriDate';

const RAMADAN_TIPS_EN = [
  "Start your day with Fajr prayer and remember Allah after salah.",
  "Read at least one page of Quran after each prayer.",
  "Make abundant dua before Iftar — this is a time when duas are accepted.",
  "Give charity daily, even if small. The Prophet ﷺ was most generous in Ramadan.",
  "Seek Laylat al-Qadr in the last 10 nights, especially odd nights.",
];

const RAMADAN_TIPS_AR = [
  "ابدأ يومك بصلاة الفجر والذكر بعد الصلاة.",
  "اقرأ صفحة من القرآن على الأقل بعد كل صلاة.",
  "أكثر من الدعاء قبل الإفطار فهو وقت إجابة الدعاء.",
  "تصدق كل يوم ولو بالقليل، فالنبي ﷺ كان أجود ما يكون في رمضان.",
  "ابحث عن ليلة القدر في العشر الأواخر وخاصة الأوتار.",
];

export default function RamadanScreen() {
  const colors = useColors();
  const { isRTL } = useTranslation();
  const insets = useSafeAreaInsets();
  const { prayerMethod } = useApp();
  const { prayerTimes, loading } = usePrayerTimes(prayerMethod);

  const hijri = toHijri();
  const inRamadan = isRamadan();
  const daysLeft = inRamadan ? 30 - hijri.day : daysUntilRamadan();
  const tips = isRTL ? RAMADAN_TIPS_AR : RAMADAN_TIPS_EN;
  const tipIndex = hijri.day % tips.length;

  const [timeToIftar, setTimeToIftar] = useState('');
  const [timeToSuhoor, setTimeToSuhoor] = useState('');

  useEffect(() => {
    if (!prayerTimes) return;
    const tick = () => {
      const now = new Date();
      const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const parse = (t: string) => {
        const [h, m] = t.split(' ')[0].split(':').map(Number);
        return h * 3600 + m * 60;
      };
      const maghribSec = parse(prayerTimes.Maghrib);
      const fajrSec = parse(prayerTimes.Fajr);
      const toMaghrib = maghribSec > nowSec ? maghribSec - nowSec : 0;
      const toFajr = fajrSec > nowSec ? fajrSec - nowSec : 86400 - nowSec + fajrSec;
      const fmt = (s: number) => {
        const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      };
      setTimeToIftar(fmt(toMaghrib));
      setTimeToSuhoor(fmt(toFajr));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [prayerTimes]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
      <LinearGradient colors={['#1A0A3B', '#2D1A6B']} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerEmoji}>🌙</Text>
        <Text style={styles.headerTitle}>{isRTL ? 'رمضان المبارك' : 'Ramadan'}</Text>
        {inRamadan ? (
          <Text style={styles.headerSub}>
            {isRTL ? `اليوم ${hijri.day} من رمضان` : `Day ${hijri.day} of Ramadan`}
          </Text>
        ) : (
          <Text style={styles.headerSub}>
            {isRTL ? `${daysLeft} يوماً حتى رمضان` : `${daysLeft} days until Ramadan`}
          </Text>
        )}
      </LinearGradient>

      {/* Iftar & Suhoor countdown */}
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ padding: 24 }} />
      ) : prayerTimes ? (
        <View style={styles.timesRow}>
          <View style={[styles.timeCard, { backgroundColor: '#F59E0B22', borderColor: '#F59E0B' }]}>
            <Text style={styles.timeEmoji}>🌅</Text>
            <Text style={[styles.timeLabel, { color: colors.mutedForeground }]}>
              {isRTL ? 'الإفطار' : 'Iftar'}
            </Text>
            <Text style={[styles.timeActual, { color: '#F59E0B' }]}>
              {prayerTimes.Maghrib.split(' ')[0]}
            </Text>
            {inRamadan && (
              <Text style={[styles.timeCountdown, { color: colors.foreground }]}>{timeToIftar}</Text>
            )}
          </View>
          <View style={[styles.timeCard, { backgroundColor: '#6366F122', borderColor: '#6366F1' }]}>
            <Text style={styles.timeEmoji}>🌌</Text>
            <Text style={[styles.timeLabel, { color: colors.mutedForeground }]}>
              {isRTL ? 'السحور' : 'Suhoor (Fajr)'}
            </Text>
            <Text style={[styles.timeActual, { color: '#6366F1' }]}>
              {prayerTimes.Fajr.split(' ')[0]}
            </Text>
            {inRamadan && (
              <Text style={[styles.timeCountdown, { color: colors.foreground }]}>{timeToSuhoor}</Text>
            )}
          </View>
        </View>
      ) : null}

      {/* Ramadan progress */}
      {inRamadan && (
        <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.progressTitle, { color: colors.foreground }]}>
            {isRTL ? 'تقدم رمضان' : 'Ramadan Progress'}
          </Text>
          <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
            <View style={[styles.progressFill, { width: `${(hijri.day / 30) * 100}%`, backgroundColor: colors.gold }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
            {hijri.day}/30 {isRTL ? 'يوماً' : 'days'}
          </Text>

          {/* Laylat al-Qadr countdown */}
          {hijri.day < 21 && (
            <View style={[styles.qadrBox, { backgroundColor: colors.gold + '18', borderColor: colors.gold }]}>
              <Text style={styles.qadrEmoji}>✨</Text>
              <Text style={[styles.qadrText, { color: colors.foreground }]}>
                {isRTL
                  ? `${21 - hijri.day} يوماً حتى العشر الأواخر`
                  : `${21 - hijri.day} days until the last 10 nights`}
              </Text>
            </View>
          )}
          {hijri.day >= 21 && (
            <View style={[styles.qadrBox, { backgroundColor: colors.gold + '18', borderColor: colors.gold }]}>
              <Text style={styles.qadrEmoji}>🌟</Text>
              <Text style={[styles.qadrText, { color: colors.foreground }]}>
                {isRTL ? 'أنت في العشر الأواخر! ابحث عن ليلة القدر' : "You're in the last 10 nights! Seek Laylat al-Qadr"}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Daily Tip */}
      <View style={[styles.tipCard, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}>
        <View style={styles.tipHeader}>
          <Feather name="sun" size={16} color={colors.primary} />
          <Text style={[styles.tipTitle, { color: colors.primary }]}>
            {isRTL ? 'نصيحة اليوم' : "Today's Tip"}
          </Text>
        </View>
        <Text style={[styles.tipText, { color: colors.foreground }]}>{tips[tipIndex]}</Text>
      </View>

      {/* Dua for breaking fast */}
      <View style={[styles.duaCard, { backgroundColor: colors.card, borderColor: colors.gold }]}>
        <Text style={[styles.duaTitle, { color: colors.gold }]}>
          {isRTL ? 'دعاء الإفطار' : 'Iftar Dua'}
        </Text>
        <Text style={[styles.duaArabic, { color: colors.foreground }]}>
          اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ
        </Text>
        <Text style={[styles.duaTranslation, { color: colors.mutedForeground }]}>
          O Allah, for You I have fasted and upon Your provision I break my fast.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 28, alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', padding: 8, marginBottom: 8 },
  headerEmoji: { fontSize: 48, marginBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 15, color: '#C9A84C', marginTop: 6, fontFamily: 'Inter_600SemiBold' },
  timesRow: { flexDirection: 'row', gap: 12, padding: 16 },
  timeCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1.5, gap: 4 },
  timeEmoji: { fontSize: 28, marginBottom: 4 },
  timeLabel: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  timeActual: { fontSize: 22, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  timeCountdown: { fontSize: 13, fontFamily: 'Inter_500Medium', marginTop: 4 },
  progressCard: { margin: 16, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  progressTitle: { fontSize: 17, fontFamily: 'Inter_600SemiBold', fontWeight: '600', marginBottom: 12 },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 4 },
  progressText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  qadrBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, marginTop: 12 },
  qadrEmoji: { fontSize: 20 },
  qadrText: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium' },
  tipCard: { margin: 16, borderRadius: 14, padding: 16, borderLeftWidth: 4 },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  tipTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 },
  tipText: { fontSize: 15, fontFamily: 'Inter_400Regular', lineHeight: 24 },
  duaCard: { margin: 16, borderRadius: 14, padding: 16, borderWidth: 1.5 },
  duaTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 10 },
  duaArabic: { fontSize: 20, fontWeight: '600', lineHeight: 36, textAlign: 'right', writingDirection: 'rtl', marginBottom: 8 },
  duaTranslation: { fontSize: 13, fontFamily: 'Inter_400Regular', fontStyle: 'italic', lineHeight: 20 },
});
