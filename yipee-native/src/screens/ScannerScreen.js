import React, { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Button, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const ScannerScreen = () => {

  const [facing, setFacing] = useState('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);

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

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo);
      sendPhotoSimulation(photo);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0]);
      sendPhoto(result.assets[0]);
    }
  };

  const sendPhoto = (photo) => {
    // right now we're simulating sending photos to a file server somewhere, maybe could
    // consider implementing an API that can do OCR for us???
    // ~ gong
    console.log('Simulating sending photo for now:', photo.uri);
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo.uri }} style={styles.preview} />
          <TouchableOpacity style={styles.button} onPress={() => setPhoto(null)}>
            <Text style={styles.text}>Take Another Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView 
          style={styles.camera} 
          type={facing}
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.text}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={styles.text}>Pick from Gallery</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbf1c7',
  },
  preview: {
    width: '80%',
    height: '60%',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#3c3836',
  },
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
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
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