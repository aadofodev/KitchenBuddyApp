// src/navigation/AddStackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddIngredientScreen from '../screens/AddIngredientScreen';
import BarcodeScannerScreen from '../screens/BarcodeScannerScreen'; 
import { GroceryItem } from '../types/types'; // Assuming this import is needed for GroceryItem type

export type AddStackParamList = {
  // This is the initial screen of this stack. 
  // Its name ('AddIngredient') must be distinct from the stack's name ('AddStack').
  AddIngredient: { name?: string; brand?: string; sourceItem?: GroceryItem; shelfLife?: number; } | undefined; // Added 'undefined' for when no params are passed
  BarcodeScanner: undefined; // The barcode scanner screen
  // Add any other screens related to the ingredient adding flow here
};

const Stack = createStackNavigator<AddStackParamList>();

const AddStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddIngredient" // <<< IMPORTANT: This screen name should be 'AddIngredient'
        component={AddIngredientScreen}
        options={{ title: 'Add Ingredient' }} 
      />
      <Stack.Screen
        name="BarcodeScanner" 
        component={BarcodeScannerScreen}
        options={{ title: 'Scan Barcode' }}
      />
    </Stack.Navigator>
  );
};

export default AddStackNavigator;