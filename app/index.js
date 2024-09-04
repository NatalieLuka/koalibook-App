import { Redirect } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

export default function IndexPage() {
  const { user } = useUser();

  return <Redirect href={!user ? "(home)" : "/profile"} />;
}
