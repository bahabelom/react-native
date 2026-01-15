import { styles } from '@/styles/auth.styles';
import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Handle Google OAuth sign-in
  const onGoogleSignInPress = async () => {
    if (!isLoaded) return;
    setError('');
    setLoading(true);

    try {
      const { createdSessionId, setActive: setActiveSession } = await startOAuthFlow();

      if (createdSessionId && setActiveSession) {
        await setActiveSession({ session: createdSessionId });
        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Failed to sign in with Google');
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;
    setError('');
    setLoading(true);

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(tabs)/home');
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        setError('Sign in incomplete. Please try again.');
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setError(err?.errors?.[0]?.message || 'Invalid email or password');
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.signInContainer} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.signInContent}>
          {/* Authentication Image */}
          <View style={styles.signInImageContainer}>
            <Image
              source={require('@/assets/images/Authentication-pana.png')}
              style={styles.signInImage}
              contentFit="contain"
            />
          </View>

          <View style={styles.signInFormContainer}>
            <Text style={styles.signInTitle}>Sign in</Text>
            <Text style={styles.signInSubtitle}>Welcome back! Sign in to continue</Text>
            
            {error ? <Text style={styles.signInErrorText}>{error}</Text> : null}

            {/* Email/Password Form */}
            <TextInput
              style={styles.signInInput}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email"
              placeholderTextColor={styles.tagline.color}
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
              keyboardType="email-address"
              editable={!loading}
            />
            <TextInput
              style={styles.signInInput}
              value={password}
              placeholder="Password"
              placeholderTextColor={styles.tagline.color}
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
              editable={!loading}
            />
            <TouchableOpacity 
              style={[styles.signInButton, loading && styles.signInButtonDisabled]} 
              onPress={onSignInPress}
              disabled={loading || !isLoaded}
            >
              <Text style={styles.signInButtonText}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.signInDivider}>
              <View style={styles.signInDividerLine} />
              <Text style={styles.signInDividerText}>or</Text>
              <View style={styles.signInDividerLine} />
            </View>

            {/* Google Sign-In Button */}
            <TouchableOpacity 
              style={styles.signInGoogleButton} 
              onPress={onGoogleSignInPress}
              disabled={loading || !isLoaded}
            >
              <View style={styles.signInGoogleIconContainer}>
                <Text style={styles.signInGoogleIcon}>G</Text>
              </View>
              <Text style={styles.signInGoogleButtonText}>
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </Text>
            </TouchableOpacity>

            <View style={styles.signInLinkContainer}>
              <Text style={styles.signInLinkText}>Don't have an account?</Text>
              <Link href="/(auth)/sign-up">
                <Text style={styles.signInLink}>Sign up</Text>
              </Link>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
