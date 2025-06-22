// src/screens/ExpiringSoonScreen.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TextStyle } from 'react-native';
import { useIngredients } from '../context/IngredientsContext';
import { Ingredient } from '../types/types';

const ExpiringSoonScreen = () => {
  const { ingredients, isLoading } = useIngredients();
  const [daysThreshold] = useState(7);

  const expiringItems = useMemo(() => {
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() + daysThreshold);
    return ingredients.filter(item => {
      // Logic from before
      if (item.isFrozen) {
        const expiry = item.expirationDate ? new Date(item.expirationDate) : null;
        return expiry && expiry <= thresholdDate && expiry >= now;
      }
      if (item.ripeness?.status === 'ripe/mature') return true;
      if (item.open?.status) return true;
      if (item.expirationDate) {
        const expiry = new Date(item.expirationDate);
        return expiry <= thresholdDate && expiry >= now;
      }
      return false;
    });
  }, [ingredients, daysThreshold]);

  if (isLoading) return <View style={styles.container}><Text>Loading...</Text></View>;

  const renderItem = ({ item }: { item: Ingredient }) => {
    let detail = "Expires soon";
    // *** CRITICAL FIX: Removed the explicit type annotation here ***
    let detailStyle: TextStyle = styles.itemDetailsNormal; 

    if (item.ripeness?.status === 'ripe/mature') {
      detail = "Ripe";
      detailStyle = styles.itemDetailsRipe; 
    } else if (item.open?.status) {
      detail = "Opened";
      detailStyle = styles.itemDetailsOpened; 
    } else if (item.expirationDate) {
      const daysLeft = Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      detail = `Expires in ${daysLeft > 0 ? daysLeft : 0} day(s)`;
      if (daysLeft <= 0) {
        detail = "Expired!";
        detailStyle = styles.itemDetailsExpired; 
      } else if (daysLeft <= 3) {
        detailStyle = styles.itemDetailsUrgent; 
      }
    }
    
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={detailStyle}>{detail}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList data={expiringItems} renderItem={renderItem} keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.header}>Expiring in Next {daysThreshold} Days</Text>}
        ListEmptyComponent={<Text style={styles.emptyMessage}>Nothing is expiring soon.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 16, 
    paddingTop: 20, // Added top padding for more space from the status bar/top edge
    backgroundColor: '#F8F8F8' 
  }, 
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 30, // Specific top margin
    marginBottom: 20, // Specific bottom margin, replacing marginVertical
    color: '#333333' 
  }, 
  itemContainer: { 
    backgroundColor: 'white', 
    padding: 18, 
    borderRadius: 8, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#EEEEEE', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  }, 
  itemName: { fontSize: 18, fontWeight: '600', color: '#333333' }, 
  
  // --- Item Details Status Styles (Minimalistic) ---
  itemDetailsNormal: { fontSize: 14, color: '#666666', fontWeight: '500' }, 
  itemDetailsRipe: { fontSize: 14, color: '#60A5FA', fontWeight: '500' }, 
  itemDetailsOpened: { fontSize: 14, color: '#888888', fontWeight: '500' }, 
  itemDetailsUrgent: { fontSize: 14, color: '#EF4444', fontWeight: '700' }, 
  itemDetailsExpired: { fontSize: 14, color: '#999999', fontWeight: '700' }, 

  emptyMessage: { textAlign: 'center', marginTop: 20, marginBottom: 30, fontSize: 16, color: '#999999' }
});
export default ExpiringSoonScreen;