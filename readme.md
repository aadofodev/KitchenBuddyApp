# My Kitchen Buddy App

## Project Overview

This application helps users manage their kitchen inventory, track expiring items, and maintain a grocery shopping list. It is built with React Native and TypeScript, emphasizing functional programming principles for predictable state management and maintainable code.

## Key Principles Followed

* **Functional Programming:** Functions are designed to be small, focused on a single responsibility, and immutable, meaning they do not modify their inputs but rather return new, updated data structures. `IngredientsContext` is a prime example where all state updates (add, update, remove) are performed immutably using array/object spreading and mapping.
* **TypeScript:** The project extensively uses type annotations. Every data structure (`Ingredient`, `GroceryItem`, `RipenessStatus`) is formally typed, and all function arguments and return types are explicitly annotated to ensure strong type checking and improve code clarity.

## Components Overview

For each component, list its purpose, expected props, managed state, and their respective types.

### 1. `App` (src/App.tsx)
* **Description:** The root component of the application. It establishes the global context providers (`IngredientsProvider`) and the main navigation container (`NavigationContainer`).
* **Props:** None
* **State:** None (manages application setup, not internal UI state)

### 2. `MainTabNavigator` (src/navigation/MainTabNavigator.tsx)
* **Description:** Implements the bottom tab navigation, serving as the primary navigation hub to switch between `QueryStack`, `AddStack`, `ExpiringSoon`, and `GroceryList` features.
* **Props:** None (React Navigation internal props)
* **State:** None (managed internally by React Navigation)
* **Types:**
    * [cite_start]`MainTabParamList` (defined in `src/navigation/MainTabNavigator.tsx`): 
        ```typescript
        type MainTabParamList = {
          QueryStack: undefined;
          AddStack: undefined;
          ExpiringSoon: undefined;
          GroceryList: undefined;
        };
        ```

### 3. `QueryStackNavigator` (src/navigation/QueryStackNavigator.tsx)
* **Description:** Manages the stack navigation within the "My Kitchen" tab, allowing users to navigate between the main `QueryScreen` and `EditIngredientScreen` for item modification.
* **Props:** None (React Navigation internal props as a nested navigator)
* **State:** None (managed internally by React Navigation)
* **Types:**
    * [cite_start]`QueryStackParamList` (defined in `src/navigation/QueryStackNavigator.tsx`): 
        ```typescript
        type QueryStackParamList = {
          QueryScreen: undefined;
          EditIngredientScreen: { ingredientId: string };
        };
        ```

### 4. `QueryScreen` (src/screens/QueryScreen.tsx)
* **Description:** Displays the main kitchen inventory, including all items, items to recheck for ripeness, and low-quantity items. Provides navigation to `EditIngredientScreen` and options to add items to the grocery list.
* **Props:**
    * `navigation`: `StackNavigationProp<QueryStackParamList, 'QueryScreen'>` (from React Navigation, used for navigation actions)
    * `route`: `RouteProp<QueryStackParamList, 'QueryScreen'>` (from React Navigation, used for route parameters)
* **State:** None (data is consumed from `IngredientsContext` or derived using `useMemo`)
* [cite_start]**Consumed Context:** `ingredients: Ingredient[]`, `addToGroceryList: (itemData: { name: string }) => void` 
* **Types:**
    * [cite_start]`QueryScreenNavigationProp`, `Ingredient` (from `src/types/types.ts`) 

### 5. `AddStackNavigator` (src/navigation/AddStackNavigator.tsx)
* **Description:** Manages the stack navigation for adding new ingredients, encompassing the `AddIngredientScreen` (form entry) and `BarcodeScannerScreen`.
* **Props:** None
* **State:** None
* **Types:**
    * [cite_start]`AddStackParamList` (defined in `src/navigation/AddStackNavigator.tsx`): 
        ```typescript
        type AddStackParamList = {
          AddIngredient: { name?: string; brand?: string; sourceItem?: GroceryItem; shelfLife?: number; } | undefined;
          BarcodeScanner: undefined;
        };
        ```

### 6. `AddIngredientScreen` (src/screens/AddIngredientScreen.tsx)
* **Description:** A form-based screen for manually entering new ingredient details or receiving data from the barcode scanner.
* **Props:**
    * `navigation`: `StackNavigationProp<AddStackParamList, 'AddIngredient'>`
    * `route`: `RouteProp<AddStackParamList, 'AddIngredient'>`
