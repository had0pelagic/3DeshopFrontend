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
  const [error, setError] = useState({ password: "", confirmPassword: "" });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    checkIfUsersPage();
  }, []);

  const tryChangePassword = async () => {
    let errorExists = false;

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
        confirmPassword: "Passwords must match",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }

    if (!errorExists) {
      await updatePassword();
    }

    return;
  };

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
      alert(response.errorMessage);
    }
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    await tryChangePassword();
    setButtonDisabled(false);
  };

  const handleChange = (e) => {
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
              error={!error.password ? false : true}
              helperText={error.password}
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
              error={!error.confirmPassword ? false : true}
              helperText={error.confirmPassword}
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
                marginTop: 5,
              }}
              onClick={(e) => {
                setButtonDisabled(true);
                handleSubmitClick(e);
              }}
              disabled={buttonDisabled}
            >
              Change password
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
