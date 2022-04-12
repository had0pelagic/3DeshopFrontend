import React, { useState } from "react";
import "./styles.css";
import JwtHelper from "../../utils/jwt.helper";
import { useAuth } from "../../hooks/useAuth";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";

export default function UserBalanceTopUp() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    userId: null,
    amount: null,
  });

  const userTopUpBalance = async () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    form.userId = jwtUserId;
    const response = await api.balance.balanceTopUp(form);

    if (response.status === 200) {
      console.log("balance update!");
      const origin = location.state?.from?.pathname || "/";
      navigate(origin);
    } else {
      alert(response.errorMessage);
      console.log("error at balance top up, didn't return 200");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    await userTopUpBalance();
  };

  return (
    <div className="flexContainer">
      <TextField
        required
        id="amount"
        label="Amount"
        variant="standard"
        margin="normal"
        value={form.amount}
        onChange={handleChange}
      />
      <div className="mt40">
        <Button variant="contained" onClick={handleSubmitClick}>
          Add to balance
        </Button>
      </div>
    </div>
  );
}
