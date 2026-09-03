import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import MenuPage from "./components/MenuPage";
import HomePage from "./components/HomePage";

function App() {
  
  return (
    <>
      <nav>
        <Link to={"/menu"}>Menu</Link>
        <Link to={"/"}>Home</Link>
      </nav>
      <Routes>
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
