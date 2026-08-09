import React from "react";
import animationData from "../assets/animations/success.json";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import LottiePlayer from "../components/Layout/LottiePlayer";

const OrderSuccessPage = () => {
  return (
    <div>
      <Header />
      <Success />
      <Footer />
    </div>
  );
};

const Success = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <LottiePlayer animationData={animationData} height={300} width={300} />
      <h2 className="text-2xl font-semibold mt-4">Order Placed Successfully</h2>
    </div>
  )
}

export default OrderSuccessPage;
