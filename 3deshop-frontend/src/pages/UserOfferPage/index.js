import React, { useState, useEffect } from "react";
import "./styles.css";
import {
  Typography,
  Button,
  Modal,
  Box,
  Card,
  CardContent,
  CardMedia,
  TextField,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/Loader/index.js";
import api from "../../api";
import "filepond/dist/filepond.min.css";
import { useAuth } from "../../hooks/useAuth";
import JwtHelper from "../../utils/jwt.helper";

export default function UserOffers() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [offers, setOffers] = useState([]);
  const [isLoadingOffers, setLoadingOffers] = useState(true);
  const [isLoadingOffer, setLoadingOffer] = useState(true);
  const [offer, setOffer] = useState();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = async (id) => {
    await getOffer(id);
    setOpen(true);
  };

  useEffect(async () => {
    await getOrderOffers();
  }, []);

  const getOrderOffers = async () => {
    const response = await api.orders.getOrderOffers(id);

    if (response.status === 200) {
      setOffers(response.data);
      console.log("Offers returned!");
    } else {
      console.log("error at products, didn't return 200");
    }
    setLoadingOffers(false);
  };

  const getOffer = async (id) => {
    const response = await api.orders.getOffer(id);

    if (response.status === 200) {
      setOffer(response.data);
      console.log("Offer returned!");
    } else {
      console.log("error at products, didn't return 200");
    }
    setLoadingOffer(false);
  };

  const acceptOffer = async (offerId) => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    const response = await api.orders.acceptOffer(jwtUserId, offerId, id);

    if (response.status === 200) {
      console.log("Offer has been approved!");
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  const declineOffer = async (offerId) => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    const response = await api.orders.declineOffer(jwtUserId, offerId);

    if (response.status === 200) {
      console.log("Offer has been declined!");
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  return (
    <div className="flexContainer">
      {isLoadingOffers ? (
        <Loader />
      ) : (
        <div className="flexContainer">
          <h1>Offers</h1>
          {offers.map((offer, index) => (
            <div
              style={{
                backgroundColor: "#F05454",
                marginTop: 30,
                width: 500,
                display: "flex",
                flex: 1,
                justifyContent: "space-between",
                padding: "6px 12px 6px 12px",
                borderRadius: 10,
                cursor: "pointer",
              }}
              key={index}
              onClick={() => handleOpen(offer.id)}
            >
              <div
                style={{
                  marginTop: 10,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "25rem",
                }}
              >
                <Typography noWrap style={{ fontSize: 30 }}>
                  {offer.description}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        BackdropProps={{
          timeout: 600,
        }}
      >
        {isLoadingOffer ? (
          <Loader />
        ) : (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              backgroundColor: "#DDDDDD",
              border: "1px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <div className="flexContainer">
              <Typography style={{ fontSize: 30 }}>Offer</Typography>
              <TextField
                id="description"
                variant="outlined"
                multiline
                maxRows={4}
                value={offer.description}
                InputProps={{ readOnly: true, disableUnderline: true }}
                sx={{ marginTop: 5, width: 400, backgroundColor: "white" }}
              />
              <div className="priceDateContainer">
                <Typography sx={{ fontSize: 20 }} variant="h5">
                  Completion till: {offer.completeTill}
                </Typography>
              </div>
              <Button
                sx={{
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#4E9F3D",
                    color: "#191A19",
                  },
                  backgroundColor: "#4E9F3D",
                  marginTop: 5,
                  width: 400,
                }}
                onClick={() => acceptOffer(offer.id)}
              >
                <Typography>Accept</Typography>
              </Button>
              <Button
                sx={{
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#B33030",
                    color: "#191A19",
                  },
                  backgroundColor: "#B33030",
                  marginTop: 5,
                  width: 400,
                }}
                onClick={() => declineOffer(offer.id)}
              >
                <Typography>Decline</Typography>
              </Button>
            </div>
          </Box>
        )}
      </Modal>
    </div>
  );
}
