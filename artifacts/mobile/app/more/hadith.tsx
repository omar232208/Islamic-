import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';
import { useApp } from '@/context/AppContext';
import { NAWAWI_40, Hadith } from '@/constants/hadithData';

export default function HadithScreen() {
  const colors = useColors();
  const { isRTL } = useTranslation();
  const { favoriteHadiths, toggleFavoriteHadith } = useApp();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {isRTL ? 'الأربعون النووية' : '40 Hadith — Imam Nawawi'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {NAWAWI_40.length} {isRTL ? 'حديث' : 'hadiths'}
          </Text>
        </View>
      </View>

      <FlatList
        data={NAWAWI_40}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80 }}
        renderItem={({ item }: { item: Hadith }) => {
          const isOpen = expanded === item.id;
          const isFav = favoriteHadiths.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setExpanded(isOpen ? null : item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.numBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.numText}>{item.id}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.narrator, { color: colors.foreground }]}>
                    {isRTL ? `عن ${item.narrator}` : `Narrated by ${item.narrator}`}
                  </Text>
                  <Text style={[styles.source, { color: colors.mutedForeground }]}>{item.source}</Text>
                </View>
                <TouchableOpacity onPress={() => toggleFavoriteHadith(item.id)} style={{ padding: 4 }}>
                  <Feather name="bookmark" size={16} color={isFav ? colors.accent : colors.mutedForeground} />
                </TouchableOpacity>
                <Feather name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.mutedForeground} style={{ marginLeft: 4 }} />
              </View>
              {item.category && (
                <View style={[styles.catBadge, { backgroundColor: colors.primary + '18' }]}>
                  <Text style={[styles.catText, { color: colors.primary }]}>{item.category}</Text>
                </View>
              )}
              {isOpen && (
                <View style={[styles.expandedContent, { borderTopColor: colors.border }]}>
                  <Text style={[styles.arabicText, { color: colors.foreground }]}>{item.arabic}</Text>
                  <Text style={[styles.englishText, { color: colors.mutedForeground }]}>{item.english}</Text>
                </View>
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
  title: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  card: { borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  numBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  numText: { color: '#fff', fontSize: 13, fontFamily: 'Inter_700Bold' },
  narrator: { fontSize: 14, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  source: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  catBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 8 },
  catText: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  expandedContent: { marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, gap: 10 },
  arabicText: { fontSize: 18, fontWeight: '600', lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' },
  englishText: { fontSize: 14, lineHeight: 22, fontFamily: 'Inter_400Regular', fontStyle: 'italic' },
});
