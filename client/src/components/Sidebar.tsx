import React from "react";
import { WiStars } from "react-icons/wi";
import { GiMagicBroom } from "react-icons/gi";
import { MdPerson } from "react-icons/md";
import { AiFillHdd } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";
import { useSelector,useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { delgenerate } from "../store/slices/generationSlice";
import { logOut } from "../store/slices/userSlice";
const Sidebar = () => {
  const generate = useSelector((state: any) => state.generation);
  const user=useSelector((state:any)=>state.user);
  const dispatch = useDispatch();
  return (
    <div className="min-h-[95vh] max-h-[95vh] rounded-3xl min-w-[200px] max-w-[200px] bg-[#7C30FF] border-r border-r-[#7C30FF] fixed">
      <div>
        <div className="items-center justify-center flex p-6 border-b border-b-white mb-5">
          <div className=" text-2xl text-white flex ">
            <p className=" font-bold">Imagine</p>
            <span className="flex items-center justify-center ml-1  text-4xl text-[#FFD700]">
              <WiStars />
            </span>
          </div>
        </div>
        <div>
          <ul>
            <Link to="/">
            <li className="flex text-white text-xl mb-5 px-5 cursor-pointer font-medium">
              <span className="flex items-center justify-center mr-3">
                <GiMagicBroom />
              </span>
              <p>Generate</p>
            </li>
            </Link>
            <Link to="/profile">
            <li className="flex text-white text-xl mb-5 px-5 cursor-pointer font-medium">
              <span className="flex items-center justify-center mr-3">
                <MdPerson />
              </span>
              <p>Profile</p>
            </li>
            </Link>
            <Link to="/plans">
            <li className="flex text-white text-xl mb-5 px-5 cursor-pointer font-medium">
              <span className="flex items-center justify-center mr-3">
                <AiFillHdd />
              </span>
              <p>Plans</p>
            </li>
            </Link>
            <li className="flex text-white text-xl mb-5 px-5 cursor-pointer font-medium" onClick={()=>{dispatch(logOut())}}>
              <span className="flex items-center justify-center mr-3">
                <CiLogout />
              </span>
              <p>Log Out</p>
            </li>
          </ul>
        </div>
      </div>
      <div className=" absolute bottom-5">
        {user.plan ==="free" &&  <div className="flex flex-col text-lg text-white items-center justify-center mb-3">
          <p>Free Generations</p>
          <div>
            {generate.generations} of 10
          </div>
        </div>}
       
        <p className="text-white text-sm text-center mt-5">
          &copy; 2024 Imagine. All rights reserved by Sayan
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
