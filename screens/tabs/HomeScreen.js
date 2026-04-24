import React from "react";
import { View, ScrollView, StyleSheet, SafeAreaView, Text } from "react-native";
import { auth } from "../../config/firebase";
import Greeting from "../../components/Greeting";
import StatsCard from "../../components/StatsCard";
import ActionButton from "../../components/buttons/ActionButton";
import AIBriefing from "../../components/AIBriefing";
import useTasks from "../../hooks/useTasks";
import useMeetings from "../../hooks/useMeetings";
import { COLORS, SPACING, FONTS } from "../../constants/theme";

export default function HomeScreen({ navigation }) {
  const { tasks } = useTasks();
  const { meetings } = useMeetings();

  const userName = auth.currentUser?.displayName || "there";
  const taskCount = tasks.filter((t) => !t.completed).length;
  const meetingCount = meetings.filter((m) => !m.completed).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Greeting userName={userName} />

        <AIBriefing
          taskCount={taskCount}
          meetingCount={meetingCount}
          userName={userName}
        />

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
    marginTop: SPACING.md,
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
