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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import Loader from "../../components/Loader/index.js";
import api from "../../api";
import "filepond/dist/filepond.min.css";
import moment from "moment";
import DefaultImage from "../../images/defaultProductImage.png";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setLoadingOrders] = useState(true);
  const [isLoadingOrder, setLoadingOrder] = useState(true);
  const [order, setOrder] = useState();
  const [open, setOpen] = useState(false);
  const handleOpen = async (id) => {
    await getDisplayOrder(id);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(async () => {
    await getOrders();
  }, []);

  const getOrders = async () => {
    const response = await api.orders.getInactiveOrders();

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
          <h1>Orders</h1>

          {orders && orders.length > 0 ? (
            <div className="flexContainer">
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
                  marginRight: 15,
                  marginBottom: 5,
                  alignItems: "right",
                  width: 200,
                }}
                component={Link}
                to={`/order-registration`}
              >
                Add new order
              </Button>

              <TableContainer component={Paper} sx={{ width: "80%" }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="left">Description</TableCell>
                      <TableCell align="left">Creation date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          cursor: "pointer",
                        }}
                        onClick={() => handleOpen(order.id)}
                      >
                        <TableCell component="th" scope="row">
                          {order.name}
                        </TableCell>
                        <TableCell align="left">{order.description}</TableCell>
                        <TableCell align="left">
                          {moment(order.created).format("YYYY-MM-DD")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : (
            <div className="flexContainer">
              <h2>No orders yet</h2>
              <Button
                sx={{
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#30475E",
                    color: "#F05454",
                  },
                  backgroundColor: "#30475E",
                  marginTop: 1,
                  marginBottom: 5,
                  alignItems: "center",
                  width: 200,
                }}
                component={Link}
                to={`/order-registration`}
              >
                Add new order
              </Button>
            </div>
          )}
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
              {OrderImages()}
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
                to={`/offer/${order.id}`}
                state={{ name: order.name }}
              >
                <Typography>Offer</Typography>
              </Button>
            </div>
          </Box>
        )}
      </Modal>
    </div>
  );
}
