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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Slider from "@mui/material/Slider";
import LinearProgress from "@mui/material/LinearProgress";
import { Link, useParams, useNavigate } from "react-router-dom";
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
import ReactPaginate from "react-paginate";
import FileFormatValidation from "../../utils/fileFormatValidation.helper";

export default function UserJobs() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const handleConfirmationDialogOpen = () => {
    setOpenConfirmationDialog(true);
  };
  const handleConfirmationDialogClose = () => {
    setOpenConfirmationDialog(false);
  };

  const [error, setError] = useState({
    comment: "",
    file: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(async () => {
    checkIfUsersPage();
    await getJobs();
  }, []);

  const trySetJobCompletion = async () => {
    let errorExists = false;

    if (form.comment.length === 0 || form.comment.length > 200) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        comment: "Comment must have between 0 and 200 symbols",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        comment: "",
      }));
    }

    if (!FileFormatValidation.isModelFormatsValid(files)) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        file: "Accepted file formats: gltf, obj, blend, fbx, png, jpg",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        file: "",
      }));
    }

    if (!errorExists) {
      await setJobCompletion();
    }

    return;
  };

  const trySetJobProgress = async () => {
    let errorExists = false;

    if (form.comment.length === 0 || form.comment.length > 200) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        comment: "Comment must have between 0 and 200 symbols",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        comment: "",
      }));
    }

    if (!errorExists) {
      await setJobProgress();
    }

    return;
  };

  const checkIfUsersPage = () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;

    if (id !== jwtUserId) {
      navigate("/");
    }
  };

  const getJobs = async () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    const response = await api.orders.getUserJobs(jwtUserId);

    if (response.status === 200) {
      setJobs(response.data);
    } else {
      alert(response.errorMessage);
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
      alert("Progress has been set");
      handleProgressClose();
      window.location.reload();
    } else {
      alert(response.errorMessage);
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
      alert("Job has been completed");
      handleProgressClose();
      window.location.reload();
    } else {
      alert(response.errorMessage);
    }
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    await trySetJobProgress();
    setButtonDisabled(false);
  };

  const handleJobCompletion = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    await trySetJobCompletion();
    setButtonDisabled(false);
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
    } else {
      alert(response.errorMessage);
    }
    setLoadingOrder(false);
  };

  const abandonJob = async () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    const request = { userId: jwtUserId, jobId: job.id };
    const response = await api.orders.workerAbandonJob(request);

    if (response.status === 200) {
      alert("Job has been abandoned!");
      window.location.reload();
    } else {
      alert(response.errorMessage);
    }
  };

  const handleProgressChange = (e) => {
    e.preventDefault();

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

  function Items({ currentItems }) {
    return (
      <>
        {currentItems && (
          <TableContainer
            component={Paper}
            sx={{ width: "100%", marginTop: 5 }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="left">Creation date</TableCell>
                  <TableCell align="left">Status</TableCell>
                  <TableCell align="left">Completed</TableCell>
                  <TableCell align="left">Request for changes</TableCell>
                  <TableCell align="left">Owner</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((job, index) => (
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
                    <TableCell align="left">
                      {job.needChanges ? "Yes" : "No"}
                    </TableCell>
                    <TableCell align="left">
                      <Typography
                        component={Link}
                        to={`/user-profile/${job.order.user.id}`}
                      >
                        {job.order.user.username}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </>
    );
  }

  function PaginatedTable({ itemsPerPage }) {
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(jobs.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(jobs.length / itemsPerPage));
    }, [itemOffset, itemsPerPage]);

    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % jobs.length;
      setItemOffset(newOffset);
    };

    return (
      <>
        <Items currentItems={currentItems} />
        <ReactPaginate
          breakLabel="..."
          nextLabel=" >"
          previousLabel="< "
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          renderOnZeroPageCount={null}
          containerClassName="userJobPagination"
          activeClassName="active"
        />
      </>
    );
  }

  return (
    <div className="flexContainer">
      {isLoadingJobs ? (
        <Loader />
      ) : (
        <div
          className="flexContainer"
          style={{ marginLeft: 30, marginRight: 30 }}
        >
          <div
            style={{
              marginTop: 20,
              width: "100%",
            }}
          >
            <Typography
              variant="h3"
              align="center"
              style={{ width: "100%", alignItems: "center" }}
            >
              My jobs
            </Typography>
            <Typography
              variant="h6"
              align="center"
              style={{ width: "100%", alignItems: "center" }}
            >
              Here you can find all of your jobs/executing orders
            </Typography>
          </div>
          {jobs && jobs.length > 0 ? (
            <div>
              <PaginatedTable itemsPerPage={6} />
            </div>
          ) : (
            <div className="flexContainer">
              <Typography
                variant="h5"
                align="center"
                style={{ width: "100%", alignItems: "center", paddingTop: 10 }}
              >
                You don't have any jobs yet
              </Typography>
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
        <div>
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
                  InputProps={{ readOnly: true }}
                  sx={{ marginTop: 5, width: 400, backgroundColor: "white" }}
                />
                <div className="priceDateContainer">
                  <Typography sx={{ fontSize: 20 }} variant="h5" gutterBottom>
                    {order.price}C
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
                    {job && job.active ? (
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
                        disabled={buttonDisabled}
                        onClick={handleConfirmationDialogOpen}
                      >
                        <Typography>Abandon job</Typography>
                      </Button>
                    ) : (
                      <div></div>
                    )}
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
                      disabled={buttonDisabled}
                      onClick={() => handleProgressOpen()}
                    >
                      <Typography>Set progress</Typography>
                    </Button>
                  </div>
                )}
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
                  disabled={buttonDisabled}
                  component={Link}
                  to={`/job-progress/${job.order.id}`}
                >
                  <Typography>Progress</Typography>
                </Button>
              </div>
            </Box>
          )}
        </div>
      </Modal>

      <Modal
        open={progressOpen}
        onClose={handleProgressClose}
        BackdropProps={{
          timeout: 600,
        }}
      >
        <div>
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
                  error={!error.comment ? false : true}
                  helperText={error.comment}
                />
              </div>
              {form.progress === 100 ? (
                <div>
                  <div style={{ marginTop: 20, height: "100%" }}>
                    <FilePond
                      stylePanelLayout="compact"
                      files={files}
                      credits
                      allowMultiple={true}
                      onupdatefiles={setFiles}
                      labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                    />
                    {error.file ? (
                      <Typography
                        sx={{
                          color: "red",
                          display: "flex",
                          justifyContent: "center",
                          marginTop: 2,
                          marginBottom: 2,
                        }}
                      >
                        {error.file}
                      </Typography>
                    ) : (
                      <div></div>
                    )}
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
                    disabled={buttonDisabled}
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
                  disabled={buttonDisabled}
                  onClick={handleSubmitClick}
                >
                  <Typography>Set progress</Typography>
                </Button>
              )}
            </div>
          </Box>
        </div>
      </Modal>

      <Dialog
        open={openConfirmationDialog}
        onClose={handleConfirmationDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Job abandon"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {"Are you sure you want to abandon this job?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={buttonDisabled}
            onClick={() => abandonJob()}
            color="primary"
            autoFocus
          >
            {"Yes"}
          </Button>
          <Button
            disabled={buttonDisabled}
            onClick={handleConfirmationDialogClose}
            color="primary"
          >
            {"No"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
