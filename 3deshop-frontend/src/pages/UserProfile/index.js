import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import api from "../../api";
import Loader from "../../components/Loader";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const response = await api.users.getUser(id);
    if (response.status === 200) {
      setUser(response.data);
    } else {
      console.log("error at account page, didn't return 200");
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
            <CardContent>
              <CardMedia
                component="img"
                sx={{ height: 200, width: 200, border: 0 }}
                image={`${user.image.format},${user.image.data}`}
              />
              <Typography variant="h3" sx={{ mt: 1 }}>
                {user.username}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {user.firstName} {user.lastName}
              </Typography>
              {/* <Typography variant="h5" sx={{ mt: 1 }}>
                0 reputation
              </Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>
                product count
              </Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>
                completed job count
              </Typography> */}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
