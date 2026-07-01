import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  AppState,
  Platform,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { AppTheme } from '@/constants/theme';
import {
  CATEGORIES,
  getQuoteOfTheDay,
  getRandomQuote,
  Quote,
} from '@/constants/quotes';

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const INTERVAL_OPTIONS = [5, 10, 15, 20, 30, 45, 60];
const AI_TIMEOUT_MS = 6000;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function fetchAiText(): Promise<string | null> {
  if (!EXPO_PUBLIC_BACKEND_URL) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    const response = await fetch(`${EXPO_PUBLIC_BACKEND_URL}/api/reason`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason_type: 'ai' }),
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.reason ?? null;
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export default function Home() {
  const {
    theme,
    isEnabled,
    setIsEnabled,
    reminderInterval,
    setReminderInterval,
    reasonType,
    setReasonType,
    selectedCategories,
    toggleCategory,
    hasAiBackend,
    todayMinutes,
    todayReminders,
    streak,
    favorites,
    toggleFavorite,
    addUsageMinute,
    addReminderSent,
    markAppOpened,
    loaded,
  } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [lastQuote, setLastQuote] = useState<Quote | null>(null);
  const [lastIsAi, setLastIsAi] = useState(false);

  const appState = useRef(AppState.currentState);
  const usageTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const notificationTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync();
    markAppOpened();
    setLastQuote(getQuoteOfTheDay());

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
      stopTracking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loaded) return;
    stopTracking();
    if (isEnabled) startTracking();
    return stopTracking;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled, reminderInterval, loaded]);

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable notifications to get screen time reminders.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const handleAppStateChange = (nextAppState: string) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      markAppOpened();
    }
    appState.current = nextAppState;
  };

  const startTracking = () => {
    usageTimer.current = setInterval(() => addUsageMinute(), 60000);
    notificationTimer.current = setInterval(() => sendNotification(), reminderInterval * 60000);
  };

  const stopTracking = () => {
    if (usageTimer.current) {
      clearInterval(usageTimer.current);
      usageTimer.current = null;
    }
    if (notificationTimer.current) {
      clearInterval(notificationTimer.current);
      notificationTimer.current = null;
    }
  };

  const pickQuote = async (): Promise<{ quote: Quote; isAi: boolean }> => {
    let useAi = reasonType === 'ai';
    if (reasonType === 'both' && hasAiBackend) useAi = Math.random() < 0.5;

    if (useAi && hasAiBackend) {
      const aiText = await fetchAiText();
      if (aiText) {
        return { quote: { id: `ai-${Date.now()}`, text: aiText, category: 'growth' }, isAi: true };
      }
    }
    return { quote: getRandomQuote(selectedCategories, lastQuote?.id), isAi: false };
  };

  const sendNotification = async () => {
    const { quote, isAi } = await pickQuote();
    setLastQuote(quote);
    setLastIsAi(isAi);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📱 Screen Time Reminder',
        body: quote.text,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null,
    });

    addReminderSent();
  };

  const handleManualReminder = async () => {
    setLoading(true);
    await sendNotification();
    setLoading(false);
  };

  const handleShare = async () => {
    if (!lastQuote) return;
    try {
      await Share.share({ message: `"${lastQuote.text}" — Digital Wellbeing` });
    } catch (error) {
      console.log('Share error', error);
    }
  };

  const toggleNotifications = (value: boolean) => {
    setIsEnabled(value);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const styles = getStyles(theme);
  const isCurrentFavorite = lastQuote && !lastIsAi ? favorites.includes(lastQuote.id) : false;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Ionicons name="phone-portrait-outline" size={48} color={theme.primary} />
        <Text style={styles.title}>Digital Wellbeing</Text>
        <Text style={styles.subtitle}>Reclaim Your Time</Text>
        {streak > 0 && (
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={16} color="#F39C12" />
            <Text style={styles.streakText}>{streak} day streak</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today&apos;s Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={32} color="#FF6B6B" />
            <Text style={styles.statValue}>{formatTime(todayMinutes)}</Text>
            <Text style={styles.statLabel}>Screen Time</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="notifications-outline" size={32} color="#4ECDC4" />
            <Text style={styles.statValue}>{todayReminders}</Text>
            <Text style={styles.statLabel}>Reminders Sent</Text>
          </View>
        </View>
      </View>

      {lastQuote ? (
        <View style={styles.reasonCard}>
          <Ionicons name="bulb-outline" size={24} color="#F7B731" />
          <Text style={styles.reasonText}>{lastQuote.text}</Text>
          <View style={styles.reasonActions}>
            {!lastIsAi && (
              <TouchableOpacity onPress={() => toggleFavorite(lastQuote.id)} style={styles.reasonIconButton}>
                <Ionicons
                  name={isCurrentFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isCurrentFavorite ? '#FF6B6B' : theme.subtext}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleShare} style={styles.reasonIconButton}>
              <Ionicons name="share-outline" size={20} color={theme.subtext} />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <View style={styles.card}>
        <View style={styles.controlRow}>
          <View style={styles.controlLeft}>
            <Ionicons
              name={isEnabled ? 'notifications' : 'notifications-off'}
              size={24}
              color={isEnabled ? theme.primary : theme.subtext}
            />
            <Text style={styles.controlLabel}>Enable Reminders</Text>
          </View>
          <Switch
            value={isEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#d1d5db', true: theme.primary }}
            thumbColor="#ffffff"
          />
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Remind me every</Text>
        <View style={styles.chipRow}>
          {INTERVAL_OPTIONS.map((minutes) => (
            <TouchableOpacity
              key={minutes}
              style={[styles.chip, reminderInterval === minutes && styles.chipActive]}
              onPress={() => setReminderInterval(minutes)}
            >
              <Text style={[styles.chipText, reminderInterval === minutes && styles.chipTextActive]}>
                {minutes}m
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Reminder Type</Text>
        <View style={styles.reasonTypeContainer}>
          <TouchableOpacity
            style={[styles.reasonTypeButton, reasonType === 'predefined' && styles.reasonTypeButtonActive]}
            onPress={() => setReasonType('predefined')}
          >
            <Ionicons name="list-outline" size={20} color={reasonType === 'predefined' ? '#ffffff' : theme.primary} />
            <Text style={[styles.reasonTypeText, reasonType === 'predefined' && styles.reasonTypeTextActive]}>
              Quotes
            </Text>
          </TouchableOpacity>

          {hasAiBackend && (
            <TouchableOpacity
              style={[styles.reasonTypeButton, reasonType === 'ai' && styles.reasonTypeButtonActive]}
              onPress={() => setReasonType('ai')}
            >
              <Ionicons name="sparkles-outline" size={20} color={reasonType === 'ai' ? '#ffffff' : theme.primary} />
              <Text style={[styles.reasonTypeText, reasonType === 'ai' && styles.reasonTypeTextActive]}>
                AI Generated
              </Text>
            </TouchableOpacity>
          )}

          {hasAiBackend && (
            <TouchableOpacity
              style={[styles.reasonTypeButton, reasonType === 'both' && styles.reasonTypeButtonActive]}
              onPress={() => setReasonType('both')}
            >
              <Ionicons name="shuffle-outline" size={20} color={reasonType === 'both' ? '#ffffff' : theme.primary} />
              <Text style={[styles.reasonTypeText, reasonType === 'both' && styles.reasonTypeTextActive]}>
                Mix
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {!hasAiBackend && (
          <Text style={styles.hintText}>
            Connect a backend URL in Settings to unlock AI-generated reminders.
          </Text>
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Categories</Text>
        <Text style={styles.hintText}>Leave empty to use all categories.</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((cat) => {
            const active = selectedCategories.includes(cat.key);
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.chip, active && { backgroundColor: cat.color, borderColor: cat.color }]}
                onPress={() => toggleCategory(cat.key)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={styles.manualButton} onPress={handleManualReminder} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <>
            <Ionicons name="send" size={24} color="#ffffff" />
            <Text style={styles.manualButtonText}>Send Reminder Now</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={20} color={theme.subtext} />
        <Text style={styles.infoText}>
          Reminders sent every {reminderInterval} minutes while the app is active. Works fully offline.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Your wellbeing journey starts here 🌱</Text>
      </View>
    </ScrollView>
  );
}

function getStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    contentContainer: { padding: 24, paddingTop: 60, paddingBottom: 40 },
    header: { alignItems: 'center', marginBottom: 32 },
    title: { fontSize: 32, fontWeight: 'bold', color: theme.text, marginTop: 16 },
    subtitle: { fontSize: 16, color: theme.subtext, marginTop: 4 },
    streakBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF3E0',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginTop: 12,
      gap: 6,
    },
    streakText: { color: '#F39C12', fontWeight: '600', fontSize: 13 },
    card: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    cardTitle: { fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 16 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 28, fontWeight: 'bold', color: theme.text, marginTop: 8 },
    statLabel: { fontSize: 14, color: theme.subtext, marginTop: 4 },
    statDivider: { width: 1, height: 60, backgroundColor: theme.border },
    reasonCard: {
      backgroundColor: '#FFF9E6',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderLeftWidth: 4,
      borderLeftColor: '#F7B731',
    },
    reasonText: { fontSize: 16, color: '#2c3e50', marginLeft: 12, flex: 1, lineHeight: 24 },
    reasonActions: { flexDirection: 'column', gap: 4, marginLeft: 8 },
    reasonIconButton: { padding: 4 },
    controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    controlLeft: { flexDirection: 'row', alignItems: 'center' },
    controlLabel: { fontSize: 16, color: theme.text, marginLeft: 12, fontWeight: '500' },
    divider: { height: 1, backgroundColor: theme.border, marginVertical: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 12 },
    hintText: { fontSize: 12, color: theme.subtext, marginBottom: 8 },
    chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.primary,
      backgroundColor: theme.chipBackground,
    },
    chipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
    chipText: { fontSize: 13, color: theme.primary, fontWeight: '500' },
    chipTextActive: { color: '#ffffff' },
    reasonTypeContainer: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    reasonTypeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.primary,
      backgroundColor: theme.chipBackground,
    },
    reasonTypeButtonActive: { backgroundColor: theme.primary, borderColor: theme.primary },
    reasonTypeText: { fontSize: 14, color: theme.primary, marginLeft: 6, fontWeight: '500' },
    reasonTypeTextActive: { color: '#ffffff' },
    manualButton: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      padding: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    manualButtonText: { fontSize: 18, fontWeight: '600', color: '#ffffff', marginLeft: 8 },
    infoCard: {
      backgroundColor: theme.chipBackground,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
      borderWidth: 1,
      borderColor: theme.border,
    },
    infoText: { fontSize: 14, color: theme.subtext, marginLeft: 8, flex: 1 },
    footer: { alignItems: 'center', marginTop: 8 },
    footerText: { fontSize: 14, color: theme.subtext, fontStyle: 'italic' },
  });
}
