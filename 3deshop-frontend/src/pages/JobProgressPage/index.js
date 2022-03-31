import React, { useState, useEffect } from "react";
import "./styles.css";
import {
  Typography,
  Button,
  Modal,
  Box,
  Card,
  CardContent,
  CardMedia,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader/index.js";
import api from "../../api";
import "filepond/dist/filepond.min.css";
import { useAuth } from "../../hooks/useAuth";
import JwtHelper from "../../utils/jwt.helper";
import moment from "moment";
import LinearProgress from "@mui/material/LinearProgress";

export default function JobProgress() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const [progresses, setProgresses] = useState();

  useEffect(async () => {
    await getProgress();
  }, []);

  const getProgress = async () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    const response = await api.orders.getJobProgress(jwtUserId, id);

    if (response.status === 200) {
      setProgresses(response.data);
      console.log("Progress returned!");
    } else {
      console.log("error at products, didn't return 200");
    }
    setLoading(false);
  };

  return (
    <div className="flexContainer">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flexContainer">
          <h1>Order progress</h1>
          {progresses.map((progress, index) => (
            <div
              style={{
                backgroundColor: "#F05454",
                marginTop: 30,
                width: 500,
                display: "flex",
                flex: 1,
                justifyContent: "space-between",
                padding: "6px 12px 6px 12px",
                borderRadius: 10,
                cursor: "pointer",
              }}
              key={index}
            >
              <div
                style={{
                  marginTop: 10,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "25rem",
                }}
              >
                <Typography noWrap style={{ fontSize: 30 }}>
                  {progress.description}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
