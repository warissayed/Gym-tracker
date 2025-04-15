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
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native"; // For refreshing when navigating between screens
import { router } from "expo-router";

interface ExerciseItem {
  name: string;
  sets: number;
  reps: number[];
  checked: boolean;
}

const Monday = () => {
  const [exerciseList, setExerciseList] = useState<ExerciseItem[]>([]);
  const [newExerciseName, setNewExerciseName] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateIndex, setUpdateIndex] = useState<number | null>(null);
  const [toggleAddExercise, setToggleAddExercise] = useState<boolean>(false);
  const [newSets, setNewSets] = useState<number>(0);
  const [newReps, setNewReps] = useState<number[]>([0]);

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

  const handleSetsChange = (text: string) => {
    if (text === "") {
      setNewSets(0);
      return;
    }

    let value = parseInt(text);
    if (!isNaN(value)) {
      if (value > 5) value = 5; // Cap at 5 sets
      setNewSets(value);
      setNewReps(new Array(value).fill(0)); // Initialize reps array
    }
  };

  const handleRepsChange = (index: number, text: string) => {
    const updatedReps = [...newReps];
    updatedReps[index] = parseInt(text) || 0; // Convert input to number
    setNewReps(updatedReps);
  };

  const toggleCheckbox = (index: number): void => {
    const updatedList = [...exerciseList];
    updatedList[index].checked = !updatedList[index].checked;
    setExerciseList(updatedList);
    saveExercises(updatedList);
  };

  const addNewExercise = () => {
    setToggleAddExercise(!toggleAddExercise);
  };

  const addExercise = (): void => {
    const sets = newSets || 0;
    const reps = newReps.map((rep) => rep || 0);

    if (!newExerciseName.trim() || sets === 0 || reps.includes(0)) {
      Alert.alert("Invalid input", "Please provide valid exercise details.");
      return;
    }

    const updatedList = [
      ...exerciseList,
      {
        name: newExerciseName,
        sets,
        reps,
        checked: false,
      },
    ];
    setExerciseList(updatedList);
    setNewExerciseName("");
    setNewSets(0);
    setNewReps([]);
    saveExercises(updatedList);
  };

  const updateExercise = (): void => {
    if (newExerciseName.trim() && newSets > 0 && newReps > [0]) {
      const updatedList = [...exerciseList];
      updatedList[updateIndex as number] = {
        name: newExerciseName,
        sets: newSets,
        reps: newReps,
        checked: false,
      };
      setExerciseList(updatedList);
      setNewExerciseName(""); // Clear input after updating
      setNewSets(0); // Reset to default value
      setNewReps([0]); // Reset to default value
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
      <View style={styles.exerciseItem}>
        <TouchableOpacity
          onPress={() => {
            router.push("/(tabs)");
          }}
        >
          <Text> {"<  "}Monday</Text>
        </TouchableOpacity>
      </View>
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
            <Text style={styles.detailsText}>Sets: {item.sets} |</Text>
          </View>
          <View>
            {item.reps.map((rep, i) => (
              <Text key={i} style={styles.detailsText}>
                rep {i + 1}: {rep}
              </Text>
            ))}
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
      <View
        style={toggleAddExercise ? { display: "none" } : { display: "flex" }}
      >
        {/* <TextInput
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
        </View> */}
        <TextInput
          style={styles.input}
          value={newExerciseName}
          onChangeText={setNewExerciseName}
          placeholder="Exercise Name"
        />

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={newSets === 0 ? "" : newSets.toString()} // Show empty string instead of 0
          onChangeText={handleSetsChange}
          placeholder="Enter sets (max 5)"
          maxLength={1}
        />

        {newSets > 0 &&
          newReps.map((rep, index) => (
            <View key={index} style={styles.setRepContainer}>
              <Text>Set {index + 1} Reps:</Text>
              <View style={styles.numberSelector}>
                <Button
                  title="-"
                  onPress={() => {
                    const updatedReps = [...newReps];
                    updatedReps[index] = Math.max(updatedReps[index] - 1, 1); // Prevent below 1
                    setNewReps(updatedReps);
                  }}
                />

                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={rep.toString()} // Convert to string for input
                  onChangeText={(text) => handleRepsChange(index, text)}
                  placeholder="Enter reps"
                />

                <Button
                  title="+"
                  onPress={() => {
                    const updatedReps = [...newReps];
                    updatedReps[index] += 1;
                    setNewReps(updatedReps);
                  }}
                />
              </View>
            </View>
          ))}

        <Button
          title={isUpdating ? "Update Exercise" : "Add Exercise"}
          onPress={isUpdating ? updateExercise : addExercise}
        />
      </View>
      <Button
        title={toggleAddExercise ? "Cancel" : "Add Exercise"}
        onPress={addNewExercise}
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
    backgroundColor: "#f0f0f0",
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
    borderColor: "#fff",
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
