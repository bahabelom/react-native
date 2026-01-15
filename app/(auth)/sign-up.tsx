import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
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

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setError('');

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setError(err?.errors?.[0]?.message || 'An error occurred during sign up');
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setError('');

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/(tabs)/home');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setError('Verification incomplete. Please try again.');
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setError(err?.errors?.[0]?.message || 'Invalid verification code');
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <ScrollView style={formStyles.container} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Text style={formStyles.title}>Verify your email</Text>
        <Text style={formStyles.subtitle}>Enter the code sent to your email</Text>
        {error ? <Text style={formStyles.errorText}>{error}</Text> : null}
        <TextInput
          style={formStyles.input}
          value={code}
          placeholder="Enter verification code"
          placeholderTextColor={styles.tagline.color}
          onChangeText={(code) => setCode(code)}
          autoCapitalize="none"
          keyboardType="number-pad"
        />
        <TouchableOpacity style={formStyles.button} onPress={onVerifyPress}>
          <Text style={formStyles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={formStyles.container} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <Text style={formStyles.title}>Sign up</Text>
      <Text style={formStyles.subtitle}>Create your account to get started</Text>
      {error ? <Text style={formStyles.errorText}>{error}</Text> : null}
      <TextInput
        style={formStyles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor={styles.tagline.color}
        onChangeText={(email) => setEmailAddress(email)}
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
      <TouchableOpacity style={formStyles.button} onPress={onSignUpPress}>
        <Text style={formStyles.buttonText}>Continue</Text>
      </TouchableOpacity>
      <View style={formStyles.linkContainer}>
        <Text style={formStyles.linkText}>Already have an account?</Text>
        <Link href="/(auth)/sign-in">
          <Text style={formStyles.link}>Sign in</Text>
        </Link>
      </View>
    </ScrollView>
  );
}
