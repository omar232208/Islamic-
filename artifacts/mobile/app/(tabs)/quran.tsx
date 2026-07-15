import React, { useState, useMemo } from 'react';
import {
  FlatList, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';
import { useApp } from '@/context/AppContext';
import { SURAHS, Surah } from '@/constants/quranData';

export default function QuranScreen() {
  const colors = useColors();
  const { isRTL } = useTranslation();
  const { lastReadSurah, lastReadVerse, favoriteSurahs } = useApp();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return SURAHS;
    const q = query.toLowerCase();
    return SURAHS.filter(
      (s) =>
        s.name.includes(query) ||
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        String(s.number).includes(q)
    );
  }, [query]);

  const lastSurah = lastReadSurah > 0 ? SURAHS.find((s) => s.number === lastReadSurah) : null;

  const renderItem = ({ item }: { item: Surah }) => {
    const isFav = favoriteSurahs.includes(item.number);
    return (
      <TouchableOpacity
        style={[styles.row, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
        onPress={() => router.push(`/quran/${item.number}` as any)}
        activeOpacity={0.7}
      >
        <View style={[styles.numberBadge, { backgroundColor: colors.primary + '18' }]}>
          <Text style={[styles.number, { color: colors.primary }]}>{item.number}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.englishName, { color: colors.foreground }]}>{item.englishName}</Text>
          <View style={styles.metaRow}>
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>
              {item.numberOfAyahs} {isRTL ? 'آية' : 'verses'}
            </Text>
            <View style={[styles.badge, { backgroundColor: item.revelationType === 'Meccan' ? colors.gold + '22' : colors.primary + '18' }]}>
              <Text style={[styles.badgeText, { color: item.revelationType === 'Meccan' ? colors.gold : colors.primary }]}>
                {isRTL ? (item.revelationType === 'Meccan' ? 'مكية' : 'مدنية') : item.revelationType}
              </Text>
            </View>
          </View>
        </View>
        <Text style={[styles.arabicName, { color: colors.foreground }]}>{item.name}</Text>
        {isFav && <Feather name="bookmark" size={14} color={colors.accent} style={{ marginLeft: 6 }} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {isRTL ? 'القرآن الكريم' : 'The Holy Quran'}
        </Text>
        <View style={[styles.searchBar, { backgroundColor: colors.input, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder={isRTL ? 'ابحث عن سورة...' : 'Search surah...'}
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Last Read Banner */}
      {lastSurah && !query ? (
        <TouchableOpacity
          style={[styles.lastReadBanner, { backgroundColor: colors.primary }]}
          onPress={() => router.push(`/quran/${lastSurah.number}` as any)}
        >
          <Feather name="bookmark" size={16} color="#fff" />
          <Text style={styles.lastReadText}>
            {isRTL ? 'متابعة: ' : 'Continue: '}
            {isRTL ? lastSurah.name : lastSurah.englishName}
            {lastReadVerse > 0 ? ` (${isRTL ? 'آية' : 'Verse'} ${lastReadVerse})` : ''}
          </Text>
          <Feather name="chevron-right" size={16} color="#fff" />
        </TouchableOpacity>
      ) : null}

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.number)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        initialNumToRender={25}
        maxToRenderPerBatch={20}
        getItemLayout={(_, index) => ({ length: 72, offset: 72 * index, index })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontSize: 22, fontWeight: '700', fontFamily: 'Inter_700Bold', marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular', padding: 0 },
  lastReadBanner: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 8,
  },
  lastReadText: { flex: 1, color: '#fff', fontSize: 14, fontFamily: 'Inter_500Medium' },
  row: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth, gap: 12, height: 72,
  },
  numberBadge: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  number: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  englishName: { fontSize: 16, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  meta: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  arabicName: { fontSize: 18, fontWeight: '600' },
});
