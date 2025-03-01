import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';

const InventoryTable = ({ data, addItem, updateItem, deleteItem }) => {
  const [newItem, setNewItem] = useState({ name: '', quantity: '', urgency: 'low' });

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text>{item.name}</Text>
      <Text>{item.quantity}</Text>
      <Text>{item.urgency}</Text>
      <TouchableOpacity onPress={() => deleteItem(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Item Name"
          value={newItem.name}
          onChangeText={(text) => setNewItem({...newItem, name: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={newItem.quantity}
          onChangeText={(text) => setNewItem({...newItem, quantity: text})}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.addButton} onPress={() => addItem(newItem)}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 4,
    borderColor: '#3c3836',
    marginRight: 10,
    padding: 10,
    fontSize: 18,
    backgroundColor: '#ebdbb2',
  },
  addButton: {
    backgroundColor: '#689d6a',
    padding: 10,
    borderRadius: 0,
    borderWidth: 4,
    borderColor: '#3c3836',
    shadowColor: '#3c3836',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  buttonText: {
    color: '#fbf1c7',
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 4,
    borderBottomColor: '#3c3836',
    backgroundColor: '#ebdbb2',
  },
  deleteButton: {
    color: '#cc241d',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default InventoryTable;