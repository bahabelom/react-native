import { View, Text } from "react-native";
import { styles } from "@/styles/notifications.styles";

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
    </View>
  );
}
