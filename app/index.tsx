import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router } from "expo-router";

const Index = () => {
  return (
    <View style={styles.container}>
      <Text>Index Screen</Text>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          // Navigating to the auth/index screen
          router.push("/(tabs)");
        }}
      >
        <Text style={styles.text}>Redirect to Tab Menu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "80%",
    backgroundColor: "black",
    padding: 10,
    alignItems: "center",
    marginTop: 20,
  },
  text: {
    color: "white",
  },
});
