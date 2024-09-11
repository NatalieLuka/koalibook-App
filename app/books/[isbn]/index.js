import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../../../styles/globalStyles";
import { useAuth } from "@clerk/clerk-expo";
import { COLORS } from "../../../styles/constants";
import { Image } from "expo-image";
import { useWindowDimensions } from "react-native";
import koalaPlaceholder from "../../../assets/noBookImage.png";

const API = `${process.env.EXPO_PUBLIC_API_URL}/books`;

export default function BookDetailPage() {
  const { isbn } = useLocalSearchParams();
  const { getToken } = useAuth();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();

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
  // if (isLoading) {
  //   return <ActivityIndicator />;
  // }
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
          {/* <Text>{JSON.stringify(book)}</Text> */}
          <Text style={globalStyles.heading}>{book.title}</Text>
          <Text style={globalStyles.paragraph}>{book.author}</Text>
          <Image
            style={
              book.image !== "22" && book.image
                ? styles.image
                : styles.koalaPlaceholder
            }
            source={
              book.image !== "22" && book.image
                ? { uri: book.image }
                : koalaPlaceholder
            }
          />
          <Text style={globalStyles.paragraph}>
            {book.description.replace(/<\/?[^>]+(>|$)/g, "")}
          </Text>
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
    height: 250,
    width: 150,
    marginBottom: 16,
  },
  koalaPlaceholder: {
    height: 250,
    width: 250,
    marginBottom: 16,
  },
});
