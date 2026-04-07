// src/navigation/index.tsx

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import { colors } from "../theme/colors";

// Import screens
import { HomeScreen } from "../screens/HomeScreen";
import { CategoriesScreen } from "../screens/CategoriesScreen";
import { FullSearchScreen } from "../screens/FullSearchScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { CardViewerScreen } from "../screens/CardViewerScreen";
import { CategoryDetailScreen } from "../screens/CategoryDetailScreen";

// Type definitions for navigation
export type RootStackParamList = {
  MainTabs: undefined;
  CardViewer: { cardId: string };
  CategoryDetail: { category: string };
  Settings: undefined;
};

export type TabParamList = {
  Home: undefined;
  Browse: undefined;
  Search: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: "⌂",
    Browse: "☰",
    Search: "⌕",
    Profile: "☆",
  };
  return (
    <Text style={{ fontSize: 22, color: focused ? colors.gold : colors.textMuted }}>
      {icons[label] || "•"}
    </Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.backgroundAlt,
          borderTopColor: colors.goldBorder,
          borderTopWidth: 1,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 1,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Browse" component={CategoriesScreen} />
      <Tab.Screen name="Search" component={FullSearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="CardViewer" component={CardViewerScreen} />
        <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
        {/* Uncomment as you build these screens:
        <Stack.Screen name="Settings" component={SettingsScreen} />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
