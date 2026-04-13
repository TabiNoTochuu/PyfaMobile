import { Tabs } from 'expo-router';
import { Colors } from '../../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.tabBarBorder,
        },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textMuted,
        headerStyle: { backgroundColor: Colors.header },
        headerTintColor: Colors.text,
        headerTitleStyle: { color: Colors.text, fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="fittings"
        options={{
          title: 'Fittings',
          tabBarLabel: 'Fittings',
          tabBarIcon: ({ color }) => (
            // Simple text icon — replace with vector icons in Phase 3 polish
            <TabIcon label="⚙" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: 'Market',
          tabBarLabel: 'Market',
          tabBarIcon: ({ color }) => <TabIcon label="🛒" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <TabIcon label="☰" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ label, color }: { label: string; color: string }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 18, color }}>{label}</Text>;
}
