import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING } from "../constants/theme";

// This function checks the current time and returns the right greeting
function getGreeting() {
  const hour = new Date().getHours(); // Gets current hour (0-23)

  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

export default function Greeting({ userName }) {
  const greeting = getGreeting();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{greeting} 👋</Text>
      <Text style={styles.userName}>{userName || "there"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
  },
  greeting: {
    fontSize: FONTS.title,
    fontWeight: "600",
    color: COLORS.text,
  },
  userName: {
    fontSize: FONTS.heading,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
});