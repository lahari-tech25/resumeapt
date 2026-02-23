// ---------- File: src/pages/Home.jsx ----------
// Purpose: Landing page with hero section and call-to-action

import React from 'react';
import { Link } from 'react-router-dom';
import Banner from '../components/home/Banner';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Testimonials from '../components/home/Testimonials';
import CallToAction from '../components/home/CallToAction';
import Footer from '../components/home/Footer';

const Home = () => {
  return (
    <>
    <Banner/>
    <Hero/>
    <Features/>
    <Testimonials/>
    <CallToAction/>
    <Footer/>
    
    </>
  );
};


export default Home;