* **State:**
    * `name`: `string`
    * `brand`: `string`
    * `category`: `string`
    * `location`: `string`
    * `date`: `Date | undefined` (expiration date)
    * `showDatePicker`: `boolean`
    * `sourceItem`: `GroceryItem | undefined` (if coming from "recently bought")
    * `shelfLife`: `number | undefined`
    * `isFrozen`: `boolean`
    * `isOpen`: `boolean`
    * `openedOnDate`: `Date | undefined`
    * `showOpenedOnDatePicker`: `boolean`
    * `ripenessStatus`: `RipenessStatus`
    * `lastCheckedDate`: `Date | undefined`
    * `showLastCheckedDatePicker`: `boolean`
    * `quantityValue`: `string`
    * `quantityUnit`: `string`
* [cite_start]**Consumed Context:** `addIngredient: (ingredient: Omit<Ingredient, 'id' | 'addedOn'>) => void`, `addIngredientFromBought: (sourceItem: GroceryItem, details: Omit<Ingredient, 'id' | 'addedOn'>) => void` 
* **Types:**
    * `AddScreenNavigationProp`, `AddScreenRouteProp`
    * [cite_start]`Ingredient`, `GroceryItem`, `RipenessStatus` (from `src/types/types.ts`) 

### 7. `BarcodeScannerScreen` (src/screens/BarcodeScannerScreen.tsx)
* **Description:** Utilizes the device's camera to scan barcodes and fetches product information from OpenFoodFacts API, then passes it back to `AddIngredientScreen`.
* **Props:**
    * `navigation`: `StackNavigationProp<AddStackParamList, 'BarcodeScanner'>`
    * `route`: `RouteProp<AddStackParamList, 'BarcodeScanner'>`
* **State:**
    * `scanned`: `boolean` (true after a barcode is successfully scanned)
    * `permission`: `CameraPermissionResponse | null | undefined` (camera permission status)
* **Types:**
    * `ScannerNavigationProp`
    * `BarcodeScanningResult` (from `expo-camera`)

### 8. `EditIngredientScreen` (src/screens/EditIngredientScreen.tsx)
* **Description:** Allows users to view and modify details of an existing ingredient.
* **Props:**
    * `navigation`: `StackNavigationProp<QueryStackParamList, 'EditIngredientScreen'>`
    * `route`: `RouteProp<QueryStackParamList, 'EditIngredientScreen'>`
* **State:** (All derived from the initial `ingredientId` from route params)
    * `name`: `string`, `brand`: `string`, `category`: `string`, `location`: `string`
    * `quantity`: `Ingredient['quantity']`
    * `isOpen`: `boolean`, `isFrozen`: `boolean`
    * `ripeness`: `Ingredient['ripeness'] | undefined`
    * `date`: `Date | undefined` (expiration date)
    * `showDatePicker`: `boolean` (for expiration date)
    * `openedOnDate`: `Date | undefined`
    * `showOpenedOnDatePicker`: `boolean` (for opened on date)
    * `lastCheckedDate`: `Date | undefined`
    * `showLastCheckedDatePicker`: `boolean` (for last checked date)
* [cite_start]**Consumed Context:** `ingredients: Ingredient[]`, `updateIngredient: (updatedIngredient: Ingredient) => void` 
* **Types:**
    * `EditScreenRouteProp`, `EditScreenNavigationProp`
    * [cite_start]`Ingredient`, `RipenessStatus` (from `src/types/types.ts`) 

### 9. `ExpiringSoonScreen` (src/screens/ExpiringSoonScreen.tsx)
* **Description:** Displays a filtered list of ingredients that are expiring within a predefined threshold (e.g., 7 days), or items that are ripe/open.
* **Props:** None (data sourced from context)
* **State:**
    * `daysThreshold`: `number` (defaults to 7)
* [cite_start]**Consumed Context:** `ingredients: Ingredient[]`, `isLoading: boolean` 
* [cite_start]**Derived State (via `useMemo`):** `expiringItems: Ingredient[]` 
* **Types:**
    * [cite_start]`Ingredient` (from `src/types/types.ts`) 

### 10. `GroceryListScreen` (src/screens/GroceryListScreen.tsx)
* **Description:** Manages the user's shopping list, allowing quick addition of items and marking items as bought (moving them to "recently bought" to potentially add to inventory).
* **Props:** None
* **State:**
    * `quickAddItem`: `string` (text input for new grocery items)
