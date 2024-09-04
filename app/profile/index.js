import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { globalStyles } from "../../styles/globalStyles";
import { useUser, useAuth } from "@clerk/clerk-expo";
import ProgressChart from "../../components/ProgressChart";

export default function ProfilePage() {
  const { getToken } = useAuth();
  const { user } = useUser();

  async function handleGetToken() {
    const token = await getToken();
    console.log(token);
  }

  return (
    <>
      <Text style={globalStyles.heading}>I am the Profilepage</Text>
      <Pressable onPress={handleGetToken}>
        <Text>Get Token</Text>
        <ProgressChart />
      </Pressable>
    </>
  );
}
