"use client";
import React, { useState, useEffect } from "react";
import { Search, Loader2, CheckCircle, Trash2, ShieldAlert } from "lucide-react";
import Image from "next/image";

export default function ManageComments() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchHiddenComments();
    }, []);

    const fetchHiddenComments = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/comments");
            const data = await res.json();
            if (data.success) {
                setComments(data.comments);
            }
        } catch (error) {
            console.error("Error fetching hidden comments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (galleryId, commentId, action) => {
        const isConfirmed = window.confirm(`Are you sure you want to ${action} this comment?`);
        if (!isConfirmed) return;

        try {
            const res = await fetch("/api/admin/comments", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ galleryId, commentId, action })
            });
            const data = await res.json();
            if (data.success) {
                // Remove the comment from the UI list
                setComments(comments.filter(c => c.commentId !== commentId));
            } else {
                alert(data.message || "Action failed");
            }
        } catch (error) {
            console.error(`Error performing ${action}:`, error);
        }
    };

    const filteredComments = comments.filter(c => 
        c.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full h-full bg-[#FAFAFA] text-[#171C3C] p-8 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-semibold flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8 text-[#E57A6B]" />
                        Moderation Queue
                    </h1>
                    <p className="text-[#171C3C]/70 mt-2">
                        Review AI-flagged comments. Approve them to make them public, or delete permanently.
                    </p>
                </div>
                <div className="relative border border-[#D1CAF2] rounded-xl overflow-hidden flex bg-white w-full md:w-72 shadow-sm focus-within:ring-2 focus-within:ring-[#98C4EC] transition-all">
                    <div className="px-3 py-2 text-[#171C3C]/40 flex items-center">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search comments or users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 py-2.5 pr-4 bg-transparent text-sm focus:outline-none placeholder:text-[#171C3C]/40 font-medium"
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl border border-[#D1CAF2]/40 shadow-sm overflow-hidden min-h-[500px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20 text-[#171C3C]/50 space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-[#98C4EC]" />
                        <p className="font-semibold animate-pulse">Scanning moderation queue...</p>
                    </div>
                ) : filteredComments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 text-[#171C3C]/50">
                        <div className="w-20 h-20 bg-[#f0f9ff] rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-[#4ADE80]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#171C3C]">All Caught Up!</h3>
                        <p className="mt-2 text-sm">No comments require moderation currently.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAFAFA] border-b border-[#D1CAF2]/40 text-[#171C3C]/60 text-xs uppercase tracking-wider font-bold">
                                    <th className="p-5 w-1/4">Art / Item</th>
                                    <th className="p-5 w-1/5">User</th>
                                    <th className="p-5 w-1/3">Flagged Comment</th>
                                    <th className="p-5 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#D1CAF2]/20">
                                {filteredComments.map((comment) => (
                                    <tr key={comment.commentId} className="hover:bg-[#f8fbff] transition-colors group">
                                        <td className="p-5 align-top">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-[#D1CAF2]/40">
                                                    <Image 
                                                        src={comment.galleryImage} 
                                                        alt="Art" 
                                                        fill 
                                                        className="object-cover" 
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm line-clamp-2 text-[#171C3C]">{comment.galleryTitle}</p>
                                                    <p className="text-xs text-[#171C3C]/60 mt-1 uppercase tracking-wider font-semibold opacity-0 group-hover:opacity-100 transition-opacity">ID: {comment.galleryId.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 align-top">
                                            <div className="font-bold text-sm text-[#171C3C]">{comment.userName}</div>
                                            <div className="text-xs text-[#171C3C]/50 mt-1">{new Date(comment.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-5 align-top">
                                            <div className="p-3 bg-red-50 text-red-900 rounded-xl text-sm border border-red-100 font-medium">
                                                "{comment.text}"
                                            </div>
                                        </td>
                                        <td className="p-5 align-top text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => handleAction(comment.galleryId, comment.commentId, 'approve')}
                                                    className="p-2 text-[#4ADE80] bg-[#4ADE80]/10 hover:bg-[#4ADE80] hover:text-white rounded-lg transition-all shadow-sm group-hover:shadow"
                                                    title="Approve Comment"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(comment.galleryId, comment.commentId, 'delete')}
                                                    className="p-2 text-[#E57A6B] bg-[#E57A6B]/10 hover:bg-[#E57A6B] hover:text-white rounded-lg transition-all shadow-sm group-hover:shadow"
                                                    title="Delete Comment"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
