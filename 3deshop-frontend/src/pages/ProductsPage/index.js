import React, { useEffect, useState } from "react";
import Product from "../../components/Product";
import "./styles.css";
import api from "../../api";
import { Tiles } from "@rebass/layout";

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
      <Tiles columns={[1, 2, 3, 4]}>
        {products.map((product, index) => (
          <Product
            id={product.id}
            name={product.name}
            categories={product.categories}
            creator={product.username}
            price={product.price}
            image={product.image}
          />
        ))}
      </Tiles>
    </div>
  );
}
