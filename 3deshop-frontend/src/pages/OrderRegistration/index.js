import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api";
import JwtHelper from "../../utils/jwt.helper";
import FormatHelper from "../../utils/format.helper";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {
  Card,
  TextField,
  Button,
  Container,
  Avatar,
  Typography,
} from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FileFormatValidation from "../../utils/fileFormatValidation.helper";

export default function OrderRegistration() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [orderForm, setOrderForm] = useState({
    name: "",
    price: "",
    description: "",
    completeTill: new Date(),
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState({ name: "", price: "", description: "" });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const tryUpload = async () => {
    let errorExists = false;

    if (orderForm.name.length < 6 || orderForm.name.length > 60) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        name: "Name must have atleast 6 symbols",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        name: "",
      }));
    }

    if (!/[0-9]/.test(orderForm.price)) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        price: "Price must be a number",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        price: "",
      }));
    }

    if (orderForm.description.length === 0) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        description: "Description cannot be empty",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        description: "",
      }));
    }

    if (!FileFormatValidation.isImageFormatsValid(images)) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        imageFormats: "Accepted image formats: png, jpg",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        imageFormats: "",
      }));
    }

    if (!errorExists) {
      await uploadOrder();
    }

    return;
  };

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

  const uploadOrder = async () => {
    const token = getToken().data;
    const jwt = JwtHelper.getUser(token);
    const imageData = await encodeData(images);
    const order = {
      name: orderForm.name,
      description: orderForm.description,
      price: orderForm.price,
      images: imageData,
      userId: jwt.userId,
      completeTill: orderForm.completeTill,
    };
    const response = await api.orders.postOrder(order);

    if (response.status === 200) {
      alert("Order uploaded!");
      navigate("/orders");
    } else {
      alert(response.errorMessage);
    }
  };

  const handleChange = async (e) => {
    const { id, value } = e.target;

    setOrderForm((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    await tryUpload();
    setButtonDisabled(false);
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
            <FileUploadIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Order upload
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
              id="name"
              label="Order name"
              margin="normal"
              variant="outlined"
              fullWidth
              value={orderForm.name}
              onChange={handleChange}
              sx={{ width: 396, mt: 3 }}
              error={!error.name ? false : true}
              helperText={error.name}
            />

            <TextField
              required
              id="price"
              label="Price"
              margin="normal"
              variant="outlined"
              fullWidth
              value={orderForm.price}
              onChange={handleChange}
              sx={{ width: 396, mt: 3 }}
              error={!error.price ? false : true}
              helperText={error.price}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                required
                id="completeTill"
                label="Completion till"
                value={orderForm.completeTill}
                minDate={new Date()}
                onChange={(orderForm) =>
                  handleChange({
                    target: { value: orderForm, id: "completeTill" },
                  })
                }
                renderInput={(params) => (
                  <TextField {...params} sx={{ width: 396, mt: 3 }} />
                )}
              />
            </LocalizationProvider>

            <TextField
              required
              id="description"
              label="Description"
              margin="normal"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={orderForm.description}
              onChange={handleChange}
              sx={{ width: 396, mt: 3 }}
              error={!error.description ? false : true}
              helperText={error.description}
            />

            <Card
              sx={{
                backgroundColor: "white",
                border: 0,
                width: 396,
                height: "100%",
                mt: 3,
              }}
            >
              <FilePond
                stylePanelLayout="compact"
                files={images}
                allowMultiple={true}
                onupdatefiles={setImages}
                credits
                labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
              />
              {error.imageFormats ? (
                <Typography
                  sx={{
                    color: "red",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 2,
                    marginBottom: 2,
                  }}
                >
                  {error.imageFormats}
                </Typography>
              ) : (
                <div></div>
              )}
            </Card>

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
                marginTop: 3,
              }}
              disabled={buttonDisabled}
              onClick={(e) => {
                setButtonDisabled(true);
                handleSubmitClick(e);
              }}
            >
              Upload order
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
