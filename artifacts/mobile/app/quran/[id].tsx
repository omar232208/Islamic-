import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator, FlatList, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';
import { useApp } from '@/context/AppContext';
import { SURAHS } from '@/constants/quranData';

interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
}

interface SurahData {
  arabicAyahs: Ayah[];
  englishAyahs: Ayah[];
}

const BISMILLAH = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

export default function SurahReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const surahNumber = Number(id);
  const surah = SURAHS.find((s) => s.number === surahNumber);

  const colors = useColors();
  const { isRTL } = useTranslation();
  const { updateReadingProgress, lastReadVerse, favoriteSurahs, toggleFavoriteSurah } = useApp();
  const insets = useSafeAreaInsets();

  const [data, setData] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(22);
  const isFav = favoriteSurahs.includes(surahNumber);

  useEffect(() => {
    if (surahNumber > 0 && surahNumber <= 114) fetchSurah();
  }, [surahNumber]);

  async function fetchSurah() {
    try {
      setLoading(true);
      setError(null);

      const cacheKey = `surah_v2_${surahNumber}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) { setData(JSON.parse(cached)); setLoading(false); return; }

      const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih`;
      const resp = await fetch(url);
      const json = await resp.json();

      if (json.code === 200 && Array.isArray(json.data) && json.data.length === 2) {
        const surahData: SurahData = {
          arabicAyahs: json.data[0].ayahs,
          englishAyahs: json.data[1].ayahs,
        };
        await AsyncStorage.setItem(cacheKey, JSON.stringify(surahData));
        setData(surahData);
      } else {
        setError('Could not load surah. Please check your internet connection.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const lastVisible = viewableItems[viewableItems.length - 1];
      if (lastVisible?.item?.numberInSurah) {
        updateReadingProgress(surahNumber, lastVisible.item.numberInSurah);
      }
    }
  }, [surahNumber]);

  if (!surah) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.foreground }}>Surah not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Navigation header */}
      <View style={[styles.navBar, { paddingTop: insets.top + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={[styles.surahName, { color: colors.foreground }]}>
            {isRTL ? surah.name : surah.englishName}
          </Text>
          <Text style={[styles.surahMeta, { color: colors.mutedForeground }]}>
            {surah.numberOfAyahs} {isRTL ? 'آية' : 'verses'} · {isRTL ? (surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية') : surah.revelationType}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setFontSize((f) => Math.min(f + 2, 34))} style={styles.iconBtn}>
            <Feather name="plus" size={18} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFontSize((f) => Math.max(f - 2, 16))} style={styles.iconBtn}>
            <Feather name="minus" size={18} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavoriteSurah(surahNumber)} style={styles.iconBtn}>
            <Feather name="bookmark" size={18} color={isFav ? colors.accent : colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            {isRTL ? 'جارٍ التحميل...' : 'Loading surah...'}
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Feather name="wifi-off" size={40} color={colors.mutedForeground} />
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.primary }]} onPress={fetchSurah}>
            <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold' }}>
              {isRTL ? 'إعادة المحاولة' : 'Retry'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : data ? (
        <FlatList
          data={data.arabicAyahs}
          keyExtractor={(item) => String(item.numberInSurah)}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ minimumViewTime: 300, itemVisiblePercentThreshold: 60 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 80, paddingHorizontal: 16 }}
          initialScrollIndex={lastReadVerse > 1 && lastReadVerse <= surah.numberOfAyahs ? lastReadVerse - 1 : 0}
          getItemLayout={(_, index) => ({ length: 160, offset: 160 * index, index })}
          ListHeaderComponent={() => (
            <View style={[styles.bismillahBox, { borderColor: colors.border }]}>
              <Text style={[styles.bismillah, { color: colors.primary }]}>{BISMILLAH}</Text>
            </View>
          )}
          renderItem={({ item }) => {
            const english = data.englishAyahs[item.numberInSurah - 1];
            return (
              <View style={[styles.ayahCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.ayahNumBadge, { backgroundColor: colors.primary + '18' }]}>
                  <Text style={[styles.ayahNum, { color: colors.primary }]}>{item.numberInSurah}</Text>
                </View>
                <Text style={[styles.arabicAyah, { color: colors.foreground, fontSize }]}>{item.text}</Text>
                {english && (
                  <Text style={[styles.englishAyah, { color: colors.mutedForeground, borderTopColor: colors.border }]}>
                    {english.text}
                  </Text>
                )}
              </View>
            );
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  backBtn: { padding: 8 },
  surahName: { fontSize: 17, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  surahMeta: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  headerActions: { flexDirection: 'row', gap: 4 },
  iconBtn: { padding: 8 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 24 },
  loadingText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  errorText: { fontSize: 15, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  bismillahBox: { borderWidth: 1, borderRadius: 14, padding: 20, marginVertical: 16, alignItems: 'center' },
  bismillah: { fontSize: 26, fontWeight: '600', textAlign: 'center' },
  ayahCard: { borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 12 },
  ayahNumBadge: { alignSelf: 'flex-end', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  ayahNum: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  arabicAyah: { fontWeight: '500', lineHeight: 46, textAlign: 'right', writingDirection: 'rtl' },
  englishAyah: { fontSize: 14, lineHeight: 22, fontFamily: 'Inter_400Regular', fontStyle: 'italic', marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
});
