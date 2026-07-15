import React, { useRef, useEffect } from 'react';
import {
  Animated, ActivityIndicator, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';
import { useApp } from '@/context/AppContext';
import { usePrayerTimes, getNextPrayer } from '@/hooks/usePrayerTimes';
import { useQibla } from '@/hooks/useQibla';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';

const PRAYER_AR: Record<string, string> = {
  Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر',
  Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء',
};
const PRAYER_LIST = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

function QiblaCompass({ needleAngle, qiblaDir }: { needleAngle: number; qiblaDir: number }) {
  const colors = useColors();
  const rotation = useRef(new Animated.Value(needleAngle)).current;

  useEffect(() => {
    Animated.spring(rotation, {
      toValue: needleAngle,
      useNativeDriver: true,
      tension: 10,
      friction: 8,
    }).start();
  }, [needleAngle]);

  const spin = rotation.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });
  const r = 100;

  return (
    <View style={styles.compassContainer}>
      <Svg width={240} height={240} viewBox="-120 -120 240 240">
        <Circle cx={0} cy={0} r={r} fill={colors.card} stroke={colors.border} strokeWidth={2} />
        <Circle cx={0} cy={0} r={r - 14} fill="none" stroke={colors.border} strokeWidth={1} strokeDasharray="4,4" />
        {/* Cardinal directions */}
        <SvgText x={0} y={-(r - 4)} textAnchor="middle" fill={colors.primary} fontSize={13} fontWeight="bold">N</SvgText>
        <SvgText x={r - 4} y={5} textAnchor="middle" fill={colors.mutedForeground} fontSize={11}>E</SvgText>
        <SvgText x={0} y={r - 2} textAnchor="middle" fill={colors.mutedForeground} fontSize={11}>S</SvgText>
        <SvgText x={-(r - 4)} y={5} textAnchor="middle" fill={colors.mutedForeground} fontSize={11}>W</SvgText>
        {/* Center dot */}
        <Circle cx={0} cy={0} r={6} fill={colors.primary} />
        <Circle cx={0} cy={0} r={3} fill="#fff" />
      </Svg>
      {/* Animated needle */}
      <Animated.View
        style={[styles.needleWrapper, { transform: [{ rotate: spin }] }]}
      >
        <Svg width={240} height={240} viewBox="-120 -120 240 240">
          <Line x1={0} y1={12} x2={0} y2={-(r - 20)} stroke={colors.gold} strokeWidth={3} strokeLinecap="round" />
          {/* Kaaba symbol at tip */}
          <SvgText x={0} y={-(r - 22)} textAnchor="middle" fontSize={16}>🕋</SvgText>
        </Svg>
      </Animated.View>
      <View style={styles.compassLabelBox}>
        <Text style={[styles.compassDeg, { color: colors.primary }]}>{Math.round(qiblaDir)}°</Text>
        <Text style={[styles.compassLabel, { color: colors.mutedForeground }]}>from North</Text>
      </View>
    </View>
  );
}

