import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Generate from "./pages/Generate";
import Profile from "./pages/Profile";
import Plans from "./pages/Plans";
import { useSelector } from "react-redux";
function App() {
  const user = useSelector((state: any) => state.user);
  const verified=user.isLogged;
  return (
    <div className="">
      <Routes>
        <Route path="/login" element={verified?<Generate/>:<Login />} />
        <Route path="/register" element={verified?<Generate/>:<Signup />} />
        <Route path="/" element={verified?<Generate />:<Signup/>} />
        <Route path="/profile" element={verified?<Profile />:<Signup/>} />
        <Route path="/plans" element={verified?<Plans />:<Signup/>} />
      </Routes>
    </div>
  );
}

export default App;
