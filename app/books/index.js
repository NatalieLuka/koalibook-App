import { View, Text, Pressable } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { useUser } from "@clerk/clerk-expo";
import { COLORS } from "../../styles/constants";
import { router } from "expo-router";

export default function BooksPage() {
  const { user } = useUser();

  return (
    <>
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
    </>
  );
}
