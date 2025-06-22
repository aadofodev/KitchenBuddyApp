// src/context/IngredientsContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ingredient, GroceryItem } from '../types/types';

const INGREDIENTS_STORAGE_KEY = '@KitchenBuddyV2:ingredients';
const GROCERY_LIST_STORAGE_KEY = '@KitchenBuddyV2:groceryList';
const RECENTLY_BOUGHT_STORAGE_KEY = '@KitchenBuddyV2:recentlyBought';

interface IngredientsContextType {
  ingredients: Ingredient[];
  groceryList: GroceryItem[];
  recentlyBought: GroceryItem[];
  isLoading: boolean;
  addIngredient: (ingredient: Omit<Ingredient, 'id' | 'addedOn'>) => void;
  updateIngredient: (updatedIngredient: Ingredient) => void;
  addToGroceryList: (itemData: { name: string }) => void;
  buyFromGroceryList: (itemId: string) => void;
  addIngredientFromBought: (sourceItem: GroceryItem, details: Omit<Ingredient, 'id' | 'addedOn'>) => void;
}

const IngredientsContext = createContext<IngredientsContextType | undefined>(undefined);

export const IngredientsProvider = ({ children }: { children: ReactNode }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [recentlyBought, setRecentlyBought] = useState<GroceryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      try {
        const [s_ingredients, s_groceryList, s_recentlyBought] = await Promise.all([
          AsyncStorage.getItem(INGREDIENTS_STORAGE_KEY),
          AsyncStorage.getItem(GROCERY_LIST_STORAGE_KEY),
          AsyncStorage.getItem(RECENTLY_BOUGHT_STORAGE_KEY),
        ]);
        if (s_ingredients) setIngredients(JSON.parse(s_ingredients));
        if (s_groceryList) setGroceryList(JSON.parse(s_groceryList));
        if (s_recentlyBought) setRecentlyBought(JSON.parse(s_recentlyBought));
      } catch (e) {
        console.error("Failed to load state.", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    if (!isLoading) AsyncStorage.setItem(INGREDIENTS_STORAGE_KEY, JSON.stringify(ingredients));
  }, [ingredients, isLoading]);
  
  useEffect(() => {
    if (!isLoading) AsyncStorage.setItem(GROCERY_LIST_STORAGE_KEY, JSON.stringify(groceryList));
  }, [groceryList, isLoading]);
  
  useEffect(() => {
    if (!isLoading) AsyncStorage.setItem(RECENTLY_BOUGHT_STORAGE_KEY, JSON.stringify(recentlyBought));
  }, [recentlyBought, isLoading]);

  const addIngredient = (ingredientData: Omit<Ingredient, 'id' | 'addedOn'>) => {
    const newIngredient: Ingredient = {
      id: new Date().toISOString() + Math.random(),
      addedOn: new Date().toISOString(),
      ...ingredientData,
    };
    setIngredients(prev => [...prev, newIngredient]);
  };

  const updateIngredient = (updatedIngredient: Ingredient) => {
    setIngredients(prev => prev.map(ing => ing.id === updatedIngredient.id ? updatedIngredient : ing));
  };
  
  const addToGroceryList = (itemData: { name: string }) => {
    if (groceryList.some(item => item.name.toLowerCase() === itemData.name.toLowerCase())) return;
    const newItem: GroceryItem = { id: new Date().toISOString() + Math.random(), name: itemData.name };
    setGroceryList(prev => [...prev, newItem]);
  };
  
  const buyFromGroceryList = (itemId: string) => {
    const itemToBuy = groceryList.find(item => item.id === itemId);
    if (itemToBuy) {
      setRecentlyBought(prev => [...prev, itemToBuy]);
      setGroceryList(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const addIngredientFromBought = (sourceItem: GroceryItem, details: Omit<Ingredient, 'id' | 'addedOn'>) => {
    addIngredient(details);
    setRecentlyBought(prev => prev.filter(item => item.id !== sourceItem.id));
  };

  const value = { ingredients, groceryList, recentlyBought, isLoading, addIngredient, updateIngredient, addToGroceryList, buyFromGroceryList, addIngredientFromBought };

  return <IngredientsContext.Provider value={value}>{children}</IngredientsContext.Provider>;
};

export const useIngredients = () => {
  const context = useContext(IngredientsContext);
  if (context === undefined) throw new Error('useIngredients must be used within an IngredientsProvider');
  return context;
};