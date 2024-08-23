import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { globalStyles } from "../../styles/globalStyles";
import { useAuth } from "@clerk/clerk-expo";

export default function ProfilePage() {
  const { getToken } = useAuth();

  async function handleGetToken() {
    const token = await getToken();
  }

  return (
    <>
      <Text style={globalStyles.heading}>I am the Profilepage</Text>
      <Pressable onPress={handleGetToken}>
        <Text>Get Token</Text>
      </Pressable>
    </>
  );
}
