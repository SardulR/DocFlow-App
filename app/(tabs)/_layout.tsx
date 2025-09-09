import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const COLORS = {
  primary: "#d90429",
  mutedForeground: "#8d99ae",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.mutedForeground,
        tabBarStyle: {
          position: 'absolute',
          // Use percentages for positioning
          bottom: hp('1.5%'), // Position bar 1.5% from the bottom
          left: wp('4%'),   // Add 4% margin on the left
          right: wp('4%'),  // Add 4% margin on the right

          // Use percentages for sizing
          height: hp('8%'),           // Bar height is 8% of the screen height
          borderRadius: wp('5%'),     // Corner radius is 5% of the screen width

          // Other styles remain the same
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        // Make the tab labels responsive as well
        tabBarLabelStyle: {
            fontSize: hp('1.5%'), // Font size scales with screen height
            marginBottom: hp('0.5%'), // Adjust spacing based on screen height
        },
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon name="home-variant-outline" size={hp('3.5%')} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="recent"
        options={{
          title: 'Recent',
          tabBarIcon: ({ color }) => (
            <Icon name="history" size={hp('3.5%')} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Icon name="cog-outline" size={hp('3.5%')} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}