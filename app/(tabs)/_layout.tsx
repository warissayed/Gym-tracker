import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

// Sample user data for profile
const user = {
  name: "Waris Sayed",
  profilePhoto: "https://avatar.iran.liara.run/public/17", // Replace with an actual image URL or local source
  streak: 7, // Example streak value
};

export default function TabLayout() {
  // Custom Header component
  const CustomHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: user.profilePhoto }}
          style={styles.profileImage}
        />
        <View style={styles.streakSection}>
          <Image
            source={require("../../assets/images/fire.png")}
            style={styles.fireImage}
          />
          <Text style={styles.streakText}>{user.streak}</Text>
        </View>
      </View>
      <Text style={styles.headerTitle}>{user.name}</Text>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        header: () => <CustomHeader />,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Gym",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Analytics"
        options={{
          tabBarLabel: "Analytics",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="face-man-profile"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#000",
    borderRadius: 20,
    top: 10,
    width: "90%",
    alignSelf: "center",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // Makes the image circular
    marginRight: 10,
  },
  streakSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  fireImage: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  streakText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});
