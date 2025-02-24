import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { router } from "expo-router";

interface ExerciseData {
  day: string;
  exercises: string;
  image: string;
}

const exercisesData: ExerciseData[] = [
  {
    day: "Monday",
    exercises: "Push-ups, Squats, Plank",
    image:
      "https://img.freepik.com/free-vector/workout-concept-illustration_114360-1148.jpg?t=st=1740143605~exp=1740147205~hmac=339aab36029531f63a33031564eff4aa060aac4007ba5517faa8ff772f568d77&w=900",
  },
  {
    day: "Tuesday",
    exercises: "Bench Press, Deadlifts, Lunges",
    image:
      "https://img.freepik.com/free-vector/male-friends-exercising-gym-together_74855-7600.jpg?t=st=1740141901~exp=1740145501~hmac=f691fa89837bf5f66a4239b50091045045b52a711a8f9a197dd015b98527f80c&w=900",
  },
  {
    day: "Wednesday",
    exercises: "Pull-ups, Bicep Curls, Tricep Dips",
    image:
      "https://img.freepik.com/free-vector/young-man-exercising-fitness-gym-room-with-sport-equipment-workouts-guy-training-lifting-dumbbell-sitting-bench_575670-690.jpg?t=st=1740143642~exp=1740147242~hmac=31a8cb0a351e40ca2580729c120b5ce67caca579a5e63d132e892de7d82f4640&w=1060",
  },
  {
    day: "Thursday",
    exercises: "Shoulder Press, Squats, Crunches",
    image:
      "https://img.freepik.com/free-vector/illustrated-flat-dance-fitness-home_23-2148875719.jpg?t=st=1740143632~exp=1740147232~hmac=e215495daec0f99a2415e5abea3255a4e0fc8143a64e2cf358d862695b1795ae&w=900",
  },
  {
    day: "Friday",
    exercises: "Leg Press, Calf Raises, Plank",
    image:
      "https://img.freepik.com/free-vector/physical-assessment-concept-illustration_114360-21871.jpg?t=st=1740143624~exp=1740147224~hmac=1804c1e56b7e04db2142adda099e644688065107f15e92b10570e64c93429f24&w=1380",
  },
  {
    day: "Saturday",
    exercises: "Cardio, Jumping Jacks, Mountain Climbers",
    image:
      "https://img.freepik.com/free-vector/stay-home-concept_52683-35474.jpg?t=st=1740143769~exp=1740147369~hmac=c224053243fa2df9973978b3f4f119b7822e0c91348022c3281842c3d8c6112f&w=1380",
  },
  {
    day: "Sunday",
    exercises: "Rest day or Light Stretching",
    image:
      "https://img.freepik.com/free-vector/sleeping-hammock-concept-illustration_114360-24367.jpg?t=st=1740143801~exp=1740147401~hmac=157ef09f43ffa9b1acbb7a7164942d9859f754b51acc7f9b710563da38a47a89&w=900",
  },
];
type ValidExercisePath =
  | "/exercise/Monday"
  | "/exercise/Tuesday"
  | "/exercise/Wednesday"
  | "/exercise/Thursday"
  | "/exercise/Friday"
  | "/exercise/Saturday"
  | "/exercise/Sunday";
const Index = () => {
  const renderItem = ({ item }: { item: ExerciseData }) => {
    const path = `/exercise/${item.day}` as ValidExercisePath; // Correctly referencing item.day
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            router.push(path);
          }}
          style={styles.exerciseItem}
        >
          <Image source={{ uri: item.image }} style={styles.exerciseImage} />
          <View style={styles.textContainer}>
            <Text style={styles.dayText}>{item.day}</Text>
            <Text style={styles.exercisesText}>{item.exercises}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercises for the Day</Text>

      <FlatList
        data={exercisesData}
        renderItem={renderItem}
        keyExtractor={(item) => item.day}
      />

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          // Navigating to the auth/index screen
          router.push("/auth");
        }}
      >
        <Text style={styles.text}>Redirect to Auth Tab</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  exerciseItem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  exerciseImage: {
    width: "30%",
    height: 80, // You can adjust the height
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  exercisesText: {
    fontSize: 16,
    color: "gray",
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
