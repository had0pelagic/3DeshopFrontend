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

export default function Upload() {
  const { getToken } = useAuth();
  const [productAbout, setProductAboutState] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [productSpecification, setProductSpecificationState] = useState({
    data: "000000x0000000x000000x0x0011x11x1x0x0001x1x1x1x00",
    textures: false,
    animation: false,
    rig: false,
    materials: false,
  });
  const [categories, setCategories] = useState([]);
  const [formats, setFormats] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);

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
    const product = {
      userId: jwt.userId,
      about: productAbout,
      specifications: productSpecification,
      categories: selectedCategories,
      formats: selectedFormats,
      images: [
        {
          data: "https://c4ddownload.com/wp-content/uploads/Bmw-8-3D-model.jpg",
        },
        {
          data: "https://3dfree.top/uploads/posts/2019-09/1567955433_bmw-8-series-g15-soupe-m850i-2019.jpg",
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
    console.log(selectedCategories);
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
        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
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
