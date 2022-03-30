import React, { useState, useEffect } from "react";
import "./styles.css";
import { useAuth } from "../../hooks/useAuth";
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
import { Link } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import Loader from "../../components/Loader/index.js";
import api from "../../api";
import "filepond/dist/filepond.min.css";
import JwtHelper from "../../utils/jwt.helper";
import DefaultImage from "../../images/defaultProductImage.png";

export default function UserOrders() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setLoadingOrders] = useState(true);
  const [isLoadingOrder, setLoadingOrder] = useState(true);
  const [order, setOrder] = useState();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = async (id) => {
    await getDisplayOrder(id);
    setOpen(true);
  };

  useEffect(async () => {
    await getUserOrders();
  }, []);

  const getUserOrders = async () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    const response = await api.orders.getUserOrders(jwtUserId);

    if (response.status === 200) {
      setOrders(response.data);
      console.log("Orders returned!");
    } else {
      console.log("error at products, didn't return 200");
    }
    setLoadingOrders(false);
  };

  const getDisplayOrder = async (id) => {
    const response = await api.orders.getDisplayOrder(id);

    if (response.status === 200) {
      setOrder(response.data);
      console.log("Order returned!");
    } else {
      console.log("error at products, didn't return 200");
    }
    setLoadingOrder(false);
  };

  function OrderImages() {
    return (
      <div style={{ minWidth: 400, marginTop: 20 }}>
        <Card>
          <CardContent>
            {order.images.length > 0 ? (
              <Carousel indicators={false}>
                {order.images.map((image, index) => (
                  <CardMedia
                    component="img"
                    height="300"
                    image={`${image.format},${image.data}`}
                    key={index}
                    style={{ backgroundColor: "Red" }}
                  />
                ))}
              </Carousel>
            ) : (
              <CardMedia component="img" height="300" image={DefaultImage} />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flexContainer">
      {isLoadingOrders ? (
        <Loader />
      ) : (
        <div className="flexContainer">
          <h1>User orders</h1>
          <Button
            sx={{
              color: "#fff",
              "&:hover": {
                backgroundColor: "#30475E",
                color: "#F05454",
              },
              backgroundColor: "#30475E",
              marginTop: 5,
              marginLeft: "auto",
              marginRight: 0,
              alignItems: "right",
              width: 200,
            }}
            component={Link}
            to={`/order-registration`}
          >
            Add new order
          </Button>
          {orders.map((order, index) => (
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
              onClick={() => handleOpen(order.id)}
            >
              <div style={{ marginTop: 10 }}>
                <Typography style={{ fontSize: 30 }}>{order.name}</Typography>
              </div>
              <div>
                <Typography style={{ fontSize: 30, marginTop: 5 }}>
                  {order.price}$
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
        {isLoadingOrder ? (
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
              <Typography style={{ fontSize: 30 }}>{order.name}</Typography>
              <OrderImages />
              <TextField
                id="description"
                variant="outlined"
                multiline
                maxRows={4}
                value={order.description}
                InputProps={{ readOnly: true, disableUnderline: true }}
                sx={{ marginTop: 5, width: 400, backgroundColor: "white" }}
              />
              <div className="priceDateContainer">
                <Typography sx={{ fontSize: 20 }} variant="h5" gutterBottom>
                  {order.price}$
                </Typography>
                <Typography sx={{ fontSize: 20 }} variant="h5">
                  Completion till: {order.completeTill}
                </Typography>
              </div>
              <Button
                sx={{
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#30475E",
                    color: "#F05454",
                  },
                  backgroundColor: "#30475E",
                  marginTop: 5,
                  width: 400,
                }}
                component={Link}
                to={`/user-offers/${order.id}`}
                state={{ name: order.name }}
              >
                <Typography>Offers</Typography>
              </Button>
            </div>
          </Box>
        )}
      </Modal>
    </div>
  );
}
