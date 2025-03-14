import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const MensaContext = createContext<MensaContextType | undefined>(undefined);

export const MensaProvider = ({ children }: { children: React.ReactNode }) => {
  const [mensaData, setMensaData] = useState<MensaDataType[] | null>(null);
  const [menuData, setMenuData] = useState<MealType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!process.env.EXPO_PUBLIC_X_API_KEY) {
        setError("EXPO_PUBLIC_X_API_KEY is missing in .env");
        setLoading(false);
        return;
      }
      try {
        const [mensaResponse, menuResponse] = await Promise.all([
          axios.get("https://mensa.gregorflachs.de/api/v1/canteen", {
            headers: { "X-API-KEY": process.env.EXPO_PUBLIC_X_API_KEY },
          }),
          axios.get("https://mensa.gregorflachs.de/api/v1/menue", {
            headers: { "X-API-KEY": process.env.EXPO_PUBLIC_X_API_KEY },
          }),
        ]);
        setMensaData(mensaResponse.data);
        setMenuData(menuResponse.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const loadMenuForMensa = (canteenId: string): MealType[] | null => {
    if (!menuData) return null;
    return menuData.filter((menu) => menu.canteenId === canteenId);
  };

  return (
    <MensaContext.Provider value={{ mensaData, menuData, loading, error, loadMenuForMensa }}>
      {children}
    </MensaContext.Provider>
  );
};

// Custom Hook für einfachen Zugriff
export const useMensa = (): MensaContextType => {
  const context = useContext(MensaContext);
  if (!context) {
    throw new Error("useMensa must be used within a MensaProvider");
  }
  return context;
};