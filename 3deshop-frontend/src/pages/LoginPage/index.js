import React, { useState } from "react";
import "./styles.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api";

export default function Login() {
  const { onLogin } = useAuth();

  const [state, setState] = useState({
    username: "",
    password: "",
  });

  const userLogin = async () => {
    const response = await api.users.userLogin(state);
    if (response.status === 200) {
      console.log("Login.js: %o", response.data.token);
      await onLogin(response.data);
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    userLogin();
  };

  return (
    <div className="flexContainer">
      <TextField
        required
        id="username"
        label="Username"
        variant="standard"
        margin="normal"
        value={state.username}
        onChange={handleChange}
      />
      <TextField
        required
        id="password"
        label="Password"
        variant="standard"
        margin="normal"
        type="password"
        value={state.password}
        onChange={handleChange}
      />
      <div className="mt40">
        <Button variant="contained" onClick={handleSubmitClick}>
          Login
        </Button>
      </div>
    </div>
  );
}
