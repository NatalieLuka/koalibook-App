import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { globalStyles } from "../../styles/globalStyles";
import { useUser } from "@clerk/clerk-expo";
import { COLORS } from "../../styles/constants";

export default function BooksPage() {
  const { user } = useUser();

  return (
    <>
      <Text style={globalStyles.heading}>I am the books page</Text>
      <Text>Hello {user?.primaryEmailAddress?.emailAddress}</Text>
      <Pressable
        style={({ pressed }) => [
          globalStyles.button,
          {
            backgroundColor: pressed ? COLORS.primary : COLORS.secondary,
          },
        ]}
      >
        <Link href="/books/scanner">
          <Text style={globalStyles.buttonText}>Buch hinzufügen</Text>
        </Link>
      </Pressable>
    </>
  );
}
