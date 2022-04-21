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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import CreateIcon from "@mui/icons-material/Create";

export default function Offer() {
  let { id } = useParams();
  const navigate = useNavigate();
  let { state } = useLocation();
  const { getToken } = useAuth();
  const [offerForm, setOfferForm] = useState({
    description: "",
    completeTill: new Date(),
  });

  const [openSuccess, setOpenSuccess] = useState(false);
  const handleSuccessDialogOpen = () => {
    setOpenSuccess(true);
  };
  const handleSuccessDialogClose = () => {
    setOpenSuccess(false);
    navigate("/orders");
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
      console.log("Offer sent!");
      handleSuccessDialogOpen();
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
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    await uploadOffer();
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
            Create offer for: {state.name}
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
            />
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
              onClick={handleSubmitClick}
            >
              Make an offer
            </Button>
          </form>
        </div>
      </Container>

      <Dialog
        open={openSuccess}
        onClose={handleSuccessDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Offer has been sent!"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
