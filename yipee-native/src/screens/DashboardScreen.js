import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import NotificationsPanel from '../components/NotificationsPanel';

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Inventory')}>
          <Text style={styles.buttonText}>Manage Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scanner')}>
          <Text style={styles.buttonText}>Scan POS Slip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Analytics')}>
          <Text style={styles.buttonText}>View Sales Analytics</Text>
        </TouchableOpacity>
      </View>
      <NotificationsPanel />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fbf1c7', 
  },
  content: {
    flex: 3,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
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

export default DashboardScreen;