import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import DownloadingIcon from "@mui/icons-material/Downloading";
import api from "../../api";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import JwtHelper from "../../utils/jwt.helper";
import { useAuth } from "../../hooks/useAuth";
import ReactPaginate from "react-paginate";
import "./styles.css";

export default function PurchasedProducts() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState("");
  const [isLoading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(async () => {
    checkIfUsersPage();
    await getPurchasedProducts();
  }, []);

  const checkIfUsersPage = () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;

    if (id !== jwtUserId) {
      navigate("/");
    }
  };

  const getPurchasedProducts = async () => {
    const response = await api.products.getPurchasedProducts(id);

    if (response.status === 200) {
      setProducts(response.data);
    } else {
      alert(response.errorMessage);
    }
    setLoading(false);
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
                  <TableCell align="left">Download</TableCell>
                  <TableCell align="left" sx={{ paddingLeft: 3 }}>
                    Product page
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {product.name}
                    </TableCell>
                    <TableCell align="left">
                      <Button
                        sx={{ color: "black" }}
                        component={Link}
                        to={`/product-download/${product.id}`}
                      >
                        <DownloadingIcon />
                      </Button>
                    </TableCell>
                    <TableCell align="left">
                      <Button
                        sx={{ color: "black", fontSize: 13 }}
                        component={Link}
                        to={`/product/${product.id}`}
                      >
                        Redirect
                      </Button>
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
        <div>
          <Items currentItems={currentItems} />
          <ReactPaginate
            breakLabel="..."
            nextLabel=" >"
            previousLabel="< "
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
            containerClassName="purchasedProductPagination"
            activeClassName="active"
          />
        </div>
      </>
    );
  }

  return (
    <div className="flexContainer mt40">
      <div
        style={{
          marginTop: 20,
          width: "100%",
        }}
      >
        <Typography
          variant="h3"
          align="center"
          style={{ width: "100%", alignItems: "center" }}
        >
          My bought products
        </Typography>
        <Typography
          variant="h6"
          align="center"
          style={{ width: "100%", alignItems: "center" }}
        >
          Here you can find all of your bought products for download
        </Typography>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {products && products.length > 0 ? (
            <div style={{ paddingTop: 30 }}>
              <PaginatedTable itemsPerPage={6} />
            </div>
          ) : (
            <div className="flexContainer">
              <Typography
                variant="h5"
                align="center"
                style={{ width: "100%", alignItems: "center", paddingTop: 10 }}
              >
                No bought products are available
              </Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
