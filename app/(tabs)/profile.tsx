import { View, Text, ScrollView } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { styles } from "@/styles/profile.styles";
import { SignOutButton } from "@/components/SignOutButton";
import { COLORS } from "@/constants/theme";

export default function ProfileScreen() {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {user && (
          <>
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 16, color: COLORS.grey, marginBottom: 8 }}>
                Email
              </Text>
              <Text style={{ fontSize: 18, color: COLORS.white, fontWeight: "600" }}>
                {user.primaryEmailAddress?.emailAddress || "No email"}
              </Text>
            </View>
            {user.firstName && (
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 16, color: COLORS.grey, marginBottom: 8 }}>
                  Name
                </Text>
                <Text style={{ fontSize: 18, color: COLORS.white, fontWeight: "600" }}>
                  {user.firstName} {user.lastName || ""}
                </Text>
              </View>
            )}
          </>
        )}
        <View style={{ marginTop: 32 }}>
          <SignOutButton />
        </View>
      </ScrollView>
    </View>
  );
}
