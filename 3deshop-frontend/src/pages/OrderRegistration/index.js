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
      console.log("Order uploaded!");
      navigate("/orders");
    } else {
      console.log("error at products, didn't return 200");
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
    await uploadOrder();
  };

  const postPayment = async (id) => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    const request = {
      userId: jwtUserId,
      orderId: id,
      sender: orderForm.cardNumber,
      amount: orderForm.price,
      currencyCode: "EUR",
    };
    const response = await api.payments.postOrderPayment(request);

    if (response.status === 200) {
      console.log("Payment sent!");
    } else {
      console.log("error at products, didn't return 200");
    }
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
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                required
                id="completeTill"
                label="Completion till"
                value={orderForm.completeTill}
                minDate={new Date("2021-01-01")}
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
              id="description"
              label="description"
              margin="normal"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={orderForm.description}
              onChange={handleChange}
              sx={{ width: 396, mt: 3 }}
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
            </Card>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: 30 }}
              onClick={handleSubmitClick}
            >
              Upload order
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
