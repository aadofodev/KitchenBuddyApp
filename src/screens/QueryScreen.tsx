// src/screens/QueryScreen.tsx
import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useIngredients } from '../context/IngredientsContext';
import { Ingredient } from '../types/types';
import { QueryStackParamList } from '../navigation/QueryStackNavigator';

type QueryScreenNavigationProp = StackNavigationProp<QueryStackParamList, 'QueryScreen'>;

const QueryScreen = () => {
  const { ingredients, addToGroceryList } = useIngredients();
  const navigation = useNavigation<QueryScreenNavigationProp>();

  const itemsToRecheck = useMemo(() => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return ingredients.filter(item => item.ripeness?.lastChecked && new Date(item.ripeness.lastChecked) < threeDaysAgo);
  }, [ingredients]);

  const lowQuantityItems = useMemo(() => {
    return ingredients.filter(item => item.quantity && item.quantity.value <= 1 && item.quantity.value > 0);
  }, [ingredients]);
  
  const handleAddToGroceries = (item: Ingredient) => {
    addToGroceryList({ name: item.name });
    Alert.alert('Added', `${item.name} was added to your grocery list.`);
  };
  
  const renderAllItem = ({ item }: { item: Ingredient }) => (
    <TouchableOpacity onPress={() => navigation.navigate('EditIngredientScreen', { ingredientId: item.id })}>
      <View style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>{item.brand || 'No brand'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Ripeness Check Needed</Text>
      <FlatList 
        scrollEnabled={false} 
        data={itemsToRecheck} 
        keyExtractor={item => `recheck-${item.id}`} 
        ListEmptyComponent={<Text style={styles.emptyMessage}>All items are up to date.</Text>}
        renderItem={({ item }) => (
          <View style={[styles.itemContainer, styles.recheckItem]}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>Last checked: {new Date(item.ripeness!.lastChecked).toLocaleDateString()}</Text>
          </View>
        )}
      />
      
      <Text style={styles.header}>Low Stock Items</Text>
      <FlatList 
        scrollEnabled={false} 
        data={lowQuantityItems} 
        keyExtractor={item => `low-${item.id}`} 
        ListEmptyComponent={<Text style={styles.emptyMessage}>No items are low on stock.</Text>}
        renderItem={({ item }) => (
          <View style={[styles.itemContainer, styles.lowStockItem]}>
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>Qty: {item.quantity?.value} {item.quantity?.unit}</Text>
            </View>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => handleAddToGroceries(item)}>
              <Text style={styles.secondaryButtonText}>Add to Groceries</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      
      <Text style={styles.header}>All Kitchen Items</Text>
      <FlatList 
        scrollEnabled={false} 
        data={ingredients} 
        keyExtractor={item => `all-${item.id}`} 
        renderItem={renderAllItem} 
        ListEmptyComponent={<Text style={styles.emptyMessage}>Your kitchen is empty.</Text>}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 16, // Increased horizontal padding
    paddingTop: 10, // Added top padding for more space from the status bar/top edge
    backgroundColor: '#F8F8F8' // Light neutral background
  }, 
  header: { 
    fontSize: 24, // Consistent header font size
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 30, // Specific top margin for header
    marginBottom: 20, // Specific bottom margin for header
    color: '#333333' // Darker text for header
  }, 
  itemContainer: { 
    backgroundColor: 'white', 
    padding: 18, // Increased padding
    borderRadius: 8, 
    marginBottom: 12, // Increased space between items
    borderWidth: 1, 
    borderColor: '#EEEEEE', // Very light border
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  }, 
  itemName: { 
    fontSize: 18, 
    fontWeight: '600', // Semibold font weight
    color: '#333333' // Clear text
  }, 
  itemDetails: { 
    fontSize: 14, 
    color: '#666666', // Muted gray for details
    marginTop: 5 
  }, 
  emptyMessage: { 
    textAlign: 'center', 
    marginTop: 20, 
    marginBottom: 30, 
    fontSize: 16, 
    color: '#999999' // Muted color for empty state messages
  }, 
  recheckItem: { 
    backgroundColor: '#FFFDEF', // Very light yellow hue
    borderColor: '#FDE6B0' // Muted yellow border
  }, 
  lowStockItem: { 
    backgroundColor: '#FDEEEE', // Very light red hue
    borderColor: '#FECDD3' // Muted red border
  },

  // --- Button Styles for Minimalism (Copied from AddIngredientScreen for consistency) ---
  primaryButton: {
    backgroundColor: '#60A5FA', // Accent color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF', // White text on accent background
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent', // Transparent background
    paddingVertical: 8, // Slightly smaller padding for list item buttons
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1, // Border with accent color
    borderColor: '#60A5FA', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#60A5FA', // Accent color text
    fontSize: 14, // Slightly smaller font for list item buttons
    fontWeight: '600',
  },
});

export default QueryScreen;