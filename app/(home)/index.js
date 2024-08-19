import { View, Text } from "react-native";
import { Link } from "expo-router";
import { globalStyles } from "../../styles/gobalStyles";

export default function HomePage() {
  return (
    <>
      <Text style={globalStyles.heading}>I am the Homepage</Text>
      <Link style={globalStyles.paragraph} href="contact">
        Go to Contacts
      </Link>
      <Link style={globalStyles.paragraph} href="animals/dogs">
        Go to Dogs
      </Link>
      <Link style={globalStyles.paragraph} href="animals/cats">
        Go to Cats
      </Link>
      <Link style={globalStyles.paragraph} href="animals">
        Go to Animals
      </Link>
    </>
  );
}
