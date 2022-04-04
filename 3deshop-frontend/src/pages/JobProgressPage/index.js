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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  const [progresses, setProgresses] = useState([]);
  const [lastProgressValue, setLastProgressValue] = useState(0);

  useEffect(async () => {
    await getProgress();
  }, []);

  const getProgress = async () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    const response = await api.orders.getJobProgress(jwtUserId, id);

    if (response.status === 200) {
      if (response.data.length > 0) {
        response.data.sort(function (a, b) {
          return new Date(a.created) - new Date(b.created);
        });
        setLastProgressValue(response.data[response.data.length - 1].progress);
        setProgresses(response.data);
      }
      console.log("Progress returned!");
    } else {
      console.log("error at products, didn't return 200");
    }
    setLoading(false);
  };

  function LinearProgressWithLabel() {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" value={lastProgressValue} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            lastProgressValue
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <div className="flexContainer">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flexContainer">
          <h1>Order progress</h1>
          {progresses && progresses.length > 0 ? (
            <div className="flexContainer">
              <Box sx={{ width: "100%" }}>
                <LinearProgressWithLabel value={lastProgressValue} />
              </Box>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Note</TableCell>
                      <TableCell align="left">Progress</TableCell>
                      <TableCell align="left">Date</TableCell>
                      <TableCell align="left">User</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {progresses.map((progress, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {progress.description}
                        </TableCell>
                        <TableCell align="left">{progress.progress}%</TableCell>
                        <TableCell align="left">
                          {moment(progress.created).format("YYYY-MM-DD")}
                        </TableCell>
                        <TableCell align="left">{progress.userId}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : (
            <div className="flexContainer">
              <h2>No progress yet</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
