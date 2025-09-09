import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';


const colors = {
  lightBackground: '#FFEBEE',
  primaryText: '#212121',
  secondaryText: '#757575',
};

const RecentScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
       
        <Ionicons name="time-outline" size={64} color={colors.secondaryText} />

       
        <Text style={styles.title}>Recent Files</Text>

        
        <Text style={styles.subtitle}>
          Files you have recently viewed or edited will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.lightBackground,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30, // Add some horizontal padding
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryText,
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default RecentScreen;