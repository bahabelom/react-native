import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { useQuery, useMutation } from "convex/react";
import { ScrollView, Text, View, TouchableOpacity, Alert, TextInput, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

export default function HomeScreen() {
  const tasks = useQuery(api.tasks.get);
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const deleteTask = useMutation(api.tasks.remove);
  
  const [newTaskText, setNewTaskText] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<{ id: Id<"tasks">; text: string } | null>(null);
  const [editText, setEditText] = useState("");

  const handleCreateTask = async () => {
    if (!newTaskText.trim()) {
      Alert.alert("Error", "Please enter a task");
      return;
    }

    setIsCreating(true);
    try {
      await createTask({ text: newTaskText.trim() });
      setNewTaskText("");
      Alert.alert("Success", "Task created successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleComplete = async (taskId: Id<"tasks">, currentStatus: boolean) => {
    try {
      await updateTask({ id: taskId, isCompleted: !currentStatus });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update task");
    }
  };

  const handleEditTask = (task: { _id: Id<"tasks">; text: string }) => {
    setEditingTask({ id: task._id, text: task.text });
    setEditText(task.text);
  };

  const handleSaveEdit = async () => {
    if (!editingTask || !editText.trim()) {
      Alert.alert("Error", "Please enter a task");
      return;
    }

    try {
      await updateTask({ id: editingTask.id, text: editText.trim() });
      setEditingTask(null);
      setEditText("");
      Alert.alert("Success", "Task updated successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update task");
    }
  };

  const handleDeleteTask = (taskId: Id<"tasks">) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTask({ id: taskId });
              Alert.alert("Success", "Task deleted successfully!");
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete task");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
      </View>

      {/* Create Task Input */}
      <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.surface }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: COLORS.surface,
              color: COLORS.white,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 8,
              fontSize: 16,
            }}
            placeholder="Enter a new task..."
            placeholderTextColor={COLORS.grey}
            value={newTaskText}
            onChangeText={setNewTaskText}
            onSubmitEditing={handleCreateTask}
          />
          <TouchableOpacity
            onPress={handleCreateTask}
            disabled={isCreating || !newTaskText.trim()}
            style={{
              backgroundColor: COLORS.primary,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8,
              justifyContent: 'center',
              opacity: isCreating || !newTaskText.trim() ? 0.6 : 1,
            }}
          >
            <Text style={{ color: COLORS.white, fontWeight: '600', fontSize: 16 }}>
              {isCreating ? '...' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {tasks === undefined ? (
          <Text style={{ color: COLORS.grey, textAlign: 'center', marginTop: 20 }}>
            Loading tasks...
          </Text>
        ) : tasks.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: COLORS.grey, textAlign: 'center' }}>
              No tasks yet. Create one above!
            </Text>
          </View>
        ) : (
          tasks.map((task) => (
            <View
              key={task._id}
              style={{
                backgroundColor: COLORS.surface,
                padding: 16,
                borderRadius: 8,
                marginBottom: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {/* Toggle Complete Checkbox */}
              <TouchableOpacity
                onPress={() => handleToggleComplete(task._id, task.isCompleted || false)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: task.isCompleted ? COLORS.primary : 'transparent',
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {task.isCompleted && (
                  <Text style={{ color: COLORS.white, fontSize: 14, fontWeight: 'bold' }}>✓</Text>
                )}
              </TouchableOpacity>

              {/* Task Text */}
              <TouchableOpacity
                onPress={() => handleEditTask(task)}
                style={{ flex: 1 }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 16,
                    textDecorationLine: task.isCompleted ? 'line-through' : 'none',
                    opacity: task.isCompleted ? 0.6 : 1,
                  }}
                >
                  {task.text}
                </Text>
              </TouchableOpacity>

              {/* Edit Button */}
              <TouchableOpacity
                onPress={() => handleEditTask(task)}
                style={{
                  padding: 8,
                }}
              >
                <Text style={{ color: COLORS.primary, fontSize: 14, fontWeight: '600' }}>
                  Edit
                </Text>
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity
                onPress={() => handleDeleteTask(task._id)}
                style={{
                  padding: 8,
                }}
              >
                <Text style={{ color: '#EF4444', fontSize: 14, fontWeight: '600' }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editingTask !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditingTask(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: '600', marginBottom: 16 }}>
              Edit Task
            </Text>
            <TextInput
              style={{
                backgroundColor: COLORS.background,
                color: COLORS.white,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 8,
                fontSize: 16,
                marginBottom: 16,
              }}
              placeholder="Enter task text..."
              placeholderTextColor={COLORS.grey}
              value={editText}
              onChangeText={setEditText}
              autoFocus
            />
            <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => {
                  setEditingTask(null);
                  setEditText("");
                }}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor: COLORS.grey + '30',
                }}
              >
                <Text style={{ color: COLORS.white }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveEdit}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor: COLORS.primary,
                }}
              >
                <Text style={{ color: COLORS.white, fontWeight: '600' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
