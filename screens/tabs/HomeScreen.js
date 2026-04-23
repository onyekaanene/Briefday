import React from "react";
import { View, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import Greeting from "../../components/Greeting";
import StatsCard from "../../components/StatsCard";
import { COLORS, SPACING } from "../../constants/theme";

export default function HomeScreen() {
  const userName = "Onyekachukwu";
  const taskCount = 5;
  const meetingCount = 2;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Greeting userName={userName} />

        <View style={styles.statsSection}>
          <StatsCard
            icon="✅"
            label="Tasks Today"
            count={taskCount}
            color={COLORS.accent}
          />
          <StatsCard
            icon="📅"
            label="Upcoming Meetings"
            count={meetingCount}
            color={COLORS.primary}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  statsSection: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
});