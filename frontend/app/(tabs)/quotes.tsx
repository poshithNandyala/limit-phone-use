import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Share,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { AppTheme } from '@/constants/theme';
import { CATEGORIES, QuoteCategory, searchQuotes, Quote } from '@/constants/quotes';

export default function QuotesScreen() {
  const { theme, favorites, toggleFavorite, customQuotes, addCustomQuote, deleteCustomQuote } =
    useAppContext();
  const [query, setQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<QuoteCategory[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<QuoteCategory>('other');

  const styles = getStyles(theme);

  const results = useMemo(() => {
    const base = searchQuotes(query, activeCategories.length ? activeCategories : undefined, customQuotes);
    return favoritesOnly ? base.filter((q) => favorites.includes(q.id)) : base;
  }, [query, activeCategories, favoritesOnly, favorites, customQuotes]);

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

  const handleSaveQuote = () => {
    if (!newText.trim()) return;
    addCustomQuote(newText, newCategory);
    setNewText('');
    setNewCategory('other');
    setAddModalVisible(false);
  };

  const handleDeleteCustom = (quote: Quote) => {
    Alert.alert('Delete Quote', 'Remove this quote you added?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCustomQuote(quote.id) },
    ]);
  };

  const renderItem = ({ item }: { item: Quote }) => {
    const isFav = favorites.includes(item.id);
    const meta = CATEGORIES.find((c) => c.key === item.category);
    return (
      <View style={styles.quoteCard}>
        <View style={[styles.categoryDot, { backgroundColor: meta?.color ?? theme.primary }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.quoteText}>{item.text}</Text>
          {item.custom && <Text style={styles.customBadge}>Added by you · {meta?.label}</Text>}
        </View>
        <View style={styles.quoteActions}>
          <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.iconButton}>
            <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={20} color={isFav ? '#FF6B6B' : theme.subtext} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleShare(item)} style={styles.iconButton}>
            <Ionicons name="share-outline" size={20} color={theme.subtext} />
          </TouchableOpacity>
          {item.custom && (
            <TouchableOpacity onPress={() => handleDeleteCustom(item)} style={styles.iconButton}>
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Quote Library</Text>
          <Text style={styles.subtitle}>{results.length} quotes</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
          <Ionicons name="add" size={22} color="#ffffff" />
        </TouchableOpacity>
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

      <View style={styles.categoryWrap}>
        {CATEGORIES.map((cat) => {
          const active = activeCategories.includes(cat.key);
          return (
            <TouchableOpacity
              key={cat.key}
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
        })}
      </View>

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

      <Modal visible={addModalVisible} animationType="slide" transparent onRequestClose={() => setAddModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Your Own Quote</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Write a reminder that works for you..."
              placeholderTextColor={theme.subtext}
              value={newText}
              onChangeText={setNewText}
              multiline
              maxLength={200}
            />
            <Text style={styles.modalLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {CATEGORIES.map((cat) => {
                const active = newCategory === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.categoryChip,
                      { borderColor: cat.color },
                      active && { backgroundColor: cat.color },
                    ]}
                    onPress={() => setNewCategory(cat.key)}
                  >
                    <Text style={[styles.categoryChipText, { color: active ? '#fff' : cat.color }]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <Text style={styles.hintText}>
              Not sure which category fits? Use "Other" — it's there for exactly that.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonGhost]}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.subtext }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                onPress={handleSaveQuote}
              >
                <Text style={[styles.modalButtonText, { color: '#ffffff' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, paddingTop: 60 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
    title: { fontSize: 26, fontWeight: 'bold', color: theme.text },
    subtitle: { fontSize: 14, color: theme.subtext, marginTop: 2 },
    addButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
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
    categoryWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      paddingHorizontal: 20,
      marginBottom: 12,
    },
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
    quoteText: { fontSize: 15, color: theme.text, lineHeight: 21 },
    customBadge: { fontSize: 11, color: theme.subtext, marginTop: 4, fontStyle: 'italic' },
    quoteActions: { flexDirection: 'column', gap: 6 },
    iconButton: { padding: 2 },
    emptyState: { alignItems: 'center', marginTop: 60, gap: 12 },
    emptyText: { color: theme.subtext, fontSize: 14 },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalCard: {
      backgroundColor: theme.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      paddingBottom: 32,
      gap: 10,
    },
    modalTitle: { fontSize: 18, fontWeight: '700', color: theme.text, marginBottom: 4 },
    modalInput: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 12,
      minHeight: 80,
      color: theme.text,
      fontSize: 15,
      textAlignVertical: 'top',
    },
    modalLabel: { fontSize: 13, fontWeight: '600', color: theme.text, marginTop: 4 },
    hintText: { fontSize: 12, color: theme.subtext },
    modalActions: { flexDirection: 'row', gap: 10, marginTop: 10 },
    modalButton: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
    modalButtonGhost: { borderWidth: 1, borderColor: theme.border },
    modalButtonText: { fontSize: 15, fontWeight: '600' },
  });
}
