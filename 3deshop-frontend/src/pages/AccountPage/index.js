import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  CardMedia,
  TextField,
  Typography,
  Card,
  Container,
  Avatar,
} from "@mui/material";
import api from "../../api";
import Loader from "../../components/Loader";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FormatHelper from "../../utils/format.helper";
import JwtHelper from "../../utils/jwt.helper";
import { useAuth } from "../../hooks/useAuth";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FileFormatValidation from "../../utils/fileFormatValidation.helper";

export default function Account() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [image, setImage] = useState();
  const [isLoading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const [error, setError] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    image: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(async () => {
    checkIfUsersPage();
    await getUser();
  }, []);

  const tryUpdate = async () => {
    let errorExists = false;

    if (user.username.length < 6 || user.username.length > 60) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        username: "Name must have atleast 6 symbols",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        username: "",
      }));
    }

    if (user.firstName.length === 0) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        firstName: "First name cannot be empty",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        firstName: "",
      }));
    }

    if (user.lastName.length === 0) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        lastName: "Last name cannot be empty",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        lastName: "",
      }));
    }

    if (!user.email.includes("@")) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        email: "Invalid email",
      }));
    } else {
      if (user.email.length < 6) {
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
    }

    if (image !== undefined && image !== null && image.length !== 0) {
      if (!FileFormatValidation.isImageFormatValid(image[0])) {
        errorExists = true;
        setError((prev) => ({
          ...prev,
          image: "Accepted image formats: png, jpg",
        }));
      } else {
        setError((prev) => ({
          ...prev,
          image: "",
        }));
      }
    } else {
      setError((prev) => ({
        ...prev,
        image: "",
      }));
    }

    if (!errorExists) {
      await updateUser();
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

  async function encodeData(item) {
    const imageFile = item[0];
    const base64 = await FormatHelper.encodeBase64(imageFile.file);
    return {
      name: imageFile.filename,
      data: base64.bytes,
      format: base64.type,
    };
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
    const imageData = image == null ? null : await encodeData(image);
    const request = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      image: imageData,
      email: user.email,
    };
    const response = await api.users.userUpdate(id, request);

    if (response.status === 200) {
      window.location.reload();
      alert("User information has been updated");
    } else {
      alert(response.errorMessage);
    }
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    await tryUpdate();
    setButtonDisabled(false);
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
                <PersonOutlineIcon />
              </Avatar>

              <Typography component="h1" variant="h5">
                Account information
              </Typography>

              <form
                style={{
                  width: "100%",
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                noValidate
              >
                <CardMedia
                  component="img"
                  image={`${user.image.format},${user.image.data}`}
                  sx={{
                    minWidth: 100,
                    maxWidth: 200,
                    minHeight: 100,
                    maxHeight: 200,
                    paddingTop: 5,
                    display: "flex",
                    justifyContent: "center",
                  }}
                />

                <Card
                  sx={{
                    backgroundColor: "white",
                    border: 0,
                    width: 350,
                    height: "100%",
                    marginTop: 5,
                  }}
                >
                  <FilePond
                    stylePanelLayout="compact"
                    files={image}
                    allowMultiple={false}
                    onupdatefiles={setImage}
                    credits
                    labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
                  />
                  {error.image ? (
                    <Typography
                      sx={{
                        color: "red",
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 2,
                        marginBottom: 2,
                      }}
                    >
                      {error.image}
                    </Typography>
                  ) : (
                    <div></div>
                  )}
                </Card>

                <TextField
                  id="username"
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  value={user.username}
                  onChange={handleChange}
                  sx={{ width: 350, marginTop: 5 }}
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
                  value={user.firstName}
                  onChange={handleChange}
                  sx={{ width: 350, marginTop: 5 }}
                  error={!error.firstName ? false : true}
                  helperText={error.firstName}
                />

                <TextField
                  required
                  id="lastName"
                  label="Last name"
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  value={user.lastName}
                  onChange={handleChange}
                  sx={{ width: 350, marginTop: 5 }}
                  error={!error.lastName ? false : true}
                  helperText={error.lastName}
                />

                <TextField
                  required
                  id="email"
                  label="Email"
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  type="email"
                  value={user.email}
                  onChange={handleChange}
                  sx={{ width: 350, marginTop: 5 }}
                  error={!error.email ? false : true}
                  helperText={error.email}
                />

                <div className="mt40 flexContainer">
                  <Button
                    variant="contained"
                    disabled={buttonDisabled}
                    onClick={(e) => {
                      handleSubmitClick(e);
                      setButtonDisabled(true);
                    }}
                  >
                    Update
                  </Button>
                </div>
              </form>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}
