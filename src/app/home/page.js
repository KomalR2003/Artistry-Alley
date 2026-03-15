"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
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
import Cart from "../../components/User/Cart";
import Checkout from "../../components/User/Checkout";
import OrderSuccess from "../../components/User/OrderSuccess";
import MyOrders from "../../components/User/MyOrders";



export default function DashboardPage() {
    const router = useRouter();
    const [activeView, setActiveView] = useState("Home");
    const [orderData, setOrderData] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const role = sessionStorage.getItem('userRole');
        if (role === 'admin') {
            router.push('/admin');
        } else if (role === 'artist') {
            router.push('/artist');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    if (!isAuthorized) {
        return <div className="min-h-screen items-center justify-center bg-white flex">
            <div className="animate-pulse text-[#171C3C]">Loading...</div>
        </div>;
    }

    const handleNavigate = (page, data) => {
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

        // Handle order data for success page
        if (data) {
            setOrderData(data);
        }

        setActiveView(pageMap[page] || page);
    };

    const renderContent = () => {
        switch (activeView) {
            case "Home": return <Home onNavigate={handleNavigate} />;
            case "Dashboard": return <Dashboard onNavigate={handleNavigate} />;
            case "About Us": return <AboutUs onNavigate={handleNavigate} />;
            case "Gallery": return <Gallery />;
            case "Products": return <Products />;
            case "Events": return <Events />;
            case "Our Team": return <OurTeam />;
            case "Blogs": return <Blogs />;
            case "Contact Us": return <ContactUs />;
            case "Cart": return <Cart onNavigate={handleNavigate} />;
            case "Checkout": return <Checkout onNavigate={handleNavigate} />;
            case "OrderSuccess": return <OrderSuccess orderData={orderData} />;
            case "My Orders": return <MyOrders />;
            default: return <Home onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar onNavigate={setActiveView} activeView={activeView} />
            <div className="w-full">
                {renderContent()}
            </div>
        </div>
    );
}
