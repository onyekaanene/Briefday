import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { COLORS, FONTS, SPACING } from "../../constants/theme";

export default function PrimaryButton({
  label,
  onPress,
  loading = false,
  variant = "filled", // 'filled' or 'outline'
  color = COLORS.primary,
}) {
  const isFilled = variant === "filled";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isFilled ? color : "transparent",
          borderColor: color,
          borderWidth: isFilled ? 0 : 2,
        },
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isFilled ? COLORS.white : color} />
      ) : (
        <Text
          style={[styles.label, { color: isFilled ? COLORS.white : color }]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: SPACING.sm,
  },
  label: {
    fontSize: FONTS.body,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
