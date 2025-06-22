// src/screens/EditIngredientScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, Alert, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useIngredients } from '../context/IngredientsContext';
import { QueryStackParamList } from '../navigation/QueryStackNavigator';
import { Ingredient, RipenessStatus } from '../types/types';

type EditScreenRouteProp = RouteProp<QueryStackParamList, 'EditIngredientScreen'>;
type EditScreenNavigationProp = StackNavigationProp<QueryStackParamList, 'EditIngredientScreen'>;

const EditIngredientScreen = () => {
  const route = useRoute<EditScreenRouteProp>();
  const navigation = useNavigation<EditScreenNavigationProp>();
  const { ingredients, updateIngredient } = useIngredients();
  const { ingredientId } = route.params;

  const [name, setName] = useState(''); const [brand, setBrand] = useState(''); const [category, setCategory] = useState(''); const [location, setLocation] = useState(''); const [quantity, setQuantity] = useState<Ingredient['quantity']>({value: 1, unit: 'items'}); const [isOpen, setIsOpen] = useState(false); const [isFrozen, setIsFrozen] = useState(false); const [ripeness, setRipeness] = useState<Ingredient['ripeness']>(undefined); const [date, setDate] = useState<Date | undefined>(undefined); const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const item = ingredients.find(ing => ing.id === ingredientId);
    if (item) {
      setName(item.name); setBrand(item.brand || ''); setCategory(item.category || ''); setLocation(item.location || ''); setIsOpen(item.open?.status || false); setIsFrozen(item.isFrozen || false); setRipeness(item.ripeness);
      if (item.expirationDate) setDate(new Date(item.expirationDate));
      if (item.quantity) setQuantity(item.quantity);
    }
  }, [ingredientId, ingredients]);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if(selectedDate) setDate(selectedDate);
  };

  const handleUpdateIngredient = () => {
    const original = ingredients.find(ing => ing.id === ingredientId);
    if (!original) return;

    let newExpirationDate = date?.toISOString();
    if (!original.isFrozen && isFrozen) {
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        if (!date || sixMonthsFromNow > date) newExpirationDate = sixMonthsFromNow.toISOString();
    }
    
    const updatedIngredient: Ingredient = { ...original, name: name.trim(), brand: brand.trim(), category: category.trim(), location: location.trim(), quantity, expirationDate: newExpirationDate, isFrozen, open: { status: isOpen, openedOn: !original.open?.status && isOpen ? new Date().toISOString() : original.open?.openedOn }, ripeness };
    
    updateIngredient(updatedIngredient);
    navigation.goBack();
  };

  const handleSetRipeness = (status: RipenessStatus) => setRipeness({ status, lastChecked: new Date().toISOString() });

  return (
    <ScrollView style={styles.scrollContainer}><View style={styles.container}>
      <Text style={styles.label}>Name</Text><TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Brand</Text><TextInput style={styles.input} value={brand} onChangeText={setBrand} />
      <Text style={styles.label}>Category</Text><TextInput style={styles.input} value={category} onChangeText={setCategory} />
      <Text style={styles.label}>Location</Text><TextInput style={styles.input} value={location} onChangeText={setLocation} />
      <Text style={styles.label}>Quantity</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput style={[styles.input, {flex: 1}]} value={String(quantity?.value)} onChangeText={v => setQuantity({value: Number(v) || 0, unit: quantity?.unit || 'items'})} keyboardType="numeric"/>
        <TextInput style={[styles.input, {flex: 1, marginLeft: 5}]} value={quantity?.unit} onChangeText={u => setQuantity({value: quantity?.value || 0, unit: u})} placeholder="unit"/>
      </View>
      <Text style={styles.label}>Expiration Date</Text>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{date ? date.toLocaleDateString() : 'Select...'}</Text>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.secondaryButtonText}>Select</Text>
        </TouchableOpacity>
      </View>
      {showDatePicker && (<DateTimePicker value={date || new Date()} mode="date" display="default" onChange={onDateChange} />)}
      <View style={styles.switchContainer}><Text style={styles.label}>Opened</Text><Switch onValueChange={() => setIsOpen(p => !p)} value={isOpen}/></View>
      <View style={styles.switchContainer}><Text style={styles.label}>Frozen</Text><Switch onValueChange={() => setIsFrozen(p => !p)} value={isFrozen}/></View>
      <Text style={styles.label}>Ripeness Status</Text>
      <View style={styles.ripenessContainer}>
        {(['none', 'green', 'ripe/mature', 'advanced', 'too ripe'] as RipenessStatus[]).map(s => (
          <TouchableOpacity 
            key={s} 
            style={[styles.ripenessButton, ripeness?.status === s ? styles.ripenessButtonActive : styles.ripenessButtonInactive]} 
            onPress={() => handleSetRipeness(s)}
          >
            <Text style={[styles.ripenessButtonText, ripeness?.status === s ? styles.ripenessButtonTextActive : styles.ripenessButtonTextInactive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.saveButton}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleUpdateIngredient}>
          <Text style={styles.primaryButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View></ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: '#F8F8F8' },
  container: { 
    flex: 1, 
    padding: 20, 
    paddingTop: 30, // Added top padding
    paddingBottom: 40, 
    backgroundColor: '#F8F8F8' 
  },
  label: { fontSize: 16, marginBottom: 5, marginTop: 15, fontWeight: '500', color: '#333333' },
  input: { 
    borderWidth: 1, 
    borderColor: '#EEEEEE', 
    padding: 12, 
    borderRadius: 8, 
    fontSize: 16, 
    backgroundColor: 'white',
    color: '#333333'
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
    height: 48,
  }, 
  dateText: { fontSize: 16, color: '#333333' }, 
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }, 
  ripenessContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    flexWrap: 'wrap', 
    marginVertical: 10,
    gap: 8, // Spacing between ripeness buttons
  }, 
  saveButton: { marginTop: 30 },

  // --- Button Styles for Minimalism ---
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
  secondaryButton: { // Used for date selection
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#60A5FA', // Accent color border
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#60A5FA', // Accent color text
    fontSize: 16,
    fontWeight: '600',
  },
  ripenessButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
  },
  ripenessButtonActive: {
    backgroundColor: '#60A5FA', // Accent color when active
    borderColor: '#60A5FA',
  },
  ripenessButtonInactive: {
    backgroundColor: 'transparent',
    borderColor: '#DEDEDE', // Light gray border for inactive
  },
  ripenessButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  ripenessButtonTextActive: {
    color: '#FFFFFF', // White text when active
  },
  ripenessButtonTextInactive: {
    color: '#666666', // Muted gray text when inactive
  }
});
export default EditIngredientScreen;