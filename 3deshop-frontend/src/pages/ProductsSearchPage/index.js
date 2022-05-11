import React, { useEffect, useState } from "react";
import Product from "../../components/Product";
import "./styles.css";
import api from "../../api";
import { Tiles } from "@rebass/layout";
import { useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function ProductsSearch() {
  const [products, setProducts] = useState([]);
  let { state } = useLocation();
  const [orderText, setOrderText] = useState("");

  useEffect(async () => {
    await searchForProducts();
  }, []);

  const searchForProducts = async () => {
    const request = {
      name: state.productName,
      formats: state.productFormats,
      categories: state.productCategories,
      specifications: state.productSpecifications,
    };
    const response = await api.products.getProductsByGivenCriteria(request);

    if (response.status === 200) {
      if (response.data.length === 0) {
        alert("No products were found by given criteria");
      }
      setProducts(response.data);
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

  function getProductIds() {
    return products.map((product) => {
      return product.id;
    });
  }
  const getProductsOrderByPrice = async (ascending) => {
    const ids = getProductIds();
    const request = { productIds: ids, ascending: ascending };
    const products = await api.products.getProductsByGivenIdsAndOrderByPrice(
      request
    );

    if (products.status === 200) {
      setProducts(products.data);
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  const getProductsOrderByUploadDate = async (ascending) => {
    const ids = getProductIds();
    const request = { productIds: ids, ascending: ascending };
    const products = await api.products.getProductsByGivenIdsAndOrderByDate(
      request
    );

    if (products.status === 200) {
      setProducts(products.data);
    } else {
      console.log("error at products, didn't return 200");
    }
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
          justifyContent: "right",
          width: "80%",
          marginBottom: 20,
        }}
      >
        <FormControl
          fullWidth
          style={{
            position: "relative",
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
    </div>
  );
}
