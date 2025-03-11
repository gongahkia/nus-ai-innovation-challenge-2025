import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import NotificationsPanel from '../components/NotificationsPanel';

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      
      <View style={styles.notificationsPanelContainer}>
        <NotificationsPanel />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Inventory')}>
          <Text style={styles.smallButtonText}>Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Scanner')}>
          <Text style={styles.smallButtonText}>Scan POS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Analytics')}>
          <Text style={styles.smallButtonText}>Analytics</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf1c7',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#3c3836',
    textShadow: '4px 4px 0 #cc241d',
  },
  notificationsPanelContainer: {
    flex: 1,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallButton: {
    backgroundColor: '#689d6a',
    borderRadius: 0,
    padding: 10,
    width: '30%',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#3c3836',
    shadowColor: '#3c3836',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  smallButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fbf1c7',
    textTransform: 'uppercase',
  },
});

export default DashboardScreen;