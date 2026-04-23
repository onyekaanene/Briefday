import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";

import HomeScreen from "../screens/tabs/HomeScreen";
import TasksScreen from "../screens/tabs/TasksScreen";
import MeetingsScreen from "../screens/tabs/MeetingsScreen";
import MapScreen from "../screens/tabs/MapScreen";
import TeamScreen from "../screens/tabs/TeamScreen";

const Tab = createBottomTabNavigator();

const getIcon = (routeName, focused) => {
  const icons = {
    Home: focused ? "home" : "home-outline",
    Tasks: focused ? "checkmark-circle" : "checkmark-circle-outline",
    Meetings: focused ? "briefcase" : "briefcase-outline",
    Map: focused ? "map" : "map-outline",
    Team: focused ? "people" : "people-outline",
  };
  return icons[routeName];
};

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={getIcon(route.name, focused)}
            size={size}
            color={color}
          />
        ),
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 4,
        },
        headerStyle: {
          backgroundColor: COLORS.white,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        },
        headerTintColor: COLORS.primary,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Briefday", tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{ title: "My Tasks", tabBarLabel: "Tasks" }}
      />
      <Tab.Screen
        name="Meetings"
        component={MeetingsScreen}
        options={{ title: "My Meetings", tabBarLabel: "Meetings" }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ title: "Map-In", tabBarLabel: "Map" }}
      />
      <Tab.Screen
        name="Team"
        component={TeamScreen}
        options={{ title: "My Team", tabBarLabel: "Team" }}
      />
    </Tab.Navigator>
  );
}
