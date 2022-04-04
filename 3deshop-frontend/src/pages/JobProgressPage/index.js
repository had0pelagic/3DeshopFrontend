import React, { useState, useEffect } from "react";
import "./styles.css";
import {
  Typography,
  Button,
  Modal,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
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

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = async () => {
    setOpen(true);
  };

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
                        hover
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
              <div>
                {lastProgressValue === 100 ? (
                  <div>
                    <Button
                      sx={{
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#30475E",
                          color: "#F05454",
                        },
                        backgroundColor: "#30475E",
                        marginTop: 5,
                        width: 400,
                      }}
                      onClick={() => handleOpen()}
                    >
                      <Typography>Check completed job</Typography>
                    </Button>
                  </div>
                ) : (
                  <h1>b</h1>
                )}
              </div>
            </div>
          ) : (
            <div className="flexContainer">
              <h2>No progress yet</h2>
            </div>
          )}
        </div>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        BackdropProps={{
          timeout: 600,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "#DDDDDD",
            border: "1px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <div className="flexContainer">
            <Button
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#30475E",
                  color: "#F05454",
                },
                backgroundColor: "#30475E",
                width: 400,
              }}
              component={Link}
              to={`/order-download/${id}`}
            >
              <Typography style={{ fontSize: 30 }}>Get files</Typography>
            </Button>

            <Button
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#30475E",
                  color: "#F05454",
                },
                backgroundColor: "#30475E",
                marginTop: 5,
                width: 400,
              }}
              onClick={() => alert("approving")}
            >
              <Typography style={{ fontSize: 30 }}>Approve</Typography>
            </Button>

            <Button
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#30475E",
                  color: "#F05454",
                },
                backgroundColor: "#30475E",
                marginTop: 5,
                width: 400,
              }}
            >
              <Typography style={{ fontSize: 30 }}>Ask for changes</Typography>
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
