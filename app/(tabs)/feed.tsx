import { View, Text } from "react-native";
import { styles } from "@/styles/feed.styles";

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
      </View>
    </View>
  );
}
