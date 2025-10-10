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
import OrganizePdfTool from "@/components/tools/OrganizePdfTool";
// import AddPageNumbersTool from "@/components/tools/AddPageNumbersTool";
// import RemoveBgTool from "@/components/tools/RemoveBgTool";
// import ExtractPdfPagesTool from "@/components/tools/ExtractPdfPagesTool";
// import RemovePdfPagesTool from "@/components/tools/RemovePdfPagesTool";
// import PdfToWordTool from "@/components/tools/PdfToWordTool";
// import WordToPdfTool from "@/components/tools/WordToPdfTool";
// import ExcelToPdfTool from "@/components/tools/ExcelToPdfTool";
// import PdfToExcelTool from "@/components/tools/PdfToExcelTool";
import ImageToPdfTool from "@/components/tools/ImageToPdfTool";
// import PdfToImageTool from "@/components/tools/PdfToImageTool";

// Registry of tool components
const TOOL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "merge-pdf": MergePdfTool,
  "split-pdf": SplitPdfTool,
  // "compress-pdf": CompressPdfTool,
  "organize-pdf": OrganizePdfTool,
  // "add-page-numbers": OrganizePdfTool, 
  // "remove-bg": OrganizePdfTool,
  // "extract-pdf-pages": OrganizePdfTool, 
  // "remove-pdf-pages": OrganizePdfTool, 
  // "pdf-to-word": OrganizePdfTool, 
  // "word-to-pdf": OrganizePdfTool, 
  // "excel-to-pdf": OrganizePdfTool, 
  // "pdf-to-excel": OrganizePdfTool, 
   "image-to-pdf": ImageToPdfTool, 
  // "pdf-to-image": OrganizePdfTool, 
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
