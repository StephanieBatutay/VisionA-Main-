import { PROMPTS, analyzeImage } from "@/lib/gemini";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface AnalysisResult {
  objects: string[];
  context: string;
  activities: string;
  recommendations: string;
}

const PERSONA_TITLES: Record<string, string> = {
  academic: "Academic Analysis",
  safety: "Safety Analysis",
  inventory: "Inventory Analysis",
};

export default function ResultScreen() {
  const { base64Image, promptKey } = useLocalSearchParams<{
    base64Image: string;
    promptKey: string;
  }>();

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    runAnalysis();
  }, []);

  async function runAnalysis() {
    try {
      setLoading(true);
      setError(null);

      if (!base64Image) throw new Error("No image received.");

      const prompt = PROMPTS[promptKey] ?? PROMPTS.academic;
      const result = await analyzeImage(base64Image, prompt);

      let text = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      if (!text) throw new Error("Gemini returned an empty response.");

      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      setAnalysis(JSON.parse(text));
    } catch (err) {
      console.error(err);
      setError("Could not analyze this image. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5B3FA3" />
        <Text style={styles.loadingText}>Analyzing image...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.personaTitle}>
        {PERSONA_TITLES[promptKey] ?? "Analysis"}
      </Text>

      <Text style={styles.sectionTitle}>Objects</Text>
      {analysis?.objects.map((item, index) => (
        <Text key={index} style={styles.listItem}>
          • {item}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Context</Text>
      <Text style={styles.bodyText}>{analysis?.context}</Text>

      <Text style={styles.sectionTitle}>Activities</Text>
      <Text style={styles.bodyText}>{analysis?.activities}</Text>

      <Text style={styles.sectionTitle}>Recommendations</Text>
      <Text style={styles.bodyText}>{analysis?.recommendations}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: { marginTop: 12, color: "#5A6472", fontSize: 16 },
  errorText: { color: "#B3261E", textAlign: "center", fontSize: 16 },
  personaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5B3FA3",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    color: "#1F2A44",
  },
  listItem: { fontSize: 16, marginTop: 6 },
  bodyText: { fontSize: 16, marginTop: 6, color: "#2B2F38", lineHeight: 24 },
});
