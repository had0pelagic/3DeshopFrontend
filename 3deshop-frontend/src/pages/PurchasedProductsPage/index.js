import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import api from "../../api";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";

export default function PurchasedProducts() {
  let { id } = useParams();
  const [products, setProducts] = useState("");
  const [isLoading, setLoading] = useState(true);

  useEffect(async () => {
    await getPurchasedProducts();
  }, []);

  const getPurchasedProducts = async () => {
    const response = await api.products.getPurchasedProducts(id);
    if (response.status === 200) {
      setProducts(response.data);
    } else {
      console.log("error at products, didn't return 200");
    }
    setLoading(false);
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    alert("downloading...");
  };

  return (
    <div className="flexContainer mt40">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <List
            sx={{ width: "150%", maxWidth: 800, bgcolor: "background.paper" }}
          >
            {products.map((product, index) => (
              <PurchasedProduct
                handleSubmitClick={handleSubmitClick}
                product={product}
                key={index}
              />
            ))}
          </List>
        </div>
      )}
    </div>
  );
}

function PurchasedProduct({ handleSubmitClick, product }) {
  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        bgcolor: "#F2D0A9",
        margin: 4,
        mb: 4,
      }}
    >
      <ListItemAvatar>
        <Avatar alt="Default image" src={product.imageURL} />
      </ListItemAvatar>
      <ListItemText
        primary={product.name}
        secondary={
          <>
            {product.categories.map((category, index) => (
              <Typography
                sx={{
                  display: "inline",
                }}
                component="span"
                variant="body2"
                color="text.primary"
                key={index}
              >
                {`${category.name} `}
              </Typography>
            ))}
          </>
        }
      />
      <ListItemButton
        sx={{
          bgcolor: "#FFC27B",
          borderRadius: 2,
          margin: 1,
          width: 2,
        }}
        variant="contained"
        onClick={handleSubmitClick}
      >
        Download
      </ListItemButton>
      <ListItemButton
        sx={{
          bgcolor: "#FFC27B",
          borderRadius: 2,
          margin: 1,
          width: 3,
        }}
        key={"Store page"}
        component={Link}
        to={`/product/${product.id}`}
      >
        Product store page
      </ListItemButton>
    </ListItem>
  );
}
