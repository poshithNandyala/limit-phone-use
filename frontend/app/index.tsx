import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Index() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [usageMinutes, setUsageMinutes] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [reasonType, setReasonType] = useState<'predefined' | 'ai' | 'both'>('both');
  const [loading, setLoading] = useState(false);
  const [lastReason, setLastReason] = useState('');
  
  const appState = useRef(AppState.currentState);
  const usageTimer = useRef<NodeJS.Timeout | null>(null);
  const notificationTimer = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    registerForPushNotificationsAsync();
    loadSettings();
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
      if (usageTimer.current) clearInterval(usageTimer.current);
      if (notificationTimer.current) clearInterval(notificationTimer.current);
    };
  }, []);

  useEffect(() => {
    if (isEnabled) {
      startTracking();
    } else {
      stopTracking();
    }
  }, [isEnabled]);

  const loadSettings = async () => {
    try {
      const savedReasonType = await AsyncStorage.getItem('reasonType');
      const savedUsage = await AsyncStorage.getItem('usageMinutes');
      const savedCount = await AsyncStorage.getItem('notificationCount');
      
      if (savedReasonType) setReasonType(savedReasonType as any);
      if (savedUsage) setUsageMinutes(parseInt(savedUsage));
      if (savedCount) setNotificationCount(parseInt(savedCount));
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('reasonType', reasonType);
      await AsyncStorage.setItem('usageMinutes', usageMinutes.toString());
      await AsyncStorage.setItem('notificationCount', notificationCount.toString());
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  useEffect(() => {
    saveSettings();
  }, [reasonType, usageMinutes, notificationCount]);

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
        return;
      }
    }
  };

  const handleAppStateChange = (nextAppState: any) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      // App came to foreground
      startTime.current = Date.now();
      if (isEnabled) {
        startTracking();
      }
    } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
      // App went to background
      stopTracking();
    }
    appState.current = nextAppState;
  };

  const startTracking = () => {
    // Update usage every minute
    usageTimer.current = setInterval(() => {
      setUsageMinutes(prev => prev + 1);
    }, 60000); // 60 seconds

    // Send notification every 10 minutes
    notificationTimer.current = setInterval(() => {
      sendNotification();
    }, 600000); // 10 minutes = 600,000ms
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

  const fetchReason = async (): Promise<string> => {
    try {
      let selectedType = reasonType;
      
      // If 'both', randomly choose between predefined and ai
      if (reasonType === 'both') {
        selectedType = Math.random() < 0.5 ? 'predefined' : 'ai';
      }

      const response = await fetch(`${EXPO_PUBLIC_BACKEND_URL}/api/reason`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason_type: selectedType }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reason');
      }

      const data = await response.json();
      return data.reason;
    } catch (error) {
      console.error('Error fetching reason:', error);
      return 'Time to take a break from your screen. Your wellbeing matters.';
    }
  };

  const sendNotification = async () => {
    const reason = await fetchReason();
    setLastReason(reason);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📱 Screen Time Reminder',
        body: reason,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Send immediately
    });

    setNotificationCount(prev => prev + 1);
  };

  const handleManualReminder = async () => {
    setLoading(true);
    await sendNotification();
    setLoading(false);
    Alert.alert('Reminder Sent!', 'Check your notifications.');
  };

  const toggleNotifications = async (value: boolean) => {
    setIsEnabled(value);
    if (!value) {
      stopTracking();
      Alert.alert('Notifications Disabled', 'Screen time tracking paused.');
    } else {
      Alert.alert('Notifications Enabled', 'We\'ll remind you every 10 minutes.');
    }
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="phone-portrait-outline" size={48} color="#4A90E2" />
        <Text style={styles.title}>Digital Wellbeing</Text>
        <Text style={styles.subtitle}>Reclaim Your Time</Text>
      </View>

      {/* Stats Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={32} color="#FF6B6B" />
            <Text style={styles.statValue}>{formatTime(usageMinutes)}</Text>
            <Text style={styles.statLabel}>Screen Time</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="notifications-outline" size={32} color="#4ECDC4" />
            <Text style={styles.statValue}>{notificationCount}</Text>
            <Text style={styles.statLabel}>Reminders Sent</Text>
          </View>
        </View>
      </View>

      {/* Last Reason Card */}
      {lastReason ? (
        <View style={styles.reasonCard}>
          <Ionicons name="bulb-outline" size={24} color="#F7B731" />
          <Text style={styles.reasonText}>{lastReason}</Text>
        </View>
      ) : null}

      {/* Controls Card */}
      <View style={styles.card}>
        <View style={styles.controlRow}>
          <View style={styles.controlLeft}>
            <Ionicons 
              name={isEnabled ? "notifications" : "notifications-off"} 
              size={24} 
              color={isEnabled ? "#4A90E2" : "#95a5a6"} 
            />
            <Text style={styles.controlLabel}>Enable Reminders</Text>
          </View>
          <Switch
            value={isEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#d1d5db', true: '#4A90E2' }}
            thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Reminder Type</Text>
        <View style={styles.reasonTypeContainer}>
          <TouchableOpacity
            style={[
              styles.reasonTypeButton,
              reasonType === 'predefined' && styles.reasonTypeButtonActive,
            ]}
            onPress={() => setReasonType('predefined')}
          >
            <Ionicons 
              name="list-outline" 
              size={20} 
              color={reasonType === 'predefined' ? '#ffffff' : '#4A90E2'} 
            />
            <Text
              style={[
                styles.reasonTypeText,
                reasonType === 'predefined' && styles.reasonTypeTextActive,
              ]}
            >
              Pre-defined
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.reasonTypeButton,
              reasonType === 'ai' && styles.reasonTypeButtonActive,
            ]}
            onPress={() => setReasonType('ai')}
          >
            <Ionicons 
              name="sparkles-outline" 
              size={20} 
              color={reasonType === 'ai' ? '#ffffff' : '#4A90E2'} 
            />
            <Text
              style={[
                styles.reasonTypeText,
                reasonType === 'ai' && styles.reasonTypeTextActive,
              ]}
            >
              AI Generated
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.reasonTypeButton,
              reasonType === 'both' && styles.reasonTypeButtonActive,
            ]}
            onPress={() => setReasonType('both')}
          >
            <Ionicons 
              name="shuffle-outline" 
              size={20} 
              color={reasonType === 'both' ? '#ffffff' : '#4A90E2'} 
            />
            <Text
              style={[
                styles.reasonTypeText,
                reasonType === 'both' && styles.reasonTypeTextActive,
              ]}
            >
              Both (Mix)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Manual Reminder Button */}
      <TouchableOpacity
        style={styles.manualButton}
        onPress={handleManualReminder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <>
            <Ionicons name="send" size={24} color="#ffffff" />
            <Text style={styles.manualButtonText}>Send Reminder Now</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={20} color="#7f8c8d" />
        <Text style={styles.infoText}>
          Reminders sent every 10 minutes while app is active
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Your wellbeing journey starts here 🌱</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#ecf0f1',
  },
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
  reasonText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
    flex: 1,
    lineHeight: 24,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  reasonTypeContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  reasonTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A90E2',
    backgroundColor: '#ffffff',
  },
  reasonTypeButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  reasonTypeText: {
    fontSize: 14,
    color: '#4A90E2',
    marginLeft: 6,
    fontWeight: '500',
  },
  reasonTypeTextActive: {
    color: '#ffffff',
  },
  manualButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  manualButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
});
