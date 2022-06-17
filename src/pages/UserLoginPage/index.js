import React, { useState } from "react";
import "./styles.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Avatar, Container, Grid, Typography } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api";
import { Link } from "react-router-dom";

export default function Login() {
  const { onLogin } = useAuth();
  const [state, setState] = useState({
    username: "",
    password: "",
  });

  const userLogin = async () => {
    const response = await api.users.userLogin(state);

    if (response.status === 200) {
      await onLogin(response.data);
    } else {
      alert(response.errorMessage);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    await userLogin();
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
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
            />
            <TextField
              required
              id="password"
              label="Password"
              margin="normal"
              variant="outlined"
              fullWidth
              type="password"
              style={{ marginTop: 5 }}
              value={state.password}
              onChange={handleChange}
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
              }}
              onClick={handleSubmitClick}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Typography
                  component={Link}
                  to={`/register`}
                  variant="body2"
                  style={{ textDecoration: "none" }}
                >
                  No account? Join today!
                </Typography>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
}
