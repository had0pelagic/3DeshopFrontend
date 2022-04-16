import React, { useEffect, useState } from "react";
import Product from "../../components/Product";
import "./styles.css";
import api from "../../api";
import Button from "@mui/material/Button";
import { Tiles } from "@rebass/layout";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(async () => {
    await getProducts();
  }, []);

  const getProducts = async () => {
    const products = await api.products.getProducts();
    if (products.status === 200) {
      console.log(products.data)
      setProducts(products.data);
    } else {
      console.log("error at products, didn't return 200");
    }
  };

  return (
    <div className="flexContainer p50">
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
      </Button>{" "}
      <Tiles columns={[1, 2, 3, 4]}>
        {products.map((product) => (
          <Product
            id={product.id}
            name={product.name}
            categories={product.categories}
            creator={product.user}
            price={product.price}
            image={product.image}
          />
        ))}
      </Tiles>
    </div>
  );
}
