import React, { useEffect, useState } from "react";
import "./styles.css";
import api from "../../api";
import JwtHelper from "../../utils/jwt.helper";
import { useAuth } from "../../hooks/useAuth";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Avatar, Container, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function UserBalanceTopUp() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    userId: null,
    amount: "",
  });
  const [error, setError] = useState({
    amount: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(async () => {
    checkIfUsersPage();
  }, []);

  const checkIfUsersPage = () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;

    if (id !== jwtUserId) {
      navigate("/");
    }
  };

  const tryUserTopUpBalance = async () => {
    let errorExists = false;

    if (!/[0-9]/.test(form.amount)) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        amount: "Amount must be a number",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        amount: "",
      }));
    }

    if (!errorExists) {
      await userTopUpBalance();
    }

    return;
  };

  const userTopUpBalance = async () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    form.userId = jwtUserId;
    const response = await api.balance.balanceTopUp(form);

    if (response.status === 200) {
      alert("Credits were added to user account");
      const origin = location.state?.from?.pathname || "/";
      navigate(origin);
    } else {
      alert(response.errorMessage);
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
    await tryUserTopUpBalance();
    setButtonDisabled(false);
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
              type="text"
              id="amount"
              label="Amount"
              margin="normal"
              variant="outlined"
              fullWidth
              value={form.amount}
              onChange={handleChange}
              error={!error.amount ? false : true}
              helperText={error.amount}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#30475E",
                  color: "#F05454",
                },
                backgroundColor: "#30475E",
                marginTop: 2,
              }}
              disabled={buttonDisabled}
              onClick={(e) => {
                setButtonDisabled(true);
                handleSubmitClick(e);
              }}
            >
              Add credits
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
