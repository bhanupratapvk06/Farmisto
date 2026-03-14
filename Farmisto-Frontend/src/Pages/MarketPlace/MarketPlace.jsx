import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import MarketHeader from "../../Components/Header/MarketHeader";
import TwoCards from "./TwoCards";
import BuyBlock from "./BuyBlock";
import Footer from "../../Components/Footer/Footer";

const MarketPlace = () => {
  return (
    <div className="w-full bg-cream">
      <NavBar />
      <MarketHeader />
      <TwoCards />
      <BuyBlock />
      <Footer />
    </div>
  );
};

export default MarketPlace;
