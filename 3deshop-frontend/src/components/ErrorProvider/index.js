import * as React from "react";
import "./style.css";
import { Typography, Card, CardContent, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default class ErrorProvider extends React.Component {
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  static setError() {
    this.setState({ hasError: true });
  }

  resetError = () => {
    this.setState({ hasError: false });
  };

  state = {
    hasError: false,
  };

  componentDidCatch(error, info) {
    // reportError(error, info);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <Card
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "  #DDDDDD",
            marginTop: 300,
            boxShadow: 3,
          }}
          elevation={0}
        >
          <CardContent>
            <Typography variant="h1">Error!</Typography>
            <Typography variant="h2">Please try again later</Typography>
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
              to={`/products`}
              onClick={this.resetError}
            >
              Home
            </Button>
          </CardContent>
        </Card>
      );
    }
    return children;
  }
}
