import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

const initialData = [
  { day: "Mo", pages: 0 },
  { day: "Tue", pages: 0 },
  { day: "Wed", pages: 0 },
  { day: "Thu", pages: 0 },
  { day: "Fri", pages: 0 },
  { day: "Sat", pages: 0 },
  { day: "Sun", pages: 0 },
];

const ProgressChart = () => {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState("");
  const [selectedDay, setSelectedDay] = useState("Mo");

  const updatePages = () => {
    const updatedData = data.map((item) =>
      item.day === selectedDay
        ? { ...item, pages: parseInt(currentPage, 10) }
        : item
    );
    setData(updatedData);
    setCurrentPage("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Pages read"
          keyboardType="numeric"
          value={currentPage}
          onChangeText={(number) => setCurrentPage(number)}
        />
        <TextInput
          style={styles.input}
          placeholder="Day"
          value={selectedDay}
          onChangeText={(text) => setSelectedDay(text)}
        />
        <Pressable onPress={updatePages} />
      </View>

      <View style={styles.chartContainer}>
        {data.map((entry, index) => (
          <View key={index} style={styles.barContainer}>
            <Text style={styles.pageText}>{entry.pages}</Text>
            <View style={[styles.bar, { height: entry.pages * 2 }]} />
            <Text style={styles.dayText}>{entry.day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingLeft: 8,
    width: 100,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "flex-end",
    height: 200, // Feste Höhe für das Chart
    marginTop: 20,
  },
  barContainer: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  bar: {
    width: 30,
    backgroundColor: "#8884d8",
    marginBottom: 5,
  },
  pageText: {
    marginBottom: 5,
    fontSize: 16,
  },
  dayText: {
    marginTop: 5,
    fontSize: 16,
  },
});
export default ProgressChart;
