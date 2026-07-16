import React, { useState } from 'react';
import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';
import { ADHKAR_CATEGORIES, Dhikr } from '@/constants/adhkarData';
let Haptics: any = null;
try { Haptics = require('expo-haptics'); } catch {}

export default function AdhkarCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const cat = ADHKAR_CATEGORIES.find((c) => c.id === category);
  const colors = useColors();
  const { isRTL } = useTranslation();
  const insets = useSafeAreaInsets();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  if (!cat) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.foreground }}>Category not found</Text>
      </View>
    );
  }

  const handleCount = (dhikr: Dhikr) => {
    try { Haptics?.impactAsync(Haptics.ImpactFeedbackStyle?.Light); } catch {}
    setCounts((prev) => {
      const current = (prev[dhikr.id] ?? 0) + 1;
      if (current >= dhikr.count && !completed.has(dhikr.id)) {
        setCompleted((c) => new Set([...c, dhikr.id]));
        try { Haptics?.notificationAsync(Haptics.NotificationFeedbackType?.Success); } catch {}
      }
      return { ...prev, [dhikr.id]: current };
    });
  };

  const resetAll = () => {
    setCounts({});
    setCompleted(new Set());
  };

  const completedCount = completed.size;
  const totalCount = cat.items.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: cat.color }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.headerTitle}>{isRTL ? cat.nameAr : cat.nameEn}</Text>
          </View>
          <TouchableOpacity onPress={resetAll} style={styles.backBtn}>
            <Feather name="rotate-ccw" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Progress */}
        <View style={styles.progressOuter}>
          <View style={[styles.progressInner, { width: `${progress * 100}%`, backgroundColor: 'rgba(255,255,255,0.9)' }]} />
        </View>
        <Text style={styles.progressText}>
          {completedCount}/{totalCount} {isRTL ? 'مكتمل' : 'completed'}
        </Text>
      </View>

      <FlatList
        data={cat.items}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80 }}
        renderItem={({ item }) => {
          const count = counts[item.id] ?? 0;
          const isDone = completed.has(item.id);
          return (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: isDone ? cat.color : colors.border }]}>
              {isDone && (
                <View style={[styles.completedBanner, { backgroundColor: cat.color }]}>
                  <Feather name="check-circle" size={14} color="#fff" />
                  <Text style={styles.completedBannerText}>{isRTL ? 'مكتمل' : 'Completed'}</Text>
                </View>
              )}
              <Text style={[styles.arabic, { color: colors.foreground }]}>{item.arabic}</Text>
              <Text style={[styles.transliteration, { color: colors.primary }]}>{item.transliteration}</Text>
              <Text style={[styles.translation, { color: colors.mutedForeground }]}>{item.translation}</Text>
              <Text style={[styles.reference, { color: colors.mutedForeground, borderTopColor: colors.border }]}>
                {item.reference}
              </Text>
              <View style={styles.countRow}>
                <Text style={[styles.countTarget, { color: colors.mutedForeground }]}>
                  {isRTL ? `${item.count}× مرة` : `${item.count}×`}
                </Text>
                <TouchableOpacity
                  style={[styles.countBtn, { backgroundColor: isDone ? cat.color + '22' : cat.color }]}
                  onPress={() => handleCount(item)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.countNum, { color: isDone ? cat.color : '#fff' }]}>{count}</Text>
                  <Text style={[styles.countBtnLabel, { color: isDone ? cat.color : '#fff' }]}>
                    {isDone ? (isRTL ? '✓' : '✓') : (isRTL ? 'اضغط' : 'Tap')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingBottom: 12 },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  progressOuter: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' },
  progressInner: { height: '100%', borderRadius: 2 },
  progressText: { fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 6, fontFamily: 'Inter_400Regular' },
  card: { borderWidth: 1.5, borderRadius: 16, padding: 16, marginBottom: 12, overflow: 'hidden' },
  completedBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, marginHorizontal: -16, marginTop: -16, marginBottom: 12, paddingHorizontal: 16 },
  completedBannerText: { color: '#fff', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  arabic: { fontSize: 22, fontWeight: '600', lineHeight: 42, textAlign: 'right', writingDirection: 'rtl', marginBottom: 10 },
  transliteration: { fontSize: 13, fontFamily: 'Inter_500Medium', fontStyle: 'italic', marginBottom: 6 },
  translation: { fontSize: 14, lineHeight: 22, fontFamily: 'Inter_400Regular', marginBottom: 10 },
  reference: { fontSize: 12, fontFamily: 'Inter_400Regular', paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, marginBottom: 12 },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  countTarget: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  countBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12, alignItems: 'center', flexDirection: 'row', gap: 8 },
  countNum: { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  countBtnLabel: { fontSize: 13, fontFamily: 'Inter_500Medium' },
});
