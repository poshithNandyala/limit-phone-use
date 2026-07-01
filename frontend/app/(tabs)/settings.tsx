import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useAppContext } from '@/context/AppContext';
import { AppTheme } from '@/constants/theme';

const REPO_URL = 'https://github.com/poshithNandyala/limit-phone-use';
const RELEASES_URL = 'https://github.com/poshithNandyala/limit-phone-use/releases/latest';
const NEW_ISSUE_URL = 'https://github.com/poshithNandyala/limit-phone-use/issues/new/choose';

export default function SettingsScreen() {
  const { theme, isDark, toggleDark, favorites, clearFavorites, hasAiBackend } = useAppContext();
  const styles = getStyles(theme);
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const handleClearFavorites = () => {
    Alert.alert('Clear Favorites', `Remove all ${favorites.length} saved favorites?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearFavorites },
    ]);
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
          <Text style={[styles.badge, hasAiBackend ? styles.badgeOn : styles.badgeOff]}>
            {hasAiBackend ? 'Connected' : 'Not configured'}
          </Text>
        </View>
        <Text style={styles.hint}>
          Set EXPO_PUBLIC_BACKEND_URL when building the app to enable AI-generated reminders.
          The app works fully offline without it, using the built-in quote library.
        </Text>
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
  });
}
