import React from "react";
import Hero from "../Components/Hero";
import Featured from "../Components/Featured";
import About from "../Components/About";
import Founder from "../Components/Founder";
import CTA from "../Components/CTA";
import Causes from "../Components/Causes";
import Volunteer from "../Components/Volunteer";
import News from "../Components/News";

import Contact from "../Components/Contact";
// import Donate from "../Components/Donate";

const Home =() => {

  return ( 

    <>
    <Hero />
    <Featured/>
    <About/>
  <Founder/>
    <CTA/>
    <Causes/>
  <Volunteer/>
 <News/>
 
  <Contact/>
{/* <Donate/> */}
</>

  )
}

export default Home 