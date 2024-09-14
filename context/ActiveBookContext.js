import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@clerk/clerk-expo";

const ActiveBookContext = createContext();

export function BookProvider({ children }) {
  const { user } = useUser();
  const [activeBook, setActiveBook] = useState(null);

  const saveActiveBookToStorage = async (book) => {
    try {
      if (user?.id) {
        const storageKey = `@active_book_${user.id}`;
        if (book) {
          await AsyncStorage.setItem(storageKey, JSON.stringify(book));
        } else {
          await AsyncStorage.removeItem(storageKey);
        }
      }
    } catch (e) {
      console.error("Error saving active book to storage", e);
    }
  };

  const loadActiveBookFromStorage = async () => {
    try {
      if (user?.id) {
        const storageKey = `@active_book_${user.id}`;
        const storedBook = await AsyncStorage.getItem(storageKey);
        if (storedBook) {
          setActiveBook(JSON.parse(storedBook));
        }
      }
    } catch (e) {
      console.error("Error loading active book from storage", e);
    }
  };
  useEffect(() => {
    if (user?.id) {
      loadActiveBookFromStorage();
    }
  }, [user]);

  useEffect(() => {
    saveActiveBookToStorage(activeBook);
  }, [activeBook]);

  return (
    <ActiveBookContext.Provider
      value={{
        activeBook,
        setActiveBook,
      }}
    >
      {children}
    </ActiveBookContext.Provider>
  );
}

export function useActiveBook() {
  return useContext(ActiveBookContext);
}
