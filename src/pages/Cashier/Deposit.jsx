import CashierLayout from "../../layouts/CashierLayout";
import { useState } from "react";
import { useData } from "../../context/DataContext";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function Deposit() {
  const { deposits, setDeposits } = useData();
  const [amount, setAmount] = useState("");

  const handleDeposit = () => {
    if (!amount) return alert("Enter amount");
    setDeposits([...deposits, { id: Date.now(), amount }]);
    setAmount("");
    alert("Deposit submitted!");
  };

  return (
    <CashierLayout>
      <h1>Deposit</h1>
      <Input label="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
      <Button onClick={handleDeposit}>Submit Deposit</Button>
    </CashierLayout>
  );
}
