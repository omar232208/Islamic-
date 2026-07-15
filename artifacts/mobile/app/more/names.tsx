import React, { useState, useMemo } from 'react';
import {
  FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';
import { NAMES_OF_ALLAH, NameOfAllah } from '@/constants/namesData';

export default function NamesScreen() {
  const colors = useColors();
  const { isRTL } = useTranslation();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!query) return NAMES_OF_ALLAH;
    const q = query.toLowerCase();
    return NAMES_OF_ALLAH.filter(
      (n) =>
        n.arabic.includes(query) ||
        n.transliteration.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {isRTL ? 'أسماء الله الحسنى' : '99 Names of Allah'}
          </Text>
        </View>
      </View>

      <View style={[styles.searchBar, { margin: 12, backgroundColor: colors.input, borderColor: colors.border }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder={isRTL ? 'ابحث...' : 'Search names...'}
          placeholderTextColor={colors.mutedForeground}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.number)}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        contentContainerStyle={{ padding: 8, paddingBottom: insets.bottom + 80 }}
        columnWrapperStyle={{ gap: 8, marginBottom: 8 }}
        renderItem={({ item }: { item: NameOfAllah }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, flex: 1 }]}
            onPress={() => setExpanded(expanded === item.number ? null : item.number)}
            activeOpacity={0.75}
          >
            <View style={[styles.numBadge, { backgroundColor: colors.gold + '22' }]}>
              <Text style={[styles.numText, { color: colors.gold }]}>{item.number}</Text>
            </View>
            <Text style={[styles.arabicName, { color: colors.foreground }]}>{item.arabic}</Text>
            <Text style={[styles.transliteration, { color: colors.primary }]}>{item.transliteration}</Text>
            <Text style={[styles.meaning, { color: colors.mutedForeground }]}>{item.meaning}</Text>
            {expanded === item.number && (
              <Text style={[styles.reference, { color: colors.mutedForeground, borderTopColor: colors.border }]}>
                {item.reference}
              </Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth, gap: 8 },
  backBtn: { padding: 8 },
  title: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular', padding: 0 },
  card: { borderRadius: 14, padding: 14, borderWidth: 1, alignItems: 'center' },
  numBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginBottom: 8 },
  numText: { fontSize: 13, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  arabicName: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  transliteration: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginBottom: 2, textAlign: 'center' },
  meaning: { fontSize: 12, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 18 },
  reference: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 8, paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, textAlign: 'center' },
});
