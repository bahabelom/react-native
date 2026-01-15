import { View, Text } from "react-native";
import { styles } from "@/styles/profile.styles";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
    </View>
  );
}
