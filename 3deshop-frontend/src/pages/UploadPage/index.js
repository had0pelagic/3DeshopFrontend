import React, { useState, useEffect } from "react";
import "./styles.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Card,
  Typography,
} from "@mui/material";
import JwtHelper from "../../utils/jwt.helper";
import FileUpload from "react-material-file-upload";
import FormatHelper from "../../utils/format.helper";

export default function Upload() {
  const { getToken } = useAuth();
  const [file, setFile] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [formats, setFormats] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [productAbout, setProductAboutState] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [productSpecification, setProductSpecificationState] = useState({
    data: "",
    textures: false,
    animation: false,
    rig: false,
    materials: false,
  });

  useEffect(async () => {
    await getCategories();
    await getFormats();
  }, []);

  const getCategories = async () => {
    const response = await api.productDetails.getCategories();

    if (response.status === 200) {
      setCategories(response.data);
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  const getFormats = async () => {
    const response = await api.productDetails.getFormats();

    if (response.status === 200) {
      setFormats(response.data);
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  const uploadProduct = async () => {
    const token = getToken().data;
    const jwt = JwtHelper.getUser(token);
    const base64 = await FormatHelper.encodeBase64Bytes(file[0]);
    handleSpecificationFileUpdate(base64);
    const product = {
      userId: jwt.userId,
      about: productAbout,
      specifications: productSpecification,
      categories: selectedCategories,
      formats: selectedFormats,
      images: [
        {
          data: "https://static.3dbaza.com/models/26223/6466bcc63bee461da93cb287.jpg",
        },
        {
          data: "https://media.sketchfab.com/models/c765caf7d1ea454fab08a95fdccd715a/thumbnails/72b2ed8e4ae94fd8948f9290ac79bf2f/1920x1080.jpeg",
        },
      ],
    };

    const response = await api.products.uploadProduct(product);

    if (response.status === 200) {
      console.log("Product uploaded!");
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  const handleAboutChange = (e) => {
    const { id, value } = e.target;

    setProductAboutState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    console.log(file);
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

  const handleSpecificationFileUpdate = (value) => {
    setProductSpecificationState((prevState) => {
      const newState = Object.assign(productSpecification, { data: value });
      return { ...prevState, ...newState };
    });
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
    await uploadProduct();
  };

  return (
    <div className="flexContainer">
      <TextField
        required
        id="name"
        label="Name"
        variant="standard"
        margin="normal"
        value={productAbout.name}
        onChange={handleAboutChange}
      />

      <TextField
        type="text"
        required
        id="price"
        label="Price"
        variant="standard"
        margin="normal"
        value={productAbout.price}
        onChange={handleAboutChange}
      />

      <TextField
        required
        id="description"
        label="Description"
        variant="standard"
        margin="normal"
        multiline
        rows={8}
        value={productAbout.description}
        onChange={handleAboutChange}
      />

      <SpecificationCheckBoxes
        handleSpecificationChange={handleSpecificationChange}
        specificationState={productSpecification}
      />

      <Card
        sx={{ bgcolor: "white", border: 2, width: 800, height: 400, mt: 5 }}
      >
        <Typography>Upload file...</Typography>
        <FileUpload value={file} onChange={setFile} />
      </Card>

      <Card
        sx={{ bgcolor: "white", border: 2, width: 800, height: 400, mt: 5 }}
      >
        <Typography>Upload images...</Typography>
      </Card>

      <ProductCheckBoxes
        items={categories}
        handleChange={handleCheckboxes}
        idName="categories"
        label="Categories:"
        state={setSelectedCategories}
      />

      <ProductCheckBoxes
        items={formats}
        handleChange={handleCheckboxes}
        idName="formats"
        label="Formats:"
        state={setSelectedFormats}
      />

      <div className="mt40">
        <Button variant="contained" onClick={handleSubmitClick}>
          Upload
        </Button>
      </div>
    </div>
  );
}

function SpecificationCheckBoxes({
  handleSpecificationChange,
  specificationState,
}) {
  return (
    <Card sx={{ mt: 5 }}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Specifications:</FormLabel>
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

function ProductCheckBoxes({ items, handleChange, idName, label, state }) {
  return (
    <Card sx={{ mt: 5 }}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{label}</FormLabel>
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
    </Card>
  );
}
