import { StyleSheet, Text, View } from "react-native";

export default function ResultScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Result Screen (Coming in Phase 5)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
