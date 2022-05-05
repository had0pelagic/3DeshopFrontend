import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import PasswordIcon from "@mui/icons-material/Password";
import api from "../../api";
import JwtHelper from "../../utils/jwt.helper";
import { useAuth } from "../../hooks/useAuth";

export default function ChangePassword() {
  const passwordObj = {
    password: "",
    confirmPassword: "",
  };
  let { id } = useParams();
  const [state, setState] = useState(passwordObj);
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    checkIfUsersPage();
  }, []);

  const checkIfUsersPage = () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;

    if (id !== jwtUserId) {
      navigate("/");
    }
  };

  const updatePassword = async () => {
    const response = await api.users.userChangePassword(id, state);

    if (response.status === 200) {
      alert("Password has been changed");
      const origin = location.state?.from?.pathname || "/";
      navigate(origin);
    } else {
      console.log("error at password change page, didn't return 200");
    }
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    updatePassword();
  };

  const handleChange = (e) => {
    console.log(e.target);
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
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
            <PasswordIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Change password
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
              id="password"
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={state.password}
              onChange={handleChange}
            />
            <TextField
              required
              id="confirmPassword"
              label="Confirm password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={state.confirmPassword}
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
              Change password
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
