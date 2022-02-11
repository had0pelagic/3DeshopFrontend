import React, { useEffect, useState } from "react";
import Product from "../../components/Product";
import "./styles.css";

export default function Products() {
  // const [state, setState] = useState({
  //   username: "",
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   password: "",
  //   confirmPassword: "",
  // });

  // const handleChange = (e) => {
  //   const { id, value } = e.target;
  //   setState((prevState) => ({
  //     ...prevState,
  //     [id]: value,
  //   }));
  // };

  // const handleSubmitClick = (e) => {
  //   e.preventDefault();
  //   if (state.password === state.confirmPassword) {
  //     console.log("registering");
  //   } else {
  //     console.log("error, passwords are not matching");
  //   }
  // };

  // useEffect(() => {
  //   console.log(state);
  // }, [state]);

  return (
    <div className="flexContainer">
      <Product
        name={"Cube"}
        categories={"Airplane, architecture"}
        creator={"noj"}
        price={"10"}
        imageUrl={
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Necker_cube.svg/1200px-Necker_cube.svg.png"
        }
      />
      <Product
        name={"Sphere"}
        categories={"Architecture"}
        creator={"noj"}
        price={"100"}
        imageUrl={
          "https://thumbs.dreamstime.com/b/blue-wireframe-sphere-isolated-white-background-blue-wireframe-sphere-isolated-white-background-d-rendering-120885605.jpg"
        }
      />
    </div>
  );
}
