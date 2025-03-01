import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const ScannerScreen = () => {

  const [facing, setFacing] = useState('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  if (!cameraPermission) { // camera permissions are still loading
    return <View />;
  }

  if (!cameraPermission.granted) { // camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.title}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestCameraPermission}>
          <Text style={styles.text}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} type={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}> Flip Camera </Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#3c3836',
    textShadow: '4px 4px 0 #cc241d',
  },
  container: {
    flex: 1,
    backgroundColor: '#fbf1c7', 
  },
  camera: {
    flex: 1,
    borderWidth: 4,
    borderColor: '#3c3836',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: '#689d6a',
    padding: 20,
    borderRadius: 0,
    borderWidth: 4,
    borderColor: '#3c3836',
    shadowColor: '#3c3836',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fbf1c7',
    textTransform: 'uppercase',
  },
  permissionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3c3836',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ScannerScreen;