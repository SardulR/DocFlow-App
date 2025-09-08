import React from 'react';
import { View, Image, StyleSheet } from 'react-native';


const SplashScreen = () => {
  return (
    <View style={styles.container}>
     
      <Image
        source={require('../assets/images/icon.png')}
        style={styles.icon}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
  },
  icon: {
    width: 350, 
    height: 350, 
    resizeMode: 'contain', 
  },
});

export default SplashScreen;