// File: app/(tabs)/index.tsx

import { TOOLS } from '@/constants/tools';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions,  ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: "#d90429",
  background: "#edf2f4",
  card: "rgba(255, 255, 255, 0.9)",
  text: "#2b2d42",
  mutedForeground: "#8d99ae", 
};

// --- Main Home Screen Component ---
export default function HomeScreen() {
  const router = useRouter(); // Get the router object

  const handleToolSelect = (toolId: string) => {
    router.push({ pathname: "/tools/[id]", params: { id: toolId } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.screenContainer}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Icon name="file-document-edit-outline" size={32} color={COLORS.primary} />
          <View>
            <Text style={styles.title}>DocFlow</Text>
            <Text style={styles.subtitle}>Simple, fast, and secure file processing</Text>
          </View>
        </View>
        <View style={styles.toolGridContainer}>
          {TOOLS.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.toolCard} 
              onPress={() => handleToolSelect(item.id)} // Pass the tool's ID
            >
              <View style={styles.toolIconContainer}>
                <Icon name={item.icon} size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.toolName}>{item.name}</Text>
              <Text style={styles.toolDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


// --- Styles for HomeScreen ---
const { width } = Dimensions.get('window');
const screenPadding = 15;
const cardGap = 10;
const cardWidth = (width - (screenPadding * 2) - cardGap) / 2;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    screenContainer: { flex: 1, paddingHorizontal: screenPadding, paddingTop: 15 },
    scrollViewContent: { paddingBottom: 70 },
    header: { flexDirection: "row", alignItems: "center", gap: 15, marginBottom: 20 },
    title: { fontSize: 28, fontWeight: "bold", color: COLORS.text },
    subtitle: { fontSize: 16, color: COLORS.mutedForeground },
    toolGridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginHorizontal: -cardGap / 2 },
    toolCard: { width: cardWidth, minHeight: 160, marginBottom: cardGap, marginHorizontal: cardGap / 2, padding: 15, backgroundColor: COLORS.card, borderRadius: 16, alignItems: "center", justifyContent: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
    toolIconContainer: { padding: 12, backgroundColor: `${COLORS.primary}20`, borderRadius: 12, marginBottom: 12 },
    toolName: { fontSize: 16, fontWeight: "bold", color: COLORS.text, textAlign: "center" },
    toolDescription: { fontSize: 12, color: COLORS.mutedForeground, textAlign: "center", marginTop: 4 },
});