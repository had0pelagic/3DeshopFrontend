import React, { useState } from "react";
import "./styles.css";
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
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
        alert("User has been registered");
        await onLogin(loginResponse.data);
      } else {
        alert(loginResponse.errorMessage);
      }
    } else {
      alert(registerResponse.errorMessage);
    }
  };

  const tryRegister = async () => {
    let errorExists = false;

    if (state.username.length < 6 || state.username.length > 14) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        username: "Username must be between 6 and 14 symbols",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        username: "",
      }));
    }

    if (state.password.length < 6) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        password: "Password must have atleast 6 symbols",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        password: "",
      }));
    }

    if (state.password !== state.confirmPassword) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        password: "Passwords must match",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        password: "",
      }));
    }

    if (state.firstName.length === 0) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        firstName: "First name can't be empty",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        firstName: "",
      }));
    }

    if (state.lastName.length === 0) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        lastName: "Last name can't be empty",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        lastName: "",
      }));
    }

    if (state.email.length < 6) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        email: "Invalid email",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        email: "",
      }));
    }

    if (!state.email.includes("@")) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        email: "Invalid email",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        email: "",
      }));
    }

    if (!errorExists) {
      await userRegistration();
    }

    return;
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    await tryRegister();
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
              error={!error.firstName ? false : true}
              helperText={error.firstName}
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
              error={!error.lastName ? false : true}
              helperText={error.lastName}
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
              error={!error.email ? false : true}
              helperText={error.email}
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
              error={!error.password ? false : true}
              helperText={error.password}
              onChange={handleChange}
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
              error={!error.confirmPassword ? false : true}
              helperText={error.confirmPassword}
              onChange={handleChange}
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
