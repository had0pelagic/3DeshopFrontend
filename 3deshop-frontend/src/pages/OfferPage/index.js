import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api";
import JwtHelper from "../../utils/jwt.helper";
import "./styles.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Avatar,
  Typography,
} from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import CreateIcon from "@mui/icons-material/Create";

export default function Offer() {
  const navigate = useNavigate();
  let { id } = useParams();
  let { state } = useLocation();
  const { getToken } = useAuth();
  const [offerForm, setOfferForm] = useState({
    description: "",
    completeTill: new Date(),
  });
  const [error, setError] = useState({ description: "" });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const tryUploadOffer = async () => {
    let errorExists = false;

    if (
      offerForm.description.length < 10 ||
      offerForm.description.length > 200
    ) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        description: "Description must be between 10 and 200 symbols",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        description: "",
      }));
    }

    if (!errorExists) {
      await uploadOffer();
    }

    return;
  };

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
      alert("Offer sent!");
      navigate("/orders");
    } else {
      alert(response.errorMessage);
    }
  };

  const handleChange = async (e) => {
    const { id, value } = e.target;

    setOfferForm((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    await tryUploadOffer();
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
            <CreateIcon />
          </Avatar>
          <Typography component="h1" variant="h5" style={{ mt: 3 }}>
            Create offer for:
          </Typography>
          <Typography component="h1" variant="h6" style={{ mt: 3 }}>
            {state.name}
          </Typography>
          <form
            style={{
              width: "100%",
              marginTop: 10,
            }}
            noValidate
          >
            <TextField
              id="description"
              label="Note"
              margin="normal"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              sx={{
                width: "100%",
              }}
              value={offerForm.description}
              onChange={handleChange}
              error={!error.description ? false : true}
              helperText={error.description}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                required
                id="completeTill"
                label="Completion till"
                value={offerForm.completeTill}
                minDate={new Date(new Date())}
                onChange={(offerForm) =>
                  handleChange({
                    target: { value: offerForm, id: "completeTill" },
                  })
                }
                renderInput={(params) => (
                  <TextField {...params} sx={{ width: "100%", mt: 3 }} />
                )}
              />
            </LocalizationProvider>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: 20 }}
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#30475E",
                  color: "#F05454",
                },
                backgroundColor: "#30475E",
                marginTop: 20,
              }}
              disabled={buttonDisabled}
              onClick={(e) => {
                handleSubmitClick(e);
                setButtonDisabled(true);
              }}
            >
              Make an offer
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
