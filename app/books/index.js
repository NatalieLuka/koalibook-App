import { View, Text } from "react-native";
import { Link } from "expo-router";
import { globalStyles } from "../../styles/gobalStyles";
import { useUser } from "../../context/UserContext";

export default function BooksPage() {
  const { user } = useUser();
  return (
    <>
      <Text style={globalStyles.heading}>I am the books page</Text>
      <Text>Hello {user}</Text>
    </>
  );
}
