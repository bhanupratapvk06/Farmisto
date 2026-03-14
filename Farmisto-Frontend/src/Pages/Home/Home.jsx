import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import HomeHeader from "../../Components/Header/HomeHeader";
import Footer from "../../Components/Footer/Footer";
import {
  MarqueeStrip,
  ProduceShowcase,
  AvocadoFeature,
  ProduceGrid,
  Testimonials,
} from "../../Components/HomeSections/HomeSections";

const Home = () => {
  return (
    <div className="relative w-full min-h-screen bg-cream">
      <NavBar />
      <HomeHeader />
      <MarqueeStrip />
      <ProduceShowcase />
      <AvocadoFeature />
      <ProduceGrid />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
