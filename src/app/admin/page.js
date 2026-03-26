"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

import AdminDashboard from "../../components/Admin/AdminDashboard";
import ManageEvents from "../../components/Admin/ManageEvents";
import ManageGallery from "../../components/Admin/ManageGallery";
import ManageProducts from "../../components/Admin/ManageProducts";
import ManageTeam from "../../components/Admin/ManageTeam";
import ManageComments from "../../components/Admin/ManageComments";

export default function AdminPage() {
    const router = useRouter();
    const [activeView, setActiveView] = useState("AdminDashboard");
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const role = sessionStorage.getItem('userRole');
        if (!role) {
            router.push('/login');
        } else if (role !== 'admin') {
            const redirectPath = role === 'artist' ? '/artist' : '/home';
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
            case "AdminDashboard": return <AdminDashboard />;
            case "ManageEvents": return <ManageEvents />;
            case "ManageGallery": return <ManageGallery />;
            case "ManageProducts": return <ManageProducts />;
            case "ManageTeam": return <ManageTeam />;
            case "ManageComments": return <ManageComments />;
            default: return <AdminDashboard />;
        }
    };
    return (
        <div className="flex h-screen overflow-hidden bg-[#121212]">
            <Sidebar role="admin" onNavigate={setActiveView} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header />
                {renderContent()}
            </div>
        </div>
    );
}
