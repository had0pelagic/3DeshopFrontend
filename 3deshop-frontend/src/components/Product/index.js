import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardMedia } from "@mui/material";
import "./style.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Product({
  name,
  categories,
  creator,
  price,
  imageUrl,
}) {
  return (
    <Card
      className="card"
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
              borderRadius: "2%",
            }}
            component="img"
            height="250"
            image={imageUrl}
            alt="No image"
          />
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="h7" sx={{ mb: 1.5 }} color="text.secondary">
          {categories.map((category, index) => category.name + " ")}
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
          <ExpandMoreIcon />
        </Button>
        {price === 0 ? (
          <Typography style={{ fontSize: 20 }}>Free</Typography>
        ) : (
          <Typography style={{ fontSize: 20 }}>{price}$</Typography>
        )}
      </CardActions>
    </Card>
  );
}
