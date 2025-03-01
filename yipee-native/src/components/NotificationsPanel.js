import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const notifications = [
  { id: '1', message: 'Your stock of PASTA is running out', urgency: 'high' },
  { id: '2', message: 'Anticipated high demand for tomato sauce in the coming 2 weeks', urgency: 'medium' },
  { id: '3', message: 'Shipping delays for cherries for the coming fall season', urgency: 'low' },
];

const NotificationsPanel = () => {
  const renderItem = ({ item }) => (
    <View style={[styles.notificationItem, styles[item.urgency]]}>
      <Text style={styles.notificationText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ebdbb2',
    padding: 20,
    borderRadius: 0,
    marginVertical: 15,
    borderWidth: 4,
    borderColor: '#3c3836',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3c3836',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  notificationItem: {
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  notificationText: {
    color: 'white',
  },
  high: {
    backgroundColor: '#ff4444',
  },
  medium: {
    backgroundColor: '#ffbb33',
  },
  low: {
    backgroundColor: '#00C851',
  },
});

export default NotificationsPanel;