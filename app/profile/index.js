import { Text, Alert } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { useUser, useAuth } from "@clerk/clerk-expo";
import ProgressChart from "../../components/ProgressChart";
import { useLocalSearchParams } from "expo-router";

export default function ProfilePage() {
  const { user } = useUser();
  const { activeBookIsbn } = useLocalSearchParams();
  console.log("Active Book ISBN:", activeBookIsbn);

  return (
    <>
      <Text>Hello {user?.primaryEmailAddress?.emailAddress}</Text>
      <Text style={globalStyles.heading}>I am the Profilepage</Text>
      {activeBookIsbn ? (
        <Text style={styles.activeBookText}>
          Active Book ISBN: {activeBookIsbn}
        </Text>
      ) : (
        <Text>No active book selected.</Text>
      )}
      <ProgressChart isbn={activeBookIsbn} />
    </>
  );
}
