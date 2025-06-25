// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons'; // Import Ionicons for minimalistic icons

// Import your Stack Navigators (essential for nested navigation)
import QueryStackNavigator from './QueryStackNavigator'; 
import AddStackNavigator from './AddStackNavigator'; 

// Import your individual screens for other tabs
import ExpiringSoonScreen from '../screens/ExpiringSoonScreen';
import GroceryListScreen from '../screens/GroceryListScreen';

// Define the parameter list for tab navigator
export type MainTabParamList = {
  QueryStack: undefined; // This is the stack navigator for queries
  AddStack: undefined;
  ExpiringSoon: undefined;
  GroceryList: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="QueryStack" // Update initial route name to match the stack
      screenOptions={({ route }) => ({
        // Apply minimalistic tab bar styles
        tabBarActiveTintColor: '#60A5FA', // Our accent blue for active tabs
        tabBarInactiveTintColor: '#999999', // Muted gray for inactive tabs
        tabBarStyle: {
          backgroundColor: 'white', // White background for the tab bar itself
          borderTopWidth: 0, // Remove the top border for a cleaner look
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
          height: 60, // Slightly increase height for more breathing room
          paddingBottom: 5, // Add a little padding at the bottom for labels
        },
        tabBarLabelStyle: {
          fontSize: 12, // Smaller font size for labels
          fontWeight: '500', // Medium font weight for clarity
          marginTop: -5, // Adjust vertical position of labels if needed
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap; // Type for Ionicons names
          let routeName = route.name as keyof MainTabParamList; // Cast for type safety with icon logic

          // Determine the icon based on the route name of the TAB
          if (routeName === 'QueryStack') { // Refer to the stack name for icon logic
            iconName = focused ? 'home' : 'home-outline'; // Filled when focused, outline when not
          } else if (routeName === 'AddStack') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (routeName === 'ExpiringSoon') {
            iconName = focused ? 'hourglass' : 'hourglass-outline';
          } else if (routeName === 'GroceryList') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else {
            iconName = 'help-circle-outline'; // Default or fallback icon
          }

          // Return the Ionicons component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false, // Hide default header, manage within screens for full control
      })}
    >
      <Tab.Screen 
        name="QueryStack" 
        component={QueryStackNavigator} 
        options={{ tabBarLabel: 'My Kitchen' }} // This is the label that will appear below the icon
      />

      <Tab.Screen 
        name="AddStack" // <<< THE NAME OF THE TAB IS NOW THE NAME OF YOUR AddStackNavigator
        component={AddStackNavigator} // <<< THE COMPONENT RENDERED FOR THIS TAB IS THE AddStackNavigator
        options={{ tabBarLabel: 'Add' }} 
      />

      <Tab.Screen name="ExpiringSoon" component={ExpiringSoonScreen} options={{ tabBarLabel: 'Expiring Soon' }} />
      <Tab.Screen name="GroceryList" component={GroceryListScreen} options={{ tabBarLabel: 'Grocery List' }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;