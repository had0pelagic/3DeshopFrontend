import React, { useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import "./style.css";

export default function ConfirmationDialog({
  buttonText,
  mainText,
  questionText,
  agreeText,
  disagreeText,
  action,
}) {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = async () => {
    setOpen(true);
  };
  const handleAgree = async () => {
    await action();
  };
  const handleDisagree = () => {
    handleClose();
  };

  return (
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
        onClick={handleOpen}
      >
        <Typography>{buttonText}</Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{questionText}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {mainText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAgree} color="primary" autoFocus>
            {agreeText}
          </Button>
          <Button onClick={handleDisagree} color="primary">
            {disagreeText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
