import { Box, Button, Grid, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

export default function Home() {
  return (
    <div>
      <Box
        style={{
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          marginTop: 15,
        }}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={6}
            style={{
              background: "linear-gradient(45deg, #30475E, #e73c7e)",
              color: "white",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="h4">Get your 3D models here!</Typography>
            <Button
              style={{
                backgroundColor: "white",
                color: "#222831",
                marginTop: 10,
                width: 200,
                borderRadius: 30,
              }}
              component={Link}
              to={`/products`}
            >
              Products
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            style={{
              background: "linear-gradient(-45deg, #30475E, #e73c7e)",
              color: "white",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="h4">
              Didn't find anything suitable for you? Make an order!
            </Typography>
            <Button
              style={{
                backgroundColor: "white",
                color: "#222831",
                marginTop: 10,
                width: 200,
                borderRadius: 30,
              }}
              component={Link}
              to={`/orders`}
            >
              Orders
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
