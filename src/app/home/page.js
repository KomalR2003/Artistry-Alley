"use client";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";

import Home from "../../components/User/Home";
import Dashboard from "../../components/User/Dashboard";
import AboutUs from "../../components/User/AboutUs";
import Gallery from "../../components/User/Gallery";
import Products from "../../components/User/Products";
import Events from "../../components/User/Events";
import OurTeam from "../../components/User/OurTeam";
import Blogs from "../../components/User/Blogs";
import ContactUs from "../../components/User/ContactUs";



export default function DashboardPage() {
    const [activeView, setActiveView] = useState("Home");

    const handleNavigate = (page) => {
        const pageMap = {
            'home': 'Home',
            'aboutus': 'About Us',
            'gallery': 'Gallery',
            'products': 'Products',
            'events': 'Events',
            'team': 'Our Team',
            'blogs': 'Blogs',
            'contact': 'Contact Us'
        };
        setActiveView(pageMap[page] || 'Home');
    };

    const renderContent = () => {
        switch (activeView) {
            case "Home": return <Home onNavigate={handleNavigate} />;
            case "Dashboard": return <Dashboard />;
            case "About Us": return <AboutUs onNavigate={handleNavigate} />;
            case "Gallery": return <Gallery />;
            case "Products": return <Products />;
            case "Events": return <Events />;
            case "Our Team": return <OurTeam />;
            case "Blogs": return <Blogs />;
            case "Contact Us": return <ContactUs />;
            default: return <Home onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar onNavigate={setActiveView} />
            <div className="w-full">
                {renderContent()}
            </div>
        </div>
    );
}