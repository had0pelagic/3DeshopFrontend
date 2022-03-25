import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api";
import JwtHelper from "../../utils/jwt.helper";
import FormatHelper from "../../utils/format.helper";
import "./styles.css";
import { Link, useParams } from "react-router-dom";
import { Card, TextField, Button } from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";

export default function OrderRegistration() {
  const { getToken } = useAuth();
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

  return (
    <div className="flexContainer p50">
      <h1>Order registration</h1>
      <div style={{ marginTop: 20 }}>
        <TextField
          required
          id="name"
          label="Name"
          variant="standard"
          margin="normal"
          value={orderForm.name}
          onChange={handleChange}
          sx={{ width: 300 }}
        />
      </div>
      <div style={{ marginTop: 20 }}>
        <TextField
          required
          id="price"
          label="Price"
          variant="standard"
          margin="normal"
          value={orderForm.price}
          onChange={handleChange}
          sx={{ width: 300 }}
        />
      </div>
      <div style={{ marginTop: 60 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            required
            id="completeTill"
            label="completeTill"
            value={orderForm.completeTill}
            minDate={new Date("2021-01-01")}
            onChange={(orderForm) =>
              handleChange({
                target: { value: orderForm, id: "completeTill" },
              })
            }
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
      <div style={{ marginTop: 60 }}>
        <TextField
          id="description"
          label="description"
          variant="outlined"
          multiline
          rows={4}
          sx={{
            width: "100%",
          }}
          value={orderForm.description}
          onChange={handleChange}
          sx={{ width: 300 }}
        />
      </div>
      <Card
        sx={{
          backgroundColor: "white",
          border: 2,
          width: 500,
          height: 200,
          mt: 5,
        }}
      >
        <FilePond
          stylePanelLayout="compact"
          files={images}
          allowMultiple={true}
          onupdatefiles={setImages}
          labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
        />
      </Card>
      <div style={{ marginTop: 40 }}>
        <Button variant="contained" onClick={handleSubmitClick}>
          Register
        </Button>
      </div>
    </div>
  );
}
