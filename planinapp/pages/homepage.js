import React, { StyleSheet } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PlanButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.planButton}
        // Use expo-router for navigation, if needed
      onPress={() => { navigation.navigate('Homepage')
        // Button click actions here
        // Use expo-router for navigation, if needed
        // Use expo-router for navigation, if needed
      }}
    >
      <Text style={styles.planButtonText}>Planlarım</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF', // Add a background color here
  },
  planButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
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

 export const App = () => {
  // ...

  return (
    <View style={styles.container}>
      <PlanButton />
      {/* ... Other content ... */}
    </View>
  );
};

export default homepage;