import React from "react";
import Sidebar from "../components/Sidebar";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useSelector } from "react-redux";
const Plans = () => {
  const user = useSelector((state: any) => state.user);
  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51O6nfKSAzoRdphrHspt66GqPlu0Y08QTS5hukyi2rgfp4XzGohcl3hZOt6uRHVKBG8oPQ3nSS10YrrFDvr563M7p009xudPYPO"
    );

    const res = await axios.post(`http://localhost:5000/payment/${user.id}`);

    if (res.status === 200) {
      const session = await res.data;
      console.log(session);
      window.location.href = session.url;
    
    }
  };
  return (
    <section className="w-full   p-5">
      <div className="min-w-[200px]">
        <Sidebar />
      </div>
      <div className="container px-4 md:px-6 flex items-center justify-center flex-col">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mt-10">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">
              Plans that scale with you
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Simple, transparent pricing
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Get started for free and upgrade as you grow. Cancel anytime.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-sm items-start gap-8 sm:max-w-4xl md:gap-12 lg:max-w-5xl lg:grid-cols-2 lg:gap-16 mt-5">
          <div
            className="rounded-lg border bg-card text-card-foreground shadow-sm"
            data-v0-t="card"
          >
            <div className="flex flex-col space-y-1.5 p-6 border-b">
              <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">
                Free
              </h3>
              <p className="text-sm text-muted-foreground">
                Start with free plan
              </p>
            </div>
            <div className="p-6 grid gap-2 text-2xl font-bold">
              
              <span>- Generate 10 images</span>
             
              <span>- Slow Generation Speed</span>
              <span>- low Quality Image</span>
            </div>
           
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-[#7C30FF] text-white">
            <div className="flex flex-col space-y-1.5 p-6 border-b">
              <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">
                Premium
              </h3>
              <p className="text-sm text-muted-foreground">
                Get the full Imagine experience
              </p>
            </div>
            <div className="p-6 grid gap-2 text-2xl font-bold">
              <span>- Unlimited generations</span>

              <span>- High quality image</span>
              <span>- Faster generations</span>
            </div>
            <div className="flex items-center p-6">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full bg-white text-[#7C30FF] text-xl" onClick={makePayment}>
                Pay $100
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Plans;
