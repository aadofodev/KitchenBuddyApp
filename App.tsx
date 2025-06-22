import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import QueryScreen from './src/screens/QueryScreen';
import { IngredientsProvider } from './src/context/IngredientsContext';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <IngredientsProvider>
        <NavigationContainer>
          <MainTabNavigator />
        </NavigationContainer>
      </IngredientsProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});