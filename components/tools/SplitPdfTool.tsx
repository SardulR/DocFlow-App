import { ProcessingCard } from "@/components/ui/ProcessingCard";
import { UploadCard } from "@/components/ui/UploadCard";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface FileItem {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export default function SplitPdfTool() {
  const [file, setFile] = useState<FileItem | null>(null);
  const [ranges, setRanges] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedFile = result.assets[0];
        setFile({
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.mimeType || "application/pdf",
          size: selectedFile.size,
        });
      }
    } catch (err) {
      console.error("Error picking file:", err);
      Alert.alert("Error", "Failed to pick file");
    }
  };

  const handleSplit = async () => {
    if (!file) {
      Alert.alert("Error", "Please select a PDF file to split");
      return;
    }

    const validRanges = ranges.filter((range) => range.trim().length > 0);
    if (validRanges.length === 0) {
      Alert.alert("Error", "Please specify at least one page range");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("pdf", {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);

      formData.append("ranges", JSON.stringify(validRanges));

      const response = await fetch(
        "https://docflow-backend-q83c.onrender.com/api/split-pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Get the ZIP file as blob, then convert to base64
      const blob = await response.blob();
      
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Save the file using FileSystem.documentDirectory
      const docDir = FileSystem.documentDirectory;
      const filename = "split-documents.zip";
      const fileUri = `${docDir}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert("Success", "PDF split successfully!", [
        { text: "OK", style: "default" },
        { text: "Share File", onPress: () => shareFile(fileUri) },
      ]);
    } catch (error: any) {
      console.error("Split error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to split PDF. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const shareFile = async (fileUri: string) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Info", "File saved to app documents");
      }
    } catch (error) {
      console.error("Error sharing file:", error);
      Alert.alert("Error", "Could not share the split PDF files");
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const addRangeInput = () => {
    setRanges([...ranges, '']);
  };

  const updateRange = (index: number, value: string) => {
    const newRanges = [...ranges];
    newRanges[index] = value;
    setRanges(newRanges);
  };

  const removeRange = (index: number) => {
    if (ranges.length > 1) {
      setRanges(ranges.filter((_, i) => i !== index));
    }
  };

  const formatFileSize = (size?: number) => {
    if (!size) return "Unknown size";
    return (size / 1024 / 1024).toFixed(2) + " MB";
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>PDF Split Tool</Text>

      <UploadCard
        onPress={pickFile}
        title="Select PDF File"
        subtitle="Tap here to browse and select a PDF file"
      />

      {file && (
        <View style={styles.fileList}>
          <Text style={styles.sectionTitle}>Selected File:</Text>
          <View style={styles.fileItem}>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName} numberOfLines={1}>
                {file.name}
              </Text>
              <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={removeFile}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {file && (
        <View style={styles.rangesSection}>
          <Text style={styles.sectionTitle}>Page Ranges:</Text>
          <Text style={styles.rangeHelp}>
            Enter page ranges (e.g., &quot;1&quot;, &quot;1-5&quot;, or &quot;1,3,5&quot;)
          </Text>
          
          {ranges.map((range, index) => (
            <View key={index} style={styles.rangeInputContainer}>
              <TextInput
                style={styles.rangeInput}
                placeholder={`Range ${index + 1} (e.g., 1-5)`}
                value={range}
                onChangeText={(value) => updateRange(index, value)}
              />
              {ranges.length > 1 && (
                <TouchableOpacity
                  style={styles.removeRangeButton}
                  onPress={() => removeRange(index)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.addRangeButton} onPress={addRangeInput}>
            <Text style={styles.addRangeButtonText}>+ Add Range</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ProcessingCard message="Splitting PDF..." progressWidth={50} />
      ) : (
        <TouchableOpacity
          style={[styles.splitButton, !file && styles.disabledButton]}
          onPress={handleSplit}
          disabled={!file}
        >
          <Text
            style={[
              styles.splitButtonText,
              !file && styles.disabledButtonText,
            ]}
          >
            Split PDF
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          • Select a PDF file to split{"\n"}
          • Specify page ranges in these formats:{"\n"}
          {"  "}– Single page: &quot;5&quot;{"\n"}
          {"  "}– Range: &quot;1-10&quot;{"\n"}
          {"  "}– Multiple pages: &quot;1,3,5,7&quot;{"\n"}
          • Each range will create a separate PDF{"\n"}
          • All PDFs will be downloaded as a ZIP file
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#666",
  },
  fileList: {
    marginVertical: 20,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: "#666",
  },
  removeButton: {
    backgroundColor: "#ff4444",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  rangesSection: {
    marginVertical: 20,
  },
  rangeHelp: {
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
    fontStyle: "italic",
  },
  rangeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rangeInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 14,
  },
  removeRangeButton: {
    backgroundColor: "#ff4444",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  addRangeButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  addRangeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  splitButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  splitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButtonText: {
    color: "#999",
  },
  instructions: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#e8f4f8",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});