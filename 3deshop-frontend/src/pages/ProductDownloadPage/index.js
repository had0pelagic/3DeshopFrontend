import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
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
      // console.log(response.data);
      const files = response.data.map((file) => {
        return DownloadHelper.getFileData(file);
      });
      // console.log(files);
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
        <div style={{ marginLeft: 30, marginRight: 30 }}>
          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file, index) => (
                  <TableRow
                    hover
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {file.filename + " "}
                    </TableCell>
                    <TableCell align="left">
                      <a
                        href={file.url}
                        download={file.filename}
                        style={{ textDecoration: "none" }}
                      >
                        Download
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}
