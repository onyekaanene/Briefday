import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { COLORS, FONTS, SPACING } from "../../constants/theme";

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>📍</Text>
        <Text style={styles.title}>Map-In Feature</Text>
        <Text style={styles.description}>
          Check in your location for meetings and track your work locations.
        </Text>
        <Text style={styles.comingSoon}>Coming Soon!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  icon: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.heading,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONTS.body,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  comingSoon: {
    fontSize: FONTS.subtitle,
    fontWeight: "600",
    color: COLORS.accent,
  },
});
