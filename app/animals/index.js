import { View, Text } from "react-native";
import { Link } from "expo-router";
import { globalStyles } from "../../styles/gobalStyles";

export default function AnimalsPage() {
  return (
    <>
      <Text style={globalStyles.heading}>I am the animals page</Text>
      <Link style={globalStyles.paragraph} href="/animals/dogs">
        Go to dogs
      </Link>
      <Link style={globalStyles.paragraph} href="/animals/cats">
        Go to cats
      </Link>
    </>
  );
}
