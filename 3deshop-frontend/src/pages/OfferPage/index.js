import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api";
import JwtHelper from "../../utils/jwt.helper";
import "./styles.css";
import { useParams, useLocation } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

export default function Offer() {
  let { id } = useParams();
  let { state } = useLocation();
  const { getToken } = useAuth();
  const [offerForm, setOfferForm] = useState({
    description: "",
    completeTill: new Date(),
  });

  const uploadOffer = async () => {
    const token = getToken().data;
    const jwt = JwtHelper.getUser(token);
    const offer = {
      description: offerForm.description,
      userId: jwt.userId,
      orderId: id,
      completeTill: offerForm.completeTill,
    };
    const response = await api.orders.postOffer(offer);

    if (response.status === 200) {
      console.log("Offer sent!");
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  const handleChange = async (e) => {
    const { id, value } = e.target;

    setOfferForm((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    console.log(state);
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    await uploadOffer();
  };

  return (
    <div className="flexContainer p50">
      <h1>Offer for: {state.name}</h1>
      <div style={{ marginTop: 60 }}>
        <TextField
          id="description"
          label="Note"
          variant="outlined"
          multiline
          rows={4}
          sx={{
            width: 260,
          }}
          value={offerForm.description}
          onChange={handleChange}
        />
      </div>
      <div style={{ marginTop: 60 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            required
            id="completeTill"
            label="completeTill"
            value={offerForm.completeTill}
            minDate={new Date("2021-01-01")}
            onChange={(offerForm) =>
              handleChange({
                target: { value: offerForm, id: "completeTill" },
              })
            }
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
      <div style={{ marginTop: 40 }}>
        <Button variant="contained" onClick={handleSubmitClick}>
          Make an offer
        </Button>
      </div>
    </div>
  );
}
