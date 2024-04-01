import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import asst from "../assets/White.jpeg";
import { useSelector } from "react-redux";
import axios from "axios";

const Profile = () => {
  const user = useSelector((state: any) => state.user);
  const [images, setImages] = useState<any[]>([]); // Initialize images state with an empty array

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/images/${user.id}`);
        setImages(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []); // Include user.id in the dependency array to trigger effect when user id changes

  return (
    <div className="p-5 flex">
      <div className="min-w-[200px]">
        <Sidebar />
      </div>
      <div className="w-full px-10 items-center justify-center flex ">
        <div className="grid gap-4 w-full max-w-3xl md:min-w-[1000px]">
          <h1 className="text-3xl font-bold tracking-tight lg:text-5xl xl:text-6xl mb-5">
            Profile
          </h1>
          <div className="grid gap-4">
            <div className="flex  gap-2">
              <label className="text-lg mr-20 min-w-24 font-semibold">
                Username
              </label>
              <p className="text-gray-500">{user.username}</p>
            </div>
            <div className="flex  gap-2">
              <label className="text-lg mr-20 min-w-24 font-semibold">
                Email
              </label>
              <p className="text-gray-500">{user.email}</p>
            </div>
            <div className="flex  gap-2">
              <label className="text-lg mr-20 min-w-24 font-semibold">
                Plan
              </label>
              <p className="text-gray-500">{user.plan}</p>
            </div>
          </div>
          <div>
            <p className="text-2xl mb-5 font-bold text-center">
              All generations
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image: any, index: number) => (
                <div className="relative">
                  <div
                    className="aspect-auto object-cover rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800"
                    onMouseEnter={(e) =>
                      e.currentTarget
                        .querySelector(".tooltip")
                        ?.classList.add("opacity-100")
                    }
                    onMouseLeave={(e) =>
                      e.currentTarget
                        .querySelector(".tooltip")
                        ?.classList.remove("opacity-100")
                    }
                  >
                    <img
                      alt="Generated Image"
                      className="w-full h-full"
                      src={image.image_url}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 opacity-0 h-1/3 transition-opacity duration-300 tooltip text-xs overflow-auto hvr">
                    {image.prompt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
