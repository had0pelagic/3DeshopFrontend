import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/RegisterPage";
import Home from "./pages/HomePage";

export default function App() {
  // return <Register />;
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </Router>
  );
}
