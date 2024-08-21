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
    </>
  );
}
