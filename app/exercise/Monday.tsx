import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native"; // For refreshing when navigating between screens

interface ExerciseItem {
  name: string;
  sets: number;
  reps: number;
  checked: boolean;
}

const WorkoutTracker = () => {
  const [exerciseList, setExerciseList] = useState<ExerciseItem[]>([]);
  const [newExerciseName, setNewExerciseName] = useState<string>("");
  const [newSets, setNewSets] = useState<number | string>("");
  const [newReps, setNewReps] = useState<number | string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateIndex, setUpdateIndex] = useState<number | null>(null);

  // Load exercises from AsyncStorage when the component mounts or when it gains focus
  const loadExercises = async () => {
    try {
      const storedExercises = await AsyncStorage.getItem("workoutExercises");
      if (storedExercises) {
        setExerciseList(JSON.parse(storedExercises)); // Parse the JSON string to an array
      }
    } catch (error) {
      console.error("Failed to load exercises", error);
    }
  };

  // Effect to load exercises on component mount
  useEffect(() => {
    loadExercises();
  }, []);

  // Optional: Reload exercises when this screen gains focus
  useFocusEffect(() => {
    loadExercises();
  });

  const toggleCheckbox = (index: number): void => {
    const updatedList = [...exerciseList];
    updatedList[index].checked = !updatedList[index].checked;
    setExerciseList(updatedList);
    saveExercises(updatedList);
  };

  const addExercise = (): void => {
    if (!newSets || !newReps) {
      ToastAndroid.show(
        "Please provide valid exercise details.",
        ToastAndroid.SHORT
      );
      return;
    }

    if (
      newExerciseName.trim() &&
      !isNaN(Number(newSets)) &&
      !isNaN(Number(newReps))
    ) {
      const updatedList = [
        ...exerciseList,
        {
          name: newExerciseName,
          sets: Number(newSets),
          reps: Number(newReps),
          checked: false,
        },
      ];
      setExerciseList(updatedList);
      setNewExerciseName(""); // Clear input after adding
      setNewSets(""); // Clear sets input
      setNewReps(""); // Clear reps input
      saveExercises(updatedList);
    } else {
      Alert.alert("Invalid input", "Please provide valid exercise details.");
    }
  };

  const updateExercise = (): void => {
    if (!newSets || !newReps) {
      ToastAndroid.show(
        "Please provide valid exercise details.",
        ToastAndroid.SHORT
      );
      return;
    }

    if (
      newExerciseName.trim() &&
      !isNaN(Number(newSets)) &&
      !isNaN(Number(newReps))
    ) {
      const updatedList = [...exerciseList];
      updatedList[updateIndex as number] = {
        name: newExerciseName,
        sets: Number(newSets),
        reps: Number(newReps),
        checked: false,
      };
      setExerciseList(updatedList);
      setNewExerciseName(""); // Clear input after updating
      setNewSets(""); // Clear sets input
      setNewReps(""); // Clear reps input
      setIsUpdating(false);
      setUpdateIndex(null); // Clear update index
      saveExercises(updatedList);
    } else {
      Alert.alert("Invalid input", "Please provide valid exercise details.");
    }
  };

  const deleteExercise = (index: number): void => {
    Alert.alert(
      "Delete Exercise",
      "Are you sure you want to delete this exercise?",
      [
        {
          text: "Cancel",
          style: "cancel", // This is the Cancel button
        },
        {
          text: "OK",
          onPress: () => {
            // Only delete the exercise if user clicks "OK"
            const updatedList = exerciseList.filter((_, i) => i !== index);
            setExerciseList(updatedList);
            saveExercises(updatedList);
          },
        },
      ],
      { cancelable: true } // Allow the alert to be dismissed by tapping outside
    );
  };

  const saveExercises = async (exercises: ExerciseItem[]) => {
    try {
      await AsyncStorage.setItem("workoutExercises", JSON.stringify(exercises)); // Save as a JSON string
    } catch (error) {
      console.error("Failed to save exercises", error);
    }
  };

  return (
    <View style={styles.container}>
      {exerciseList.map((item, index) => (
        <View
          key={index}
          style={[styles.exerciseItem, item.checked && styles.checkedItem]}
        >
          <TouchableOpacity onPress={() => toggleCheckbox(index)}>
            <View
              style={[styles.checkbox, item.checked && styles.checkedCheckbox]}
            />
          </TouchableOpacity>
          <View style={styles.exerciseTextContainer}>
            <Text
              style={[styles.exerciseText, item.checked && styles.checkedText]}
            >
              {item.name}
            </Text>
            <Text style={styles.detailsText}>
              Sets: {item.sets} | Reps: {item.reps}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Update"
              onPress={() => {
                setIsUpdating(true);
                setUpdateIndex(index);
                setNewExerciseName(item.name);
                setNewSets(String(item.sets));
                setNewReps(String(item.reps));
              }}
            />
            <Button title="Delete" onPress={() => deleteExercise(index)} />
          </View>
        </View>
      ))}
      <TextInput
        style={styles.input}
        value={newExerciseName}
        onChangeText={setNewExerciseName}
        placeholder="Exercise Name"
      />
      <TextInput
        style={styles.input}
        value={String(newSets)}
        onChangeText={setNewSets}
        placeholder="Sets"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={String(newReps)}
        onChangeText={setNewReps}
        placeholder="Reps"
        keyboardType="numeric"
      />
      <Button
        title={isUpdating ? "Update Exercise" : "Add Exercise"}
        onPress={isUpdating ? updateExercise : addExercise}
      />
    </View>
  );
};

export default WorkoutTracker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  checkedItem: {
    backgroundColor: "#d3d3d3", // Gray background when checked
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 10,
  },
  checkedCheckbox: {
    backgroundColor: "#000",
  },
  exerciseTextContainer: {
    flex: 1,
  },
  exerciseText: {
    fontSize: 16,
  },
  detailsText: {
    fontSize: 14,
    color: "#666",
  },
  checkedText: {
    textDecorationLine: "line-through", // Add line-through when checked
    color: "#777", // Optional, change text color when checked
  },
  buttonContainer: {
    flexDirection: "row",
    marginLeft: 10,
  },
});
