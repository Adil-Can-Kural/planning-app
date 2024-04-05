import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import HomeScreen from './pages/homepage.js';






const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },  
});

function App() {
  return (
    <SafeAreaView>
      <HomeScreen/>
    </SafeAreaView>
  );
}

export default App;
