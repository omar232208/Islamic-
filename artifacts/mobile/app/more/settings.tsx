import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';
import { useApp } from '@/context/AppContext';

const PRAYER_METHODS = [
  { id: 1, name: 'Muslim World League', nameAr: 'رابطة العالم الإسلامي' },
  { id: 2, name: 'Islamic Society of North America', nameAr: 'جمعية إسلامية لأمريكا الشمالية' },
  { id: 3, name: 'Egyptian General Authority', nameAr: 'الهيئة المصرية العامة' },
  { id: 4, name: 'Umm Al-Qura University (Makkah)', nameAr: 'جامعة أم القرى' },
  { id: 5, name: 'University of Islamic Sciences, Karachi', nameAr: 'جامعة العلوم الإسلامية كراتشي' },
];

export default function SettingsScreen() {
  const colors = useColors();
  const { isRTL } = useTranslation();
  const insets = useSafeAreaInsets();
  const { language, theme, prayerMethod, setLanguage, setTheme, setPrayerMethod } = useApp();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {isRTL ? 'الإعدادات' : 'Settings'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80 }} showsVerticalScrollIndicator={false}>
        {/* Language */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{isRTL ? 'اللغة' : 'LANGUAGE'}</Text>
        <View style={[styles.group, { backgroundColor: colors.card }]}>
          {(['en', 'ar'] as const).map((lang, idx) => (
            <TouchableOpacity
              key={lang}
              style={[styles.row, idx === 0 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}
              onPress={() => setLanguage(lang)}
            >
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>
                {lang === 'en' ? '🇬🇧 English' : '🇸🇦 العربية'}
              </Text>
              {language === lang && <Feather name="check" size={18} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Theme */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{isRTL ? 'المظهر' : 'THEME'}</Text>
        <View style={[styles.group, { backgroundColor: colors.card }]}>
          {[
            { id: 'light', labelEn: '☀️ Light', labelAr: '☀️ فاتح' },
            { id: 'dark', labelEn: '🌙 Dark', labelAr: '🌙 داكن' },
            { id: 'auto', labelEn: '⚙️ Auto (System)', labelAr: '⚙️ تلقائي' },
          ].map((t, idx, arr) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.row, idx < arr.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}
              onPress={() => setTheme(t.id as any)}
            >
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>
                {isRTL ? t.labelAr : t.labelEn}
              </Text>
              {theme === t.id && <Feather name="check" size={18} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Prayer Method */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          {isRTL ? 'طريقة حساب الصلاة' : 'PRAYER CALCULATION METHOD'}
        </Text>
        <View style={[styles.group, { backgroundColor: colors.card }]}>
          {PRAYER_METHODS.map((m, idx) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.row, idx < PRAYER_METHODS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}
              onPress={() => setPrayerMethod(m.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowLabel, { color: colors.foreground }]}>
                  {isRTL ? m.nameAr : m.name}
                </Text>
              </View>
              {prayerMethod === m.id && <Feather name="check" size={18} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* About */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{isRTL ? 'حول التطبيق' : 'ABOUT'}</Text>
        <View style={[styles.group, { backgroundColor: colors.card }]}>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.foreground }]}>{isRTL ? 'الإصدار' : 'Version'}</Text>
            <Text style={[styles.rowValue, { color: colors.mutedForeground }]}>1.0.0</Text>
          </View>
          <View style={[styles.row, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}>
            <Text style={[styles.rowLabel, { color: colors.foreground }]}>
              {isRTL ? 'مصادر البيانات' : 'Data Sources'}
            </Text>
            <Text style={[styles.rowValue, { color: colors.mutedForeground }]}>Aladhan API, AlQuran.cloud</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth, gap: 8 },
  backBtn: { padding: 8 },
  title: { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  sectionLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.8, marginTop: 20, marginBottom: 6, marginLeft: 4 },
  group: { borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  rowLabel: { fontSize: 16, fontFamily: 'Inter_400Regular' },
  rowValue: { fontSize: 14, fontFamily: 'Inter_400Regular' },
});
