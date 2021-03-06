import React, { useState, useEffect } from "react";
import "./styles.css";
import {
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/index.js";
import api from "../../api";
import "filepond/dist/filepond.min.css";
import { useAuth } from "../../hooks/useAuth";
import JwtHelper from "../../utils/jwt.helper";
import moment from "moment";

export default function UserOffers() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();
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
    } else {
      alert(response.errorMessage);
    }
    setLoadingOffers(false);
  };

  const getOffer = async (id) => {
    const response = await api.orders.getOffer(id);

    if (response.status === 200) {
      setOffer(response.data);
    } else {
      alert(response.errorMessage);
    }
    setLoadingOffer(false);
  };

  const acceptOffer = async (offerId) => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    const response = await api.orders.acceptOffer(jwtUserId, offerId, id);

    if (response.status === 200) {
      alert("Offer has been approved!");
      const token = getToken().data;
      const jwtUserId = JwtHelper.getUser(token).userId;
      navigate(`/user-orders/${jwtUserId}`);
    } else {
      alert(response.errorMessage);
    }
  };

  const declineOffer = async (offerId) => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    const response = await api.orders.declineOffer(jwtUserId, offerId);

    if (response.status === 200) {
      alert("Offer has been declined!");
      const token = getToken().data;
      const jwtUserId = JwtHelper.getUser(token).userId;
      navigate(`/user-orders/${jwtUserId}`);
    } else {
      alert(response.errorMessage);
    }
  };

  return (
    <div className="flexContainer">
      {isLoadingOffers ? (
        <Loader />
      ) : (
        <div
          className="flexContainer"
          style={{ marginLeft: 30, marginRight: 30 }}
        >
          <div
            style={{
              marginTop: 20,
              width: "100%",
              marginBottom: 15,
            }}
          >
            <Typography
              variant="h3"
              align="center"
              style={{ width: "100%", alignItems: "center" }}
            >
              Offers for selected order
            </Typography>
            <Typography
              variant="h6"
              align="center"
              style={{ width: "100%", alignItems: "center" }}
            >
              Here you can accept or decline offers for your order
            </Typography>
          </div>
          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell align="left">Creation date</TableCell>
                  <TableCell align="left">Complete till</TableCell>
                  <TableCell align="left">User</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {offers.map((offer, index) => (
                  <TableRow
                    hover
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                    onClick={() => handleOpen(offer.id)}
                  >
                    <TableCell component="th" scope="row">
                      {offer.description}
                    </TableCell>
                    <TableCell align="left">
                      {moment(offer.created).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell align="left">
                      {moment(offer.completeTill).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell align="left">
                      <Typography
                        component={Link}
                        to={`/user-profile/${offer.user.id}`}
                      >
                        {offer.user.username}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        BackdropProps={{
          timeout: 600,
        }}
      >
        <div>
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
                <Typography
                  variant="h4"
                  align="center"
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Offer
                </Typography>
                <Typography
                  variant="h6"
                  align="center"
                  style={{ width: "100%", alignItems: "center" }}
                >
                  by {offer.user.username}
                </Typography>

                <TextField
                  id="description"
                  variant="outlined"
                  multiline
                  maxRows={4}
                  value={offer.description}
                  InputProps={{ readOnly: true }}
                  sx={{ marginTop: 2, width: 400, backgroundColor: "white" }}
                />
                <div className="priceDateContainer">
                  <Typography sx={{ fontSize: 20 }} variant="h5">
                    Completion till:{" "}
                    {moment(offer.completeTill).format("YYYY-MM-DD")}
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
                    marginTop: 2,
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
                    marginTop: 2,
                    width: 400,
                  }}
                  onClick={() => declineOffer(offer.id)}
                >
                  <Typography>Decline</Typography>
                </Button>
              </div>
            </Box>
          )}
        </div>
      </Modal>
    </div>
  );
}
