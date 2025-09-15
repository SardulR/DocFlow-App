import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";

import { ToolService } from "@/services/toolService";
import { BackButton } from "@/components/ui/BackButton";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { NotFoundState } from "@/components/ui/NotFoundState";
import { ToolScreenParams } from "@/types/tool.types";
import { THEME } from "@/constants/theme";

// Import all tool components
import MergePdfTool from "@/components/tools/MergePdfTool";
import SplitPdfTool from "@/components/tools/SplitPdfTool";
// import CompressPdfTool from "@/components/tools/CompressPdfTool";
// import OrganisePdfTool from "@/components/tools/OrganisePdfTool";
// ...import others

// Registry of tool components
const TOOL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "merge-pdf": MergePdfTool,
  "split-pdf": SplitPdfTool,
  // "compress-pdf": CompressPdfTool,
  // "organise-pdf": OrganisePdfTool,
};

export default function ToolScreen(): JSX.Element {
  const { id } = useLocalSearchParams<ToolScreenParams>();
  const selectedTool = ToolService.findToolById(id);

  if (!selectedTool) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Not Found" }} />
        <NotFoundState />
      </SafeAreaView>
    );
  }

  const ToolComponent = TOOL_COMPONENTS[selectedTool.id];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={styles.screenContainer}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />
        <ToolHeader tool={selectedTool} />

        {/* Render tool-specific component */}
        {ToolComponent ? <ToolComponent /> : <NotFoundState />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  screenContainer: {
    flex: 1,
    padding: THEME.spacing.md,
  },
});
