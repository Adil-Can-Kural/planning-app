import React, { StyleSheet } from 'react';
import { View, TouchableOpacity, Text } from 'react-native'; // Import TouchableOpacity

const PlanButton = () => {
  return (
    <TouchableOpacity
      style={styles.planButton}
      onPress={() => {
        // Button click actions here
        // Use expo-router for navigation, if needed
      }}
    >
      <Text style={styles.planButtonText}>Planlarım</Text>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  planButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const App = () => {
  // ...

  return (
    <View style={styles.container}>
      <PlanButton />
      {/* ... Other content ... */}
    </View>
  );
};
export default HomePage;
