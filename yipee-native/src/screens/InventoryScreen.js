import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { sortInventoryByUrgency } from '../utils/inventoryUtils';
import InventoryTable from '../components/InventoryTable';

const InventoryScreen = () => {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Pasta', quantity: 50, urgency: 'low' },
    { id: 2, name: 'Tomato Sauce', quantity: 20, urgency: 'medium' },
    { id: 3, name: 'Cheese', quantity: 5, urgency: 'high' },
  ]);

  const addItem = (item) => {
    setInventory([...inventory, { id: Date.now(), ...item }]);
  };

  const updateItem = (id, updatedItem) => {
    setInventory(inventory.map(item => item.id === id ? { ...item, ...updatedItem } : item));
  };

  const deleteItem = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Management</Text>
      <InventoryTable 
        data={sortInventoryByUrgency(inventory)}
        addItem={addItem}
        updateItem={updateItem}
        deleteItem={deleteItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default InventoryScreen;