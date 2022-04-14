import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "./style.css";
import { useNavigate } from "react-router-dom";
import DefaultImage from "../../images/defaultProductImage.png";

export default function Product({
  id,
  name,
  categories,
  creator,
  price,
  image = "",
}) {
  const navigate = useNavigate();

  return (
    <Card
      className="card"
      sx={{
        minWidth: 200,
        maxWidth: 350,
        minHeight: 250,
        maxHeight: 500,
        cursor: "pointer",
      }}
      onClick={() => {
        navigate(`/product/${id}`);
      }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              style={{ objectFit: "contain" }}
              src={
                image !== null ? `${image.format},${image.data}` : DefaultImage
              }
              height="200"
              width="300"
              alt="none"
            />
          </div>
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        {categories.map((category, index) => (
          <Typography
            variant="h7"
            sx={{ mb: 1.5, wordWrap: "break-word" }}
            color="text.secondary"
            key={index}
          >
            {category.name + " "}
          </Typography>
        ))}

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
        {price === 0 ? (
          <Typography style={{ fontSize: 20 }}>Free</Typography>
        ) : (
          <Typography style={{ fontSize: 20 }}>{price} C</Typography>
        )}
      </CardActions>
    </Card>
  );
}
