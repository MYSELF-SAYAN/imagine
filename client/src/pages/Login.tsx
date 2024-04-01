import React, { useState, useEffect } from "react";
import asst from "../assets/Collage.png";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { signIn } from "../store/slices/userSlice";
import { generate } from "../store/slices/generationSlice";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notify = () => {
    console.log("notify");
    toast.error("Invalid email or password", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      //transition: Bounce,
    });
  };
  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email: email,
        password: password,
      });
      dispatch(
        signIn({
          id: res.data._id,
          email: res.data.email,
          username: res.data.username,
          plan: res.data.plan,
          password: res.data.password,
          isLogged: true,
        })
      );
      dispatch(generate({ generations: res.data.generations }));
      navigate("/");
     // console.log(res.data);
    } catch (err) {
      notify();
      console.log(err);
    }
  };
  return (
    <div className="flex items-center justify-center  h-[100vh] w-[100vw]  bg-gray-50">
      <div
        key="1"
        className="w-full py-12 bg-gray-50 flex items-center justify-center"
      >
        <div className="container grid max-w-6xl items-start gap-6 px-4 md:grid-cols-2 md:gap-10 lg:px-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl mb-5 font-bold tracking-tight sm:text-5xl xl:text-6xl">
                Log In
              </h1>
              <p className="max-w-[600px] font-semibold text-gray-500 md:text-2xl dark:text-gray-400">
                Unleash your creativity and show your imagination to the whole
                world with
                <span className="text-[#7C30FF] ml-2 text-3xl font-bold">
                  Imagine
                </span>
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2 flex flex-col">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 bg-white px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C30FF] focus:border-transparent"
                />
              </div>
              <div className="space-y-2 flex flex-col">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 bg-white px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C30FF] focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-5">
                <button
                  className="border-gray-300 bg-[#7C30FF] p-2 px-5 rounded-md text-white"
                  onClick={login}
                >
                  Log in
                </button>
                <p className="text-md font-semibold ">
                  Dont't have a account?{" "}
                  <Link to="/register">
                  <span className="text-[#7C30FF] cursor-pointer">Sign Up</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <img
            alt="Image"
            className="rounded-xl object-cover aspect-image"
            height={420}
            src={asst}
            width={700}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
