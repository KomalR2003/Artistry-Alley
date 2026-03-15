"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

import MyDashboard from "../../components/Artist/MyDashboard";
import MyProducts from "../../components/Artist/MyProducts";
import MyEvents from "../../components/Artist/MyEvents";
import MyGallery from "../../components/Artist/MyGallery";
import MyPortfolio from "../../components/Artist/MyPortfolio";
import MyOrders from "../../components/Artist/MyOrders";

const ArtistPage = () => {
    const router = useRouter();
    const [activeView, setActiveView] = useState("MyDashboard");
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const role = sessionStorage.getItem('userRole');
        if (!role) {
            router.push('/login');
        } else if (role !== 'artist') {
            const redirectPath = role === 'admin' ? '/admin' : '/home';
            router.push(redirectPath);
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    if (!isAuthorized) {
        return <div className="flex h-screen items-center justify-center bg-[#121212]">
            <div className="animate-pulse text-white">Loading...</div>
        </div>;
    }


    const renderContent = () => {
        switch (activeView) {
            case "MyDashboard": return <MyDashboard />;
            case "MyProducts": return <MyProducts />;
            case "MyEvents": return <MyEvents />;
            case "MyGallery": return <MyGallery />;
            case "MyPortfolio": return <MyPortfolio />;
            case "MyOrders": return <MyOrders />;
            default: return <MyDashboard />;
        }
    }
    return (
        <div className="flex h-screen overflow-hidden bg-[#121212]">
            <Sidebar role="artist" onNavigate={setActiveView} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header />
                {renderContent()}
            </div>
        </div>
    )
}

export default ArtistPage;
