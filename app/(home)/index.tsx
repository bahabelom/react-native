import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { SignOutButton } from '@/components/SignOutButton';
import { COLORS } from '@/constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: COLORS.grey,
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 24,
    fontWeight: '600',
  },
  linkContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  link: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function Page() {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <SignedIn>
        <Text style={styles.title}>Welcome!</Text>
        {user && (
          <>
            <Text style={styles.text}>Signed in as:</Text>
            <Text style={styles.email}>{user.primaryEmailAddress?.emailAddress}</Text>
          </>
        )}
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Text style={styles.title}>Please sign in</Text>
        <View style={styles.linkContainer}>
          <Link href="/(auth)/sign-in">
            <Text style={styles.link}>Sign in</Text>
          </Link>
          <Text style={styles.text}>or</Text>
          <Link href="/(auth)/sign-up">
            <Text style={styles.link}>Sign up</Text>
          </Link>
        </View>
      </SignedOut>
    </View>
  );
}
