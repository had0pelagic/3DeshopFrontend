import React, { useEffect, useState } from "react";
import "./styles.css";
import api from "../../api";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Loader from "../../components/Loader/index.js";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Carousel from "react-material-ui-carousel";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export default function ProductDetails() {
  let { id } = useParams();
  const [productDetails, setDetails] = useState();
  const [comments, setComments] = useState();
  const [isLoadingDetails, setLoadingDetails] = useState(true);
  const [isLoadingComments, setLoadingComments] = useState(true);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    cardNumber: "",
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(async () => {
    await getProductDetails();
    await getProductComments();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    console.log(state);
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    const payment = {
      productId: id,
      sender: state.cardNumber,
      amount: productDetails.about.price,
      currencyCode: "EUR",
    };
    await postPayment(payment);
  };

  const getProductDetails = async () => {
    const response = await api.products.getProduct(id);
    if (response.status === 200) {
      setDetails(response.data);
    } else {
      console.log("error at products, didn't return 200");
    }
    setLoadingDetails(false);
  };

  const getProductComments = async () => {
    const response = await api.comments.getComments(id);
    if (response.status === 200) {
      setComments(response.data);
    } else {
      console.log("error at products, didn't return 200");
    }
    setLoadingComments(false);
  };

  const postPayment = async (payment) => {
    const response = await api.payments.postPayment(payment);
    if (response.status === 200) {
      console.log("payment sent!");
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  return (
    <div className="flexContainer p50">
      {isLoadingDetails ? (
        <Loader />
      ) : (
        <div>
          {productDetails.images.length > 0 && (
            <Card sx={{ minWidth: 300 }}>
              <CardContent>
                <Carousel>
                  {productDetails.images.map((image, index) => (
                    <CardMedia
                      component="img"
                      height="300"
                      image={image.data}
                      alt={image.data}
                      key={index}
                    />
                  ))}
                </Carousel>
              </CardContent>
            </Card>
          )}

          <Card sx={{ minWidth: 600 }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 30 }}
                color="text.primary"
                gutterBottom
              >
                {productDetails.about.name}
              </Typography>
              {productDetails.categories.map((category, index) => (
                <Typography sx={{ mb: 1.5 }} color="text.secondary" key={index}>
                  {category.name}
                </Typography>
              ))}
              <Typography variant="h6" component="div">
                {productDetails.about.description}
              </Typography>

              <Typography variant="body2">{/* {productDetails} */}</Typography>
            </CardContent>
          </Card>
        </div>
      )}
      {isLoadingComments ? (
        <Loader />
      ) : (
        <div>
          <Card sx={{ minWidth: 600 }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 25 }}
                color="text.primary"
                gutterBottom
              >
                Comments
              </Typography>
              {comments.map((comment, index) => (
                <Typography sx={{ mb: 1.5 }} color="text.secondary" key={index}>
                  {comment.description}
                </Typography>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardActions
              sx={{
                color: "black",
                justifyContent: "center",
              }}
            >
              <Button
                sx={{
                  color: "black",
                }}
                onClick={handleOpen}
              >
                <ShoppingCartIcon />
              </Button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                BackdropProps={{
                  timeout: 600,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  <div className="flexContainer">
                    <TextField
                      required
                      id="cardNumber"
                      label="Card number"
                      variant="standard"
                      margin="normal"
                      value={state.cardNumber}
                      onChange={handleChange}
                    />
                    <div className="mt40">
                      <Button variant="contained" onClick={handleSubmitClick}>
                        Purchase
                      </Button>
                    </div>
                  </div>
                </Box>
              </Modal>
              {productDetails.about.price === 0 ? (
                <Typography style={{ fontSize: 20 }}>Free</Typography>
              ) : (
                <Typography style={{ fontSize: 20 }}>
                  {productDetails.about.price}$
                </Typography>
              )}
            </CardActions>
          </Card>
        </div>
      )}

      <Card></Card>
    </div>
  );
}
