import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import LegalDisclaimer from '../components/LegalDisclaimer';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

const RegisterScreen = () => {

  const navigation = useNavigation();
  const [businessData, setBusinessData] = useState({
    industry: '',
    ownerNames: '',
    annualIncome: '',
    businessLocation: '',
    hasPhysicalLocation: false,
    username: '',
    password: '',
    recoveryEmail: '',
    recoveryPhone: '',
  });

  const handleRegister = () => {

    console.log('Registration data:', businessData);

    navigation.navigate('MainDashboard');

    // uncomment this when we're ready to use Firebase
    /*
    createUserWithEmailAndPassword(auth, businessData.username, businessData.password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // Store additional business data in Firestore
        return setDoc(doc(db, "businesses", user.uid), {
          industry: businessData.industry,
          ownerNames: businessData.ownerNames,
          annualIncome: businessData.annualIncome,
          businessLocation: businessData.businessLocation,
          hasPhysicalLocation: businessData.hasPhysicalLocation,
          recoveryEmail: businessData.recoveryEmail,
          recoveryPhone: businessData.recoveryPhone,
        });
      })
      .then(() => {
        console.log("Business registered successfully");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Registration error:', errorCode, errorMessage);
      });
    */
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Industry"
        value={businessData.industry}
        onChangeText={(text) => setBusinessData({...businessData, industry: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Owner Names"
        value={businessData.ownerNames}
        onChangeText={(text) => setBusinessData({...businessData, ownerNames: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Annual Income"
        value={businessData.annualIncome}
        onChangeText={(text) => setBusinessData({...businessData, annualIncome: text})}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Business Location"
        value={businessData.businessLocation}
        onChangeText={(text) => setBusinessData({...businessData, businessLocation: text})}
      />
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => setBusinessData({...businessData, hasPhysicalLocation: !businessData.hasPhysicalLocation})}
      >
        <Text>Has Physical Location: {businessData.hasPhysicalLocation ? 'Yes' : 'No'}</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={businessData.username}
        onChangeText={(text) => setBusinessData({...businessData, username: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={businessData.password}
        onChangeText={(text) => setBusinessData({...businessData, password: text})}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Recovery Email"
        value={businessData.recoveryEmail}
        onChangeText={(text) => setBusinessData({...businessData, recoveryEmail: text})}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Recovery Phone"
        value={businessData.recoveryPhone}
        onChangeText={(text) => setBusinessData({...businessData, recoveryPhone: text})}
        keyboardType="phone-pad"
      />
      <LegalDisclaimer />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default RegisterScreen;