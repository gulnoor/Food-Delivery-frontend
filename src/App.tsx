import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import MenuPage from "./components/MenuPage";
import HomePage from "./components/HomePage";
import RegistrationForm from "./components/RegistrationForm";
import { useContext, useEffect } from "react";
import { UserContext, zodUserSchema } from "./context/contexts";
import axios from "axios";
import { toast, Toaster } from "./components/ui/toast";
import CheckoutPage from "./components/CheckoutPage";
import Cart from "./components/Cart/Cart";

const AuthenticateToken = async (
  setUser:
    | React.Dispatch<
        React.SetStateAction<{
          id: string;
          name: string;
          token: string;
        } | null>
      >
    | undefined,
  missionAbort: boolean,
) => {
  const userJSON = window.localStorage.getItem("loggedInUser");
  if (userJSON) {
    try {
      const user = zodUserSchema.parse(JSON.parse(userJSON));
      const response = await axios.get("/api/customer/me", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!missionAbort && setUser) {
        if (response.status === 200) {
          setUser(user);
        } else {
          setUser(null);
        }
      }
    } catch (error: unknown) {
      // todo:
      toast.add({
        description: error.response.data.message,
        title: error.response.data.name,
        type: "error",
      });
      console.log(error);
    }
  }
};

function App() {
  // console.log("rendering App...");
  const userContext = useContext(UserContext);
  const setUserContext = userContext?.setUser;

  useEffect(() => {
    let effectCancelled = false;
    void AuthenticateToken(setUserContext, effectCancelled);
    return () => {
      effectCancelled = true;
    };
  }, []);

  if (!userContext) {
    console.log("NO user context");

    return null;
  }
  return (
    <>
      <Toaster />
      {userContext.user && <h3>logged User {userContext.user.name}</h3>}
      <nav>
        <Link to={"/menu"}>Menu</Link>
        <Link to={"/"}>Home</Link>
        <Link to={"/register"}>Register</Link>
        <Link to={"/cart"}>Cart</Link>
      </nav>
      <Routes>
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
    </>
  );
}

export default App;
