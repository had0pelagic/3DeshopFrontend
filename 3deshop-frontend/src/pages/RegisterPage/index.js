import React, { useEffect, useState } from "react";
import "./styles.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function Register() {
  const [registeredUsers, setRegisteredUsers] = useState();
  const [state, setState] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // const tryRegister = async () => {
  //   if (!state.username) {
  //     console.log("Error: No username");
  //   }
  //   if (state.password != state.confirmPassword) {
  //     console.log("Error: passwords are not matching");
  //   }
  //   return;
  // };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    // tryRegister();
    if (state.password === state.confirmPassword) {
      console.log("registering");
    } else {
      console.log("error, passwords are not matching");
    }
  };

  useEffect(() => {
    console.log(state);
  }, [state]);

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
        id="firstName"
        label="First name"
        variant="standard"
        margin="normal"
        value={state.firstName}
        onChange={handleChange}
      />
      <TextField
        required
        id="lastName"
        label="Last name"
        variant="standard"
        margin="normal"
        value={state.lastName}
        onChange={handleChange}
      />
      <TextField
        required
        id="email"
        label="Email"
        variant="standard"
        margin="normal"
        type="email"
        value={state.email}
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
      <TextField
        required
        id="confirmPassword"
        label="Confirm password"
        variant="standard"
        margin="normal"
        type="password"
        value={state.confirmPassword}
        onChange={handleChange}
      />
      <div className="mt40">
        <Button variant="contained" onClick={handleSubmitClick}>
          Register
        </Button>
      </div>
    </div>
  );
}