* [cite_start]**Consumed Context:** `groceryList: GroceryItem[]`, `recentlyBought: GroceryItem[]`, `addToGroceryList: (itemData: { name: string }) => void`, `buyFromGroceryList: (itemId: string) => void` 
* **Types:**
    * [cite_start]`GroceryItem` (from `src/types/types.ts`) 

### 11. `IngredientsContext` (src/context/IngredientsContext.tsx)
* **Description:** A React Context Provider that serves as the central state management for all ingredient data (`ingredients`), grocery list items (`groceryList`), and recently bought items (`recentlyBought`). It handles persistence to `AsyncStorage` and provides functions for immutable state updates.
* **Props:**
    * `children`: `ReactNode` (standard for a Context Provider)
* **State (internal to context):**
    * [cite_start]`ingredients`: `Ingredient[]` 
    * [cite_start]`groceryList`: `GroceryItem[]` 
    * [cite_start]`recentlyBought`: `GroceryItem[]` 
    * [cite_start]`isLoading`: `boolean` 
* **Provided Context Value:**
    * `ingredients`, `groceryList`, `recentlyBought`, `isLoading`
    * [cite_start]`addIngredient: (ingredient: Omit<Ingredient, 'id' | 'addedOn'>) => void` 
    * [cite_start]`updateIngredient: (updatedIngredient: Ingredient) => void` 
    * [cite_start]`addToGroceryList: (itemData: { name: string }) => void` 
    * [cite_start]`buyFromGroceryList: (itemId: string) => void` 
    * [cite_start]`addIngredientFromBought: (sourceItem: GroceryItem, details: Omit<Ingredient, 'id' | 'addedOn'>) => void` 
* **Types:**
    * [cite_start]`IngredientsContextType` [cite: 200][cite_start], `Ingredient` [cite: 199][cite_start], `GroceryItem` 

---

## Component Tree and Control Flow

Here is a visual representation of the application's component hierarchy, illustrating data flow, callbacks, and state changes.

