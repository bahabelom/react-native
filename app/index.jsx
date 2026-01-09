import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Welcome to React Native! 👋');

  const incrementCount = () => {
    setCount(count + 1);
    if (count + 1 === 10) {
      setMessage('Wow! You reached 10! 🎉');
    } else if (count + 1 === 20) {
      setMessage('Amazing! 20 clicks! 🚀');
    } else {
      setMessage('Keep tapping! 💪');
    }
  };

  const resetCount = () => {
    setCount(0);
    setMessage('Welcome to React Native! 👋');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>My First App</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.counterBox}>
          <Text style={styles.counterLabel}>Tap Count:</Text>
          <Text style={styles.counterNumber}>{count}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={incrementCount}>
            <Text style={styles.buttonText}>Tap Me! 👆</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetCount}>
            <Text style={styles.buttonText}>Reset 🔄</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.notesBox}>
          <Text style={styles.notesTitle}>📚 What you're learning:</Text>
          <Text style={styles.notesText}>• useState - managing app state</Text>
          <Text style={styles.notesText}>• TouchableOpacity - interactive buttons</Text>
          <Text style={styles.notesText}>• StyleSheet - styling components</Text>
          <Text style={styles.notesText}>• View & Text - basic components</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  counterBox: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  counterLabel: {
    fontSize: 16,
    color: '#999',
    marginBottom: 10,
  },
  counterNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notesBox: {
    backgroundColor: '#E8F4F8',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default App;
