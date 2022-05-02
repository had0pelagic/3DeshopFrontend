import React, { useEffect, useState } from "react";
import Product from "../../components/Product";
import "./styles.css";
import api from "../../api";
import { Tiles } from "@rebass/layout";
import { useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

export default function ProductsSearch() {
  const { name } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(async () => {
    await searchForProduct(name);
  }, []);

  const searchForProduct = async (name) => {
    const products = await api.products.getProductByName(name);

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

  return (
    <div className="flexContainer p50">
      <PaginatedItems itemsPerPage={9} />
    </div>
  );
}
