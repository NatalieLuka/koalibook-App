import { createContext, useContext, useState } from "react";

const ActiveBookContext = createContext();

export function BookProvider({ children }) {
  const [activeBook, setActiveBook] = useState(null);

  const selectBook = (book) => {
    setActiveBook(book);
  };

  return (
    <ActiveBookContext.Provider
      value={{
        activeBook,
        setActiveBook,
        selectBook,
      }}
    >
      {children}
    </ActiveBookContext.Provider>
  );
}

export function useActiveBook() {
  return useContext(ActiveBookContext);
}
