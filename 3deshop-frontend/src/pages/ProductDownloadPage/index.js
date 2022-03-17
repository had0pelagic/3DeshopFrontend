import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import api from "../../api";
import DownloadHelper from "../../utils/download.helper";
import JwtHelper from "../../utils/jwt.helper";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/Loader";

export default function ProductDownload() {
  let { id } = useParams();
  const { getToken } = useAuth();
  const [files, setFiles] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(async () => {
    await getFiles();
  }, []);

  const getFiles = async () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;
    const response = await api.files.getFiles(id, jwtUserId);
    if (response.status === 200) {
      const files = response.data.map((file) => {
        return DownloadHelper.getFileData(file);
      });
      setFiles(files);
    } else {
      console.log("error at products, didn't return 200");
    }
    setLoading(false);
  };

  return (
    <div className="flexContainer mt40">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <List
            sx={{ width: "150%", maxWidth: 800, bgcolor: "background.paper" }}
          >
            {files.map((file, index) => (
              <a
                href={file.url}
                download={file.filename}
                key={index}
                style={{ textDecoration: "none" }}
              >
                {file.filename + " "}
              </a>
            ))}
          </List>
        </div>
      )}
    </div>
  );
}
