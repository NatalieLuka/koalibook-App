import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { router } from "expo-router";
import { globalStyles } from "../../styles/gobalStyles";

export default function DogsPage() {
  return (
    <>
      <Text style={globalStyles.heading}>I am the dogs page</Text>
    </>
  );
}
