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

export default function DocxToPdfTool() {
  const [file, setFile] = useState<FileItem | null>(null);
  const [loading, setLoading] = useState(false);

  const pickDocument = async () => {
    try {
      // Launch document picker for DOCX/DOC files
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/msword",
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const selectedFile: FileItem = {
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: asset.size,
        };
        setFile(selectedFile);
      }
    } catch (err) {
      console.error("Error picking document:", err);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handleConvert = async () => {
    if (!file) {
      Alert.alert("Error", "Please select a DOCX or DOC file to convert");
      return;
    }

    // Validate file size (10MB limit as per backend)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size && file.size > MAX_FILE_SIZE) {
      Alert.alert("Error", "File size exceeds 10MB limit");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Create a proper File-like object for React Native
      const fileToUpload: any = {
        uri: file.uri,
        type: file.type,
        name: file.name,
      };

      formData.append("file", fileToUpload);

      

      // Update this URL to your backend endpoint
      const response = await fetch(
        "https://docflow-backend-q83c.onrender.com/api/word-to-pdf",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
        console.error("Error response:", errorData);
        throw new Error(errorMessage);
      }

      // Get the PDF as blob, then convert to base64
      const blob = await response.blob();

      // Convert blob to base64 using FileReader
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (result) {
            const base64 = result.split(",")[1];
            resolve(base64);
          } else {
            reject(new Error("Failed to read blob"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Save the file using FileSystem.documentDirectory
      const docDir = FileSystem.documentDirectory;
      const filename = file.name.replace(/\.(docx?|DOCX?)$/, ".pdf");
      const fileUri = `${docDir}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      

      Alert.alert("Success", "DOCX converted to PDF successfully!", [
        { text: "OK", style: "default" },
        { text: "Share File", onPress: () => shareFile(fileUri) },
      ]);

      // Clear file after successful conversion
      setFile(null);
    } catch (error) {
      console.error("Conversion error:", error);
      Alert.alert(
        "Error",
        `Failed to convert DOCX to PDF. ${
          error instanceof Error ? error.message : "Please try again."
        }`
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
      Alert.alert("Error", "Could not share the PDF file");
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const formatFileSize = (size?: number) => {
    if (!size) return "Unknown size";
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
    return (size / 1024 / 1024).toFixed(2) + " MB";
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>DOCX to PDF Converter</Text>

      <UploadCard
        onPress={pickDocument}
        title="Select DOCX File"
        subtitle="Tap here to choose a Word document (.docx or .doc)"
      />

      {file && (
        <View style={styles.fileList}>
          <Text style={styles.sectionTitle}>Selected Document:</Text>
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
        <TouchableOpacity style={styles.replaceButton} onPress={pickDocument}>
          <Text style={styles.replaceButtonText}>Choose Different File</Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <ProcessingCard
          message="Converting DOCX to PDF..."
          progressWidth={50}
        />
      ) : (
        <TouchableOpacity
          style={[styles.convertButton, !file && styles.disabledButton]}
          onPress={handleConvert}
          disabled={!file}
        >
          <Text
            style={[
              styles.convertButtonText,
              !file && styles.disabledButtonText,
            ]}
          >
            {file ? "Convert to PDF" : "Select a file to convert"}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          • Only DOCX and DOC files are supported{"\n"}• Maximum file size: 10MB
          {"\n"}• Text formatting and structure will be preserved{"\n"}• The PDF
          will be saved and can be shared
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Supported Features:</Text>
        <Text style={styles.infoText}>
          ✓ Paragraphs and headings{"\n"}✓ Lists (bulleted and numbered){"\n"}
          ✓ Tables (basic formatting){"\n"}✓ Text styling
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
  replaceButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  replaceButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  convertButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  convertButtonText: {
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
  infoBox: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#34C759",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },
});