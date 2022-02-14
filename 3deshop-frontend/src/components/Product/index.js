import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardMedia } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "./style.css";


export default function Product({
  name,
  categories,
  creator,
  price,
  imageUrl,
}) {
  return (
    <Card
      className="kardas"
      sx={{ minWidth: 300, maxWidth: 350, minHeight: 300, maxHeight: 500 }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          <CardMedia
            sx={{
              minWidth: 200,
              maxWidth: 300,
              minHeight: 200,
              maxHeight: 250,
            }}
            component="img"
            height="250"
            image={imageUrl}
            alt="cube"
          />
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="h7" sx={{ mb: 1.5 }} color="text.secondary">
          {categories}
        </Typography>
        <Typography sx={{ color: "black" }} component="div">
          by {creator}
        </Typography>
      </CardContent>
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
        >
          <ShoppingCartIcon />
          <Typography style={{ fontSize: 20 }}>{price}$</Typography>
        </Button>
      </CardActions>
    </Card>
  );
}
