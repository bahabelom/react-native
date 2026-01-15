import { View, Text } from "react-native";
import { styles } from "@/styles/create.styles";

export default function CreateScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create</Text>
      </View>
    </View>
  );
}
