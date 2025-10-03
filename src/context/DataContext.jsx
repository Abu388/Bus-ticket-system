import { createContext, useContext, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [cashiers, setCashiers] = useState([{ id: 1, name: "Cashier 1" }]);
  const [tickets, setTickets] = useState([]);
  const [deposits, setDeposits] = useState([]);

  return (
    <DataContext.Provider value={{ cashiers, setCashiers, tickets, setTickets, deposits, setDeposits }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
