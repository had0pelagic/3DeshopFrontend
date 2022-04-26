import React, { useState, useEffect } from "react";
import "./styles.css";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/Loader/index.js";
import api from "../../api";
import "filepond/dist/filepond.min.css";
import ReactPaginate from "react-paginate";

export default function UserProducts() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [IsLoadingProducts, setLoadingProducts] = useState(true);

  useEffect(async () => {
    await getUserProducts();
  }, []);

  const getUserProducts = async () => {
    const response = await api.products.getUserProducts(id);

    if (response.status === 200) {
      setProducts(response.data);
      console.log("Products returned!");
    } else {
      console.log("error at products, didn't return 200");
    }
    setLoadingProducts(false);
  };

  function Items({ currentItems }) {
    return (
      <>
        {currentItems && (
          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {item.name}
                    </TableCell>
                    <TableCell align="left">
                      <Typography component={Link} to={`/product/${item.id}`}>
                        Product page
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </>
    );
  }

  function PaginatedTable({ itemsPerPage }) {
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
        <Items currentItems={currentItems} />
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

  return (
    <div className="flexContainer">
      {IsLoadingProducts ? (
        <Loader />
      ) : (
        <div className="flexContainer">
          <h1>User products</h1>

          {products && products.length > 0 ? (
            <div
              className="flexContainer"
              style={{ marginLeft: 30, marginRight: 30 }}
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
                  marginLeft: "auto",
                  marginRight: 15,
                  marginBottom: 5,
                  alignItems: "right",
                  width: 200,
                }}
                component={Link}
                to={`/upload-product`}
              >
                Add new product
              </Button>

              <PaginatedTable itemsPerPage={6} />
            </div>
          ) : (
            <div className="flexContainer">
              <h2>You don't have any uploaded products</h2>
              <Button
                sx={{
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#30475E",
                    color: "#F05454",
                  },
                  backgroundColor: "#30475E",
                  marginTop: 1,
                  marginBottom: 5,
                  alignItems: "center",
                  width: 200,
                }}
                component={Link}
                to={`/upload-product`}
              >
                Add new product
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
