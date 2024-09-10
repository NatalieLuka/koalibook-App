import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
} from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { COLORS } from "../../styles/constants";

export default function UpcomingPage() {
  const [upcomingBooks, setUpcomingBooks] = useState([]);
  const [upcomingTitle, setUpcomingTitle] = useState("");

  useFocusEffect(
    useCallback(() => {
      const loadBooks = async () => {
        const storedBooks = await AsyncStorage.getItem("books");
        if (storedBooks) {
          setUpcomingBooks(JSON.parse(storedBooks));
        }
      };

      loadBooks();
    }, [])
  );

  const addBook = async () => {
    if (!upcomingTitle) return;

    const newBook = {
      id: Date.now().toString(),
      title: upcomingTitle,
      checked: false,
    };
    const updatedBooks = [...upcomingBooks, newBook];
    setUpcomingBooks(updatedBooks);
    await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
    setUpcomingTitle("");
  };

  const toggleCheckbox = async (id) => {
    const updatedBooks = upcomingBooks.map((book) =>
      book.id === id ? { ...book, checked: !book.checked } : book
    );
    setUpcomingBooks(updatedBooks);
    await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
  };

  const removeBook = async (id) => {
    const updatedBooks = upcomingBooks.filter((book) => book.id !== id);
    setUpcomingBooks(updatedBooks);
    await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
  };

  return (
    <View style={globalStyles.pageContainer}>
      <Text style={globalStyles.heading}>Your Pre-Orders</Text>
      <Text style={globalStyles.paragraph}>
        Here, you can relax and keep track of all your pre-Orders, just like a
        koala waiting patiently in its tree for the juiciest eucalyptus leaves
        to arrive.
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Date / Book Title"
          value={upcomingTitle}
          onChangeText={setUpcomingTitle}
        />
        <Pressable style={globalStyles.button} onPress={addBook}>
          <Text style={globalStyles.buttonText}>Add pre-Order</Text>
        </Pressable>
      </View>
      <FlatList
        data={upcomingBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Checkbox
              value={item.checked}
              onValueChange={() => toggleCheckbox(item.id)}
              style={styles.checkbox}
              color={item.checked ? COLORS.secondary : undefined}
            />
            <Text style={item.checked ? styles.strikethrough : styles.text}>
              {item.title}
            </Text>
            <Pressable onPress={() => removeBook(item.id)}>
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/eating-Koala.png")}
              style={styles.logo}
            />
          </View>
        }
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingLeft: 8,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.paragraphDark,
  },
  strikethrough: {
    flex: 1,
    marginLeft: 10,
    textDecorationLine: "line-through",
    color: COLORS.secondary,
  },
  removeText: {
    backgroundColor: COLORS.primary,
    padding: 4,
    color: COLORS.secondary,
  },
  checkbox: {
    marginRight: 10,
  },
  flatList: {
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
});
