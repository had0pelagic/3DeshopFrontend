import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import api from "../../api";
import Loader from "../../components/Loader";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [completedJobCount, setCompletedJobCount] = useState(0);
  const [isLoading, setLoading] = useState(true);

  useEffect(async () => {
    await getUser();
    await getCompletedJobCount();
  }, []);

  const getUser = async () => {
    const response = await api.users.getUser(id);

    if (response.status === 200) {
      setUser(response.data);
    } else {
      alert(response.errorMessage);
    }
    setLoading(false);
  };

  const getCompletedJobCount = async () => {
    const response = await api.orders.getUserCompletedJobCount(id);

    if (response.status === 200) {
      setCompletedJobCount(response.data);
    } else {
      alert(response.errorMessage);
    }
    setLoading(false);
  };

  return (
    <div className="flexContainer">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Card
            sx={{
              position: "relative",
              marginTop: 10,
              width: 400,
              height: 500,
              borderRadius: 15,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "30%",
                backgroundSize: "400% 400%",
                background:
                  "linear-gradient(-45deg, rgb(48, 71, 94), rgb(231, 60, 126))",
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: 200,
                  width: 200,
                  border: 0,
                  borderRadius: "50%",
                  borderColor: "#273a4d",
                  marginLeft: "25%",
                  marginTop: 1,
                }}
                image={`${user.image.format},${user.image.data}`}
              />
              <CardContent>
                <Typography
                  variant="h3"
                  sx={{ mt: 1, display: "flex", justifyContent: "center" }}
                >
                  {user.username}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ mt: 3, display: "flex", justifyContent: "center" }}
                >
                  Completed jobs: {completedJobCount}
                </Typography>
              </CardContent>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
