import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { useQuery, useMutation } from "convex/react";
import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function HomeScreen() {
  const tasks = useQuery(api.tasks.get);
  const createTask = useMutation(api.tasks.create);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTestTask = async () => {
    setIsCreating(true);
    try {
      await createTask({ text: "Test task - " + new Date().toLocaleTimeString() });
      Alert.alert("Success", "Task created successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
      </View>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {tasks === undefined ? (
          <Text style={{ color: COLORS.grey, textAlign: 'center', marginTop: 20 }}>
            Loading tasks...
          </Text>
        ) : tasks.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: COLORS.grey, textAlign: 'center', marginBottom: 20 }}>
              No tasks found
            </Text>
            <TouchableOpacity
              onPress={handleCreateTestTask}
              disabled={isCreating}
              style={{
                backgroundColor: COLORS.primary,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
                opacity: isCreating ? 0.6 : 1,
              }}
            >
              <Text style={{ color: COLORS.white, fontWeight: '600' }}>
                {isCreating ? 'Creating...' : 'Create Test Task'}
              </Text>
            </TouchableOpacity>
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
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: task.isCompleted ? COLORS.primary : 'transparent',
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                  marginRight: 12,
                }}
              />
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 16,
                  flex: 1,
                  textDecorationLine: task.isCompleted ? 'line-through' : 'none',
                  opacity: task.isCompleted ? 0.6 : 1,
                }}
              >
                {task.text}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
