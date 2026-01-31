"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

import AdminDashboard from "../../components/Admin/AdminDashboard";
import ManageEvents from "../../components/Admin/ManageEvents";
import ManageGallery from "../../components/Admin/ManageGallery";
import ManageProducts from "../../components/Admin/ManageProducts";
import ManageTeam from "../../components/Admin/ManageTeam";

export default function AdminPage() {

    const [activeView, setActiveView] = useState("AdminDashboard"); 

    const renderContent = () => {
        switch (activeView) {
            case "AdminDashboard": return <AdminDashboard />;
            case "ManageEvents": return <ManageEvents />;
            case "ManageGallery": return <ManageGallery />;
            case "ManageProducts": return <ManageProducts />;
            case "ManageTeam": return <ManageTeam />;
            default: return <AdminDashboard />;
        }
    };
    return (
        <div className="flex h-screen overflow-hidden bg-[#121212]">
            <Sidebar role="admin" onNavigate={setActiveView}/>
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header />
                {renderContent()}
            </div>
        </div>
    );
}