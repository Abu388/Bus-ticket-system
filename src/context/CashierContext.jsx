import { createContext, useContext, useState } from "react";

const CashierContext = createContext();

export function CashierProvider({ children }) {
  const [cashiers, setCashiers] = useState([
    { id: 1, name: "Cashier 1" }
  ]);

  const addCashier = (name) => {
    const newCashier = { id: cashiers.length + 1, name };
    setCashiers([...cashiers, newCashier]);
  };

  return (
    <CashierContext.Provider value={{ cashiers, addCashier }}>
      {children}
    </CashierContext.Provider>
  );
}

export const useCashiers = () => useContext(CashierContext);
