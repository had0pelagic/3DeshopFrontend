import React, { useEffect, useState } from "react";
import Product from "../../components/Product";
import "./styles.css";
import api from "../../api";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Tiles } from "@rebass/layout";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [formats, setFormats] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [productSearchName, setProductSearchName] = useState("");
  const [productSpecification, setProductSpecification] = useState({
    Textures: false,
    Animation: false,
    Rig: false,
    Materials: false,
  });
  const [orderText, setOrderText] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  useEffect(async () => {
    await getProducts();
    await getCategories();
    await getFormats();
  }, []);

  const toggleProductCheckBoxValue = (index) => {
    setProductSpecification((prevState) => ({
      ...prevState,
      [Object.keys(productSpecification)[index]]:
        !Object.values(productSpecification)[index],
    }));
  };

  const getCategories = async () => {
    const response = await api.productDetails.getCategories();

    if (response.status === 200) {
      setCategories(response.data);
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  const getProductsOrderByPrice = async (ascending) => {
    const products = await api.products.getProductsOrderByPrice(ascending);

    if (products.status === 200) {
      setProducts(products.data);
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  const getProductsOrderByUploadDate = async (ascending) => {
    const products = await api.products.getProductsOrderByUploadDate(ascending);

    if (products.status === 200) {
      setProducts(products.data);
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

  const getProducts = async () => {
    const products = await api.products.getProducts();

    if (products.status === 200) {
      setProducts(products.data);
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  function Items({ currentItems }) {
    return (
      <>
        {currentItems &&
          currentItems.map((product, index) => (
            <Product
              key={index}
              id={product.id}
              name={product.name}
              categories={product.categories}
              creator={product.user}
              price={product.price}
              image={product.image}
            />
          ))}
      </>
    );
  }

  function PaginatedItems({ itemsPerPage }) {
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(products.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(products.length / itemsPerPage));
    }, [itemOffset, itemsPerPage]);

    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % products.length;
      setItemOffset(newOffset);
    };

    return (
      <>
        <Tiles columns={[1, 2, 3, 4]}>
          <Items currentItems={currentItems} />
        </Tiles>
        <ReactPaginate
          breakLabel="..."
          nextLabel=" >"
          previousLabel="< "
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          activeClassName="active"
        />
      </>
    );
  }

  const handleChange = (e) => {
    const { id, value } = e.target;

    setProductSearchName((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleCategoryCheckboxes = (id) => {
    setSelectedCategories((prevState) =>
      prevState.includes(id)
        ? prevState.filter((x) => x !== id)
        : [...prevState, id]
    );
  };

  const handleFormatCheckboxes = (id) => {
    setSelectedFormats((prevState) =>
      prevState.includes(id)
        ? prevState.filter((x) => x !== id)
        : [...prevState, id]
    );
  };

  const advancedSearch = () => {
    const search = {
      productName: productSearchName.name,
      productFormats: selectedFormats,
      productCategories: selectedCategories,
      productSpecifications: productSpecification,
    };
    navigate("/advanced-product-search", { state: search });
  };

  const handleOrderChange = (e) => {
    setOrderText(e.target.value);
  };

  return (
    <div className="flexContainer p50">
      <div
        style={{
          display: "flex",
          flexDirection: "initial",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Button
          sx={{
            color: "#fff",
            "&:hover": {
              backgroundColor: "#30475E",
              color: "#F05454",
            },
            backgroundColor: "#30475E",
            marginTop: 5,
            marginRight: 5,
            marginBottom: 5,
            alignItems: "right",
            width: 200,
            minWidth: 100,
          }}
          component={Link}
          to={`/upload-product`}
        >
          Upload product
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
            marginLeft: 5,
            marginBottom: 5,
            alignItems: "right",
            width: 200,
            minWidth: 100,
          }}
          onClick={handleOpen}
        >
          Advanced search
        </Button>

        <FormControl
          fullWidth
          style={{
            position: "relative",
            marginLeft: 80,
            marginTop: 30,
            minWidth: 100,
            width: 200,
          }}
        >
          <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={orderText}
            label="Sort by"
            onChange={handleOrderChange}
          >
            <MenuItem
              value={"Lowest price"}
              onClick={async () => {
                await getProductsOrderByPrice(true);
              }}
            >
              Lowest price
            </MenuItem>
            <MenuItem
              value={"Higher price"}
              onClick={async () => {
                await getProductsOrderByPrice(false);
              }}
            >
              Higher price
            </MenuItem>
            <MenuItem
              value={"Newest"}
              onClick={async () => {
                await getProductsOrderByUploadDate(true);
              }}
            >
              Newest
            </MenuItem>
            <MenuItem
              value={"Oldest"}
              onClick={async () => {
                await getProductsOrderByUploadDate(false);
              }}
            >
              Oldest
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      <PaginatedItems itemsPerPage={9} />

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
            <Typography style={{ fontSize: 30 }}>Advanced search</Typography>

            <div
              style={{
                display: "flex",
                marginTop: 5,
                width: 200,
              }}
            >
              <TextField
                id="name"
                margin="normal"
                variant="outlined"
                onChange={handleChange}
                label="Product name or fragment"
              />
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 5,
                width: 200,
              }}
            >
              <FormControl style={{ width: "100%" }}>
                <InputLabel id="demo-multiple-checkbox-label">
                  Specifications
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={[]}
                  input={<OutlinedInput label="Tag" />}
                >
                  {Object.keys(productSpecification).map((item, index) => (
                    <MenuItem key={index} value={item}>
                      <Checkbox
                        key={index}
                        checked={Object.values(productSpecification)[index]}
                        onClick={() => toggleProductCheckBoxValue(index)}
                      />
                      <ListItemText primary={item} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 15,
                width: 200,
              }}
            >
              <FormControl style={{ width: "100%" }}>
                <InputLabel id="demo-multiple-checkbox-label">
                  Formats
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={[]}
                  input={<OutlinedInput label="Tag" />}
                >
                  {formats.map((item, index) => (
                    <MenuItem key={index} value={item.name}>
                      <Checkbox
                        key={index}
                        checked={selectedFormats.includes(item.id)}
                        onChange={() => handleFormatCheckboxes(item.id)}
                      />
                      <ListItemText primary={item.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 15,
                width: 200,
              }}
            >
              <FormControl style={{ width: "100%" }}>
                <InputLabel id="demo-multiple-checkbox-label">
                  Categories
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={[]}
                  input={<OutlinedInput label="Tag" />}
                >
                  {categories.map((item, index) => (
                    <MenuItem key={index} value={item.name}>
                      <Checkbox
                        key={index}
                        checked={selectedCategories.includes(item.id)}
                        onChange={() => handleCategoryCheckboxes(item.id)}
                      />
                      <ListItemText primary={item.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <Button
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#30475E",
                  color: "#F05454",
                },
                marginTop: 2,
                backgroundColor: "#30475E",
                width: 200,
              }}
              onClick={advancedSearch}
            >
              Advanced search
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
