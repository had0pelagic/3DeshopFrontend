import React, { useEffect, useState } from "react";
import "./styles.css";
import api from "../../api";
import JwtHelper from "../../utils/jwt.helper";
import { Link, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Loader from "../../components/Loader/index.js";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DownloadingIcon from "@mui/icons-material/Downloading";
import Carousel from "react-material-ui-carousel";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useAuth } from "../../hooks/useAuth";
import DefaultImage from "../../images/defaultProductImage.png";
import Divider from "@mui/material/Divider";
import { Avatar, Grid } from "@mui/material";

export default function ProductDetails() {
  let { id } = useParams();
  const { getToken } = useAuth();
  const [productDetails, setDetails] = useState();
  const [comments, setComments] = useState();
  const [comment, setComment] = useState({
    description: "",
  });
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

  const postPayment = async () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    const request = {
      userId: jwtUserId,
      productId: id,
      sender: state.cardNumber,
      amount: productDetails.about.price,
      currencyCode: "EUR",
    };
    const response = await api.payments.postPayment(request);

    if (response.status === 200) {
      console.log("payment sent!");
      handleClose();
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  const postComment = async (productId, userId, comment) => {
    const response = await api.comments.postComment(productId, userId, comment);

    if (response.status === 200) {
      console.log("Comment added");
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    console.log(value);
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    await postPayment();
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    await postComment(id, jwtUserId, comment);
  };

  const handleCommentChange = (e) => {
    const { id, value } = e.target;

    setComment((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    console.log(value);
  };

  function ProductImages() {
    return (
      <div style={{ minWidth: 400 }}>
        <Card>
          <CardContent>
            {productDetails.images.length > 0 ? (
              <Carousel>
                {productDetails.images.map((image, index) => (
                  <CardMedia
                    component="img"
                    height="300"
                    image={`${image.format},${image.data}`}
                    key={index}
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

  function ProductActions() {
    return (
      <div style={{ paddingTop: "60px" }}>
        <Card>
          <CardActions
            sx={{
              color: "black",
              justifyContent: "center",
            }}
          >
            {productDetails.isBoughtByUser ? (
              <Button
                sx={{
                  color: "black",
                }}
                component={Link}
                to={`/product-download/${id}`}
              >
                <DownloadingIcon sx={{ fontSize: 50 }} />
              </Button>
            ) : productDetails.about.price === 0 ? (
              <Typography style={{ fontSize: 20 }}>Free</Typography>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div style={{ flex: 2 }}>
                  <Button
                    sx={{
                      color: "black",
                    }}
                    onClick={handleOpen}
                  >
                    <ShoppingCartIcon sx={{ fontSize: 50 }} />
                  </Button>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <Typography style={{ fontSize: 20 }}>
                    {productDetails.about.price}$
                  </Typography>
                </div>
              </div>
            )}
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
                  backgroundColor: "background.paper",
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
                    defaultValue={state.cardNumber}
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
          </CardActions>
        </Card>
      </div>
    );
  }

  function ProductAbout() {
    return (
      <div style={{ paddingTop: "60px" }}>
        <Card sx={{ minWidth: 100 }}>
          <CardContent>
            <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
              {productDetails.about.name}
            </Typography>
            {productDetails.categories.map((category, index) => (
              <Typography
                variant="h7"
                sx={{ mb: 1.5 }}
                color="text.secondary"
                key={index}
              >
                {category.name + " "}
              </Typography>
            ))}
            <Typography variant="h6" component="div" sx={{ inlineSize: 800 }}>
              {productDetails.about.description}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  function ProductComments() {
    return (
      <div style={{ paddingTop: "60px" }}>
        <Card
          sx={{
            minWidth: 800,
            maxWidth: 800,
            backgroundColor: "transparent",
          }}
        >
          <CardContent>
            <Typography sx={{ fontSize: 25 }} color="text.primary" gutterBottom>
              Comments
            </Typography>
            {comments.map((comment, index) => (
              <Grid
                container
                spacing={1}
                key={index}
                sx={{
                  marginTop: 2,
                  display: "flex",
                  justifyContent: "left",
                }}
              >
                <Grid item sx={{ marginTop: "8px", marginBottom: "10px" }}>
                  <Avatar
                    src={comment.user.imageURL}
                    alt="User avatar"
                    sx={{ width: 60, height: 60 }}
                  />
                </Grid>
                <Grid item xs={8}>
                  <Typography>{comment.user.username}</Typography>
                  <Typography
                    style={{ wordWrap: "break-word", paddingTop: 15 }}
                  >
                    {comment.description}
                  </Typography>
                  <Divider />
                </Grid>
              </Grid>
            ))}
            <div
              style={
                comments.length > 0
                  ? {
                      paddingTop: 10,
                    }
                  : {
                      paddingTop: 30,
                    }
              }
            >
              <div>
                <TextField
                  id="description"
                  variant="outlined"
                  multiline
                  rows={4}
                  sx={{
                    width: "100%",
                  }}
                  value={comment.description}
                  onChange={handleCommentChange}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: 10,
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    background: "#222831",
                    color: "white",
                    borderStyle: "none",
                    "&:hover": {
                      background: "#30475E",
                      borderStyle: "none",
                    },
                  }}
                  onClick={handleCommentSubmit}
                >
                  Post comment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flexContainer p50">
      {isLoadingDetails ? (
        <Loader />
      ) : (
        <div>
          {ProductImages()}
          <ProductAbout />
        </div>
      )}
      {isLoadingComments ? (
        <Loader />
      ) : (
        <div>
          {ProductActions()}
          {ProductComments()}
        </div>
      )}
    </div>
  );
}
