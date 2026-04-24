import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from "dayjs";
import useMeetings from "../../hooks/useMeetings";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import { COLORS, FONTS, SPACING } from "../../constants/theme";

export default function MeetingsScreen() {
  const {
    meetings,
    loading,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    toggleComplete,
  } = useMeetings();

  const [modalVisible, setModalVisible] = useState(false);
  const [meetingText, setMeetingText] = useState("");
  const [meetingDate, setMeetingDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);

  const handleSaveMeeting = async () => {
    if (!meetingText.trim()) {
      Alert.alert("Empty Meeting", "Please enter a meeting description");
      return;
    }

    try {
      if (editingMeeting) {
        await updateMeeting(editingMeeting.id, {
          task: meetingText,
          reminder: meetingDate,
        });
      } else {
        await addMeeting({
          task: meetingText,
          reminder: meetingDate,
        });
      }

      setModalVisible(false);
      setMeetingText("");
      setMeetingDate(null);
      setEditingMeeting(null);
    } catch (error) {
      Alert.alert("Error", "Failed to save meeting");
    }
  };

  const handleEditMeeting = (meeting) => {
    setEditingMeeting(meeting);
    setMeetingText(meeting.task);
    setMeetingDate(meeting.reminder);
    setModalVisible(true);
  };

  const handleDeleteMeeting = (meetingId) => {
    Alert.alert(
      "Delete Meeting",
      "Are you sure you want to delete this meeting?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMeeting(meetingId),
        },
      ],
    );
  };

  const handleDateConfirm = (date) => {
    setMeetingDate(date);
    setShowDatePicker(false);
  };

  const renderMeeting = ({ item }) => (
    <View style={styles.meetingItem}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleComplete(item.id, item.completed)}
      >
        {item.completed && (
          <Ionicons name="checkmark" size={18} color={COLORS.primary} />
        )}
      </TouchableOpacity>

      <View style={styles.meetingContent}>
        <Text
          style={[
            styles.meetingText,
            item.completed && styles.meetingTextCompleted,
          ]}
        >
          {item.task}
        </Text>
        {item.reminder && (
          <Text style={styles.reminderText}>
            📅 {dayjs(item.reminder.toDate()).format("MMM D, YYYY h:mm A")}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => handleEditMeeting(item)}
      >
        <Ionicons name="pencil" size={20} color={COLORS.primary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => handleDeleteMeeting(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {meetings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyTitle}>No Meetings Scheduled</Text>
          <Text style={styles.emptyText}>
            Tap the + button to schedule your first meeting
          </Text>
        </View>
      ) : (
        <FlatList
          data={meetings}
          renderItem={renderMeeting}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingMeeting ? "Edit Meeting" : "New Meeting"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Meeting description..."
              value={meetingText}
              onChangeText={setMeetingText}
              multiline
              autoFocus
            />

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.dateButtonText}>
                {meetingDate
                  ? dayjs(meetingDate).format("MMM D, YYYY h:mm A")
                  : "Set Date & Time"}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={showDatePicker}
              mode="datetime"
              onConfirm={handleDateConfirm}
              onCancel={() => setShowDatePicker(false)}
            />

            <PrimaryButton
              label={editingMeeting ? "Update Meeting" : "Schedule Meeting"}
              onPress={handleSaveMeeting}
              color={COLORS.primary}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.lg,
  },
  meetingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  meetingContent: {
    flex: 1,
  },
  meetingText: {
    fontSize: FONTS.body,
    color: COLORS.text,
    fontWeight: "500",
  },
  meetingTextCompleted: {
    textDecorationLine: "line-through",
    color: COLORS.textLight,
  },
  reminderText: {
    fontSize: FONTS.small,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  iconButton: {
    padding: SPACING.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONTS.title,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONTS.body,
    color: COLORS.textLight,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
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
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONTS.body,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: SPACING.md,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  dateButtonText: {
    marginLeft: SPACING.sm,
    fontSize: FONTS.body,
    color: COLORS.text,
  },
});
