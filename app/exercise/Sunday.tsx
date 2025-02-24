import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native"; // For refreshing when navigating between screens

interface TodoItem {
  text: string;
  checked: boolean;
}

const Sunday = () => {
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");

  // Load todos from AsyncStorage when the component mounts or when it gains focus
  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem("sundayTodos");
      if (storedTodos) {
        setTodoList(JSON.parse(storedTodos)); // Parse the JSON string to an array
      }
    } catch (error) {
      console.error("Failed to load todos", error);
    }
  };

  // Effect to load todos on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  // Optional: Reload todos when this screen gains focus
  useFocusEffect(() => {
    loadTodos();
  });

  const toggleCheckbox = (index: number): void => {
    const updatedList = [...todoList];
    updatedList[index].checked = !updatedList[index].checked;
    setTodoList(updatedList);
    saveTodos(updatedList);
  };

  const addTodo = (): void => {
    if (newTodo.trim()) {
      const updatedList = [...todoList, { text: newTodo, checked: false }];
      setTodoList(updatedList);
      setNewTodo(""); // Clear input after adding
      saveTodos(updatedList);
    }
  };

  const saveTodos = async (todos: TodoItem[]) => {
    try {
      await AsyncStorage.setItem("sundayTodos", JSON.stringify(todos)); // Save as a JSON string
    } catch (error) {
      console.error("Failed to save todos", error);
    }
  };

  return (
    <View style={styles.container}>
      {todoList.map((item, index) => (
        <View
          key={index}
          style={[styles.todoItem, item.checked && styles.checkedItem]}
        >
          <TouchableOpacity onPress={() => toggleCheckbox(index)}>
            <View
              style={[styles.checkbox, item.checked && styles.checkedCheckbox]}
            />
          </TouchableOpacity>
          <Text style={[styles.todoText, item.checked && styles.checkedText]}>
            {item.text}
          </Text>
        </View>
      ))}
      <TextInput
        style={styles.input}
        value={newTodo}
        onChangeText={setNewTodo}
        placeholder="Add new task"
      />
      <Button title="Add" onPress={addTodo} />
    </View>
  );
};

export default Sunday;

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
  todoItem: {
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
  todoText: {
    fontSize: 16,
  },
  checkedText: {
    textDecorationLine: "line-through", // Add line-through when checked
    color: "#777", // Optional, change text color when checked
  },
});
