import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/data/mockData";

export interface FavoritePair {
  type: string;
  principal: string;
  pair: string;
  cliente: string;
}

interface AppContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  selectedTerminal: string;
  setSelectedTerminal: (t: string) => void;
  favoritePairs: FavoritePair[];
  setFavoritePairs: React.Dispatch<React.SetStateAction<FavoritePair[]>>;
  toggleFavorite: (pair: FavoritePair) => void;
  isFavorite: (principal: string, pair: string) => boolean;
  clientesByContainer: Record<string, string>;
  setClienteForContainer: (containerId: string, cliente: string) => void;
  bulkAssignClientes: (mapping: Record<string, string>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedTerminal, setSelectedTerminal] = useState("LCTPC");
  const [favoritePairs, setFavoritePairs] = useState<FavoritePair[]>([]);
  const [clientesByContainer, setClientesByContainer] = useState<Record<string, string>>({});

  const toggleFavorite = (pair: FavoritePair) => {
    setFavoritePairs((prev) => {
      const exists = prev.find((p) => p.principal === pair.principal && p.pair === pair.pair);
      if (exists) return prev.filter((p) => !(p.principal === pair.principal && p.pair === pair.pair));
      return [...prev, pair];
    });
  };

  const isFavorite = (principal: string, pair: string) =>
    favoritePairs.some((p) => p.principal === principal && p.pair === pair);

  const setClienteForContainer = (containerId: string, cliente: string) => {
    setClientesByContainer((prev) => ({ ...prev, [containerId]: cliente }));
  };

  const bulkAssignClientes = (mapping: Record<string, string>) => {
    setClientesByContainer((prev) => ({ ...prev, ...mapping }));
  };

  return (
    <AppContext.Provider value={{
      user, setUser, selectedTerminal, setSelectedTerminal,
      favoritePairs, setFavoritePairs, toggleFavorite, isFavorite,
      clientesByContainer, setClienteForContainer, bulkAssignClientes,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};
