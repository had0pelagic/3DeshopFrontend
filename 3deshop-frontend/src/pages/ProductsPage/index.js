import React, { useEffect, useState } from "react";
import Product from "../../components/Product";
import "./styles.css";
import api from "../../api";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Tiles } from "@rebass/layout";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productSearchName, setProductSearchName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [productSpecification, setProductSpecification] = useState({
    Textures: false,
    Animation: false,
    Rig: false,
    Materials: false,
  });
  const navigate = useNavigate();

  useEffect(async () => {
    await getProducts();
    await getCategories();
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

    console.log(response);

    if (response.status === 200) {
      setCategories(response.data);
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

  const getProductsBySpecification = async () => {
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
          currentItems.map((product) => (
            <Product
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

  const handleCheckboxes = (id) => {
    setSelectedCategories((prevState) =>
      prevState.includes(id)
        ? prevState.filter((x) => x !== id)
        : [...prevState, id]
    );
  };

  const advancedSearch = () => {
    const search = {
      productName: productSearchName.name,
      productCategories: selectedCategories,
      productSpecifications: productSpecification,
    };
    console.log(search);
    navigate("/advanced-product-search", { state: search });
  };

  return (
    <div className="flexContainer p50">
      <div
        style={{
          backgroundColor: "blue",
          display: "flex",
          flexDirection: "initial",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ backgroundColor: "cyan", display: "flex" }}>
          <TextField
            required
            id="name"
            margin="normal"
            variant="outlined"
            fullWidth
            onChange={handleChange}
            style={{ width: 200 }}
          />
          <Button
            sx={{
              color: "#fff",
              "&:hover": {
                backgroundColor: "#30475E",
                color: "#F05454",
              },
              marginTop: 15,
              marginLeft: 3,
              marginBottom: 45,
              backgroundColor: "#30475E",
              width: 200,
            }}
            component={Link}
            to={`/products/${productSearchName.name}`}
          >
            {console.log(productSearchName)}
            Search
          </Button>
        </div>

        <div style={{ backgroundColor: "orange", display: "flex" }}>
          <FormControl sx={{ m: 1, width: 300 }}>
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
                <MenuItem key={index} value={item} selected={item}>
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

        <div style={{ backgroundColor: "red", display: "flex" }}>
          <FormControl sx={{ m: 1, width: 300 }}>
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
                    onChange={() => handleCheckboxes(item.id)}
                  />
                  <ListItemText primary={item.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            sx={{
              color: "#fff",
              "&:hover": {
                backgroundColor: "#30475E",
                color: "#F05454",
              },
              marginTop: 15,
              marginLeft: 3,
              marginBottom: 45,
              backgroundColor: "#30475E",
              width: 200,
            }}
            onClick={advancedSearch}
          >
            Advanced search
          </Button>
        </div>

        <div style={{ backgroundColor: "pink" }}>
          <Button
            sx={{
              color: "#fff",
              "&:hover": {
                backgroundColor: "#30475E",
                color: "#F05454",
              },
              backgroundColor: "#30475E",
              marginTop: 5,
              marginLeft: "auto",
              marginRight: 15,
              marginBottom: 5,
              alignItems: "right",
              width: 200,
            }}
            component={Link}
            to={`/upload-product`}
          >
            Upload product
          </Button>
        </div>
      </div>

      <PaginatedItems itemsPerPage={9} />
    </div>
  );
}
