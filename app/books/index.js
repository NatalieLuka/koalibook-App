import { FlatList, View, Text, Pressable, StyleSheet } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { globalStyles } from "../../styles/globalStyles";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useState, useEffect, useCallback } from "react";
import { COLORS } from "../../styles/constants";
import { router } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const API = "http://localhost:3000/books";

const renderItem = ({ item }) => {
  return (
    <View style={styles.item}>
      <Text style={globalStyles.paragraph}>{item.title}</Text>
      <Text style={globalStyles.paragraph}>{item.author}</Text>
      {/* <Image source={item.coverImage} style={styles.image} /> */}
      <Link style={globalStyles.paragraph} href={`${item.isbn}`}>
        View more details
      </Link>
    </View>
  );
};

export default function BooksPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
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
          console.log(data);
          setBooks(data);
        } catch (error) {
          console.log("Error loading books:", error);
        } finally {
          setIsLoading(false);
        }
      }

      console.log("useFocusEffect called");
      loadData();
    }, [getToken]) // Abhängigkeit sicherstellen
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text style={globalStyles.heading}>I am the books page 📚</Text>
        <Text>Hello {user?.primaryEmailAddress?.emailAddress}</Text>
        <Pressable
          onPress={() => router.push("/books/scanner")}
          style={({ pressed }) => [
            globalStyles.button,
            {
              backgroundColor: pressed ? COLORS.primary : COLORS.secondary,
            },
          ]}
        >
          <Text style={globalStyles.buttonText}>Add new Book</Text>
        </Pressable>
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={(item) => item.isbn.toString()}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});
