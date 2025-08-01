import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/signup";
import Signin from "./components/signin";
import Home from "./components/home";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="user/signup" />} />
        <Route path="/home" element={<Home />} />
        <Route path="user/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </div>
  );
}     