import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router } from "expo-router";

const index = () => {
  return (
    <View>
      <Text>index</Text>
      <View>
        <Text>index</Text>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            // Navigating to the auth/index screen
            router.push("/");
          }}
        >
          <Text style={styles.text}>Redirect to Auth Tab</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default index;

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
