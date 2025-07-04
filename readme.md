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
    * `MainTabParamList` (defined in `src/navigation/MainTabNavigator.tsx`): 
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
    * `QueryStackParamList` (defined in `src/navigation/QueryStackNavigator.tsx`): 
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
* **Consumed Context:** `ingredients: Ingredient[]`, `addToGroceryList: (itemData: { name: string }) => void` 
* **Types:**
    * `QueryScreenNavigationProp`, `Ingredient` (from `src/types/types.ts`) 

### 5. `AddStackNavigator` (src/navigation/AddStackNavigator.tsx)
* **Description:** Manages the stack navigation for adding new ingredients, encompassing the `AddIngredientScreen` (form entry) and `BarcodeScannerScreen`.
* **Props:** None
* **State:** None
* **Types:**
    * `AddStackParamList` (defined in `src/navigation/AddStackNavigator.tsx`): 
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
* **Consumed Context:** `addIngredient: (ingredient: Omit<Ingredient, 'id' | 'addedOn'>) => void`, `addIngredientFromBought: (sourceItem: GroceryItem, details: Omit<Ingredient, 'id' | 'addedOn'>) => void` 
* **Types:**
    * `AddScreenNavigationProp`, `AddScreenRouteProp`
    * `Ingredient`, `GroceryItem`, `RipenessStatus` (from `src/types/types.ts`) 

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
* **Consumed Context:** `ingredients: Ingredient[]`, `updateIngredient: (updatedIngredient: Ingredient) => void` 
* **Types:**
    * `EditScreenRouteProp`, `EditScreenNavigationProp`
    * `Ingredient`, `RipenessStatus` (from `src/types/types.ts`) 

### 9. `ExpiringSoonScreen` (src/screens/ExpiringSoonScreen.tsx)
* **Description:** Displays a filtered list of ingredients that are expiring within a predefined threshold (e.g., 7 days), or items that are ripe/open.
* **Props:** None (data sourced from context)
* **State:**
    * `daysThreshold`: `number` (defaults to 7)
* **Consumed Context:** `ingredients: Ingredient[]`, `isLoading: boolean` 
* **Derived State (via `useMemo`):** `expiringItems: Ingredient[]` 
* **Types:**
    * `Ingredient` (from `src/types/types.ts`) 

### 10. `GroceryListScreen` (src/screens/GroceryListScreen.tsx)
* **Description:** Manages the user's shopping list, allowing quick addition of items and marking items as bought (moving them to "recently bought" to potentially add to inventory).
* **Props:** None
* **State:**
    * `quickAddItem`: `string` (text input for new grocery items)
* **Consumed Context:** `groceryList: GroceryItem[]`, `recentlyBought: GroceryItem[]`, `addToGroceryList: (itemData: { name: string }) => void`, `buyFromGroceryList: (itemId: string) => void` 
* **Types:**
    * `GroceryItem` (from `src/types/types.ts`) 

### 11. `IngredientsContext` (src/context/IngredientsContext.tsx)
* **Description:** A React Context Provider that serves as the central state management for all ingredient data (`ingredients`), grocery list items (`groceryList`), and recently bought items (`recentlyBought`). It handles persistence to `AsyncStorage` and provides functions for immutable state updates.
* **Props:**
    * `children`: `ReactNode` (standard for a Context Provider)
* **State (internal to context):**
    * `ingredients`: `Ingredient[]` 
    * `groceryList`: `GroceryItem[]` 
    * `recentlyBought`: `GroceryItem[]` 
    * `isLoading`: `boolean` 
* **Provided Context Value:**
    * `ingredients`, `groceryList`, `recentlyBought`, `isLoading`
    * `addIngredient: (ingredient: Omit<Ingredient, 'id' | 'addedOn'>) => void` 
    * `updateIngredient: (updatedIngredient: Ingredient) => void` 
    * `addToGroceryList: (itemData: { name: string }) => void` 
    * `buyFromGroceryList: (itemId: string) => void` 
    * `addIngredientFromBought: (sourceItem: GroceryItem, details: Omit<Ingredient, 'id' | 'addedOn'>) => void` 
* **Types:**
    * `IngredientsContextType`, `Ingredient`, `GroceryItem` 

---

## Component Tree and Control Flow

Here is a visual representation of the application's component hierarchy, illustrating data flow, callbacks, and state changes.

```mermaid
graph TD
    A[App] --> B[NavigationContainer]
    B --> C[IngredientsProvider]
    C -- Provides context --> D[MainTabNavigator]

    D -- Tab: My Kitchen --> E[QueryStackNavigator]
    D -- Tab: Add --> F[AddStackNavigator]
    D -- Tab: Expiring Soon --> G[ExpiringSoonScreen]
    D -- Tab: Grocery List --> H[GroceryListScreen]

    E --> I[QueryScreen]
    E --> J[EditIngredientScreen]
    F --> K[AddIngredientScreen]
    F --> L[BarcodeScannerScreen]

    subgraph QueryFlow
        I -- Reads --> C
        I -- Navigates --> J
        I -- Calls addToGroceryList --> C
        J -- Reads --> C
        J -- Calls updateIngredient --> C
    end

    subgraph AddFlow
        K -- Calls addIngredient --> C
        K -- Navigates --> L
        L -- Returns data --> K
    end

    subgraph ExpiringFlow
        G -- Reads --> C
    end

    subgraph GroceryFlow
        H -- Reads --> C
        H -- Calls addToGroceryList --> C
        H -- Calls buyFromGroceryList --> C
        H -- Calls addIngredientFromBought --> C
    end

    style C fill:#ACE1AF,stroke:#333,stroke-width:2px
    style A fill:#D6EAF8,stroke:#333,stroke-width:2px
    style B fill:#D6EAF8,stroke:#333,stroke-width:2px
    style D fill:#D6EAF8,stroke:#333,stroke-width:2px
    style E fill:#D6EAF8,stroke:#333,stroke-width:2px
    style F fill:#D6EAF8,stroke:#333,stroke-width:2px
    style I fill:#FFFACD,stroke:#333,stroke-width:1px
    style J fill:#FFFACD,stroke:#333,stroke-width:1px
    style K fill:#FFFACD,stroke:#333,stroke-width:1px
    style L fill:#FFFACD,stroke:#333,stroke-width:1px
    style G fill:#FFFACD,stroke:#333,stroke-width:1px
    style H fill:#FFFACD,stroke:#333,stroke-width:1px