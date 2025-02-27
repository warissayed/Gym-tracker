import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
  TextInput,
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

const Monday = () => {
  const [exerciseList, setExerciseList] = useState<ExerciseItem[]>([]);
  const [newExerciseName, setNewExerciseName] = useState<string>("");
  const [newSets, setNewSets] = useState<number>(0); // Initialize with a default value
  const [newReps, setNewReps] = useState<number>(0); // Initialize with a default value
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateIndex, setUpdateIndex] = useState<number | null>(null);

  // Load exercises from AsyncStorage when the component mounts or when it gains focus
  const loadExercises = async () => {
    try {
      const storedExercises = await AsyncStorage.getItem("MondayExercises");
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
    if (newExerciseName.trim() && newSets > 0 && newReps > 0) {
      const updatedList = [
        ...exerciseList,
        {
          name: newExerciseName,
          sets: newSets,
          reps: newReps,
          checked: false,
        },
      ];
      setExerciseList(updatedList);
      setNewExerciseName(""); // Clear input after adding
      setNewSets(1); // Reset to default value
      setNewReps(1); // Reset to default value
      saveExercises(updatedList);
    } else {
      Alert.alert("Invalid input", "Please provide valid exercise details.");
    }
  };

  const updateExercise = (): void => {
    if (newExerciseName.trim() && newSets > 0 && newReps > 0) {
      const updatedList = [...exerciseList];
      updatedList[updateIndex as number] = {
        name: newExerciseName,
        sets: newSets,
        reps: newReps,
        checked: false,
      };
      setExerciseList(updatedList);
      setNewExerciseName(""); // Clear input after updating
      setNewSets(1); // Reset to default value
      setNewReps(1); // Reset to default value
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
      await AsyncStorage.setItem("MondayExercises", JSON.stringify(exercises)); // Save as a JSON string
    } catch (error) {
      console.error("Failed to save exercises", error);
    }
  };

  // Increment and decrement functions
  const increment = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter((prev) => prev + 1);
  };

  const decrement = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter((prev) => Math.max(prev - 1, 1)); // Prevent going below 1
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
                setNewSets(item.sets);
                setNewReps(item.reps);
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
      <View style={styles.inputRow}>
        <View style={styles.setRepContainer}>
          <Text>Sets:</Text>
          <View style={styles.numberSelector}>
            <Button title="-" onPress={() => decrement(setNewSets)} />
            <Text style={styles.number}>{newSets}</Text>
            <Button title="+" onPress={() => increment(setNewSets)} />
          </View>
        </View>
        <View style={styles.setRepContainer}>
          <Text>Reps:</Text>
          <View style={styles.numberSelector}>
            <Button title="-" onPress={() => decrement(setNewReps)} />
            <Text style={styles.number}>{newReps}</Text>
            <Button title="+" onPress={() => increment(setNewReps)} />
          </View>
        </View>
      </View>

      <Button
        title={isUpdating ? "Update Exercise" : "Add Exercise"}
        onPress={isUpdating ? updateExercise : addExercise}
      />
    </View>
  );
};

export default Monday;

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
  inputRow: {
    flexDirection: "row", // Arrange sets and reps in a row
    justifyContent: "space-between",
  },
  setRepContainer: {
    flexDirection: "column", // Each container will have vertical alignment
    alignItems: "center",
  },
  numberSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  number: {
    marginHorizontal: 10,
    fontSize: 16,
  },
});
