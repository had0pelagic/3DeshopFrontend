import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, CardMedia, TextField, Typography } from "@mui/material";
import api from "../../api";
import Loader from "../../components/Loader";

export default function Account() {
  const userObj = {
    username: "",
    firstName: "",
    lastName: "",
    imageURL: "",
    email: "",
  };
  let { id } = useParams();
  const [user, setUser] = useState(userObj);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const response = await api.users.getUser(id);
    if (response.status === 200) {
      setUser(response.data);
    } else {
      console.log("error at account page, didn't return 200");
    }
    setLoading(false);
  };

  const updateUser = async () => {
    const response = await api.users.userUpdate(id, user);
    if (response.status === 200) {
      console.log("Updated", user.username);
    } else {
      console.log("error at account page, didn't return 200");
    }
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    updateUser();
    console.log("Updating");
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
    updateUser();
    console.log("Uploading image...");
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <div className="flexContainer">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Typography>{console.log(user)}</Typography>
          <div>
            <CardMedia
              component="img"
              height="150"
              image={user.imageURL}
              alt={"User avatar"}
            />
            <div className="flexContainer">
              <TextField
                id="imageURL"
                label="Image"
                variant="standard"
                margin="normal"
                value={user.imageURL}
                onChange={handleChange}
              />
            </div>
            <div className="mt40 flexContainer">
              <Button variant="contained" onClick={handleImageUpload}>
                Upload
              </Button>
            </div>
          </div>
          <div className="flexContainer">
            <TextField
              id="username"
              label="Username"
              variant="standard"
              margin="normal"
              value={user.username}
              onChange={handleChange}
            />
          </div>
          <div className="flexContainer">
            <TextField
              required
              id="firstName"
              label="First name"
              variant="standard"
              margin="normal"
              value={user.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="flexContainer">
            <TextField
              required
              id="lastName"
              label="Last name"
              variant="standard"
              margin="normal"
              value={user.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="flexContainer">
            <TextField
              required
              id="email"
              label="Email"
              variant="standard"
              margin="normal"
              type="email"
              value={user.email}
              onChange={handleChange}
            />
          </div>
          <div className="mt40 flexContainer">
            <Button variant="contained" onClick={handleSubmitClick}>
              Update
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
