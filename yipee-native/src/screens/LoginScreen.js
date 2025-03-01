import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// comment in the below imports when firebase is linked up
// ~ gong

// import { auth } from '../../firebaseConfig';
// import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = () => {

  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'username' && password === 'password') { // test values we'll need to change later ~ gong
      alert('Login successful!');
      navigation.navigate('MainDashboard');
    } else {
      alert('Invalid credentials');
    }
  };

    // uncomment this when we're ready to use firebase authentication
    // ~ gong
    /*
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('User signed in:', user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login error:', errorCode, errorMessage);
      });
    */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#3c3836',
    textShadow: '4px 4px 0 #cc241d',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fbf1c7', 
  },
  input: {
    width: '100%',
    height: 60,
    borderColor: '#3c3836',
    borderWidth: 4,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 18,
    color: '#3c3836',
    backgroundColor: '#ebdbb2', 
  },
  button: {
    backgroundColor: '#689d6a',
    borderRadius: 0,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#3c3836',
    shadowColor: '#3c3836',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fbf1c7',
    textTransform: 'uppercase',
  },
});

export default LoginScreen;