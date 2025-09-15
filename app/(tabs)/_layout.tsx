import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Platform, Dimensions } from 'react-native';

const COLORS = {
  primary: "#d90429",
  mutedForeground: "#8d99ae",
};

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375 || height < 667;

export default function TabLayout() {
  const getResponsiveValue = (small, medium, large) => {
    if (isSmallDevice) return small;
    if (isTablet) return large;
    return medium;
  };

  const tabBarHeight = getResponsiveValue(hp('7%'), hp('8%'), hp('7.5%'));
  const bottomOffset = Platform.OS === 'ios' ? 
    getResponsiveValue(hp('2%'), hp('2.5%'), hp('2%')) : 
    getResponsiveValue(hp('1%'), hp('1.5%'), hp('1.2%'));
  
  const horizontalMargin = getResponsiveValue(wp('3%'), wp('4%'), wp('5%'));
  const borderRadius = getResponsiveValue(wp('4%'), wp('5%'), wp('4%'));
  const iconSize = getResponsiveValue(hp('2.8%'), hp('3.5%'), hp('3.2%'));
  const fontSize = getResponsiveValue(hp('1.2%'), hp('1.5%'), hp('1.4%'));

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.mutedForeground,
        tabBarStyle: {
          position: 'absolute',
          bottom: bottomOffset,
          left: horizontalMargin,
          right: horizontalMargin,
          height: tabBarHeight,
          borderRadius: borderRadius,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.95)' : '#ffffff',
          paddingBottom: Platform.OS === 'ios' ? hp('0.5%') : hp('0.2%'),
          paddingTop: hp('0.5%'),
        },
        tabBarLabelStyle: {
          fontSize: fontSize,
          marginBottom: Platform.OS === 'ios' ? hp('0.3%') : hp('0.2%'),
          fontWeight: '500',
        },
        tabBarItemStyle: {
          paddingVertical: hp('0.5%'),
        },
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon name="home-variant-outline" size={iconSize} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="recent"
        options={{
          title: 'Recent',
          tabBarIcon: ({ color }) => (
            <Icon name="history" size={iconSize} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Icon name="cog-outline" size={iconSize} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}