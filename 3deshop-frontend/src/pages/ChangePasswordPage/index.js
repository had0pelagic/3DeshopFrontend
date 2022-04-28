import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import api from "../../api";

export default function ChangePassword() {
  const passwordObj = {
    password: "",
    confirmPassword: "",
  };
  let { id } = useParams();
  const [state, setState] = useState(passwordObj);
  const location = useLocation();
  const navigate = useNavigate();

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
          Change
        </Button>
      </div>
    </div>
  );
}
