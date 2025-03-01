import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import LegalDisclaimer from '../components/LegalDisclaimer';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

const RegisterScreen = () => {

  const navigation = useNavigation();
  const [errors, setErrors] = useState({});
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

  const validateInputs = () => {
    let newErrors = {};
    if (!businessData.industry) newErrors.industry = "Industry is required";
    if (!businessData.ownerNames) newErrors.ownerNames = "Owner names are required";
    if (!businessData.annualIncome) newErrors.annualIncome = "Annual income is required";
    if (!businessData.businessLocation) newErrors.businessLocation = "Business location is required";
    if (!businessData.username) newErrors.username = "Username is required";
    if (!businessData.password) newErrors.password = "Password is required";
    if (!businessData.recoveryEmail) {
      newErrors.recoveryEmail = "Recovery email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessData.recoveryEmail)) {
      newErrors.recoveryEmail = "Invalid email format";
    }
    if (!businessData.recoveryPhone) {
      newErrors.recoveryPhone = "Recovery phone is required";
    } else if (!/^65\d{8}$/.test(businessData.recoveryPhone)) {
      newErrors.recoveryPhone = "Phone must start with 65 and be 10 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {

    if (!validateInputs()) return;

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
      {errors.industry && <Text style={styles.errorText}>{errors.industry}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Owner Names"
        value={businessData.ownerNames}
        onChangeText={(text) => setBusinessData({...businessData, ownerNames: text})}
      />
      {errors.ownerNames && <Text style={styles.errorText}>{errors.ownerNames}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Annual Income"
        value={businessData.annualIncome}
        onChangeText={(text) => setBusinessData({...businessData, annualIncome: text})}
        keyboardType="numeric"
      />
      {errors.annualIncome && <Text style={styles.errorText}>{errors.annualIncome}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Business Location"
        value={businessData.businessLocation}
        onChangeText={(text) => setBusinessData({...businessData, businessLocation: text})}
      />
      {errors.businessLocation && <Text style={styles.errorText}>{errors.businessLocation}</Text>}
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
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={businessData.password}
        onChangeText={(text) => setBusinessData({...businessData, password: text})}
        secureTextEntry
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Recovery Email"
        value={businessData.recoveryEmail}
        onChangeText={(text) => setBusinessData({...businessData, recoveryEmail: text})}
        keyboardType="email-address"
      />
      {errors.recoveryEmail && <Text style={styles.errorText}>{errors.recoveryEmail}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Recovery Phone"
        value={businessData.recoveryPhone}
        onChangeText={(text) => setBusinessData({...businessData, recoveryPhone: text})}
        keyboardType="phone-pad"
      />
      {errors.recoveryPhone && <Text style={styles.errorText}>{errors.recoveryPhone}</Text>}
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default RegisterScreen;