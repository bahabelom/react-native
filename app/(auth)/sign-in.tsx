import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import React from 'react';
import { styles } from '@/styles/auth.styles';

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
};

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;
    setError('');

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
    }
  };

  return (
    <ScrollView style={formStyles.container} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <Text style={formStyles.title}>Sign in</Text>
      <Text style={formStyles.subtitle}>Welcome back! Sign in to continue</Text>
      {error ? <Text style={formStyles.errorText}>{error}</Text> : null}
      <TextInput
        style={formStyles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor={styles.tagline.color}
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        keyboardType="email-address"
      />
      <TextInput
        style={formStyles.input}
        value={password}
        placeholder="Enter password"
        placeholderTextColor={styles.tagline.color}
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity style={formStyles.button} onPress={onSignInPress}>
        <Text style={formStyles.buttonText}>Continue</Text>
      </TouchableOpacity>
      <View style={formStyles.linkContainer}>
        <Text style={formStyles.linkText}>Don't have an account?</Text>
        <Link href="/(auth)/sign-up">
          <Text style={formStyles.link}>Sign up</Text>
        </Link>
      </View>
    </ScrollView>
  );
}
