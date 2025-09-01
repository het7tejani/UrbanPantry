import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedProducts from '../components/FeaturedProducts';
import CategoryGrid from '../components/CategoryGrid';
import TestimonialSection from '../components/TestimonialSection';

const HomePage = ({ onViewProduct, navigate }) => (
    <>
        <HeroSection />
        <FeaturedProducts onViewProduct={onViewProduct} />
        <CategoryGrid navigate={navigate} />
        <TestimonialSection />
        
    </>
);

export default HomePage;