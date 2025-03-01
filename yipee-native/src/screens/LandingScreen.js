import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LandingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Yipee!³
        {"\n"}ᐠ( ᐛ )ᐟ
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fbf1c7', 
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#3c3836', 
    textShadow: '4px 4px 0 #cc241d', 
  },
  button: {
    backgroundColor: '#689d6a', 
    borderRadius: 0,
    padding: 20,
    marginVertical: 15,
    width: '90%',
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

export default LandingScreen;