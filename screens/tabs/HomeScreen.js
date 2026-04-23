import React from "react";
import { View, ScrollView, StyleSheet, SafeAreaView, Text } from "react-native";
import Greeting from "../../components/Greeting";
import StatsCard from "../../components/StatsCard";
import ActionButton from "../../components/buttons/ActionButton";
import { COLORS, SPACING, FONTS } from "../../constants/theme";

export default function HomeScreen({ navigation }) {
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

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionsGrid}>
          <ActionButton
            icon="✅"
            label="Add Task"
            color={COLORS.accent}
            onPress={() => navigation.navigate("Tasks")}
          />
          <ActionButton
            icon="📅"
            label="Schedule Meeting"
            color={COLORS.primary}
            onPress={() => navigation.navigate("Meetings")}
          />
          <ActionButton
            icon="📍"
            label="Map-In"
            color="#10B981"
            onPress={() => navigation.navigate("Map")}
          />
          <ActionButton
            icon="👥"
            label="My Team"
            color="#8B5CF6"
            onPress={() => navigation.navigate("Team")}
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
  sectionTitle: {
    fontSize: FONTS.subtitle,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SPACING.xl,
  },
});