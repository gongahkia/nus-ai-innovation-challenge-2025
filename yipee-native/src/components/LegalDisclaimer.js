import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LegalDisclaimer = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Legal Disclaimer</Text>
      <Text style={styles.text}>
        By registering, you agree to our Terms of Service and Privacy Policy. 
        You certify that all information provided is accurate and complete. 
        You understand that false information may result in termination of your account.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
  },
});

export default LegalDisclaimer;