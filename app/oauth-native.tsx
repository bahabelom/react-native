import { useEffect, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { useOAuth, useAuth } from '@clerk/clerk-expo';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '@/constants/theme';

export default function OAuthNativeCallback() {
  const { handleRedirect } = useOAuth({ strategy: 'oauth_google' });
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [isHandling, setIsHandling] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await handleRedirect();
        // If successful, check if signed in and redirect accordingly
        if (isSignedIn) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(auth)/sign-in');
        }
      } catch (error) {
        // If callback fails (e.g., user cancelled), redirect to sign-in
        console.log('OAuth callback error:', error);
        router.replace('/(auth)/sign-in');
      } finally {
        setIsHandling(false);
      }
    };

    handleCallback();
  }, [handleRedirect, isSignedIn, router]);

  // Show loading while handling callback
  if (isHandling) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Fallback redirect
  return <Redirect href="/(auth)/sign-in" />;
}
