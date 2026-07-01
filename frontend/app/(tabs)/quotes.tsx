import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { AppTheme } from '@/constants/theme';
import { CATEGORIES, QuoteCategory, searchQuotes, Quote } from '@/constants/quotes';

export default function QuotesScreen() {
  const { theme, favorites, toggleFavorite } = useAppContext();
  const [query, setQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<QuoteCategory[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const styles = getStyles(theme);

  const results = useMemo(() => {
    const base = searchQuotes(query, activeCategories.length ? activeCategories : undefined);
    return favoritesOnly ? base.filter((q) => favorites.includes(q.id)) : base;
  }, [query, activeCategories, favoritesOnly, favorites]);

  const toggleCategoryFilter = (cat: QuoteCategory) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleShare = async (quote: Quote) => {
    try {
      await Share.share({ message: `"${quote.text}" — Digital Wellbeing` });
    } catch (error) {
      console.log('Share error', error);
    }
  };

  const renderItem = ({ item }: { item: Quote }) => {
    const isFav = favorites.includes(item.id);
    const meta = CATEGORIES.find((c) => c.key === item.category);
    return (
      <View style={styles.quoteCard}>
        <View style={[styles.categoryDot, { backgroundColor: meta?.color ?? theme.primary }]} />
        <Text style={styles.quoteText}>{item.text}</Text>
        <View style={styles.quoteActions}>
          <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.iconButton}>
            <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={20} color={isFav ? '#FF6B6B' : theme.subtext} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleShare(item)} style={styles.iconButton}>
            <Ionicons name="share-outline" size={20} color={theme.subtext} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quote Library</Text>
        <Text style={styles.subtitle}>{results.length} quotes</Text>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={theme.subtext} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search quotes..."
          placeholderTextColor={theme.subtext}
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity onPress={() => setFavoritesOnly((v) => !v)}>
          <Ionicons
            name={favoritesOnly ? 'heart' : 'heart-outline'}
            size={22}
            color={favoritesOnly ? '#FF6B6B' : theme.subtext}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORIES}
        keyExtractor={(c) => c.key}
        style={styles.categoryList}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
        renderItem={({ item: cat }) => {
          const active = activeCategories.includes(cat.key);
          return (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                { borderColor: cat.color },
                active && { backgroundColor: cat.color },
              ]}
              onPress={() => toggleCategoryFilter(cat.key)}
            >
              <Ionicons name={cat.icon as any} size={14} color={active ? '#fff' : cat.color} />
              <Text style={[styles.categoryChipText, { color: active ? '#fff' : cat.color }]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color={theme.subtext} />
            <Text style={styles.emptyText}>No quotes match your filters.</Text>
          </View>
        }
      />
    </View>
  );
}

function getStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, paddingTop: 60 },
    header: { paddingHorizontal: 20, marginBottom: 12 },
    title: { fontSize: 26, fontWeight: 'bold', color: theme.text },
    subtitle: { fontSize: 14, color: theme.subtext, marginTop: 2 },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      marginHorizontal: 20,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 8,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchInput: { flex: 1, color: theme.text, fontSize: 15 },
    categoryList: { flexGrow: 0, marginBottom: 12 },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      borderWidth: 1.5,
      backgroundColor: theme.chipBackground,
    },
    categoryChipText: { fontSize: 13, fontWeight: '600' },
    listContent: { paddingHorizontal: 20, paddingBottom: 40 },
    quoteCard: {
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    categoryDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
    quoteText: { flex: 1, fontSize: 15, color: theme.text, lineHeight: 21 },
    quoteActions: { flexDirection: 'column', gap: 6 },
    iconButton: { padding: 2 },
    emptyState: { alignItems: 'center', marginTop: 60, gap: 12 },
    emptyText: { color: theme.subtext, fontSize: 14 },
  });
}
