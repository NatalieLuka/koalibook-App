import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { COLORS } from "../styles/constants";
import { Picker } from "@react-native-picker/picker";
import climbingKoala from "../assets/climbingKoala.png";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";

const API = `${process.env.EXPO_PUBLIC_API_URL}/books`;

const ProgressChart = ({ isbn }) => {
  const { getToken } = useAuth();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState("");
  const [selectedDay, setSelectedDay] = useState("Mo");
  const maxBarHeight = 150;

  const fetchProgressData = async () => {
    try {
      const token = await getToken();

      const response = await fetch(`${API}/${isbn}/progress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error retrieving data:", errorText);
        return;
      }

      const result = await response.json();
      const weekProgress = result.currentWeekProgress.map((entry) => ({
        day: entry.weekday,
        pages: entry.pagesRead,
      }));
      setData(weekProgress);
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  const updatePages = async () => {
    try {
      const token = await getToken();

      const response = await fetch(`${API}/${isbn}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newPage: parseInt(currentPage, 10),
        }),
      });
      if (response.ok) {
        await fetchProgressData();
        setCurrentPage("");
      } else {
        Alert.alert("Error, Data could not be updated");
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const maxPages = Math.max(...data.map((entry) => entry.pages), 1);

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
        <Picker
          selectedValue={selectedDay}
          style={styles.picker}
          itemStyle={styles.item}
          onValueChange={(itemValue) => setSelectedDay(itemValue)}
        >
          <Picker.Item label="Monday" value="Mon" />
          <Picker.Item label="Tuesday" value="Tue" />
          <Picker.Item label="Wednesday" value="Wed" />
          <Picker.Item label="Thursday" value="Thu" />
          <Picker.Item label="Friday" value="Fri" />
          <Picker.Item label="Saturday" value="Sat" />
          <Picker.Item label="Sunday" value="Sun" />
        </Picker>

        <Pressable
          style={({ pressed }) => [
            globalStyles.button,
            {
              backgroundColor: pressed ? COLORS.primary : COLORS.secondary,
            },
          ]}
          onPress={updatePages}
        >
          <Text style={globalStyles.buttonText}>Update</Text>
        </Pressable>
      </View>

      <View style={styles.chartContainer}>
        {data.map((entry, index) => {
          const barHeight =
            maxPages > 0 ? (entry.pages / maxPages) * maxBarHeight : 0;

          return (
            <View key={index} style={styles.barContainer}>
              <Text style={styles.pageText}>{entry.pages}</Text>
              <View style={[styles.bar, { height: barHeight }]}>
                {barHeight > 0 && (
                  <Image
                    source={climbingKoala}
                    style={[styles.icon, { bottom: barHeight - 20 }]}
                  />
                )}
              </View>
              <Text style={styles.dayText}>{entry.day}</Text>
            </View>
          );
        })}
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
    borderColor: COLORS.paragraphLight,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingLeft: 8,
    width: 100,
    color: COLORS.paragraphLight,
  },

  picker: {
    width: "50%",
    marginRight: 10,
  },
  item: {
    height: 50,
    fontSize: 16,
    color: COLORS.paragraphLight,
  },

  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "120%",
    alignItems: "flex-end",
    height: 200,
    marginTop: 20,
  },
  barContainer: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  bar: {
    width: 30,
    backgroundColor: COLORS.primary,
    marginBottom: 5,
    position: "relative",
  },
  icon: {
    width: 30,
    height: 40,
    position: "absolute",
    left: "50%",
    transform: [{ translateY: 20 }, { translateX: 10 }],
  },
});
export default ProgressChart;
