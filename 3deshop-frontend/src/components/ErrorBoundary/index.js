import * as React from "react";
import "./style.css";
import { Typography, Card, CardContent } from "@mui/material";

export default class ErrorBoundary extends React.Component {
  static getDerivedStateFromError() {
    return { hasError: true };
  }

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
          </CardContent>
        </Card>
      );
    }
    return children;
  }
}
