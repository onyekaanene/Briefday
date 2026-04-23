import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import Greeting from "../../components/Greeting";
import StatsCard from "../../components/StatsCard";
import { COLORS, SPACING } from "../../constants/theme";

export default function HomeScreen() {
  // Hardcoded for now - we'll connect to real data later
  const userName = "Onyekachukwu";
  const taskCount = 5;
  const meetingCount = 2;

  return (
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
          icon="🗓️"
          label="Upcoming Meetings"
          count={meetingCount}
          color={COLORS.primary}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
});
