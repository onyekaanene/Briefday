import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import PrimaryButton from '../buttons/PrimaryButton';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

export default function AITaskModal({ visible, onClose, onTasksGenerated }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('');
  const [generatedTasks, setGeneratedTasks] = useState([]);

  const ANTHROPIC_API_KEY = Constants.expoConfig.extra.anthropicApiKey;

  const handleGenerate = async () => {
    if (!projectName.trim()) {
      Alert.alert("Missing Info", "Please enter a project name");
      return;
    }

    setLoading(true);

    // Mock generation if no API key
    if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === "sk-ant-your-key-here") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const mockTasks = [
        `Research requirements for ${projectName}`,
        `Create outline and structure for ${projectName}`,
        `Draft initial version of ${projectName}`,
        `Review and refine ${projectName}`,
        `Finalize and submit ${projectName}`,
      ];
      setGeneratedTasks(mockTasks);
      setStep(2);
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
          max_tokens: 500,
          messages: [
            {
              role: "user",
              content: `Break down this project into 5-7 specific, actionable tasks:

Project: ${projectName}
Deadline: ${deadline || "Not specified"}
Priority: ${priority || "Medium"}

Return ONLY a numbered list of tasks, one per line. No additional explanation.`,
            },
          ],
        }),
      });

      const data = await response.json();

      if (data.content && data.content[0] && data.content[0].text) {
        const tasksText = data.content[0].text;
        const tasks = tasksText
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => line.replace(/^\d+\.\s*/, "").trim());

        setGeneratedTasks(tasks);
        setStep(2);
      } else {
        Alert.alert("Error", "Failed to generate tasks");
      }
    } catch (error) {
      console.error("AI Task Generation Error:", error);
      Alert.alert("Error", "Failed to generate tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTasks = () => {
    onTasksGenerated(generatedTasks);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setProjectName("");
    setDeadline("");
    setPriority("");
    setGeneratedTasks([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🤖 Create Tasks with AI</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={28} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {step === 1 ? (
            <ScrollView>
              <Text style={styles.label}>What project are you working on?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Launch new mobile app"
                value={projectName}
                onChangeText={setProjectName}
                autoFocus
              />

              <Text style={styles.label}>Deadline (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Next Friday, End of month"
                value={deadline}
                onChangeText={setDeadline}
              />

              <Text style={styles.label}>Priority (optional)</Text>
              <View style={styles.priorityButtons}>
                {["Low", "Medium", "High"].map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityButton,
                      priority === p && styles.priorityButtonActive,
                    ]}
                    onPress={() => setPriority(p)}
                  >
                    <Text
                      style={[
                        styles.priorityButtonText,
                        priority === p && styles.priorityButtonTextActive,
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <PrimaryButton
                label="Generate Tasks with AI"
                onPress={handleGenerate}
                loading={loading}
                color={COLORS.accent}
              />
            </ScrollView>
          ) : (
            <ScrollView>
              <Text style={styles.resultTitle}>
                Generated {generatedTasks.length} tasks for: {projectName}
              </Text>

              {generatedTasks.map((task, index) => (
                <View key={index} style={styles.taskPreview}>
                  <Text style={styles.taskNumber}>{index + 1}</Text>
                  <Text style={styles.taskText}>{task}</Text>
                </View>
              ))}

              <PrimaryButton
                label={`Add All ${generatedTasks.length} Tasks`}
                onPress={handleSaveTasks}
                color={COLORS.success}
              />

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep(1)}
              >
                <Text style={styles.backButtonText}>← Regenerate</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONTS.title,
    fontWeight: "700",
    color: COLORS.text,
  },
  label: {
    fontSize: FONTS.body,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONTS.body,
    marginBottom: SPACING.md,
  },
  priorityButtons: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  priorityButtonActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accent,
  },
  priorityButtonText: {
    fontSize: FONTS.body,
    fontWeight: "600",
    color: COLORS.text,
  },
  priorityButtonTextActive: {
    color: COLORS.white,
  },
  resultTitle: {
    fontSize: FONTS.subtitle,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  taskPreview: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  taskNumber: {
    fontSize: FONTS.body,
    fontWeight: "700",
    color: COLORS.accent,
    marginRight: SPACING.md,
  },
  taskText: {
    flex: 1,
    fontSize: FONTS.body,
    color: COLORS.text,
  },
  backButton: {
    alignItems: "center",
    marginTop: SPACING.md,
  },
  backButtonText: {
    fontSize: FONTS.body,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
