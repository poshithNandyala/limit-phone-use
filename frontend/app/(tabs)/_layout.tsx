import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';

export default function TabsLayout() {
  const { theme } = useAppContext();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subtext,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="quotes"
        options={{
          title: 'Quotes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbox-ellipses-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Streaks',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flame-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