export default function PrayerScreen() {
  const colors = useColors();
  const { isRTL } = useTranslation();
  const { prayerMethod } = useApp();
  const { prayerTimes, loading, error, locationName, refetch } = usePrayerTimes(prayerMethod);
  const { qiblaDirection, needleAngle, distance, permissionGranted, loading: qiblaLoading } = useQibla();
  const insets = useSafeAreaInsets();

  const nextPrayer = prayerTimes ? getNextPrayer(prayerTimes) : null;
  const todayDate = new Date().toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
    >
      {/* Header */}
      <LinearGradient
        colors={[colors.emerald, '#1B4D30']}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <Text style={styles.headerTitle}>{isRTL ? 'مواقيت الصلاة' : 'Prayer Times'}</Text>
        <Text style={styles.headerDate}>{todayDate}</Text>
        {!!locationName && (
          <View style={styles.locRow}>
            <Feather name="map-pin" size={12} color="rgba(255,255,255,0.75)" />
            <Text style={styles.locText}>{locationName}</Text>
          </View>
        )}
      </LinearGradient>

      {/* Prayer Times */}
      <View style={[styles.timesCard, { backgroundColor: colors.card }]}>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ padding: 24 }} />
        ) : error ? (
          <TouchableOpacity style={styles.errorBox} onPress={refetch}>
            <Text style={{ color: colors.mutedForeground }}>{error}</Text>
            <Text style={{ color: colors.primary, marginTop: 8, fontFamily: 'Inter_600SemiBold' }}>
              {isRTL ? 'إعادة المحاولة' : 'Retry'}
            </Text>
          </TouchableOpacity>
        ) : prayerTimes ? (
          PRAYER_LIST.map((prayer) => {
            const isNext = nextPrayer?.name === prayer;
            return (
              <View
                key={prayer}
                style={[
                  styles.prayerRow,
                  { borderBottomColor: colors.border },
                  isNext && { backgroundColor: colors.primary + '14' },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  {isNext && <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />}
                  {!isNext && <View style={styles.activeDotPlaceholder} />}
                  <Text style={[styles.prayerName, { color: isNext ? colors.primary : colors.foreground }]}>
                    {isRTL ? PRAYER_AR[prayer] : prayer}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[styles.prayerTime, { color: isNext ? colors.primary : colors.foreground }]}>
                    {prayerTimes[prayer].split(' ')[0]}
                  </Text>
                  {isNext && (
                    <View style={[styles.nextBadge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.nextBadgeText}>{isRTL ? 'التالية' : 'Next'}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        ) : null}
      </View>

      {/* Qibla Section */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          {isRTL ? 'القبلة' : 'Qibla Direction'}
        </Text>
        {qiblaLoading ? (
          <ActivityIndicator color={colors.primary} style={{ padding: 24 }} />
        ) : !permissionGranted ? (
          <View style={styles.permBox}>
            <Feather name="map-pin" size={32} color={colors.mutedForeground} />
            <Text style={[styles.permText, { color: colors.mutedForeground }]}>
              {isRTL ? 'يلزم تفعيل الموقع لإظهار اتجاه القبلة' : 'Location access needed for Qibla direction'}
            </Text>
          </View>
        ) : qiblaDirection !== null ? (
          <>
            <QiblaCompass needleAngle={needleAngle} qiblaDir={qiblaDirection} />
            {distance !== null && (
              <Text style={[styles.distanceText, { color: colors.mutedForeground }]}>
                {isRTL
                  ? `المسافة إلى مكة المكرمة: ${Math.round(distance).toLocaleString()} كم`
                  : `Distance to Mecca: ${Math.round(distance).toLocaleString()} km`}
              </Text>
            )}
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  headerDate: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2, fontFamily: 'Inter_400Regular' },
  locRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
  locText: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular' },
  timesCard: { margin: 16, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  prayerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  activeDot: { width: 8, height: 8, borderRadius: 4 },
  activeDotPlaceholder: { width: 8, height: 8 },
  prayerName: { fontSize: 16, fontFamily: 'Inter_500Medium' },
  prayerTime: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  nextBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  nextBadgeText: { fontSize: 11, color: '#fff', fontFamily: 'Inter_600SemiBold' },
  errorBox: { padding: 24, alignItems: 'center' },
  section: { margin: 16, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '600', fontFamily: 'Inter_600SemiBold', marginBottom: 16, textAlign: 'center' },
  compassContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  needleWrapper: { position: 'absolute' },
  compassLabelBox: { alignItems: 'center', marginTop: 12 },
  compassDeg: { fontSize: 28, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  compassLabel: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  permBox: { alignItems: 'center', padding: 24, gap: 12 },
  permText: { textAlign: 'center', fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  distanceText: { textAlign: 'center', marginTop: 8, fontSize: 13, fontFamily: 'Inter_400Regular' },
});
