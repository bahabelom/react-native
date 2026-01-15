import { styles } from '@/styles/auth.styles';
import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
      // Handle user cancellation gracefully
      const errorMessage = err?.errors?.[0]?.message || err?.message || '';
      const errorCode = err?.errors?.[0]?.code || err?.code || '';
      
      // Check if user cancelled the OAuth flow
      if (
        errorMessage.toLowerCase().includes('cancel') ||
        errorMessage.toLowerCase().includes('cancelled') ||
        errorMessage.toLowerCase().includes('user_cancelled') ||
        errorCode === 'user_cancelled' ||
        errorCode === 'oauth_cancelled'
      ) {
        // Silently handle cancellation - don't show error message
        setError('');
        return;
      }

      // Handle network errors
      if (
        errorMessage.toLowerCase().includes('network') ||
        errorMessage.toLowerCase().includes('connection') ||
        errorMessage.toLowerCase().includes('timeout')
      ) {
        setError('Network error. Please check your connection and try again.');
        return;
      }

      // Handle other OAuth errors
      if (errorMessage) {
        setError(errorMessage);
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
      
      console.error('OAuth error:', JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;
    
    // Basic validation
    if (!emailAddress.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setError('');
    setLoading(true);

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress.trim(),
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
        console.error('Sign in incomplete:', JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      // Handle different types of errors gracefully
      const errorMessage = err?.errors?.[0]?.message || err?.message || '';
      const errorCode = err?.errors?.[0]?.code || err?.code || '';

      // Handle network errors
      if (
        errorMessage.toLowerCase().includes('network') ||
        errorMessage.toLowerCase().includes('connection') ||
        errorMessage.toLowerCase().includes('timeout') ||
        errorMessage.toLowerCase().includes('fetch')
      ) {
        setError('Network error. Please check your connection and try again.');
        return;
      }

      // Handle invalid credentials
      if (
        errorMessage.toLowerCase().includes('invalid') ||
        errorMessage.toLowerCase().includes('incorrect') ||
        errorCode === 'form_identifier_not_found' ||
        errorCode === 'form_password_incorrect'
      ) {
        setError('Invalid email or password. Please try again.');
        return;
      }

      // Handle account locked/suspended
      if (
        errorMessage.toLowerCase().includes('locked') ||
        errorMessage.toLowerCase().includes('suspended') ||
        errorMessage.toLowerCase().includes('disabled')
      ) {
        setError('Your account has been locked. Please contact support.');
        return;
      }

      // Handle other errors
      if (errorMessage) {
        setError(errorMessage);
      } else {
        setError('An error occurred. Please try again.');
      }
      
      console.error('Sign in error:', JSON.stringify(err, null, 2));
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
              onChangeText={(emailAddress) => {
                setEmailAddress(emailAddress);
                // Clear error when user starts typing
                if (error) setError('');
              }}
              keyboardType="email-address"
              editable={!loading}
            />
            <TextInput
              style={styles.signInInput}
              value={password}
              placeholder="Password"
              placeholderTextColor={styles.tagline.color}
              secureTextEntry={true}
              onChangeText={(password) => {
                setPassword(password);
                // Clear error when user starts typing
                if (error) setError('');
              }}
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
