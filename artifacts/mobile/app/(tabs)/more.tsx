import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';

interface MenuItem {
  id: string;
  labelEn: string;
  labelAr: string;
  descEn: string;
  descAr: string;
  icon: string;
  color: string;
  route: string;
}

const MENU_SECTIONS = [
  {
    titleEn: 'Quran & Hadith',
    titleAr: 'القرآن والحديث',
    items: [
      { id: 'hadith', labelEn: '40 Hadith', labelAr: 'الأربعون النووية', descEn: "Imam Nawawi's 40 Hadith", descAr: 'الأحاديث الأربعون للنووي', icon: 'message-circle', color: '#2D7A4F', route: '/more/hadith' },
      { id: 'duas', labelEn: 'Duas', labelAr: 'الأدعية', descEn: 'Quran & Prophetic Duas', descAr: 'أدعية قرآنية ونبوية', icon: 'wind', color: '#059669', route: '/more/duas' },
    ] as MenuItem[],
  },
  {
    titleEn: 'Islamic Knowledge',
    titleAr: 'المعرفة الإسلامية',
    items: [
      { id: 'names', labelEn: "99 Names of Allah", labelAr: 'أسماء الله الحسنى', descEn: "The Most Beautiful Names", descAr: 'الأسماء الحسنى ومعانيها', icon: 'star', color: '#8B5CF6', route: '/more/names' },
      { id: 'calendar', labelEn: 'Islamic Calendar', labelAr: 'التقويم الهجري', descEn: 'Hijri dates & Islamic months', descAr: 'التواريخ والأشهر الهجرية', icon: 'calendar', color: '#6366F1', route: '/more/calendar' },
    ] as MenuItem[],
  },
  {
    titleEn: 'Occasions',
    titleAr: 'المناسبات',
    items: [
      { id: 'ramadan', labelEn: 'Ramadan', labelAr: 'رمضان', descEn: 'Tracker & Iftar times', descAr: 'متتبع رمضان وأوقات الإفطار', icon: 'moon', color: '#F59E0B', route: '/more/ramadan' },
    ] as MenuItem[],
  },
  {
    titleEn: 'Personal',
    titleAr: 'الشخصية',
    items: [
      { id: 'profile', labelEn: 'Profile', labelAr: 'الملف الشخصي', descEn: 'Progress & achievements', descAr: 'التقدم والإنجازات', icon: 'user', color: '#EC4899', route: '/more/profile' },
      { id: 'settings', labelEn: 'Settings', labelAr: 'الإعدادات', descEn: 'Language, theme & more', descAr: 'اللغة والمظهر وغير ذلك', icon: 'settings', color: '#6B7280', route: '/more/settings' },
    ] as MenuItem[],
  },
];

export default function MoreScreen() {
  const colors = useColors();
  const { isRTL } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
    >
      <LinearGradient
        colors={['#1E3A5F', '#0F2040']}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <Text style={styles.headerTitle}>{isRTL ? 'المزيد' : 'More'}</Text>
        <Text style={styles.headerSub}>{isRTL ? 'استكشف ميزات التطبيق' : 'Explore app features'}</Text>
      </LinearGradient>

      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        {MENU_SECTIONS.map((section) => (
          <View key={section.titleEn} style={{ marginBottom: 20 }}>
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
              {isRTL ? section.titleAr : section.titleEn}
            </Text>
            <View style={[styles.group, { backgroundColor: colors.card }]}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.row,
                    idx < section.items.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
                  ]}
                  onPress={() => router.push(item.route as any)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconBox, { backgroundColor: item.color + '1A' }]}>
                    <Feather name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemLabel, { color: colors.foreground }]}>
                      {isRTL ? item.labelAr : item.labelEn}
                    </Text>
                    <Text style={[styles.itemDesc, { color: colors.mutedForeground }]}>
                      {isRTL ? item.descAr : item.descEn}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4, fontFamily: 'Inter_400Regular' },
  sectionTitle: { fontSize: 12, fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6, marginLeft: 4 },
  group: { borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  iconBox: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  itemLabel: { fontSize: 16, fontFamily: 'Inter_500Medium', fontWeight: '500' },
  itemDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
});