```mermaid
graph TD
    App --> NavigationContainer
    NavigationContainer --> IngredientsProvider
    IngredientsProvider -- Provides: ingredients[], groceryList[], recentlyBought[], addIngredient(), updateIngredient(), addToGroceryList(), buyFromGroceryList(), addIngredientFromBought() --> MainTabNavigator

    MainTabNavigator -- Tab: My Kitchen --> QueryStackNavigator
    MainTabNavigator -- Tab: Add --> AddStackNavigator
    MainTabNavigator -- Tab: Expiring Soon --> ExpiringSoonScreen
    MainTabNavigator -- Tab: Grocery List --> GroceryListScreen

    QueryStackNavigator -- Route: QueryScreen --> QueryScreen
    QueryStackNavigator -- Route: EditIngredientScreen --> EditIngredientScreen

    AddStackNavigator -- Route: AddIngredient --> AddIngredientScreen
    AddStackNavigator -- Route: BarcodeScanner --> BarcodeScannerScreen

    subgraph QueryFlow
        QueryScreen -- Consumes: ingredients[] --> FlatList (Displays Ingredients)
        QueryScreen -- Calls `navigation.navigate('EditIngredientScreen', { id })` --> QueryStackNavigator
        QueryScreen -- Calls `addToGroceryList({ name })` --> IngredientsProvider (State Change: groceryList[])
        EditIngredientScreen -- Consumes: ingredients[] (finds by id) --> Form Fields
        EditIngredientScreen -- Calls `updateIngredient(updatedItem)` --> IngredientsProvider (State Change: ingredients[])
    end

    subgraph AddFlow
        AddIngredientScreen -- Calls `addIngredient(details)` --> IngredientsProvider (State Change: ingredients[])
        AddIngredientScreen -- Calls `navigation.navigate('BarcodeScanner')` --> AddStackNavigator
        BarcodeScannerScreen -- Returns barcode data via `navigation.navigate('AddIngredient', { params })` --> AddIngredientScreen (Receives data via `route.params`)
    end

    subgraph ExpiringFlow
        ExpiringSoonScreen -- Consumes: ingredients[] --> useMemo (expiringItems)
        ExpiringSoonScreen -- Displays: expiringItems[] --> FlatList
    end

    subgraph GroceryFlow
        GroceryListScreen -- Consumes: groceryList[], recentlyBought[] --> FlatList (Displays Grocery Items)
        GroceryListScreen -- Calls `addToGroceryList({ name })` --> IngredientsProvider (State Change: groceryList[])
        GroceryListScreen -- Calls `buyFromGroceryList(id)` --> IngredientsProvider (State Change: groceryList[], recentlyBought[])
        GroceryListScreen -- Displays recentlyBought[] (Option to add to inventory) --> RecentlyBoughtList
        RecentlyBoughtList -- Calls `addIngredientFromBought(source, details)` --> IngredientsProvider (State Change: ingredients[], recentlyBought[])
    end

    style IngredientsProvider fill:#ACE1AF,stroke:#333,stroke-width:2px,color:#000
    style App fill:#D6EAF8,stroke:#333,stroke-width:2px,color:#000
    style NavigationContainer fill:#D6EAF8,stroke:#333,stroke-width:2px,color:#000
    style MainTabNavigator fill:#D6EAF8,stroke:#333,stroke-width:2px,color:#000
    style QueryStackNavigator fill:#D6EAF8,stroke:#333,stroke-width:2px,color:#000
    style AddStackNavigator fill:#D6EAF8,stroke:#333,stroke-width:2px,color:#000
    style QueryScreen fill:#FFFACD,stroke:#333,stroke-width:1px,color:#000
    style EditIngredientScreen fill:#FFFACD,stroke:#333,stroke-width:1px,color:#000
    style AddIngredientScreen fill:#FFFACD,stroke:#333,stroke-width:1px,color:#000
    style BarcodeScannerScreen fill:#FFFACD,stroke:#333,stroke-width:1px,color:#000
    style ExpiringSoonScreen fill:#FFFACD,stroke:#333,stroke-width:1px,color:#000
    style GroceryListScreen fill:#FFFACD,stroke:#333,stroke-width:1px,color:#000
    style FlatList fill:#F0F8FF,stroke:#ccc,stroke-width:1px,color:#000
    style FormFields fill:#F0F8FF,stroke:#ccc,stroke-width:1px,color:#000
    style RecentlyBoughtList fill:#F0F8FF,stroke:#ccc,stroke-width:1px,color:#000
    style useMemo fill:#F0F8FF,stroke:#ccc,stroke-width:1px,color:#000

    linkStyle 0 stroke:#000,stroke-width:1px,fill:none;
    linkStyle 1 stroke:#000,stroke-width:1px,fill:none;
    linkStyle 2 stroke:#4CAF50,stroke-width:2px,fill:none; /* Data/Context Flow (Green) */
    linkStyle 3 stroke:#000,stroke-width:1px,fill:none;
    linkStyle 4 stroke:#000,stroke-width:1px,fill:none;
    linkStyle 5 stroke:#000,stroke-width:1px,fill:none;
    linkStyle 6 stroke:#000,stroke-width:1px,fill:none;
    linkStyle 7 stroke:#000,stroke-width:1px,fill:none;
    linkStyle 8 stroke:#000,stroke-width:1px,fill:none;
    linkStyle 9 stroke:#FFA000,stroke-width:2px,fill:none; /* Callbacks (Orange) */
    linkStyle 10 stroke:#FF0000,stroke-width:2px,fill:none; /* State Change (Red) */
    linkStyle 11 stroke:#FFA000,stroke-width:2px,fill:none;
    linkStyle 12 stroke:#FF0000,stroke-width:2px,fill:none;
    linkStyle 13 stroke:#000,stroke-width:1px,fill:none;
    linkStyle 14 stroke:#FFA000,stroke-width:2px,fill:none;
    linkStyle 15 stroke:#FF0000,stroke-width:2px,fill:none;
    linkStyle 16 stroke:#000,stroke-width:1px,fill:none;
    linkStyle 17 stroke:#FFA000,stroke-width:2px,fill:none;
    linkStyle 18 stroke:#4CAF50,stroke-width:2px,fill:none;
    linkStyle 19 stroke:#000,stroke-width:1px,fill:none;
    linkStyle 20 stroke:#FFA000,stroke-width:2px,fill:none;
    linkStyle 21 stroke:#FF0000,stroke-width:2px,fill:none;
    linkStyle 22 stroke:#000,stroke-width:1px,fill:none;
    linkStyle 23 stroke:#FFA000,stroke-width:2px,fill:none;
    linkStyle 24 stroke:#FF0000,stroke-width:2px,fill:none;
    linkStyle 25 stroke:#FF0000,stroke-width:2px,fill:none;
    linkStyle 26 stroke:#FFA000,stroke-width:2px,fill:none;
    linkStyle 27 stroke:#FF0000,stroke-width:2px,fill:none;
    linkStyle 28 stroke:#FF0000,stroke-width:2px,fill:none;