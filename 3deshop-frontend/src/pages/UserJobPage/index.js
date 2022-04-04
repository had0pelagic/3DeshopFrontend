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
import { Link } from "react-router-dom";
import Loader from "../../components/Loader/index.js";
import api from "../../api";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { useAuth } from "../../hooks/useAuth";
import JwtHelper from "../../utils/jwt.helper";
import FormatHelper from "../../utils/format.helper";
import Carousel from "react-material-ui-carousel";
import DefaultImage from "../../images/defaultProductImage.png";
import moment from "moment";
import Slider from "@mui/material/Slider";
import LinearProgress from "@mui/material/LinearProgress";

export default function UserJobs() {
  const { getToken } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [files, setFiles] = useState();
  const [isLoadingJobs, setLoadingJobs] = useState(true);
  const [isLoadingOrder, setLoadingOrder] = useState(true);
  const [order, setOrder] = useState();
  const [job, setJob] = useState();
  const [form, setForm] = useState({ comment: "", progress: 0 });
  const [orderFormattedDate, setOrderFormattedDate] = useState();
  const [offerFormattedDate, setOfferFormattedDate] = useState();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = async (job) => {
    await getDisplayOrder(job);
    setOpen(true);
  };

  const [progressOpen, setProgressOpen] = useState(false);
  const handleProgressClose = () => setProgressOpen(false);
  const handleProgressOpen = async () => {
    setProgressOpen(true);
  };

  useEffect(async () => {
    await getJobs();
  }, []);

  const getJobs = async () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    const response = await api.orders.getUserJobs(jwtUserId);

    if (response.status === 200) {
      setJobs(response.data);
      console.log("Offers returned!");
    } else {
      console.log("error at products, didn't return 200");
    }
    setLoadingJobs(false);
  };

  const setJobProgress = async () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    const request = {
      id: job.id,
      orderId: order.id,
      userId: jwtUserId,
      comment: form.comment,
      progress: form.progress,
    };
    const response = await api.orders.setJobProgress(request);

    if (response.status === 200) {
      console.log("Job has been updated!");
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  function encodeData(array) {
    return Promise.all(
      array.map(async (item) => {
        try {
          const base64 = await FormatHelper.encodeBase64(item.file);
          return {
            name: item.filename,
            data: base64.bytes,
            format: base64.type,
          };
        } catch (error) {
          throw error;
        }
      })
    );
  }

  const setJobCompletion = async () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    const fileData = await encodeData(files);
    const request = {
      id: job.id,
      orderId: order.id,
      userId: jwtUserId,
      comment: form.comment,
      progress: form.progress,
      files: fileData,
    };

    const response = await api.orders.setJobCompletion(request);

    if (response.status === 200) {
      console.log("Job has been completed!");
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    await setJobProgress();
  };

  const handleJobCompletion = async (e) => {
    e.preventDefault();
    await setJobCompletion();
  };

  const getDisplayOrder = async (job) => {
    const response = await api.orders.getDisplayOrder(job.order.id);

    if (response.status === 200) {
      setOrderFormattedDate(
        moment(job.order.completeTill).format("YYYY-MM-DD")
      );
      setOfferFormattedDate(
        moment(job.offer.completeTill).format("YYYY-MM-DD")
      );
      setOrder(response.data);
      setJob(job);
      console.log("Order returned!");
    } else {
      console.log("error at products, didn't return 200");
    }
    setLoadingOrder(false);
  };

  const abandonJob = async () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    const request = { userId: jwtUserId, jobId: job.id };
    const response = await api.orders.workerAbandonJob(request);

    if (response.status === 200) {
      console.log("Job has been abandoned!");
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  function OrderImages() {
    return (
      <div style={{ minWidth: 400, marginTop: 20 }}>
        <Card>
          <CardContent>
            {order.images.length > 0 ? (
              <Carousel indicators={false}>
                {order.images.map((image, index) => (
                  <CardMedia
                    component="img"
                    height="300"
                    image={`${image.format},${image.data}`}
                    key={index}
                    style={{ backgroundColor: "Red" }}
                  />
                ))}
              </Carousel>
            ) : (
              <CardMedia component="img" height="300" image={DefaultImage} />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  function LinearProgressWithLabel() {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" value={job.progress} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            job.progress
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  const handleProgressChange = (e) => {
    setForm((prevState) => ({
      ...prevState,
      ["progress"]: e.target.value,
    }));
  };

  const handleNoteChange = (e) => {
    const { id, value } = e.target;

    setForm((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <div className="flexContainer">
      {isLoadingJobs ? (
        <Loader />
      ) : (
        <div
          className="flexContainer"
          style={{ marginLeft: 30, marginRight: 30 }}
        >
          <h1>Active jobs</h1>

          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="left">Creation date</TableCell>
                  <TableCell align="left">Status</TableCell>
                  <TableCell align="left">Completed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job, index) => (
                  <TableRow
                    hover
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                    onClick={() => handleOpen(job)}
                  >
                    <TableCell component="th" scope="row">
                      {job.order.name}
                    </TableCell>
                    <TableCell align="left">
                      {moment(job.created).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell align="left">
                      {job.active ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell align="left">
                      {job.progress === 100 ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        BackdropProps={{
          timeout: 600,
        }}
      >
        {isLoadingOrder ? (
          <Loader />
        ) : (
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
              <Typography style={{ fontSize: 30 }}>{order.name}</Typography>
              {OrderImages()}
              <TextField
                id="description"
                variant="outlined"
                multiline
                maxRows={4}
                value={order.description}
                InputProps={{ readOnly: true, disableUnderline: true }}
                sx={{ marginTop: 5, width: 400, backgroundColor: "white" }}
              />
              <div className="priceDateContainer">
                <Typography sx={{ fontSize: 20 }} variant="h5" gutterBottom>
                  {order.price}$
                </Typography>
                <Box sx={{ width: "100%" }}>
                  <LinearProgressWithLabel value={job.progress} />
                </Box>
                <Typography sx={{ fontSize: 20 }} variant="h5">
                  Order completion date: {orderFormattedDate}
                </Typography>
                <Typography sx={{ fontSize: 20 }} variant="h5">
                  Offer completion date: {offerFormattedDate}
                </Typography>
              </div>

              {job.progress === 100 ? (
                <div></div>
              ) : (
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
                    onClick={abandonJob}
                  >
                    <Typography>Abandon the job</Typography>
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
                    onClick={() => handleProgressOpen()}
                  >
                    <Typography>Set progress</Typography>
                  </Button>
                </div>
              )}
            </div>
          </Box>
        )}
      </Modal>

      <Modal
        open={progressOpen}
        onClose={handleProgressClose}
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
            <Typography style={{ fontSize: 30 }}>Progress</Typography>
            <Slider
              id={"Progress"}
              aria-label="Progress"
              defaultValue={30}
              valueLabelDisplay="auto"
              step={10}
              marks
              min={0}
              max={100}
              value={form.progress}
              onChange={handleProgressChange}
            />

            <div style={{ marginTop: 20 }}>
              <TextField
                id="comment"
                label="Comment"
                variant="outlined"
                multiline
                rows={4}
                sx={{
                  width: 400,
                }}
                value={form.comment}
                onChange={handleNoteChange}
              />
            </div>
            {form.progress === 100 ? (
              <div>
                <div style={{ marginTop: 20 }}>
                  <FilePond
                    stylePanelLayout="compact"
                    files={files}
                    allowMultiple={true}
                    onupdatefiles={setFiles}
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                  />
                </div>
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
                  onClick={handleJobCompletion}
                >
                  <Typography>Set progress & upload files</Typography>
                </Button>
              </div>
            ) : (
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
                onClick={handleSubmitClick}
              >
                <Typography>Set progress</Typography>
              </Button>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
