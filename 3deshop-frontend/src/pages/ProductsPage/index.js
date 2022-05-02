import React, { useEffect, useState } from "react";
import Product from "../../components/Product";
import "./styles.css";
import api from "../../api";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Tiles } from "@rebass/layout";
import { Link } from "react-router-dom";
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
  const [productSearchName, setProductSearchName] = useState("");

  const specifications = ["Textures", "Rig", "Animation", "Materials"];
  const [selectedSpecificationValues, setSelectedSpecificationValues] =
    useState([]);

  useEffect(async () => {
    await getProducts();
  }, []);

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
    console.log(value);
  };

  const handleSpecificationChange = (e) => {
    const {
      target: { value },
    } = e;
    setSelectedSpecificationValues(
      typeof value === "string" ? value.split(",") : value
    );
    console.log(value);
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
              Specification
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={selectedSpecificationValues}
              onChange={handleSpecificationChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {specifications.map((value) => (
                <MenuItem key={value} value={value}>
                  <Checkbox
                    checked={selectedSpecificationValues.indexOf(value) > -1}
                  />
                  <ListItemText primary={value} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
