import { View, Text, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { globalStyles } from "../../../styles/gobalStyles";

export default function CatsPage() {
  return (
    <>
      <Text style={globalStyles.heading}>I am the cats page</Text>

      <Link style={globalStyles.paragraph} href="/animals/cats/2">
        View details of Gipsy
      </Link>
      <Link style={globalStyles.paragraph} href="/animals/cats/1">
        View details of Ginger
      </Link>
    </>
  );
}
