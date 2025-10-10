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

export default function ImageToPdfTool() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  const pickFiles = async () => {
    try {
      const results = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/jpg", "image/png"],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!results.canceled && results.assets) {
        const newFiles = results.assets.map((file) => ({
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "image/jpeg",
          size: file.size,
        }));
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      }
    } catch (err) {
      console.error("Error picking files:", err);
      Alert.alert("Error", "Failed to pick files");
    }
  };

  const handleConvert = async () => {
    if (files.length < 1) {
      Alert.alert("Error", "Please select at least 1 image file to convert");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Read each file and append to FormData properly for React Native
      for (const file of files) {
        // Create a proper File-like object for React Native
        const fileToUpload: any = {
          uri: file.uri,
          type: file.type,
          name: file.name,
        };
        
        formData.append("images", fileToUpload);
      }

      console.log("Sending request with", files.length, "images");

      const response = await fetch(
        "https://docflow-backend-q83c.onrender.com/api/images-to-pdf",
        {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/pdf',
          },
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the PDF as blob, then convert to base64
      const blob = await response.blob();
      
      // Convert blob to base64 using FileReader
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (result) {
            const base64 = result.split(',')[1];
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
      const filename = "converted.pdf";
      const fileUri = `${docDir}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log("PDF saved to:", fileUri);

      Alert.alert("Success", "Images converted to PDF successfully!", [
        { text: "OK", style: "default" },
        { text: "Share File", onPress: () => shareFile(fileUri) },
      ]);
      
      // Clear files after successful conversion
      setFiles([]);
    } catch (error) {
      console.error("Conversion error:", error);
      Alert.alert(
        "Error",
        `Failed to convert images to PDF. ${error instanceof Error ? error.message : 'Please try again.'}`
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

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const formatFileSize = (size?: number) => {
    if (!size) return "Unknown size";
    return (size / 1024 / 1024).toFixed(2) + " MB";
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Image to PDF Converter</Text>

      <UploadCard
        onPress={pickFiles}
        title="Select Image Files"
        subtitle="Tap here to browse and select JPG or PNG images"
      />

      {files.length > 0 && (
        <View style={styles.fileList}>
          <Text style={styles.sectionTitle}>
            Selected Images ({files.length}):
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
          <Text style={styles.addMoreButtonText}>Add More Images</Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <ProcessingCard message="Converting images to PDF..." progressWidth={50} />
      ) : (
        <TouchableOpacity
          style={[styles.convertButton, files.length < 1 && styles.disabledButton]}
          onPress={handleConvert}
          disabled={files.length < 1}
        >
          <Text
            style={[
              styles.convertButtonText,
              files.length < 1 && styles.disabledButtonText,
            ]}
          >
            Convert to PDF ({files.length} {files.length === 1 ? 'image' : 'images'})
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          • Select JPG or PNG images to convert{"\n"}• Images will be added to PDF in
          the order selected{"\n"}• Each image will be fitted to a separate page{"\n"}• The PDF will be saved and can be shared
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
});