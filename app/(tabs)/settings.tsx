import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Type definition for the card's props ---
type SettingsCardProps = {
  title: string;
  description: string;
};

// --- Define our Red Theme Color Palette ---
const colors = {
  primaryRed: '#C62828',
  lightBackground: '#FFEBEE',
  cardBackground: '#FFFFFF',
  primaryText: '#212121',
  secondaryText: '#757575',
};

// --- A reusable, typed component for the settings cards ---
const SettingsCard: React.FC<SettingsCardProps> = ({ title, description }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.dot} />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <Text style={styles.cardDescription}>{description}</Text>
  </View>
);

const SettingsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Settings</Text>
        <SettingsCard
          title="About"
          description="Simple PDF and image tools for everyday use. No registration required."
        />
        <SettingsCard
          title="Privacy"
          description="All files are processed locally and automatically deleted after processing."
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ...styles remain exactly the same
  safeArea: { flex: 1, backgroundColor: colors.lightBackground },
  scrollContent: { padding: 20 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: colors.primaryText, marginBottom: 24 },
  card: { backgroundColor: colors.cardBackground, borderRadius: 12, padding: 20, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primaryRed, marginRight: 10 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: colors.primaryText },
  cardDescription: { fontSize: 14, color: colors.secondaryText, lineHeight: 20 },
});

export default SettingsScreen;