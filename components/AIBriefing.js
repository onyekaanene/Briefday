import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { COLORS, FONTS, SPACING } from "../constants/theme";

export default function AIBriefing({ taskCount, meetingCount, userName }) {
  const [briefing, setBriefing] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchBriefing = async () => {
    setLoading(true);
    setError(false);
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'YOUR_API_KEY_HERE',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          messages: [
            {
              role: 'user',
              content: `You are a helpful personal assistant. Generate a brief, friendly morning briefing (2-3 sentences) for ${userName}. They have ${taskCount} tasks and ${meetingCount} meetings today. Keep it motivating and concise.`
            }
          ]
        })
      });