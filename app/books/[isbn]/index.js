import { View, Text, StyleSheet, Scrollview, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../../../styles/globalStyles";
import { useAuth } from "@clerk/clerk-expo";
import { COLORS } from "../../../styles/constants";
import { Image } from "expo-image";

const API = "http://localhost:3000/books";

export default function BookDetailPage() {
  const { isbn } = useLocalSearchParams();
  const { getToken } = useAuth();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBookDetails() {
      try {
        setIsLoading(true);
        const token = await getToken();
        const response = await fetch(`${API}/${isbn}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error loading book details:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isbn) {
      loadBookDetails();
    }
  }, [isbn, getToken]);

  if (!book) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text style={globalStyles.paragraph}>Book not found.</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={globalStyles.heading}>{book.title}</Text>
          <Text style={globalStyles.paragraph}>{book.author}</Text>
          <Image style={styles.image} source={book.image}></Image>

          <Text style={globalStyles.paragraph}>{book.description}</Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingTop: 10,
    backgroundColor: COLORS.background,
    alignItems: "center",
    paddingBottom: 50,
    gap: 10,
  },
  image: {
    height: 300,
    width: 200,
    marginBottom: 16,
  },
});
