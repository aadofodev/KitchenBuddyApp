// src/navigation/QueryStackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import QueryScreen from '../screens/QueryScreen';
import EditIngredientScreen from '../screens/EditIngredientScreen';

export type QueryStackParamList = {
  QueryScreen: undefined;
  EditIngredientScreen: { ingredientId: string };
};

const Stack = createStackNavigator<QueryStackParamList>();

const QueryStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="QueryScreen" 
        component={QueryScreen}
        options={{ title: 'Queries' }} 
      />
      <Stack.Screen 
        name="EditIngredientScreen" 
        component={EditIngredientScreen}
        options={{ title: 'Edit Ingredient' }}
      />
    </Stack.Navigator>
  );
};

export default QueryStackNavigator;