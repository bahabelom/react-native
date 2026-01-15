import { styles } from '@/styles/auth.styles';
import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const formStyles = {
  container: {
    flex: 1,
    backgroundColor: styles.container.backgroundColor,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: styles.appName.color,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: 16,
    color: styles.tagline.color,
    marginBottom: 32,
    textAlign: 'center' as const,
  },
  input: {
    backgroundColor: styles.googleButton.backgroundColor,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 16,
    fontSize: 16,
    color: styles.googleButtonText.color,
  },
  button: {
    backgroundColor: styles.appName.color,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center' as const,
    marginTop: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: styles.container.backgroundColor,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  linkContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: 4,
    marginTop: 16,
  },
  linkText: {
    color: styles.tagline.color,
    fontSize: 14,
  },
  link: {
    color: styles.appName.color,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center' as const,
  },
  imageContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingTop: 20,
    paddingBottom: 20,
  },
  image: {
    width: 280,
    height: 280,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center' as const,
  },
  googleButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: styles.googleButton.backgroundColor,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
    backgroundColor: '#4285F4',
    borderRadius: 4,
  },
  googleIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: styles.googleButtonText.color,
  },
  divider: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: styles.tagline.color,
    opacity: 0.3,
  },
  dividerText: {
    marginHorizontal: 16,
    color: styles.tagline.color,
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
};

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
      }// If sign-in process is complete, set the created session as active
      // and redirect the user
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
    <ScrollView 
      style={formStyles.container} 
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Authentication Image */}
      <View style={formStyles.imageContainer}>
        <Image
          source={require('@/assets/images/Authentication-pana.png')}
          style={formStyles.image}
          contentFit="contain"
        />
      </View>

      <View style={formStyles.formContainer}>
        <Text style={formStyles.title}>Sign in</Text>
        <Text style={formStyles.subtitle}>Welcome back! Sign in to continue</Text>
        
        {error ? <Text style={formStyles.errorText}>{error}</Text> : null}

        {/* Google Sign-In Button */}
        <TouchableOpacity 
          style={formStyles.googleButton} 
          onPress={onGoogleSignInPress}
          disabled={loading || !isLoaded}
        >
          <View style={formStyles.googleIconContainer}>
            <Text style={formStyles.googleIcon}>G</Text>
          </View>
          <Text style={formStyles.googleButtonText}>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={formStyles.divider}>
          <View style={formStyles.dividerLine} />
          <Text style={formStyles.dividerText}>or</Text>
          <View style={formStyles.dividerLine} />
        </View>

        {/* Email/Password Form */}
        <TextInput
        style={formStyles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor={styles.tagline.color}
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        keyboardType="email-address"
        editable={!loading}
      />
      <TextInput
        style={formStyles.input}
        value={password}
        placeholder="Enter password"
        placeholderTextColor={styles.tagline.color}
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        editable={!loading}
      />
      <TouchableOpacity 
        style={[formStyles.button, loading && formStyles.buttonDisabled]} 
        onPress={onSignInPress}
        disabled={loading || !isLoaded}
      >
        <Text style={formStyles.buttonText}>
          {loading ? 'Signing in...' : 'Continue'}
        </Text>
      </TouchableOpacity>
      <View style={formStyles.linkContainer}>
        <Text style={formStyles.linkText}>Don't have an account?</Text>
        <Link href="/(auth)/sign-up">
          <Text style={formStyles.link}>Sign up</Text>
        </Link>
      </View>
      </View>
    </ScrollView>
  );
}
