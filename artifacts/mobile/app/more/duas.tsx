import React, { useState } from 'react';
import {
  FlatList, SectionList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';
import { DUA_CATEGORIES, Dua } from '@/constants/duasData';

export default function DuasScreen() {
  const colors = useColors();
  const { isRTL } = useTranslation();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState<string | null>(null);

  const sections = DUA_CATEGORIES.map((cat) => ({
    title: isRTL ? cat.nameAr : cat.nameEn,
    data: cat.duas,
    icon: cat.icon,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {isRTL ? 'الأدعية' : 'Duas'}
        </Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80 }}
        renderSectionHeader={({ section }) => (
          <View style={[styles.sectionHeader, { backgroundColor: colors.secondary }]}>
            <Feather name={section.icon as any} size={16} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }: { item: Dua }) => {
          const isOpen = expanded === item.id;
          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setExpanded(isOpen ? null : item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.duaArabic, { color: colors.foreground }]} numberOfLines={isOpen ? undefined : 2}>
                    {item.arabic}
                  </Text>
                </View>
                <Feather name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.mutedForeground} />
              </View>
              {isOpen && (
                <>
                  <Text style={[styles.transliteration, { color: colors.primary }]}>{item.transliteration}</Text>
                  <Text style={[styles.translation, { color: colors.mutedForeground }]}>{item.translation}</Text>
                  <Text style={[styles.reference, { color: colors.gold, borderTopColor: colors.border }]}>{item.reference}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth, gap: 8 },
  backBtn: { padding: 8 },
  title: { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginBottom: 8, marginTop: 8 },
  sectionTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  card: { borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 8 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  duaArabic: { fontSize: 18, fontWeight: '600', lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' },
  transliteration: { fontSize: 13, fontFamily: 'Inter_400Regular', fontStyle: 'italic', marginTop: 10, lineHeight: 20 },
  translation: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22, marginTop: 8 },
  reference: { fontSize: 12, fontFamily: 'Inter_600SemiBold', marginTop: 10, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth },
});
