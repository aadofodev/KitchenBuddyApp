// src/screens/AddIngredientScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useIngredients } from '../context/IngredientsContext';
import { AddStackParamList } from '../navigation/AddStackNavigator';
import { GroceryItem } from '../types/types';

// Define types for navigation and route props
type AddScreenNavigationProp = StackNavigationProp<AddStackParamList, 'AddIngredient'>;
type AddScreenRouteProp = RouteProp<{ AddIngredient: { name?: string; brand?: string; sourceItem?: GroceryItem, shelfLife?: number; } }, 'AddIngredient'>;

const AddIngredientScreen = () => {
  const { addIngredient, addIngredientFromBought } = useIngredients();
  const navigation = useNavigation<AddScreenNavigationProp>();
  const route = useRoute<AddScreenRouteProp>();

  // State variables for ingredient details
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sourceItem, setSourceItem] = useState<GroceryItem | undefined>(undefined);

  // Effect to pre-fill fields if coming from a navigation route (e.g., after scanning a barcode)
  useEffect(() => {
    if (route.params) {
      const { name: paramName, brand: paramBrand, sourceItem: paramSourceItem, shelfLife } = route.params;
      if (paramSourceItem) {
        setSourceItem(paramSourceItem);
        setName(paramSourceItem.name); // Set name from source item if available
      } else {
        if (paramName) setName(paramName);
        if (paramBrand) setBrand(paramBrand);
      }
      if (shelfLife) setDate(new Date(Date.now() + shelfLife)); // Set expiration based on shelf life
    }
  }, [route.params]);

  // Handler for date picker changes
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep date picker open on iOS until manually dismissed
    if (selectedDate) setDate(selectedDate);
  };
  
  // Function to reset all form fields
  const resetForm = () => { setName(''); setBrand(''); setCategory(''); setLocation(''); setDate(new Date()); setSourceItem(undefined); };

  // Handler for adding the ingredient
  const handleAddIngredient = () => {
    if (!name.trim()) { // Basic validation for ingredient name
      Alert.alert("Validation Error", "Ingredient name is required.");
      return;
    }
    
    // Construct ingredient details object
    const ingredientDetails = { 
      name: name.trim(), 
      brand: brand.trim(), 
      category: category.trim(), 
      location: location.trim(), 
      expirationDate: date?.toISOString(), 
      isFrozen: false, 
      open: { status: false } 
    };

    // Add ingredient based on whether it originated from a grocery list item
    if (sourceItem) {
      addIngredientFromBought(sourceItem, ingredientDetails);
      Alert.alert("Success", `${ingredientDetails.name} was added to your kitchen!`);
    } else {
      addIngredient(ingredientDetails);
      Alert.alert("Success", `${ingredientDetails.name} was added.`);
    }
    resetForm(); // Reset form after successful addition
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, !!sourceItem && styles.disabledButton]} 
            onPress={() => navigation.navigate('BarcodeScanner')} 
            disabled={!!sourceItem} // Disable if pre-filled from grocery list
          >
            <Text style={styles.primaryButtonText}>Scan Barcode to Pre-fill</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Ingredient Name (Required)</Text>
        <TextInput 
          style={styles.input} 
          value={name} 
          onChangeText={setName} 
          placeholder="e.g., Milk, Apples, Chicken Breast" // Placeholder text
          placeholderTextColor="#999999" // Muted placeholder color
        />

        <Text style={styles.label}>Brand</Text>
        <TextInput 
          style={styles.input} 
          value={brand} 
          onChangeText={setBrand} 
          placeholder="e.g., Granarolo, Dole, Amadori" // Placeholder text
          placeholderTextColor="#999999"
        />

        <Text style={styles.label}>Category</Text>
        <TextInput 
          style={styles.input} 
          value={category} 
          onChangeText={setCategory} 
          placeholder="e.g., Dairy, Produce, Meat" // Placeholder text
          placeholderTextColor="#999999"
        />

        <Text style={styles.label}>Location</Text>
        <TextInput 
          style={styles.input} 
          value={location} 
          onChangeText={setLocation} 
          placeholder="e.g., Fridge, Pantry, Freezer" // Placeholder text
          placeholderTextColor="#999999"
        />

        <Text style={styles.label}>Expiration Date</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{date ? date.toLocaleDateString() : 'Select...'}</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.secondaryButtonText}>Select</Text>
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker 
            value={date || new Date()} 
            mode="date" 
            display="default" 
            onChange={onDateChange} 
          />
        )}

        <View style={styles.addButton}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleAddIngredient}>
            <Text style={styles.primaryButtonText}>Add Ingredient to Kitchen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { 
    flex: 1, 
    backgroundColor: '#F8F8F8' // Light neutral background for the scrollable area
  }, 
  container: { 
    flex: 1, 
    padding: 20, 
    paddingTop: 30, // Increased top padding for the form container
    paddingBottom: 40, // More padding at the bottom for scrolling
    backgroundColor: '#F8F8F8' 
  },
  buttonContainer: { 
    marginBottom: 20 // Space below the scan barcode button
  },
  label: { 
    fontSize: 16, 
    marginBottom: 5, 
    marginTop: 15, // Space above labels
    fontWeight: '500', 
    color: '#333333' // Darker, clear text color for labels
  }, 
  input: { 
    borderWidth: 1, 
    borderColor: '#EEEEEE', // Light border for inputs
    padding: 12, // More padding inside inputs
    borderRadius: 8, // Subtle rounded corners
    fontSize: 16, 
    backgroundColor: 'white', // White background for inputs
    color: '#333333' // Dark text for input values
  },
  dateContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginTop: 5, 
    backgroundColor: 'white', 
    borderWidth: 1, 
    borderColor: '#EEEEEE', 
    borderRadius: 8, 
    paddingLeft: 12,
    height: 48, // Consistent height for date picker area
  }, 
  dateText: { 
    fontSize: 16, 
    color: '#333333' // Dark text for selected date
  }, 
  addButton: { 
    marginTop: 30 // Space above the final add button
  },

  // --- Reusable Button Styles for Minimalism ---
  primaryButton: {
    backgroundColor: '#60A5FA', // Accent color for primary actions
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 8, // Rounded corners
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  primaryButtonText: {
    color: '#FFFFFF', // White text on accent background
    fontSize: 16,
    fontWeight: '600', // Semibold font weight
  },
  secondaryButton: {
    backgroundColor: 'transparent', // Transparent background
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1, // Border with accent color
    borderColor: '#60A5FA', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#60A5FA', // Accent color text
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5, // Visually indicate disabled state by reducing opacity
  },
});

export default AddIngredientScreen;