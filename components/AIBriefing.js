import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function AIBriefing({ taskCount, meetingCount, userName }) {
  const [briefing, setBriefing] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const ANTHROPIC_API_KEY = Constants.expoConfig.extra.anthropicApiKey;

  const fetchBriefing = async () => {
    setLoading(true);
    setError(false);

    // If no API key, use mock data
    if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === "sk-ant-your-key-here") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const greetings = [
        `Good morning, ${userName}! You have ${taskCount} tasks and ${meetingCount} meetings scheduled for today. Stay focused on your priorities and you'll crush it! 💪`,
        `Hello ${userName}! Today looks productive with ${taskCount} tasks on your plate and ${meetingCount} meetings lined up. Remember to take breaks and stay hydrated! ☕`,
        `Hey ${userName}! You've got ${taskCount} tasks to tackle and ${meetingCount} meetings to attend. Prioritize wisely and make today count! 🎯`,
      ];
      setBriefing(greetings[Math.floor(Math.random() * greetings.length)]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 200,
          messages: [
            {
              role: "user",
              content: `You are a helpful personal assistant. Generate a brief, friendly morning briefing (2-3 sentences max) for ${userName}. They have ${taskCount} tasks and ${meetingCount} meetings today. Keep it motivating, concise, and encouraging.`,
            },
          ],
        }),
      });

      const data = await response.json();

      if (data.content && data.content[0] && data.content[0].text) {
        setBriefing(data.content[0].text);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Briefing error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefing();
  }, [taskCount, meetingCount]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🤖 Your Daily AI Briefing</Text>
        <TouchableOpacity onPress={fetchBriefing} disabled={loading}>
          <Text style={styles.refreshIcon}>{loading ? "⏳" : "🔄"}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Preparing your briefing...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>
          Couldn't load briefing. Tap 🔄 to retry.
        </Text>
      ) : (
        <Text style={styles.briefingText}>{briefing}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginVertical: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.subtitle,
    fontWeight: "700",
    color: COLORS.text,
  },
  refreshIcon: {
    fontSize: 20,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
  },
  loadingText: {
    marginLeft: SPACING.sm,
    fontSize: FONTS.body,
    color: COLORS.textLight,
    fontStyle: "italic",
  },
  briefingText: {
    fontSize: FONTS.body,
    lineHeight: 22,
    color: COLORS.text,
  },
  errorText: {
    fontSize: FONTS.body,
    color: COLORS.danger,
    fontStyle: "italic",
  },
});
