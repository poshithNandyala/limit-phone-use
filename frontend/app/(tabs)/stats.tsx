import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { AppTheme } from '@/constants/theme';

function lastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export default function StatsScreen() {
  const { theme, history, streak, favorites, resetStats } = useAppContext();
  const styles = getStyles(theme);

  const totals = useMemo(() => {
    return history.reduce(
      (acc, day) => ({
        minutes: acc.minutes + day.minutes,
        reminders: acc.reminders + day.reminders,
      }),
      { minutes: 0, reminders: 0 }
    );
  }, [history]);

  const week = useMemo(() => {
    const days = lastNDays(7);
    return days.map((date) => {
      const entry = history.find((h) => h.date === date);
      return { date, minutes: entry?.minutes ?? 0, reminders: entry?.reminders ?? 0 };
    });
  }, [history]);

  const maxMinutes = Math.max(1, ...week.map((d) => d.minutes));

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const dayLabel = (date: string) =>
    new Date(date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short' });

  const handleReset = () => {
    Alert.alert('Reset Stats', 'This clears your streak and usage history. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetStats },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Progress</Text>

      <View style={styles.rowCards}>
        <View style={[styles.miniCard, { flex: 1 }]}>
          <Ionicons name="flame" size={26} color="#F39C12" />
          <Text style={styles.miniValue}>{streak}</Text>
          <Text style={styles.miniLabel}>Day Streak</Text>
        </View>
        <View style={[styles.miniCard, { flex: 1 }]}>
          <Ionicons name="heart" size={26} color="#FF6B6B" />
          <Text style={styles.miniValue}>{favorites.length}</Text>
          <Text style={styles.miniLabel}>Favorites</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>All-Time Totals</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatTime(totals.minutes)}</Text>
            <Text style={styles.statLabel}>Screen Time Logged</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totals.reminders}</Text>
            <Text style={styles.statLabel}>Reminders Sent</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Last 7 Days</Text>
        <View style={styles.chartRow}>
          {week.map((day) => (
            <View key={day.date} style={styles.chartColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(4, (day.minutes / maxMinutes) * 100),
                      backgroundColor: theme.primary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.chartLabel}>{dayLabel(day.date)}</Text>
              <Text style={styles.chartValue}>{day.minutes}m</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Ionicons name="refresh-outline" size={18} color="#FF6B6B" />
        <Text style={styles.resetText}>Reset Stats</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function getStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
    title: { fontSize: 26, fontWeight: 'bold', color: theme.text, marginBottom: 20 },
    rowCards: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    miniCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 18,
      alignItems: 'center',
    },
    miniValue: { fontSize: 24, fontWeight: 'bold', color: theme.text, marginTop: 8 },
    miniLabel: { fontSize: 12, color: theme.subtext, marginTop: 2 },
    card: { backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 16 },
    cardTitle: { fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 16 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 22, fontWeight: 'bold', color: theme.text },
    statLabel: { fontSize: 12, color: theme.subtext, marginTop: 4, textAlign: 'center' },
    statDivider: { width: 1, backgroundColor: theme.border },
    chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150 },
    chartColumn: { alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' },
    barTrack: { height: 100, justifyContent: 'flex-end' },
    bar: { width: 16, borderRadius: 8 },
    chartLabel: { fontSize: 11, color: theme.subtext, marginTop: 6 },
    chartValue: { fontSize: 10, color: theme.subtext },
    resetButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#FF6B6B',
    },
    resetText: { color: '#FF6B6B', fontWeight: '600' },
  });
}
