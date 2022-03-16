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

export default function ProductDownload() {
  let { id } = useParams();
  const [files, setFiles] = useState();
  const [img, setImg] = useState({ url: "", filename: "" });
  const [isLoading, setLoading] = useState(true);

  useEffect(async () => {
    await downloadImage();
  }, []);

  const downloadImage = async () => {
    const response = await api.products.downloadImage(id);
    if (response.status === 200) {
      const data = DownloadHelper.getFileData(response);
      setImg(data);
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  return (
    <div className="flexContainer mt40">
      <a href={img.url} download={img.filename}>
        Get image
      </a>
      {/* {isLoading ? (
        <Loader />
      ) : (
        <div>
          <List
            sx={{ width: "150%", maxWidth: 800, bgcolor: "background.paper" }}
          >
            {products.map((product, index) => (
              <PurchasedProduct
                handleSubmitClick={handleSubmitClick}
                product={product}
                key={index}
              />
            ))}
          </List>
        </div>
      )} */}
    </div>
  );
}
