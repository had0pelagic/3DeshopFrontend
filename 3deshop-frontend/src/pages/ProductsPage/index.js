import React, { useEffect, useState } from "react";
import Product from "../../components/Product";
import "./styles.css";
import Grid from "@mui/material/Grid";
import api from "../../api";

export default function Products() {
  const [products, setProducts] = useState([]);

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

  return (
    <div className="flexContainer p50">
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 2, sm: 3, md: 10 }}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {products.map((product, index) => (
          <Grid item xs={2} sm={2} md={2} key={index}>
            <Product
              id={product.id}
              name={product.name}
              categories={product.categories}
              creator={product.username}
              price={product.price}
              imageUrl={product.imageUrl}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
