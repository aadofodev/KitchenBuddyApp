// src/screens/GroceryListScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useIngredients } from '../context/IngredientsContext';

export default function GroceryListScreen() {
  const { groceryList, recentlyBought, addToGroceryList, buyFromGroceryList } = useIngredients();
  const [quickAddItem, setQuickAddItem] = useState('');

  const handleQuickAdd = () => { if (!quickAddItem.trim()) return; addToGroceryList({ name: quickAddItem.trim() }); setQuickAddItem(''); };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quick Add</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="e.g., Pasta, Olive Oil" 
          value={quickAddItem} 
          onChangeText={setQuickAddItem} 
          placeholderTextColor="#999999" // Muted placeholder color
        />
        <TouchableOpacity style={styles.primaryButton} onPress={handleQuickAdd}>
          <Text style={styles.primaryButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.header}>Shopping List</Text>
      <FlatList data={groceryList} keyExtractor={item => item.id} ListEmptyComponent={<Text style={styles.emptyMessage}>Shopping list is empty.</Text>}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => buyFromGroceryList(item.id)}>
              <Text style={styles.secondaryButtonText}>Buy</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.header}>Recently Bought</Text>
      <FlatList data={recentlyBought} keyExtractor={item => item.id} ListEmptyComponent={<Text style={styles.emptyMessage}>No recently bought items.</Text>}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.itemName}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      padding: 16, 
      paddingTop: 30, // Increased top padding for the container
      backgroundColor: '#F8F8F8' 
    }, 
    header: { 
      fontSize: 24, 
      fontWeight: 'bold', 
      marginTop: 20, // Adjusted to work with container's paddingTop
      marginBottom: 15, 
      color: '#333333' 
    }, 
    inputContainer: { flexDirection: 'row', marginBottom: 15, gap: 10 }, // Spacing for input and button
    input: { 
      flex: 1, 
      borderWidth: 1, 
      borderColor: '#EEEEEE', 
      padding: 12, 
      borderRadius: 8, 
      backgroundColor: 'white',
      fontSize: 16,
      color: '#333333'
    }, 
    listItem: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: 18, 
      backgroundColor: 'white', 
      borderWidth: 1, 
      borderColor: '#EEEEEE', 
      borderRadius: 8, 
      marginBottom: 8 // Less space between list items
    }, 
    itemName: { fontSize: 16, color: '#333333' }, 
    emptyMessage: { textAlign: 'center', color: '#999999', marginVertical: 20 },

    // --- Button Styles for Minimalism (reused) ---
    primaryButton: {
      backgroundColor: '#60A5FA', 
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButtonText: {
      color: '#FFFFFF', 
      fontSize: 16,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      paddingVertical: 8, // Smaller padding for list item buttons
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#60A5FA', 
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryButtonText: {
      color: '#60A5FA', 
      fontSize: 14, // Smaller font for list item buttons
      fontWeight: '600',
    },
});