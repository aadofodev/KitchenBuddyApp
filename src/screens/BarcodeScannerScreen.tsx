// src/screens/BarcodeScannerScreen.tsx
import React, { useState, useCallback } from 'react';
import { StyleSheet, Alert, View, Button, Text } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AddStackParamList } from '../navigation/AddStackNavigator';

import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';

type ScannerNavigationProp = StackNavigationProp<AddStackParamList, 'BarcodeScanner'>;

export default function BarcodeScannerScreen() {
  const navigation = useNavigation<ScannerNavigationProp>();
  const isFocused = useIsFocused(); // To enable/disable camera when screen is not visible
  const [scanned, setScanned] = useState(false);
  
  const [permission, requestPermission] = useCameraPermissions();

  const fetchDataFromBarcode = useCallback(async (barcode: string) => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
      const json = await response.json();
      
      if (json.status === 1) {
        const product = json.product;
        Alert.alert('Product Found!', `${product.product_name || 'Unknown'} (${product.brands || ''})`,
          [{ text: 'OK', onPress: () => navigation.navigate('AddIngredient', { name: product.product_name, brand: product.brands }) }]
        );
      } else {
        Alert.alert('Product Not Found', `Could not find a product with barcode: ${barcode}`, [{ text: 'Scan Again', onPress: () => setScanned(false) }]);
      }
    } catch (error) {
        Alert.alert('API Error', 'Could not connect to the food database.', [{ text: 'Scan Again', onPress: () => setScanned(false) }]);
    }
  }, [navigation]);

  const handleBarcodeScanned = useCallback((scanningResult: BarcodeScanningResult) => {
    if (!scanned && scanningResult.data) {
      setScanned(true); // Prevent multiple scans
      console.log(`Barcode scanned: ${scanningResult.data}`);
      fetchDataFromBarcode(scanningResult.data);
    }
  }, [scanned, fetchDataFromBarcode]);

  // --- Render logic for permissions ---
  if (!permission) {
    // Permissions are still loading
    return <View />;
  }
  if (!permission.granted) {
    // Permissions have not been granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // --- Main Render ---
  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        // The prop is onBarcodeScanned (no 'd')
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        // Settings are passed directly as a prop
        barcodeScannerSettings={{
          // Barcode types are now simple strings
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128"],
        }}
      />
      {scanned && (
        <View style={styles.scanAgainButtonContainer}>
          <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanAgainButtonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '80%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 5,
  }
});