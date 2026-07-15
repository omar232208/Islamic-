import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';
import { toHijri } from '@/hooks/useHijriDate';

const HIJRI_MONTHS_AR = ['محرم','صفر','ربيع الأول','ربيع الثاني','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'];
const HIJRI_MONTHS_EN = ['Muharram','Safar',"Rabi' al-Awwal","Rabi' al-Thani",'Jumada al-Ula','Jumada al-Akhirah','Rajab',"Sha'ban",'Ramadan','Shawwal',"Dhu al-Qi'dah",'Dhu al-Hijjah'];

const ISLAMIC_EVENTS = [
  { month: 1, day: 1, nameEn: "Islamic New Year", nameAr: "رأس السنة الهجرية" },
  { month: 1, day: 10, nameEn: "Day of Ashura", nameAr: "يوم عاشوراء" },
  { month: 3, day: 12, nameEn: "Mawlid an-Nabi", nameAr: "المولد النبوي الشريف" },
  { month: 7, day: 27, nameEn: "Isra Wal Miraj", nameAr: "الإسراء والمعراج" },
  { month: 8, day: 15, nameEn: "Shab-e-Barat", nameAr: "ليلة النصف من شعبان" },
  { month: 9, day: 1, nameEn: "Ramadan Begins", nameAr: "بداية رمضان" },
  { month: 9, day: 27, nameEn: "Laylat al-Qadr", nameAr: "ليلة القدر" },
  { month: 10, day: 1, nameEn: "Eid al-Fitr", nameAr: "عيد الفطر المبارك" },
  { month: 12, day: 9, nameEn: "Day of Arafah", nameAr: "يوم عرفة" },
  { month: 12, day: 10, nameEn: "Eid al-Adha", nameAr: "عيد الأضحى المبارك" },
];

export default function CalendarScreen() {
  const colors = useColors();
  const { isRTL } = useTranslation();
  const insets = useSafeAreaInsets();
  const today = new Date();
  const todayHijri = toHijri(today);

  const [selectedMonth, setSelectedMonth] = useState(todayHijri.month);
  const [selectedYear] = useState(todayHijri.year);

  const eventsThisMonth = ISLAMIC_EVENTS.filter((e) => e.month === selectedMonth);

  // Generate approximation of gregorian dates for this hijri month
  const daysInMonth = selectedMonth % 2 === 1 ? 30 : 29;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
      <LinearGradient colors={['#0F2040', '#1E3A5F']} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isRTL ? 'التقويم الهجري' : 'Islamic Calendar'}</Text>
        <Text style={styles.headerSub}>
          {todayHijri.day} {isRTL ? todayHijri.monthNameAr : todayHijri.monthNameEn} {todayHijri.year} AH
        </Text>
        <Text style={styles.headerGregorian}>
          {today.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>
      </LinearGradient>

      {/* Month Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
        {HIJRI_MONTHS_EN.map((m, i) => {
          const monthNum = i + 1;
          const isSelected = selectedMonth === monthNum;
          const isRamadan = monthNum === 9;
          return (
            <TouchableOpacity
              key={m}
              style={[styles.monthChip, { backgroundColor: isSelected ? colors.primary : colors.card, borderColor: isRamadan ? colors.gold : colors.border }]}
              onPress={() => setSelectedMonth(monthNum)}
            >
              {isRamadan && <Text style={{ fontSize: 10 }}>🌙</Text>}
              <Text style={[styles.monthChipText, { color: isSelected ? '#fff' : colors.foreground }]}>
                {isRTL ? HIJRI_MONTHS_AR[i] : m}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected Month Info */}
      <View style={[styles.monthCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.monthName, { color: colors.foreground }]}>
          {isRTL ? HIJRI_MONTHS_AR[selectedMonth - 1] : HIJRI_MONTHS_EN[selectedMonth - 1]}
          {' '}{selectedYear} AH
        </Text>
        <Text style={[styles.daysText, { color: colors.mutedForeground }]}>
          {daysInMonth} {isRTL ? 'يوم' : 'days'}
        </Text>
        {selectedMonth === 9 && (
          <View style={[styles.ramadanBadge, { backgroundColor: colors.gold }]}>
            <Text style={styles.ramadanText}>{isRTL ? '🌙 شهر رمضان المبارك' : '🌙 The Holy Month of Ramadan'}</Text>
          </View>
        )}

        {/* Days grid */}
        <View style={styles.daysGrid}>
          {Array.from({ length: daysInMonth }, (_, i) => {
            const d = i + 1;
            const isToday = d === todayHijri.day && selectedMonth === todayHijri.month;
            const hasEvent = eventsThisMonth.some((e) => e.day === d);
            return (
              <View
                key={d}
                style={[styles.dayCell, isToday && { backgroundColor: colors.primary }, hasEvent && !isToday && { backgroundColor: colors.gold + '22' }]}
              >
                <Text style={[styles.dayNum, { color: isToday ? '#fff' : hasEvent ? colors.gold : colors.foreground }]}>{d}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Events */}
      {eventsThisMonth.length > 0 && (
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={[styles.eventsTitle, { color: colors.foreground }]}>
            {isRTL ? 'مناسبات الشهر' : "This Month's Events"}
          </Text>
          {eventsThisMonth.map((e) => (
            <View key={e.day + e.nameEn} style={[styles.eventRow, { backgroundColor: colors.card, borderLeftColor: colors.gold }]}>
              <View style={[styles.eventDay, { backgroundColor: colors.gold }]}>
                <Text style={styles.eventDayNum}>{e.day}</Text>
              </View>
              <Text style={[styles.eventName, { color: colors.foreground }]}>
                {isRTL ? e.nameAr : e.nameEn}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* All Islamic Events */}
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <Text style={[styles.eventsTitle, { color: colors.foreground }]}>
          {isRTL ? 'المناسبات الإسلامية' : 'Islamic Occasions'}
        </Text>
        {ISLAMIC_EVENTS.map((e) => (
          <View key={e.day + e.nameEn + e.month} style={[styles.allEventRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <Text style={[styles.allEventMonth, { color: colors.primary }]}>
              {isRTL ? HIJRI_MONTHS_AR[e.month - 1] : HIJRI_MONTHS_EN[e.month - 1]} {e.day}
            </Text>
            <Text style={[styles.allEventName, { color: colors.foreground }]}>
              {isRTL ? e.nameAr : e.nameEn}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 24 },
  backBtn: { padding: 8, marginBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 16, color: '#C9A84C', marginTop: 4, fontFamily: 'Inter_600SemiBold' },
  headerGregorian: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4, fontFamily: 'Inter_400Regular' },
  monthScroll: { paddingHorizontal: 12, paddingVertical: 12 },
  monthChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  monthChipText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  monthCard: { margin: 16, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  monthName: { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  daysText: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2, marginBottom: 12 },
  ramadanBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 12 },
  ramadanText: { color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dayCell: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  dayNum: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  eventsTitle: { fontSize: 17, fontWeight: '600', fontFamily: 'Inter_600SemiBold', marginBottom: 10 },
  eventRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderLeftWidth: 3, padding: 12, marginBottom: 8, gap: 12 },
  eventDay: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  eventDayNum: { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  eventName: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  allEventRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  allEventMonth: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  allEventName: { fontSize: 14, fontFamily: 'Inter_500Medium', textAlign: 'right' },
});
