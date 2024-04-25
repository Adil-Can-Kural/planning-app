import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginScreen from './pages/LoginScreen.js';
import { NavigationContainer } from '@react-navigation/native';
import  Schedule from './pages/plan.js'




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },  
});

function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}> 
      <Schedule />
      
      </SafeAreaView>
      
      </NavigationContainer>
  );
}

export default App;
