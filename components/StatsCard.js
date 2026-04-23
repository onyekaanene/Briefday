import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING } from "../constants/theme";

export default function StatsCard({ icon, label, count, color }) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.textContainer}>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    marginVertical: SPACING.xs,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  icon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  count: {
    fontSize: FONTS.title,
    fontWeight: "800",
    color: COLORS.text,
  },
  label: {
    fontSize: FONTS.body,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
});