import { Stack } from "expo-router";
import { COLORS } from "../../styles/constants";

export default function AnimalsStack() {
  return (
    <Stack
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: "white",

        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTitleStyle: {
          color: COLORS.text,
          fontSize: 20,
        },
        contentStyle: {
          backgroundColor: COLORS.background,
          paddingHorizontal: 20,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Animals",
        }}
      />
      <Stack.Screen
        name="dogs"
        options={{
          title: "Dogs",
        }}
      />
      <Stack.Screen
        name="cats/index"
        options={{
          title: "Cats",
        }}
      />
      <Stack.Screen
        name="cats/[catid]/index"
        options={{
          title: "Cat Details",
        }}
      />
    </Stack>
  );
}
