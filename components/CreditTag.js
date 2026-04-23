import React from "react";
import { Text, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constants/theme";

export default function CreditTag() {
  return <Text style={styles.credit}>Designed by Onyekachukwu Anene</Text>;
}

const styles = StyleSheet.create({
  credit: {
    fontSize: FONTS.small,
    color: COLORS.textLight,
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: 0.3,
    paddingBottom: 8,
  },
});
