import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import asst from "../assets/Magic.jpeg";
import "../App.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { generate } from "../store/slices/generationSlice";
interface ImageData {
  image_url: string;
  prompt: string;
}

const Generate = () => {
  const user = useSelector((state: any) => state.user);
  const generating = useSelector((state: any) => state.generation);
  const dispatch = useDispatch();
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const subscribe = () => {
    console.log("notify");
    toast.error(
      "Generation limit reached. Upgrade to premium to get unlimited generations",
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  };
  const generateImage = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/generate/${user.id}`,
        {
          prompt: prompt,
        }
      );
      console.log(res.data);
      setGeneratedImage(res.data.image_url);
      setLoading(false);
      setPrompt("");
      setImages((prevImages) => [
        { image_url: res.data.image_url, prompt: prompt },
        ...prevImages,
      ]);
      dispatch(generate({ generations: generating.generations + 1 }));
    } catch (error: any) {
      console.error(error);
      error.response.status === 403 ? subscribe() : console.log(error);
      setPrompt("");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      const res = await axios.get("http://localhost:5000/all_images");
      setImages(res.data);
    };
    fetchImages();
  }, []);

  return (
    <div className="p-5 flex">
      <div className="min-w-[200px]">
        <Sidebar />
      </div>

      <div className="w-full  ">
        <div className="flex min-h-screen flex-col">
          <main className="flex-1 flex flex-col items-center justify-center w-full mx-auto px-4 pb-4 text-center">
            <div className="grid gap-4 w-full max-w-3xl">
              <div className="grid gap-2">
                <h1 className="text-3xl font-bold tracking-tight lg:text-5xl xl:text-6xl">
                  Generate with <span className="text-[#7C30FF]">Imagine</span>
                </h1>
                <p className="text-gray-500   md:mx-auto dark:text-gray-400 mt-5 text-2xl">
                  Enter a prompt and let our AI generate an image for you. The
                  possibilities are endless.
                </p>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:gap-4 w-full">
                <input
                  className="flex-1  h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-full md:w-auto"
                  placeholder="Enter a prompt..."
                  type="text"
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button
                  className="w-full md:w-auto border-gray-300 bg-[#7C30FF] p-2 px-5 rounded-md text-white"
                  onClick={generateImage}
                >
                  Generate
                </button>
              </div>
              {loading ? (
                <div
                  role="status"
                  className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center justify-center"
                >
                  <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                    <svg
                      className=" text-gray-200 dark:text-gray-600"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                    </svg>
                  </div>

                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <div className="grid gap-4 justify-center">
                  <img
                    alt="Generated Image"
                    className="aspect-auto object-cover rounded-lg overflow-hidden border max-h-[500px] border-gray-200 dark:border-gray-800"
                    src={
                      generatedImage === ""
                        ? "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bm8lMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D"
                        : generatedImage
                    }
                  />
                </div>
              )}
            </div>
            <div className="grid gap-4 w-full max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight">
                All Generations
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image: ImageData, index: number) => (
                  <div className="relative" key={index}>
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
          </main>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Generate;
