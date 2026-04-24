import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import useTasks from '../../hooks/useTasks';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import AITaskModal from '../../components/modals/AITaskModal';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

export default function TasksScreen() {
  const { tasks, loading, addTask, updateTask, deleteTask, toggleComplete } = useTasks();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [reminderDate, setReminderDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  const handleSaveTask = async () => {
    if (!taskText.trim()) {
      Alert.alert('Empty Task', 'Please enter a task description');
      return;
    }

    try {
      if (editingTask) {
        await updateTask(editingTask.id, {
          task: taskText,
          reminder: reminderDate,
        });
      } else {
        await addTask({
          task: taskText,
          reminder: reminderDate,
        });
      }
      
      setModalVisible(false);
      setTaskText('');
      setReminderDate(null);
      setEditingTask(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to save task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskText(task.task);
    setReminderDate(task.reminder);
    setModalVisible(true);
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteTask(taskId),
        },
      ]
    );
  };

  const handleDateConfirm = (date) => {
    setReminderDate(date);
    setShowDatePicker(false);
  };

  const handleAITasksGenerated = async (tasks) => {
    try {
      for (const taskText of tasks) {
        await addTask({ task: taskText, reminder: null });
      }
      Alert.alert('Success', `Added ${tasks.length} tasks!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to add some tasks');
    }
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleComplete(item.id, item.completed)}
      >
        {item.completed && (
          <Ionicons name="checkmark" size={18} color={COLORS.primary} />
        )}
      </TouchableOpacity>

      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskText,
            item.completed && styles.taskTextCompleted,
          ]}
        >
          {item.task}
        </Text>
        {item.reminder && (
          <Text style={styles.reminderText}>
            ⏰ {dayjs(item.reminder.toDate()).format('MMM D, YYYY h:mm A')}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => handleEditTask(item)}
      >
        <Ionicons name="pencil" size={20} color={COLORS.primary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => handleDeleteTask(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>No Tasks Yet</Text>
          <Text style={styles.emptyText}>
            Tap the + button to add manually or use 🤖 AI to generate tasks
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity
        style={styles.aiFab}
        onPress={() => setAiModalVisible(true)}
      >
        <Text style={styles.aiFabText}>🤖 AI</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>

      <AITaskModal
        visible={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
        onTasksGenerated={handleAITasksGenerated}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingTask ? 'Edit Task' : 'New Task'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="What do you need to do?"
              value={taskText}
              onChangeText={setTaskText}
              multiline
              autoFocus
            />

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
              <Text style={styles.dateButtonText}>
                {reminderDate
                  ? dayjs(reminderDate).format('MMM D, YYYY h:mm A')
                  : 'Set Reminder (optional)'}
              </Text>
            </TouchableOpacity>

            <PrimaryButton
              title={editingTask ? 'Update Task' : 'Add Task'}
              onPress={handleSaveTask}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="datetime"
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
        minimumDate={new Date()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  listContent: {
    padding: SPACING.md,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.text,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  reminderText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  iconButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  aiFab: {
    position: 'absolute',
    bottom: 90,
    right: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  aiFabText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.primary,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.text,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: SPACING.md,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  dateButtonText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});