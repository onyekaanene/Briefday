import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { COLORS, FONTS, SPACING } from "../../constants/theme";

export default function ActionButton({ icon, label, color, onPress }) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SPACING.xs,
    marginVertical: SPACING.sm,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  icon: {
    fontSize: 28,
  },
  label: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
});