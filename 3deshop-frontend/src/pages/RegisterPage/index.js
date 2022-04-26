import React, { useEffect, useState } from "react";
import "./styles.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";
import { Avatar, Container, Typography } from "@mui/material";
import { ImportContactsOutlined } from "@material-ui/icons";

export default function Register() {
  const user = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [state, setState] = useState(user);
  const [error, setError] = useState(user);
  const { onLogin } = useAuth();

  useEffect(() => {
    console.log(error);
  }, [error]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const userRegistration = async () => {
    const registerResponse = await api.users.userRegister(state);
    if (registerResponse.status === 200) {
      const loginResponse = await api.users.userLogin({
        username: state.username,
        password: state.password,
      });
      if (loginResponse.status === 200) {
        alert("User has been registered")
        await onLogin(loginResponse.data);
      } else {
        console.log("Error, while trying to login after registration");
      }
    } else {
      console.log("Error at registration, didn't return 200");
    }
  };

  const tryRegister = async () => {
    if (!state.username) {
      console.log("Error: Username is empty");
      setError((prev) => ({
        ...prev,
        username: "Error: Username is empty",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        username: "",
      }));
    }

    if (state.password !== state.confirmPassword) {
      console.log("Error: Passwords are not matching");
      setError((prev) => ({
        ...prev,
        password: "Error: Passwords are not matching",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        password: "",
      }));
    }

    if (state.username.length < 4 || state.username.length > 14) {
      console.log("Error: Username must be between 4 and 14 symbols");
      setError((prev) => ({
        ...prev,
        username: "Error: Username must be between 4 and 14 symbols",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        username: "",
      }));
    }

    if (state.password.length < 4 || state.password.length > 14) {
      console.log("Error: Password must be between 4 and 14 symbols");
      setError((prev) => ({
        ...prev,
        password: "Error: Password must be between 4 and 14 symbols",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        password: "",
      }));
    }

    if (state.password !== state.confirmPassword) {
      console.log("Error: Passwords must match");
      setError((prev) => ({
        ...prev,
        confirmPassword: "Error: Passwords must match",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }

    return;
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    tryRegister();
    userRegistration();
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
            <ImportContactsOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
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
              id="username"
              label="Username"
              margin="normal"
              variant="outlined"
              fullWidth
              value={state.username}
              onChange={handleChange}
              error={!error.username ? false : true}
              helperText={error.username}
            />
            <TextField
              required
              id="firstName"
              label="First name"
              margin="normal"
              variant="outlined"
              fullWidth
              value={state.firstName}
              onChange={handleChange}
            />
            <TextField
              required
              id="lastName"
              label="Last name"
              margin="normal"
              variant="outlined"
              fullWidth
              value={state.lastName}
              onChange={handleChange}
            />
            <TextField
              required
              id="email"
              label="Email"
              margin="normal"
              variant="outlined"
              fullWidth
              type="email"
              value={state.email}
              onChange={handleChange}
            />
            <TextField
              required
              id="password"
              label="Password"
              margin="normal"
              variant="outlined"
              fullWidth
              type="password"
              value={state.password}
              onChange={handleChange}
              error={!error.password ? false : true}
              helperText={error.password}
            />
            <TextField
              required
              id="confirmPassword"
              label="Confirm password"
              margin="normal"
              variant="outlined"
              fullWidth
              type="password"
              value={state.confirmPassword}
              onChange={handleChange}
              error={!error.confirmPassword ? false : true}
              helperText={error.confirmPassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: 5 }}
              onClick={handleSubmitClick}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
