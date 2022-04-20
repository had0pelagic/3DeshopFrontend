import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, CardMedia, TextField, Typography, Card } from "@mui/material";
import api from "../../api";
import Loader from "../../components/Loader";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FormatHelper from "../../utils/format.helper";

export default function Account() {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [image, setImage] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(async () => {
    await getUser();
  }, []);

  function encodeData(array) {
    return Promise.all(
      array.map(async (item) => {
        try {
          const base64 = await FormatHelper.encodeBase64(item.file);
          return {
            name: item.filename,
            data: base64.bytes,
            format: base64.type,
          };
        } catch (error) {
          throw error;
        }
      })
    );
  }

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
    const imageData = await encodeData(image);
    const request = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      image: imageData[0],
      email: user.email,
    };
    const response = await api.users.userUpdate(id, request);

    if (response.status === 200) {
      window.location.reload();
      console.log("Updated", user.username);
    } else {
      console.log("error at account page, didn't return 200");
    }
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    updateUser();
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
        <div className="flexContainer">
          <CardMedia
            component="img"
            image={`${user.image.format},${user.image.data}`}
            sx={{ width: 200, height: 200, paddingTop: 5 }}
          />
          <Card
            sx={{
              backgroundColor: "white",
              border: 2,
              width: 350,
              height: "100%",
              marginTop: 5,
            }}
          >
            <Typography>Upload image...</Typography>
            <FilePond
              stylePanelLayout="compact"
              files={image}
              allowMultiple={false}
              onupdatefiles={setImage}
              labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
            />
          </Card>
          <TextField
            id="username"
            label="Username"
            variant="standard"
            margin="normal"
            value={user.username}
            onChange={handleChange}
            sx={{ width: 350 }}
          />
          <TextField
            required
            id="firstName"
            label="First name"
            variant="standard"
            margin="normal"
            value={user.firstName}
            onChange={handleChange}
            sx={{ width: 350 }}
          />
          <TextField
            required
            id="lastName"
            label="Last name"
            variant="standard"
            margin="normal"
            value={user.lastName}
            onChange={handleChange}
            sx={{ width: 350 }}
          />
          <TextField
            required
            id="email"
            label="Email"
            variant="standard"
            margin="normal"
            type="email"
            value={user.email}
            onChange={handleChange}
            sx={{ width: 350 }}
          />
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
