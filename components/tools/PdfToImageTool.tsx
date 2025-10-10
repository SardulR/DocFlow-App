import { ProcessingCard } from "@/components/ui/ProcessingCard";
import { UploadCard } from "@/components/ui/UploadCard";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
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

export default function PdfToImagesTool() {
  const [file, setFile] = useState<FileItem | null>(null);
  const [loading, setLoading] = useState(false);

  const pickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setFile({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || "application/pdf",
          size: asset.size,
        });
      }
    } catch (err) {
      console.error("Error picking PDF:", err);
      Alert.alert("Error", "Failed to pick PDF file");
    }
  };

  const handleConvert = async () => {
    if (!file) {
      Alert.alert("Error", "Please select a PDF file to convert");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      const fileToUpload: any = {
        uri: file.uri,
        type: file.type,
        name: file.name,
      };

      // Changed to "file" to match backend expectation
      formData.append("file", fileToUpload);

      const response = await fetch(
        "https://docflow-backend-q83c.onrender.com/api/pdf-to-images",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/zip",
          },
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Backend returns a ZIP file, so we need to handle it as a blob
      const zipBlob = await response.blob();
      console.log("Received ZIP file, size:", zipBlob.size);

      // Convert blob to base64 for React Native
      const reader = new FileReader();
      
      const base64Zip = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          // Remove data URL prefix to get pure base64
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(zipBlob);
      });

      // Save ZIP file to device
      const zipFilename = `converted-images-${Date.now()}.zip`;
      const zipFileUri = `${FileSystem.documentDirectory}${zipFilename}`;

      await FileSystem.writeAsStringAsync(zipFileUri, base64Zip, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Request permission to save to media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to save the ZIP file"
        );
        return;
      }

      // Save ZIP to media library
      await MediaLibrary.saveToLibraryAsync(zipFileUri);

      Alert.alert(
        "Success",
        `PDF converted successfully!\n\nA ZIP file containing all images has been saved to your gallery.\n\nFile: ${zipFilename}`
      );

      // Clear file after successful conversion
      setFile(null);
    } catch (error) {
      console.error("Conversion error:", error);
      Alert.alert(
        "Error",
        `Failed to convert PDF to images. ${
          error instanceof Error ? error.message : "Please try again."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const formatFileSize = (size?: number) => {
    if (!size) return "Unknown size";
    return (size / 1024 / 1024).toFixed(2) + " MB";
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>PDF to Images Converter</Text>

      <UploadCard
        onPress={pickPdf}
        title="Select PDF File"
        subtitle="Tap here to choose a PDF from your files"
      />

      {file && (
        <View style={styles.fileList}>
          <Text style={styles.sectionTitle}>Selected PDF:</Text>
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

      {loading ? (
        <ProcessingCard
          message="Converting PDF to images..."
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
            Convert to Images
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          • Select a PDF file from your device{"\n"}• Each page will be
          converted to a separate JPG image{"\n"}• Images will be packaged in a
          ZIP file{"\n"}• The ZIP file will be saved to your gallery
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