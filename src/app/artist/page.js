"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

import MyDashboard from "../../components/Artist/MyDashboard";
import MyProducts from "../../components/Artist/MyProducts";
import MyEvents from "../../components/Artist/MyEvents";
import MyGallery from "../../components/Artist/MyGallery";
import MyPortfolio from "../../components/Artist/MyPortfolio";

const ArtistPage = () => {

    const [activeView, setActiveView] = useState("MyDashboard");

    const renderContent = () => {
        switch (activeView) {
            case "MyDashboard": return <MyDashboard />;
            case "MyProducts": return <MyProducts />;
            case "MyEvents": return <MyEvents />;
            case "MyGallery": return <MyGallery />;
            case "MyPortfolio": return <MyPortfolio />;
            default: return <MyDashboard />;    
        }
    }
  return (
    <div className="flex h-screen overflow-hidden bg-[#121212]">
               <Sidebar role="artist" onNavigate={setActiveView}/>
               <div className="flex-1 flex flex-col h-screen overflow-hidden">
                   <Header />
                   {renderContent()}
               </div>
           </div>
  )
}

export default ArtistPage;
