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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/index.js";
import api from "../../api";
import "filepond/dist/filepond.min.css";
import ReactPaginate from "react-paginate";
import JwtHelper from "../../utils/jwt.helper";
import { useAuth } from "../../hooks/useAuth";

export default function UserProducts() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [IsLoadingProducts, setLoadingProducts] = useState(true);
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [currentProductId, setCurrentProductId] = useState("");
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const handleConfirmationDialogOpen = (id) => {
    setCurrentProductId(id);
    setOpenConfirmationDialog(true);
  };
  const handleConfirmationDialogClose = () => {
    setOpenConfirmationDialog(false);
  };

  useEffect(async () => {
    checkIfUsersPage();
    await getUserProducts();
  }, []);

  const checkIfUsersPage = () => {
    const token = getToken().data;
    const jwtUserId = JwtHelper.getUser(token).userId;

    if (id !== jwtUserId) {
      navigate("/");
    }
  };

  const getUserProducts = async () => {
    const response = await api.products.getUserProducts(id);

    if (response.status === 200) {
      setProducts(response.data);
    } else {
      alert(response.errorMessage);
    }
    setLoadingProducts(false);
  };

  const changeProductStatus = async () => {
    const response = await api.products.changeProductStatus(currentProductId);

    if (response.status === 200) {
      window.location.reload();
    } else {
      alert(response.errorMessage);
    }
  };

  function Items({ currentItems }) {
    return (
      <>
        {currentItems && (
          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table
              sx={{ minWidth: 650, maxWidth: 1000 }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="left"></TableCell>
                  <TableCell align="left" sx={{ paddingLeft: 4 }}>
                    Active
                  </TableCell>
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
                    {console.log(item)}
                    <TableCell align="left">
                      <Button>
                        {item.isActive === true ? (
                          <CheckIcon
                            sx={{ color: "green" }}
                            onClick={() =>
                              handleConfirmationDialogOpen(item.id)
                            }
                          />
                        ) : (
                          <CloseIcon
                            sx={{ color: "red" }}
                            onClick={() =>
                              handleConfirmationDialogOpen(item.id)
                            }
                          />
                        )}
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
          <h1>My products</h1>

          {products && products.length > 0 ? (
            <div
              className="flexContainer"
              style={{ marginLeft: 30, marginRight: 30 }}
            >
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
                    marginLeft: "auto",
                    marginRight: 0,
                    marginBottom: 5,
                    alignItems: "right",
                    width: 200,
                  }}
                  component={Link}
                  to={`/upload-product`}
                >
                  Add new product
                </Button>
              </div>
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

          <Dialog
            open={openConfirmationDialog}
            onClose={handleConfirmationDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Order completion"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {"Are you sure you want to change this product status?"}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={async () => await changeProductStatus()}
                color="primary"
                autoFocus
              >
                {"Yes"}
              </Button>
              <Button onClick={handleConfirmationDialogClose} color="primary">
                {"No"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
}
