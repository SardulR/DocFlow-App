import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  useWindowDimensions, 
  View 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const colors = {
  lightBackground: '#FFEBEE',
  primaryText: '#212121',
  secondaryText: '#757575',
};

const RecentScreen: React.FC = () => {
  const { width } = useWindowDimensions();

  const getResponsivePadding = () => {
    if (width < 350) return 25; 
    if (width < 400) return 30;
    return 35; 
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
      paddingHorizontal: getResponsivePadding(),
    },
    title: {
      fontSize: 24, 
      fontWeight: 'bold',
      color: colors.primaryText,
      marginTop: 20, 
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16, 
      color: colors.secondaryText,
      textAlign: 'center',
      lineHeight: 22, 
      maxWidth: '90%', 
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
 <MaterialIcons 
  name="access-time" 
  size={64} 
  color={colors.secondaryText} 
/>
        
        <Text style={styles.title}>Recent Files</Text>
        
        <Text style={styles.subtitle}>
          Files you have recently viewed or edited will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default RecentScreen;