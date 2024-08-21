import { Tabs } from "expo-router";
import { COLORS } from "../styles/constants";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { usePathname } from "expo-router";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { useUser } from "@clerk/clerk-expo";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};
function TabNavigation() {
  const { user } = useUser();

  const pathname = usePathname();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.background,
        tabBarStyle: {
          backgroundColor: COLORS.secondary,
        },
        tabBarIcon: () => {
          const iconColor =
            pathname === "/" ? COLORS.primary : COLORS.background;

          return <FontAwesome5 name="home" size={24} color={iconColor} />;
        },
      }}
    >
      <Tabs.Screen name="(home)" options={{ href: null }} />
      <Tabs.Screen
        name="index"
        options={{
          href: user ? null : "/",
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          href: user ? "/books" : null,
          title: "My Books",
          tabBarIcon: ({ color }) => {
            return <FontAwesome5 name="book-open" size={24} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: user ? "/search" : null,
          title: "Search",
          tabBarIcon: ({ color }) => {
            return <FontAwesome name="search" size={24} color={color} />;
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          href: user ? "/profile" : null,
          title: "Profile",
          tabBarIcon: ({ color }) => {
            return <FontAwesome5 name="user-alt" size={24} color={color} />;
          },
        }}
      />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <TabNavigation />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
