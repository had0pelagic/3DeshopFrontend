import React, { useEffect, useState } from "react";
import "./styles.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const { onLogin } = useAuth();

  const [state, setState] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (state.password === "123") {
      console.log("logging in");
      onLogin();
    } else {
      console.log("error, bad password");
    }
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
