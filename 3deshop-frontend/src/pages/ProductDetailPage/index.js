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

export default function ProductDetails() {
  const [productDetails, setDetails] = useState();
  const [comments, setComments] = useState();
  const [isLoadingDetails, setLoadingDetails] = useState(true);
  const [isLoadingComments, setLoadingComments] = useState(true);
  let { id } = useParams();

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

  return (
    <div className="flexContainer p50">
      {isLoadingDetails ? (
        <Loader />
      ) : (
        <div>
          {productDetails.images.length > 0 && (
            <Card sx={{ minWidth: 300 }}>
              <CardContent>
                <CardMedia
                  component="img"
                  height="300"
                  image={productDetails.images[0].data}
                  alt={productDetails.images[0].data}
                />
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
              <Carousel>
                {productDetails.categories.map((category, index) => (
                  <Typography
                    sx={{ mb: 1.5 }}
                    color="text.secondary"
                    key={index}
                  >
                    {category.name}
                  </Typography>
                ))}
              </Carousel>
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
                onClick={() => {
                  alert("buying");
                }}
              >
                <ShoppingCartIcon />
              </Button>
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
