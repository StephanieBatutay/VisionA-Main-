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

const PERSONAS = [
  { key: "academic", label: "Academic Analysis", color: "#2E5BBA" },
  { key: "safety", label: "Safety Analysis", color: "#C0392B" },
  { key: "inventory", label: "Inventory Analysis", color: "#1E8449" },
] as const;

type PersonaKey = (typeof PERSONAS)[number]["key"];

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams<{
    photoUri: string;
  }>();

  async function goAnalyze(promptKey: PersonaKey) {
    try {
      if (!photoUri) {
        Alert.alert("Error", "No photo found.");
        return;
      }

      const base64Image = await imageToBase64(photoUri);

      router.push({
        pathname: "/result",
        params: {
          base64Image,
          promptKey,
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
      </View>

      <View style={styles.personaRow}>
        {PERSONAS.map(({ key, label, color }) => (
          <TouchableOpacity
            key={key}
            style={[styles.personaButton, { backgroundColor: color }]}
            onPress={() => goAnalyze(key)}
          >
            <Text style={styles.personaLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  preview: { flex: 1 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  retakeButton: {
    backgroundColor: "#5A6472",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  personaRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 8,
  },
  personaButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  personaLabel: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
});
