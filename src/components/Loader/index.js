import {CircularProgress} from "@mui/material";
import "./styles.css";

const Loader = () => {
  return (
    <div className="flexContainer mt200">
      <CircularProgress color="inherit" />
    </div>
  );
};

export default Loader;
