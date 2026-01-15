import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { styles } from "@/styles/profile.styles";
import { SignOutButton } from "@/components/SignOutButton";
import { COLORS } from "@/constants/theme";

export default function ProfileScreen() {
  const { user } = useUser();

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName[0].toUpperCase();
    }
    if (user?.primaryEmailAddress?.emailAddress) {
      return user.primaryEmailAddress.emailAddress[0].toUpperCase();
    }
    return "U";
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={styles.profileScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Data Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={require('@/assets/images/Profile data-bro.png')}
            style={styles.profileDataImage}
            contentFit="contain"
          />
        </View>

        {/* Avatar Section */}
        <View style={styles.profileAvatarSection}>
          <View style={styles.profileAvatarContainer}>
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                style={styles.profileAvatar}
                contentFit="cover"
              />
            ) : (
              <View style={styles.profileAvatarPlaceholder}>
                <Text style={styles.profileAvatarText}>{getInitials()}</Text>
              </View>
            )}
          </View>
          <Text style={styles.profileUserName}>
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.firstName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || "User"}
          </Text>
          {user?.primaryEmailAddress?.emailAddress && (
            <Text style={styles.profileUserEmail}>
              {user.primaryEmailAddress.emailAddress}
            </Text>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.profileInfoSection}>
          {user?.firstName && (
            <View style={styles.profileInfoItem}>
              <Text style={styles.profileInfoLabel}>First Name</Text>
              <Text style={styles.profileInfoValue}>{user.firstName}</Text>
            </View>
          )}
          {user?.lastName && (
            <View style={styles.profileInfoItem}>
              <Text style={styles.profileInfoLabel}>Last Name</Text>
              <Text style={styles.profileInfoValue}>{user.lastName}</Text>
            </View>
          )}
          {user?.primaryEmailAddress?.emailAddress && (
            <View style={styles.profileInfoItem}>
              <Text style={styles.profileInfoLabel}>Email</Text>
              <Text style={styles.profileInfoValue}>
                {user.primaryEmailAddress.emailAddress}
              </Text>
            </View>
          )}
        </View>

        {/* Sign Out Button */}
        <View style={styles.profileSignOutContainer}>
          <SignOutButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
