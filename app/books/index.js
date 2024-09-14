import { FlatList, View, Text, Pressable, Alert, Image } from "react-native";
import { useFocusEffect } from "expo-router";
import { globalStyles } from "../../styles/globalStyles";
import { useAuth } from "@clerk/clerk-expo";
import { useState, useCallback } from "react";
import { COLORS } from "../../styles/constants";
import { router } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useActiveBook } from "../../context/ActiveBookContext";
import koalaPlaceholder from "../../assets/noBookImage.png";

const API = `${process.env.EXPO_PUBLIC_API_URL}/books`;

const removeBookFromList = async (isbn, setBooks, getToken) => {
  try {
    setBooks((prevBooks) => prevBooks.filter((book) => book.isbn !== isbn));
    const token = await getToken();
    const deleteResponse = await fetch(`${API}/${isbn}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (deleteResponse.ok) {
      Alert.alert("Book removed from your list.");
    } else {
      Alert.alert("Failed to remove book from your list.");
    }
  } catch (error) {
    console.log(error);
    Alert.alert("An error occurred while removing the book.");
  }
};

export default function BooksPage() {
  const { getToken } = useAuth();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setActiveBook } = useActiveBook();

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        try {
          setIsLoading(true);
          const token = await getToken();
          const response = await fetch(API, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const data = await response.json();
          setBooks(data);
        } catch (error) {
          console.log("Error loading books:", error);
        } finally {
          setIsLoading(false);
        }
      }
      loadData();
    }, [getToken])
  );

  const renderItem = ({ item, setBooks, getToken }) => {
    return (
      <View style={globalStyles.card}>
        <Image
          style={
            item.image !== "22" && item.image
              ? globalStyles.cardImage
              : globalStyles.koalaPlaceholder
          }
          source={
            item.image !== "22" && item.image
              ? { uri: item.image }
              : koalaPlaceholder
          }
        />
        <View style={globalStyles.cardButtonContainer}>
          <Pressable
            onPress={() => router.push(`/books/${item.isbn}`)}
            style={({ pressed }) => [
              globalStyles.button,
              { backgroundColor: pressed ? COLORS.primary : COLORS.secondary },
            ]}
          >
            <Text style={globalStyles.buttonText}>View Details</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              router.push("/profile"), setActiveBook(item);
            }}
            style={({ pressed }) => [
              globalStyles.button,
              { backgroundColor: pressed ? COLORS.primary : COLORS.secondary },
            ]}
          >
            <Text style={globalStyles.buttonText}>Set as Active</Text>
          </Pressable>
          <Pressable
            onPress={() => removeBookFromList(item.isbn, setBooks, getToken)}
            style={({ pressed }) => [
              globalStyles.button,
              {
                backgroundColor: pressed ? COLORS.secondary : COLORS.background,
                borderWidth: 1,
                borderColor: "white",
              },
            ]}
          >
            <Text
              style={[globalStyles.buttonText, { color: COLORS.paragraphDark }]}
            >
              Remove Book
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={globalStyles.pageContainer}>
        <Text style={globalStyles.heading}>My Bookshelf📚</Text>

        <Pressable
          onPress={() => router.push("/books/scanner")}
          style={({ pressed }) => [
            globalStyles.button,
            { backgroundColor: pressed ? COLORS.primary : COLORS.secondary },
          ]}
        >
          <Text style={globalStyles.buttonText}>Add New Book</Text>
        </Pressable>

        <FlatList
          data={books}
          renderItem={({ item }) => renderItem({ item, setBooks, getToken })}
          keyExtractor={(item) => item.isbn.toString()}
          contentContainerStyle={globalStyles.listContainer}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
