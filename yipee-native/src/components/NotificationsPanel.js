import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const initialNotifications = [
  { id: '1', message: 'Your stock of Penne Pasta is running out', urgency: 'high' },
  { id: '2', message: 'Anticipated high demand for tomato sauce in the coming 2 weeks', urgency: 'medium' },
  { id: '3', message: 'Shipping delays for cherries for the coming fall season', urgency: 'low' },
  { id: '4', message: 'Coffee beans inventory low – consider ordering more soon', urgency: 'high' },
  { id: '5', message: 'Specialty teas running low; order to avoid stockouts', urgency: 'medium' },
  { id: '6', message: 'Fresh pastries delivery delayed by 2 hours today', urgency: 'high' },
  { id: '7', message: 'Your order for oat milk has shipped', urgency: 'low' },
  { id: '8', message: 'High demand for gluten-free bread expected this week', urgency: 'medium' },
  { id: '9', message: 'Stock of avocados is running low for guacamole orders', urgency: 'high' },
  { id: '10', message: 'New shipment of seasonal fruits (apples, pears) arriving tomorrow', urgency: 'low' },
  { id: '11', message: 'Order for fresh eggs is confirmed, delivery expected Friday', urgency: 'low' },
  { id: '12', message: 'Unexpected ingredient shortage of almond flour – restocking delayed', urgency: 'high' },
  { id: '13', message: 'Bottled water supplier will be unavailable for the next 3 days', urgency: 'medium' },
  { id: '14', message: 'Expect a new batch of pastries by tomorrow morning', urgency: 'low' },
  { id: '15', message: 'Milk delivery confirmed for 9 AM tomorrow', urgency: 'low' },
  { id: '16', message: 'We’ve received a new shipment of freshly brewed coffee beans', urgency: 'low' },
  { id: '17', message: 'Prepare for an influx of orders on National Pancake Day next week', urgency: 'medium' },
  { id: '18', message: 'Your order for sugar packets has shipped', urgency: 'low' },
  { id: '19', message: 'Supplier update: Your regular delivery of sourdough will be delayed', urgency: 'high' },
  { id: '20', message: 'There’s a potential issue with your milk supplier’s order. Follow up required', urgency: 'high' },
  { id: '21', message: 'Seasonal herbs (basil, mint) available in bulk starting tomorrow', urgency: 'low' },
  { id: '22', message: 'Check your cheese stock; expected higher usage for the upcoming weekend', urgency: 'medium' },
  { id: '23', message: 'The kitchen cleaning service will arrive tomorrow at 10 AM', urgency: 'low' }
];

const NotificationsPanel = () => {

  const [notifications, setNotifications] = useState(initialNotifications);

  const removeNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={[styles.notificationItem, styles[item.urgency]]}>
      <Text style={styles.notificationText}>{item.message}</Text>
      <TouchableOpacity 
        style={styles.removeButton} 
        onPress={() => removeNotification(item.id)}
      >
      <Text style={styles.removeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
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
    width: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3c3836',
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadow: '3px 3px 0 #cc241d',
  },
  notificationItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 0,
    borderWidth: 3,
    borderColor: '#3c3836',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeButton: {
    padding: 5,
    backgroundColor: '#3c3836',
    borderRadius: 0,
  },
  removeButtonText: {
    color: '#fbf1c7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationText: {
    color: '#3c3836',
    fontSize: 16,
    fontWeight: 'bold',
  },
  high: {
    backgroundColor: '#cc241d',
  },
  medium: {
    backgroundColor: '#d79921',
  },
  low: {
    backgroundColor: '#98971a',
  },
});

export default NotificationsPanel;