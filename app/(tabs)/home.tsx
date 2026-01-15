import { View, Text } from "react-native";
import { styles } from "@/styles/feed.styles";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
      </View>
    </View>
  );
}
