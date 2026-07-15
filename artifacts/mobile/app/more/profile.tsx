import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';
import { useApp } from '@/context/AppContext';
import { SURAHS } from '@/constants/quranData';

export default function ProfileScreen() {
  const colors = useColors();
  const { isRTL } = useTranslation();
  const insets = useSafeAreaInsets();
  const { readingProgress, dailyPrayerLog, tasbeehTotal, favoriteSurahs } = useApp();

  const surahsRead = Object.keys(readingProgress).length;
  const totalVerses = Object.values(readingProgress).reduce((a, b) => a + b, 0);

  const prayerDaysLogged = Object.keys(dailyPrayerLog).length;
  const totalPrayersLogged = Object.values(dailyPrayerLog).reduce((a, b) => a + b.length, 0);

  const today = new Date().toISOString().split('T')[0];
  const todayPrayers = dailyPrayerLog[today]?.length ?? 0;

  // Streak calculation
  const streak = useMemo(() => {
    let s = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().split('T')[0];
      if (dailyPrayerLog[key]?.length > 0) { s++; d.setDate(d.getDate() - 1); }
      else break;
      if (s > 365) break;
    }
    return s;
  }, [dailyPrayerLog]);

  const stats = [
    { icon: 'book-open', labelEn: 'Surahs Read', labelAr: 'سور مقروءة', value: surahsRead, color: '#2D7A4F' },
    { icon: 'hash', labelEn: 'Verses Read', labelAr: 'آيات مقروءة', value: totalVerses, color: '#6366F1' },
    { icon: 'heart', labelEn: 'Total Tasbeeh', labelAr: 'إجمالي التسبيح', value: tasbeehTotal.toLocaleString(), color: '#EC4899' },
    { icon: 'sun', labelEn: "Today's Prayers", labelAr: 'صلوات اليوم', value: todayPrayers, color: '#F59E0B' },
    { icon: 'activity', labelEn: 'Prayer Days', labelAr: 'أيام الصلاة', value: prayerDaysLogged, color: '#059669' },
    { icon: 'trending-up', labelEn: 'Day Streak', labelAr: 'أيام متتالية', value: streak, color: '#8B5CF6' },
  ];

  const achievements = [
    { id: 'first_read', icon: '📖', labelEn: 'First Read', labelAr: 'أول قراءة', earned: surahsRead > 0 },
    { id: 'al_fatiha', icon: '🌟', labelEn: 'Al-Fatihah', labelAr: 'الفاتحة', earned: readingProgress[1] !== undefined },
    { id: 'al_kahf', icon: '🕌', labelEn: 'Al-Kahf', labelAr: 'الكهف', earned: readingProgress[18] !== undefined },
    { id: 'tasbeeh_100', icon: '📿', labelEn: 'Tasbeeh 100', labelAr: '١٠٠ تسبيحة', earned: tasbeehTotal >= 100 },
    { id: 'tasbeeh_1000', icon: '💎', labelEn: 'Tasbeeh 1000', labelAr: '١٠٠٠ تسبيحة', earned: tasbeehTotal >= 1000 },
    { id: 'week_streak', icon: '🔥', labelEn: '7-Day Streak', labelAr: '٧ أيام متتالية', earned: streak >= 7 },
    { id: 'bookmarked', icon: '🔖', labelEn: '5 Bookmarks', labelAr: '٥ إشارات مرجعية', earned: favoriteSurahs.length >= 5 },
    { id: 'juz30', icon: '✨', labelEn: 'Juz 30 Complete', labelAr: 'جزء عم', earned: readingProgress[78] !== undefined && readingProgress[114] !== undefined },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
      <LinearGradient
        colors={['#1E3A5F', '#0F2040']}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🕌</Text>
        </View>
        <Text style={styles.profileTitle}>{isRTL ? 'ملفك الشخصي' : 'Your Profile'}</Text>
        <Text style={styles.profileSub}>{isRTL ? 'رحلتك الروحية' : 'Your spiritual journey'}</Text>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{isRTL ? 'إحصائياتك' : 'Your Stats'}</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.icon} style={[styles.statCard, { backgroundColor: colors.card }]}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '22' }]}>
                <Feather name={stat.icon as any} size={18} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                {isRTL ? stat.labelAr : stat.labelEn}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Achievements */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{isRTL ? 'الإنجازات' : 'Achievements'}</Text>
        <View style={styles.achieveGrid}>
          {achievements.map((a) => (
            <View
              key={a.id}
              style={[styles.achieveCard, { backgroundColor: a.earned ? colors.card : colors.muted, borderColor: a.earned ? colors.gold : colors.border }]}
            >
              <Text style={[styles.achieveIcon, { opacity: a.earned ? 1 : 0.35 }]}>{a.icon}</Text>
              <Text style={[styles.achieveLabel, { color: a.earned ? colors.foreground : colors.mutedForeground }]}>
                {isRTL ? a.labelAr : a.labelEn}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 28, alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', padding: 8, marginBottom: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 36 },
  profileTitle: { fontSize: 22, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  profileSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4, fontFamily: 'Inter_400Regular' },
  sectionTitle: { fontSize: 17, fontWeight: '600', fontFamily: 'Inter_600SemiBold', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: { width: '30.5%', borderRadius: 14, padding: 14, alignItems: 'center', gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  statIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  achieveGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  achieveCard: { width: '22%', borderRadius: 12, padding: 10, alignItems: 'center', borderWidth: 1.5, gap: 4 },
  achieveIcon: { fontSize: 24 },
  achieveLabel: { fontSize: 10, fontFamily: 'Inter_400Regular', textAlign: 'center' },
});
