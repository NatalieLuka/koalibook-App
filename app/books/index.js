import { FlatList, View, Text, Pressable, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { globalStyles } from "../../styles/globalStyles";
import { useAuth } from "@clerk/clerk-expo";
import { useState, useCallback } from "react";
import { COLORS } from "../../styles/constants";
import { router } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const API = "http://localhost:3000/books";

const renderItem = ({ item }) => {
  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.cardTitle}>{item.title}</Text>
      <Text style={globalStyles.cardAuthor}>by {item.author}</Text>
      <Pressable
        style={globalStyles.button}
        onPress={() => router.push(`/books/${item.isbn}`)}
      >
        <Text style={globalStyles.buttonText}>View Details</Text>
      </Pressable>
    </View>
  );
};

export default function BooksPage() {
  const { getToken } = useAuth();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    // next.js useEffect
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

  return (
    <SafeAreaProvider>
      <SafeAreaView style={globalStyles.pageContainer}>
        <Text style={globalStyles.heading}>Books Page 📚</Text>

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
          renderItem={renderItem}
          keyExtractor={(item) => item.isbn.toString()}
          contentContainerStyle={globalStyles.listContainer}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
