import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext, Habit } from '@/context/AppContext';
import { AppTheme } from '@/constants/theme';
import { computeStreak, getMilestone, lastNDays } from '@/lib/habitStreak';

const EMOJI_CHOICES = ['🔥', '💪', '🏆', '📚', '💻', '🏃', '🧘', '💧', '🎯', '✅', '🌟', '🎨', '🎵', '🥗', '☀️', '➕'];

export default function HabitsScreen() {
  const { theme, habits, addHabit, deleteHabit, toggleHabitToday } = useAppContext();
  const styles = getStyles(theme);

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJI_CHOICES[0]);

  const handleSave = () => {
    if (!name.trim()) return;
    addHabit(name, emoji);
    setName('');
    setEmoji(EMOJI_CHOICES[0]);
    setModalVisible(false);
  };

  const handleDelete = (habit: Habit) => {
    Alert.alert('Delete Streak', `Remove "${habit.name}"? This can't be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(habit.id) },
    ]);
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const days28 = lastNDays(28);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Streaks</Text>
          <Text style={styles.subtitle}>Track anything, one day at a time</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {habits.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="flame-outline" size={48} color={theme.subtext} />
            <Text style={styles.emptyTitle}>No streaks yet</Text>
            <Text style={styles.emptyText}>
              Track anything you want to build or break - a daily habit, a goal, a habit you're
              quitting. Tap + to start your first streak.
            </Text>
          </View>
        )}

        {habits.map((habit) => {
          const { current, longest } = computeStreak(habit.completedDates);
          const milestone = getMilestone(current);
          const doneToday = habit.completedDates.includes(todayStr);
          const completedSet = new Set(habit.completedDates);

          return (
            <View key={habit.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.habitEmoji}>{habit.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <Text style={styles.habitSub}>
                    Best streak: {longest} day{longest === 1 ? '' : 's'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(habit)} style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={18} color={theme.subtext} />
                </TouchableOpacity>
              </View>

              <View style={styles.streakRow}>
                <Text style={styles.streakCount}>{current}</Text>
                <Text style={styles.streakLabel}>day{current === 1 ? '' : 's'}</Text>
                {milestone && (
                  <View style={styles.milestoneBadge}>
                    <Text style={styles.milestoneEmoji}>{milestone.emoji}</Text>
                    <Text style={styles.milestoneLabel}>{milestone.label}</Text>
                  </View>
                )}
              </View>

              <View style={styles.calendarGrid}>
                {days28.map((date) => (
                  <View
                    key={date}
                    style={[
                      styles.calendarDot,
                      completedSet.has(date) && { backgroundColor: theme.primary },
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[styles.markButton, doneToday && { backgroundColor: theme.primary }]}
                onPress={() => toggleHabitToday(habit.id)}
              >
                <Ionicons
                  name={doneToday ? 'checkmark-circle' : 'checkmark-circle-outline'}
                  size={20}
                  color={doneToday ? '#ffffff' : theme.primary}
                />
                <Text style={[styles.markButtonText, { color: doneToday ? '#ffffff' : theme.primary }]}>
                  {doneToday ? 'Done today' : 'Mark today done'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Streak</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Daily workout, Solve 1 problem, Read 10 pages"
              placeholderTextColor={theme.subtext}
              value={name}
              onChangeText={setName}
              maxLength={60}
            />
            <Text style={styles.modalLabel}>Pick an icon</Text>
            <View style={styles.emojiRow}>
              {EMOJI_CHOICES.map((e) => (
                <TouchableOpacity
                  key={e}
                  style={[styles.emojiChip, emoji === e && { backgroundColor: theme.primary }]}
                  onPress={() => setEmoji(e)}
                >
                  <Text style={styles.emojiChipText}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonGhost]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.subtext }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.primary }]} onPress={handleSave}>
                <Text style={[styles.modalButtonText, { color: '#ffffff' }]}>Start Streak</Text>
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
    content: { paddingHorizontal: 20, paddingBottom: 40 },
    emptyState: { alignItems: 'center', marginTop: 60, gap: 12, paddingHorizontal: 20 },
    emptyTitle: { fontSize: 16, fontWeight: '600', color: theme.text },
    emptyText: { fontSize: 14, color: theme.subtext, textAlign: 'center', lineHeight: 20 },
    card: { backgroundColor: theme.card, borderRadius: 16, padding: 18, marginBottom: 14 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    habitEmoji: { fontSize: 30 },
    habitName: { fontSize: 16, fontWeight: '600', color: theme.text },
    habitSub: { fontSize: 12, color: theme.subtext, marginTop: 2 },
    deleteButton: { padding: 4 },
    streakRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginBottom: 14 },
    streakCount: { fontSize: 34, fontWeight: 'bold', color: theme.text },
    streakLabel: { fontSize: 14, color: theme.subtext, marginBottom: 6 },
    milestoneBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: '#FFF3E0',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 'auto',
      marginBottom: 4,
    },
    milestoneEmoji: { fontSize: 14 },
    milestoneLabel: { fontSize: 12, fontWeight: '600', color: '#F39C12' },
    calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 14 },
    calendarDot: { width: 16, height: 16, borderRadius: 4, backgroundColor: theme.border },
    markButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderWidth: 2,
      borderColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 10,
    },
    markButtonText: { fontSize: 14, fontWeight: '600' },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
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
      color: theme.text,
      fontSize: 15,
    },
    modalLabel: { fontSize: 13, fontWeight: '600', color: theme.text, marginTop: 4 },
    emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    emojiChip: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.chipBackground,
      borderWidth: 1,
      borderColor: theme.border,
    },
    emojiChipText: { fontSize: 20 },
    modalActions: { flexDirection: 'row', gap: 10, marginTop: 10 },
    modalButton: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
    modalButtonGhost: { borderWidth: 1, borderColor: theme.border },
    modalButtonText: { fontSize: 15, fontWeight: '600' },
  });
}
