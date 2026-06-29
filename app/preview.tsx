import { imageToBase64 } from "@/lib/gemini";
import { router, useLocalSearchParams } from "expo-router";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams<{
    photoUri: string;
  }>();

  async function handleAnalyze() {
    try {
      if (!photoUri) {
        Alert.alert("Error", "No photo found.");
        return;
      }

      const base64Image = await imageToBase64(photoUri);

      // Temporary checkpoint for Phase 4
      console.log("Base64 Length:", base64Image.length);

      router.push({
        pathname: "/result",
        params: {
          base64Image,
        },
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to process the image.");
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: photoUri }}
        style={styles.preview}
        resizeMode="contain"
      />

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
          <Text style={styles.buttonText}>Analyze</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  preview: {
    flex: 1,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },

  retakeButton: {
    backgroundColor: "#5A6472",
    padding: 14,
    borderRadius: 8,
  },

  analyzeButton: {
    backgroundColor: "#5B3FA3",
    padding: 14,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
