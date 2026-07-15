import React, { useState } from 'react';
import {
  Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View, Vibration,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';
import { useApp } from '@/context/AppContext';
import { ADHKAR_CATEGORIES, TASBIH_PRESETS } from '@/constants/adhkarData';
import * as Haptics from 'expo-haptics';

export default function AdhkarScreen() {
  const colors = useColors();
  const { isRTL } = useTranslation();
  const { tasbeehCurrent, incrementTasbeeh, resetTasbeeh } = useApp();
  const insets = useSafeAreaInsets();
  const [selectedPreset, setSelectedPreset] = useState(0);
  const preset = TASBIH_PRESETS[selectedPreset];

  const handleTasbeeh = () => {
    incrementTasbeeh();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const progressPct = preset.target > 0 ? Math.min((tasbeehCurrent % preset.target) / preset.target, 1) : 0;
  const completed = preset.target > 0 && tasbeehCurrent > 0 && tasbeehCurrent % preset.target === 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
    >
      {/* Header */}
      <LinearGradient
        colors={['#5B21B6', '#4338CA']}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <Text style={styles.headerTitle}>{isRTL ? 'الأذكار والتسبيح' : 'Adhkar & Tasbeeh'}</Text>
        <Text style={styles.headerSub}>{isRTL ? 'ذكر الله يطمئن القلوب' : "In Allah's remembrance do hearts find rest"}</Text>
      </LinearGradient>

      {/* Tasbeeh Counter */}
      <View style={[styles.tasbeehCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.tasbeehTitle, { color: colors.foreground }]}>
          {isRTL ? 'عداد التسبيح' : 'Tasbeeh Counter'}
        </Text>

        {/* Preset selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {TASBIH_PRESETS.map((p, i) => (
            <TouchableOpacity
              key={p.transliteration}
              style={[styles.presetChip, { backgroundColor: i === selectedPreset ? colors.primary : colors.secondary }]}
              onPress={() => setSelectedPreset(i)}
            >
              <Text style={[styles.presetLabel, { color: i === selectedPreset ? '#fff' : colors.foreground }]}>
                {p.label}
              </Text>
              <Text style={[styles.presetTarget, { color: i === selectedPreset ? 'rgba(255,255,255,0.8)' : colors.mutedForeground }]}>
                /{p.target}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Progress ring display */}
        <View style={styles.counterCenter}>
          <View style={[styles.counterRing, { borderColor: completed ? colors.gold : colors.primary }]}>
            <TouchableOpacity style={styles.counterBtn} onPress={handleTasbeeh} activeOpacity={0.7}>
              <Text style={[styles.counterNum, { color: colors.foreground }]}>
                {tasbeehCurrent % (preset.target || 1) || (completed ? preset.target : 0)}
              </Text>
              <Text style={[styles.counterTarget, { color: colors.mutedForeground }]}>/ {preset.target}</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.presetArabic, { color: colors.foreground }]}>{preset.label}</Text>
          <Text style={[styles.presetTrans, { color: colors.mutedForeground }]}>{preset.transliteration}</Text>
          {completed && (
            <View style={[styles.completedBadge, { backgroundColor: colors.gold }]}>
              <Feather name="check-circle" size={14} color="#fff" />
              <Text style={styles.completedText}>{isRTL ? 'اكتمل!' : 'Complete!'}</Text>
            </View>
          )}
        </View>

        <View style={styles.counterActions}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.destructive + '18' }]} onPress={resetTasbeeh}>
            <Feather name="rotate-ccw" size={18} color={colors.destructive} />
            <Text style={[styles.actionText, { color: colors.destructive }]}>{isRTL ? 'إعادة' : 'Reset'}</Text>
          </TouchableOpacity>
          <View style={[styles.totalBox, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.totalLabel, { color: colors.mutedForeground }]}>{isRTL ? 'المجموع' : 'Total'}</Text>
            <Text style={[styles.totalNum, { color: colors.primary }]}>{tasbeehCurrent}</Text>
          </View>
        </View>
      </View>

      {/* Adhkar Categories */}
      <Text style={[styles.sectionTitle, { color: colors.foreground, paddingHorizontal: 16 }]}>
        {isRTL ? 'أنواع الأذكار' : 'Adhkar Categories'}
      </Text>
      <View style={styles.categoryGrid}>
        {ADHKAR_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.catCard, { backgroundColor: colors.card }]}
            onPress={() => router.push(`/adhkar/${cat.id}` as any)}
            activeOpacity={0.75}
          >
            <View style={[styles.catIcon, { backgroundColor: cat.color + '22' }]}>
              <Feather name={cat.icon as any} size={26} color={cat.color} />
            </View>
            <Text style={[styles.catName, { color: colors.foreground }]}>
              {isRTL ? cat.nameAr : cat.nameEn}
            </Text>
            <Text style={[styles.catCount, { color: colors.mutedForeground }]}>
              {cat.items.length} {isRTL ? 'ذكر' : 'adhkar'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 28 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4, fontFamily: 'Inter_400Regular', fontStyle: 'italic' },
  tasbeehCard: { margin: 16, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  tasbeehTitle: { fontSize: 17, fontWeight: '600', fontFamily: 'Inter_600SemiBold', marginBottom: 12 },
  presetChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, flexDirection: 'row', alignItems: 'center', gap: 2 },
  presetLabel: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  presetTarget: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  counterCenter: { alignItems: 'center', marginVertical: 8 },
  counterRing: { width: 150, height: 150, borderRadius: 75, borderWidth: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  counterBtn: { justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' },
  counterNum: { fontSize: 48, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  counterTarget: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  presetArabic: { fontSize: 20, fontWeight: '600', marginTop: 4 },
  presetTrans: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginTop: 10 },
  completedText: { color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  counterActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  actionText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  totalBox: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  totalLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  totalNum: { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  sectionTitle: { fontSize: 17, fontWeight: '600', fontFamily: 'Inter_600SemiBold', marginBottom: 12, marginTop: 8 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10 },
  catCard: {
    width: '46%', marginHorizontal: '1%', borderRadius: 14, padding: 16, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  catIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  catName: { fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  catCount: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
});
