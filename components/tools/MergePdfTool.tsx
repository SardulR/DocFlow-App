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
  TouchableOpacity,
  View,
} from "react-native";

interface FileItem {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export default function MergePdfTool() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  const pickFiles = async () => {
    try {
      const results = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!results.canceled && results.assets) {
        const newFiles = results.assets.map((file) => ({
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/pdf",
          size: file.size,
        }));
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      }
    } catch (err) {
      console.error("Error picking files:", err);
      Alert.alert("Error", "Failed to pick files");
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      Alert.alert("Error", "Please select at least 2 PDF files to merge");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      for (const file of files) {
        formData.append("pdfs", {
          uri: file.uri,
          type: file.type,
          name: file.name,
        } as any);
      }

      const response = await fetch(
        "https://docflow-backend-q83c.onrender.com/api/merge-pdf",
        {
          method: "POST",
          body: formData,
          // ✅ Don't set Content-Type header - let browser set it with boundary
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // ✅ Get the PDF as blob, then convert to base64
      const blob = await response.blob();
      
      // ✅ Convert blob to base64 using FileReader (works in React Native)
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // ✅ Save the file using FileSystem.documentDirectory
      const docDir = FileSystem.documentDirectory;
      const filename = "merged.pdf";
      const fileUri = `${docDir}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert("Success", "PDF merged successfully!", [
        { text: "OK", style: "default" },
        { text: "Share File", onPress: () => shareFile(fileUri) },
      ]);
    } catch (error) {
      console.error("Merge error:", error);
      Alert.alert(
        "Error",
        "Failed to merge PDFs. Please check your internet connection and try again."
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
      Alert.alert("Error", "Could not share the merged PDF file");
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const formatFileSize = (size?: number) => {
    if (!size) return "Unknown size";
    return (size / 1024 / 1024).toFixed(2) + " MB";
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>PDF Merge Tool</Text>

      <UploadCard
        onPress={pickFiles}
        title="Select PDF Files"
        subtitle="Tap here to browse and select PDF files"
      />

      {files.length > 0 && (
        <View style={styles.fileList}>
          <Text style={styles.sectionTitle}>
            Selected Files ({files.length}):
          </Text>
          {files.map((file, index) => (
            <View key={`${file.uri}-${index}`} style={styles.fileItem}>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {file.name}
                </Text>
                <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFile(index)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {files.length > 0 && (
        <TouchableOpacity style={styles.addMoreButton} onPress={pickFiles}>
          <Text style={styles.addMoreButtonText}>Add More Files</Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <ProcessingCard message="Merging PDFs..." progressWidth={50} />
      ) : (
        <TouchableOpacity
          style={[styles.mergeButton, files.length < 2 && styles.disabledButton]}
          onPress={handleMerge}
          disabled={files.length < 2}
        >
          <Text
            style={[
              styles.mergeButtonText,
              files.length < 2 && styles.disabledButtonText,
            ]}
          >
            Merge PDFs ({files.length} files)
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          • Select at least 2 PDF files to merge{"\n"}• Files will be merged in
          the order selected{"\n"}• The merged PDF will be saved and can be
          shared
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
  addMoreButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  addMoreButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  mergeButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  mergeButtonText: {
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