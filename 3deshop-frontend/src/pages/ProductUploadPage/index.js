import React, { useState, useEffect } from "react";
import "./styles.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Card,
  Typography,
  Avatar,
  Container,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import JwtHelper from "../../utils/jwt.helper";
import FormatHelper from "../../utils/format.helper";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FileFormatValidation from "../../utils/fileFormatValidation.helper";
import VideoHelper from "../../utils/video.helper";

export default function Upload() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [formats, setFormats] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [productAbout, setProductAboutState] = useState({
    name: "",
    price: 0,
    description: "",
    videoLink: "",
  });
  const [productSpecification, setProductSpecificationState] = useState({
    data: "",
    textures: false,
    animation: false,
    rig: false,
    materials: false,
  });
  const [error, setError] = useState({
    name: "",
    price: "",
    description: "",
    fileFormats: "",
    imageFormats: "",
    categories: "",
    formats: "",
    videoLink: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(async () => {
    await getCategories();
    await getFormats();
  }, []);

  const tryUpload = async () => {
    let errorExists = false;

    if (productAbout.name.length < 6 || productAbout.name.length > 60) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        name: "Name must have atleast 6 symbols",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        name: "",
      }));
    }

    if (!/[0-9]/.test(productAbout.price)) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        price: "Price must be a number",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        price: "",
      }));
    }

    if (productAbout.description.length === 0) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        description: "Description cannot be empty",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        description: "",
      }));
    }

    if (selectedCategories.length === 0) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        categories: "Atleast one category needs to be chosen",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        categories: "",
      }));
    }

    if (selectedFormats.length === 0) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        formats: "Atleast one format needs to be chosen",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        formats: "",
      }));
    }

    if (productAbout.videoLink.length !== 0) {
      const videoId = VideoHelper.getYoutubeVideoId(productAbout.videoLink);

      if (videoId === null) {
        errorExists = true;
        setError((prev) => ({
          ...prev,
          videoLink: "Only YouTube video links are accepted",
        }));
      } else {
        setError((prev) => ({
          ...prev,
          videoLink: "",
        }));
      }
    } else {
      setError((prev) => ({
        ...prev,
        videoLink: "",
      }));
    }

    if (!FileFormatValidation.isModelFormatsValid(files)) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        fileFormats: "Accepted file formats: gltf, obj, blend, fbx, png, jpg",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        fileFormats: "",
      }));
    }

    if (!FileFormatValidation.isImageFormatsValid(images)) {
      errorExists = true;
      setError((prev) => ({
        ...prev,
        imageFormats: "Accepted image formats: png, jpg",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        imageFormats: "",
      }));
    }

    if (!errorExists) {
      await uploadProduct();
    }

    return;
  };

  const getCategories = async () => {
    const response = await api.productDetails.getCategories();

    if (response.status === 200) {
      setCategories(response.data);
    } else {
      alert(response.errorMessage);
    }
  };

  const getFormats = async () => {
    const response = await api.productDetails.getFormats();

    if (response.status === 200) {
      setFormats(response.data);
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

  const uploadProduct = async () => {
    const token = getToken().data;
    const jwt = JwtHelper.getUser(token);
    const fileData = await encodeData(files);
    const imageData = await encodeData(images);
    const product = {
      userId: jwt.userId,
      about: productAbout,
      files: fileData,
      specifications: productSpecification,
      categories: selectedCategories,
      formats: selectedFormats,
      images: imageData,
    };
    const response = await api.products.uploadProduct(product);

    if (response.status === 200) {
      alert("Product has been uploaded");
      navigate("/products");
    } else {
      alert(response.errorMessage);
    }
  };

  const handleAboutChange = async (e) => {
    const { id, value } = e.target;

    setProductAboutState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSpecificationChange = (e) => {
    const { id, value } = e.target;

    if (["textures", "rig", "animation", "materials"].includes(value)) {
      setProductSpecificationState((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.checked,
      }));
    } else {
      setProductSpecificationState((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const handleCheckboxes = (id, setState) => {
    setState((prevState) =>
      prevState.includes(id)
        ? prevState.filter((x) => x !== id)
        : [...prevState, id]
    );
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    await tryUpload();
    setButtonDisabled(false);
  };

  return (
    <div className="flexContainer">
      <Container component="main" maxWidth="xs">
        <div
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar style={{ marginTop: 10 }}>
            <FileUploadIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Product upload
          </Typography>

          <form
            style={{
              width: "100%",
              marginTop: 10,
            }}
            noValidate
          >
            <TextField
              required
              id="name"
              label="Name"
              margin="normal"
              variant="outlined"
              fullWidth
              value={productAbout.name}
              onChange={handleAboutChange}
              sx={{ width: 400 }}
              error={!error.name ? false : true}
              helperText={error.name}
            />

            <TextField
              type="text"
              required
              id="price"
              label="Price"
              margin="normal"
              variant="outlined"
              fullWidth
              value={productAbout.price}
              onChange={handleAboutChange}
              sx={{ width: 400 }}
              error={!error.price ? false : true}
              helperText={error.price}
            />

            <TextField
              required
              id="description"
              label="Description"
              margin="normal"
              variant="outlined"
              fullWidth
              multiline
              rows={8}
              value={productAbout.description}
              onChange={handleAboutChange}
              sx={{ width: 400 }}
              error={!error.description ? false : true}
              helperText={error.description}
            />

            <TextField
              type="text"
              id="videoLink"
              label="YouTube video link"
              margin="normal"
              variant="outlined"
              fullWidth
              value={productAbout.videoLink}
              onChange={handleAboutChange}
              sx={{ width: 400 }}
              error={!error.videoLink ? false : true}
              helperText={error.videoLink}
            />

            <SpecificationCheckBoxes
              handleSpecificationChange={handleSpecificationChange}
              specificationState={productSpecification}
            />

            <Card
              sx={{
                bgcolor: "white",
                border: 0,
                width: 400,
                height: "100%",
                mt: 5,
              }}
            >
              <FilePond
                stylePanelLayout="compact"
                files={files}
                allowMultiple={true}
                onupdatefiles={setFiles}
                credits
                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              />
              {error.fileFormats ? (
                <Typography
                  sx={{
                    color: "red",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 2,
                    marginBottom: 2,
                  }}
                >
                  {error.fileFormats}
                </Typography>
              ) : (
                <div></div>
              )}
            </Card>

            <Card
              sx={{
                bgcolor: "white",
                border: 0,
                width: 400,
                height: "100%",
                mt: 5,
              }}
            >
              <FilePond
                stylePanelLayout="compact"
                files={images}
                allowMultiple={true}
                onupdatefiles={setImages}
                credits
                labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
              />
              {error.imageFormats ? (
                <Typography
                  sx={{
                    color: "red",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 2,
                    marginBottom: 2,
                  }}
                >
                  {error.imageFormats}
                </Typography>
              ) : (
                <div></div>
              )}
            </Card>

            <ProductCheckBoxes
              items={categories}
              handleChange={handleCheckboxes}
              idName="categories"
              label="Categories:"
              state={setSelectedCategories}
              error={error.categories}
            />

            <ProductCheckBoxes
              items={formats}
              handleChange={handleCheckboxes}
              idName="formats"
              label="File formats:"
              state={setSelectedFormats}
              error={error.formats}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: 30 }}
              disabled={buttonDisabled}
              onClick={(e) => {
                setButtonDisabled(true);
                handleSubmitClick(e);
              }}
            >
              Upload product
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

function SpecificationCheckBoxes({
  handleSpecificationChange,
  specificationState,
}) {
  return (
    <Card sx={{ mt: 5, width: 400 }}>
      <FormControl
        component="fieldset"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <FormLabel
          component="legend"
          sx={{
            color: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Typography sx={{ mt: 2, mb: 2 }}>Specifications:</Typography>
        </FormLabel>
        <FormGroup aria-label="position" row>
          <FormControlLabel
            value="textures"
            control={
              <Checkbox
                id="textures"
                color="default"
                checked={specificationState.textures}
                onChange={handleSpecificationChange}
              />
            }
            label="Textures"
            labelPlacement="start"
          />
          <FormControlLabel
            value="rig"
            control={
              <Checkbox
                id="rig"
                color="default"
                checked={specificationState.rig}
                onChange={handleSpecificationChange}
              />
            }
            label="Rig"
            labelPlacement="start"
          />
          <FormControlLabel
            value="animation"
            control={
              <Checkbox
                id="animation"
                color="default"
                checked={specificationState.animation}
                onChange={handleSpecificationChange}
              />
            }
            label="Animation"
            labelPlacement="start"
          />
          <FormControlLabel
            value="materials"
            control={
              <Checkbox
                id="materials"
                color="default"
                checked={specificationState.materials}
                onChange={handleSpecificationChange}
              />
            }
            label="Materials"
            labelPlacement="start"
          />
        </FormGroup>
      </FormControl>
    </Card>
  );
}

function ProductCheckBoxes({
  items,
  handleChange,
  idName,
  label,
  state,
  error,
}) {
  return (
    <Card sx={{ mt: 5, width: 400 }}>
      <FormControl
        component="fieldset"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <FormLabel
          component="legend"
          sx={{
            color: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Typography sx={{ mt: 2, mb: 2 }}>{label}</Typography>
        </FormLabel>
        <FormGroup aria-label="position" row>
          {items.map((item, index) => (
            <FormControlLabel
              key={index}
              value={item.id}
              control={
                <Checkbox
                  id={idName}
                  color="default"
                  onChange={() => handleChange(item.id, state)}
                />
              }
              label={item.name}
              labelPlacement="start"
            />
          ))}
        </FormGroup>
      </FormControl>
      {error ? (
        <Typography
          sx={{
            color: "red",
            display: "flex",
            justifyContent: "center",
            marginTop: 2,
            marginBottom: 2,
          }}
        >
          {error}
        </Typography>
      ) : (
        <div></div>
      )}
    </Card>
  );
}
