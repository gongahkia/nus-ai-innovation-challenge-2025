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
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 10,
    padding: 5,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  deleteButton: {
    color: 'red',
  },
});

export default InventoryTable;