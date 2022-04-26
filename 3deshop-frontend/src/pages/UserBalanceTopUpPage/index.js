import React, { useState } from "react";
import "./styles.css";
import JwtHelper from "../../utils/jwt.helper";
import { useAuth } from "../../hooks/useAuth";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import { Avatar, Container, Typography } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

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
      alert("Credits were added to user account")
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
      <Container component="main" maxWidth="xs">
        <div
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar style={{ marginTop: 10 }}>
            <AttachMoneyIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Add credits to balance
          </Typography>
          <form
            style={{
              width: "100%",
              marginTop: 10,
            }}
            noValidate
          >
            <TextField
              required
              id="amount"
              label="Amount"
              margin="normal"
              variant="outlined"
              fullWidth
              value={form.amount}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: 15 }}
              onClick={handleSubmitClick}
            >
              Add to balance
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
