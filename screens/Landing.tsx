"use client"
import React, { useState } from "react";
import styled from "styled-components";
import HeroBg from "@/assets/img/hero-bg.png";
// Sections
import TopNavbar from "@/components/Nav/TopNavbar";
import Header from "@/components/Sections/Header";
import AboutUs from "@/components/Sections/AboutUs";
import Pricing from "@/components/Sections/Pricing";
import Contact from "@/components/Sections/Contact";
import Footer from "@/components/Sections/Footer";
import Features from "@/components/Sections/features";
import Services from "@/components/Sections/Services";
import Merchandise from "@/components/Sections/Merchandise";
import Events from "@/components/Sections/events";

export default function Landing() {
  const [newPlan, setNewPlan] = useState();
  const planSelectHandler = (plan:any) => {
    if(plan){
      setNewPlan(plan);
    }
  };
  return (
    <>
      <HeroWrapper>
        <TopNavbar selectedPlan={newPlan} />
        <Header />
      </HeroWrapper>
      <AboutUs />
      <Features />
      <Services />
      <Merchandise />
      <Events />
      <Pricing planSelectHandler={planSelectHandler} />
      <Contact />
      <Footer />
    </>
  );
}

const HeroWrapper = styled.section`
  background-image: url(${HeroBg.src});
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  background-size: cover;
  position: relative;
  z-index: 9;
`;
