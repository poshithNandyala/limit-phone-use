import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Linking,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useAppContext } from '@/context/AppContext';
import { AppTheme } from '@/constants/theme';

const REPO_URL = 'https://github.com/poshithNandyala/limit-phone-use';
const RELEASES_URL = 'https://github.com/poshithNandyala/limit-phone-use/releases/latest';
const NEW_ISSUE_URL = 'https://github.com/poshithNandyala/limit-phone-use/issues/new/choose';
const GEMINI_KEY_URL = 'https://aistudio.google.com/apikey';

export default function SettingsScreen() {
  const {
    theme,
    isDark,
    toggleDark,
    favorites,
    clearFavorites,
    hasGemini,
    hasLegacyBackend,
    geminiApiKey,
    setGeminiApiKey,
    quietHoursEnabled,
    setQuietHoursEnabled,
    quietHoursStart,
    setQuietHoursStart,
    quietHoursEnd,
    setQuietHoursEnd,
  } = useAppContext();
  const styles = getStyles(theme);
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const formatHour = (hour: number) => {
    const h = ((hour + 11) % 12) + 1;
    return `${h} ${hour < 12 ? 'AM' : 'PM'}`;
  };
  const cycleHour = (hour: number, delta: number) => (hour + delta + 24) % 24;

  const [keyInput, setKeyInput] = useState(geminiApiKey);
  const [showKey, setShowKey] = useState(false);

  const handleClearFavorites = () => {
    Alert.alert('Clear Favorites', `Remove all ${favorites.length} saved favorites?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearFavorites },
    ]);
  };

  const handleSaveKey = () => {
    setGeminiApiKey(keyInput.trim());
  };

  const handleClearKey = () => {
    setKeyInput('');
    setGeminiApiKey('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="moon-outline" size={22} color={theme.text} />
            <Text style={styles.rowLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleDark}
            trackColor={{ false: '#d1d5db', true: theme.primary }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="sparkles-outline" size={22} color={theme.text} />
            <Text style={styles.rowLabel}>AI Reminders</Text>
          </View>
          <Text style={[styles.badge, hasGemini || hasLegacyBackend ? styles.badgeOn : styles.badgeOff]}>
            {hasGemini ? 'Gemini Connected' : hasLegacyBackend ? 'Backend Connected' : 'Not configured'}
          </Text>
        </View>
        <Text style={styles.hint}>
          Paste your own free Gemini API key below to unlock AI-generated reminders, sent directly
          from your device to Google - it never touches any server of ours. Leave it blank and the
          app works great with the built-in quote library, offline.
        </Text>

        <TextInput
          style={styles.keyInput}
          placeholder="Paste your Gemini API key..."
          placeholderTextColor={theme.subtext}
          value={keyInput}
          onChangeText={setKeyInput}
          secureTextEntry={!showKey}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.keyActions}>
          <TouchableOpacity onPress={() => setShowKey((v) => !v)} style={styles.keyActionButton}>
            <Ionicons name={showKey ? 'eye-off-outline' : 'eye-outline'} size={16} color={theme.subtext} />
            <Text style={styles.keyActionText}>{showKey ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
          {!!geminiApiKey && (
            <TouchableOpacity onPress={handleClearKey} style={styles.keyActionButton}>
              <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
              <Text style={[styles.keyActionText, { color: '#FF6B6B' }]}>Remove</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.saveKeyButton} onPress={handleSaveKey}>
            <Text style={styles.saveKeyButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL(GEMINI_KEY_URL)}>
          <Ionicons name="key-outline" size={16} color={theme.primary} />
          <Text style={[styles.linkText, { color: theme.primary, fontSize: 13 }]}>
            Get a free Gemini API key
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.rowLeft}>
          <Ionicons name="notifications-outline" size={22} color={theme.text} />
          <Text style={styles.rowLabel}>Background Reminders</Text>
        </View>
        <Text style={styles.hint}>
          Reminders are scheduled directly with your phone's notification system, so they keep
          arriving even when the app is closed. Make sure notifications are allowed for this app
          in your phone's system settings if reminders ever stop showing up.
        </Text>
        <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openSettings()}>
          <Ionicons name="settings-outline" size={16} color={theme.primary} />
          <Text style={[styles.linkText, { color: theme.primary, fontSize: 13 }]}>
            Open Notification Settings
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="moon-outline" size={22} color={theme.text} />
            <Text style={styles.rowLabel}>Quiet Hours</Text>
          </View>
          <Switch
            value={quietHoursEnabled}
            onValueChange={setQuietHoursEnabled}
            trackColor={{ false: '#d1d5db', true: theme.primary }}
            thumbColor="#ffffff"
          />
        </View>
        <Text style={styles.hint}>
          Pause reminders during this window so you're not disturbed while asleep or otherwise not
          using your phone. Reminders resume automatically right after it ends.
        </Text>
        {quietHoursEnabled && (
          <View style={styles.hourRow}>
            <View style={styles.hourGroup}>
              <Text style={styles.hourGroupLabel}>From</Text>
              <View style={styles.hourStepper}>
                <TouchableOpacity onPress={() => setQuietHoursStart(cycleHour(quietHoursStart, -1))} style={styles.hourButton}>
                  <Ionicons name="remove" size={16} color={theme.primary} />
                </TouchableOpacity>
                <Text style={styles.hourValue}>{formatHour(quietHoursStart)}</Text>
                <TouchableOpacity onPress={() => setQuietHoursStart(cycleHour(quietHoursStart, 1))} style={styles.hourButton}>
                  <Ionicons name="add" size={16} color={theme.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.hourGroup}>
              <Text style={styles.hourGroupLabel}>Until</Text>
              <View style={styles.hourStepper}>
                <TouchableOpacity onPress={() => setQuietHoursEnd(cycleHour(quietHoursEnd, -1))} style={styles.hourButton}>
                  <Ionicons name="remove" size={16} color={theme.primary} />
                </TouchableOpacity>
                <Text style={styles.hourValue}>{formatHour(quietHoursEnd)}</Text>
                <TouchableOpacity onPress={() => setQuietHoursEnd(cycleHour(quietHoursEnd, 1))} style={styles.hourButton}>
                  <Ionicons name="add" size={16} color={theme.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.rowLeft}>
          <Ionicons name="time-outline" size={22} color={theme.text} />
          <Text style={styles.rowLabel}>About "Time in App"</Text>
        </View>
        <Text style={styles.hint}>
          This app can only measure how long it's been open itself - it can't see your total phone
          usage across other apps. For your real, device-wide screen time, check your phone's own
          Digital Wellbeing / Screen Time dashboard in system settings.
        </Text>
        <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openSettings()}>
          <Ionicons name="phone-portrait-outline" size={16} color={theme.primary} />
          <Text style={[styles.linkText, { color: theme.primary, fontSize: 13 }]}>
            Open Phone Settings
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.row} onPress={handleClearFavorites}>
          <View style={styles.rowLeft}>
            <Ionicons name="heart-dislike-outline" size={22} color="#FF6B6B" />
            <Text style={[styles.rowLabel, { color: '#FF6B6B' }]}>Clear Favorites ({favorites.length})</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>About</Text>
        <Text style={styles.aboutText}>Digital Wellbeing v{version}</Text>
        <Text style={styles.hint}>
          Smart, offline-first reminders to help you spend less time on your phone.
        </Text>
        <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL(REPO_URL)}>
          <Ionicons name="logo-github" size={18} color={theme.primary} />
          <Text style={[styles.linkText, { color: theme.primary }]}>View on GitHub</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL(RELEASES_URL)}>
          <Ionicons name="download-outline" size={18} color={theme.primary} />
          <Text style={[styles.linkText, { color: theme.primary }]}>Download Latest Release</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL(NEW_ISSUE_URL)}>
          <Ionicons name="chatbox-ellipses-outline" size={18} color={theme.primary} />
          <Text style={[styles.linkText, { color: theme.primary }]}>Report a Bug / Request a Feature</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with care for a healthier digital life 🌱</Text>
      </View>
    </ScrollView>
  );
}

function getStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
    title: { fontSize: 26, fontWeight: 'bold', color: theme.text, marginBottom: 20 },
    card: { backgroundColor: theme.card, borderRadius: 16, padding: 18, marginBottom: 14 },
    cardTitle: { fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    rowLabel: { fontSize: 15, color: theme.text, fontWeight: '500' },
    hint: { fontSize: 12, color: theme.subtext, marginTop: 10, lineHeight: 17 },
    badge: { fontSize: 12, fontWeight: '600', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, overflow: 'hidden' },
    badgeOn: { backgroundColor: '#E6F9F4', color: '#16A085' },
    badgeOff: { backgroundColor: '#FDECEC', color: '#E74C3C' },
    aboutText: { fontSize: 15, color: theme.text, fontWeight: '600' },
    linkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
    linkText: { fontSize: 14, fontWeight: '600' },
    footer: { alignItems: 'center', marginTop: 10 },
    footerText: { fontSize: 13, color: theme.subtext, fontStyle: 'italic' },
    keyInput: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: theme.text,
      fontSize: 14,
      marginTop: 12,
    },
    keyActions: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 10 },
    keyActionButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    keyActionText: { fontSize: 13, color: theme.subtext, fontWeight: '500' },
    saveKeyButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: theme.primary },
    saveKeyButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 13 },
    hourRow: { flexDirection: 'row', gap: 16, marginTop: 14 },
    hourGroup: { flex: 1, alignItems: 'center' },
    hourGroupLabel: { fontSize: 12, color: theme.subtext, marginBottom: 6 },
    hourStepper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    hourButton: { padding: 2 },
    hourValue: { fontSize: 14, fontWeight: '600', color: theme.text, minWidth: 48, textAlign: 'center' },
  });
}
