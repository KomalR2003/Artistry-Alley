"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Send, User as UserIcon, Plus, X, Search, CheckCheck, RefreshCw, MessageSquarePlus } from "lucide-react";

export default function MessageDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [availableArtists, setAvailableArtists] = useState([]);
  const [isFetchingArtists, setIsFetchingArtists] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize current user
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const username = sessionStorage.getItem("username");
    const userRole = sessionStorage.getItem("userRole");
    
    if (userId) {
      setCurrentUser({ _id: userId, username, role: userRole });
    }
  }, []);

  // Fetch conversations
  useEffect(() => {
    if (!currentUser) return;
    const fetchConversations = async () => {
      try {
        const res = await fetch(`/api/messages/conversations?userId=${currentUser._id}`);
        const data = await res.json();
        if (data.success) {
          setConversations(data.conversations);
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };
    fetchConversations();
    // Removed setInterval polling to prevent infinite API calls
  }, [currentUser]);

  // Fetch active conversation messages
  useEffect(() => {
    if (!currentUser || !activeConversation) return;
    
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${activeConversation._id}?userId=${currentUser._id}`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
          scrollToBottom();
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
    // Removed setInterval polling to prevent infinite API calls
  }, [currentUser, activeConversation]);

  const forceRefresh = async () => {
    if (!currentUser) return;
    
    // Refresh Conversations
    try {
      const res = await fetch(`/api/messages/conversations?userId=${currentUser._id}`);
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (err) {}

    // Refresh Active Messages
    if (activeConversation && !activeConversation.isNew) {
      try {
        const res = await fetch(`/api/messages/${activeConversation._id}?userId=${currentUser._id}`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
          scrollToBottom();
        }
      } catch (err) {}
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || !currentUser) return;

    // Find the other participant's ID
    const receiver = activeConversation.participants.find(p => p._id !== currentUser._id);
    if (!receiver) return;

    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser._id,
          receiverId: receiver._id,
          content: newMessage
        })
      });
      const data = await res.json();
      if (data.success) {
        // Optimistically update
        setMessages([...messages, data.message]);
        setNewMessage("");
        scrollToBottom();
        
        // If it was a mock new conversation, force a refresh of the conversation list
        if (activeConversation.isNew) {
           setActiveConversation(data.conversation);
           // The polling will pick up the new conversation
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const openNewChatModal = async () => {
    setIsNewChatModalOpen(true);
    setIsFetchingArtists(true);
    try {
      // Fetch artists to chat with
      const res = await fetch(`/api/users?role=artist&excludeId=${currentUser._id}`);
      const data = await res.json();
      if (data.success) {
        setAvailableArtists(data.users);
      }
    } catch (err) {
      console.error("Error fetching artists:", err);
    } finally {
      setIsFetchingArtists(false);
    }
  };

  const startNewChat = (artist) => {
    // Check if a conversation already exists
    const existingConv = conversations.find(conv => 
      conv.participants.some(p => p._id === artist._id)
    );

    if (existingConv) {
      setActiveConversation(existingConv);
    } else {
      // Create a temporary local conversation structure
      setActiveConversation({
        _id: 'temp_' + artist._id,
        isNew: true,
        participants: [currentUser, artist],
        lastMessage: ""
      });
      setMessages([]); // clear messages
    }
    setIsNewChatModalOpen(false);
  };


  if (!currentUser) {
    return (
      <div className="w-full h-full bg-[#f8f9fa] flex items-center justify-center px-4 md:px-8 lg:px-8 py-6" style={{ minHeight: "calc(100vh - 80px)" }}>
        <div className="w-full max-w-[1800px] flex bg-white rounded-3xl shadow-2xl border border-gray-300 h-[calc(100vh-160px)] min-h-[500px] items-center justify-center flex-col text-gray-500">
          <div className="w-16 h-16 border-4 border-[#171C3C] border-t-[#98C4EC] rounded-full animate-spin mb-4"></div>
          <p className="font-semibold text-lg">Loading your messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#f8f9fa] flex items-center justify-center px-4 md:px-8 lg:px-8 py-6" style={{ minHeight: "calc(100vh - 80px)" }}>
      <div className="w-full max-w-[1800px] flex bg-white rounded-3xl shadow-2xl border border-gray-300 overflow-hidden" style={{ height: "calc(100vh - 160px)", minHeight: "500px" }}>
        <div className="w-[320px] md:w-[380px] shrink-0 border-r-2 border-gray-200 flex flex-col bg-gray-50/50 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10">
          <div className="p-6 border-b-2 border-gray-200 bg-white/95 backdrop-blur-md z-10 sticky top-0 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-2xl font-extrabold text-[#171C3C]">Chats</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">Recent conversations</p>
          </div>
          <div className="flex gap-2">
            <button 
               onClick={openNewChatModal}
               className="w-10 h-10 rounded-full bg-gray-100 text-[#171C3C] flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm border border-gray-200"
               title="Start new chat"
            >
               <MessageSquarePlus size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No conversations yet</div>
          ) : (
            conversations.map((conv) => {
              const otherUser = conv.participants.find(p => p._id !== currentUser._id);
              if (!otherUser) return null;
              const isActive = activeConversation?._id === conv._id;

              return (
                <div
                  key={conv._id}
                  onClick={() => setActiveConversation(conv)}
                  className={`px-6 py-4 cursor-pointer transition-all border-l-4 ${isActive ? 'bg-white shadow-sm border-[#FE9E8F] relative z-0' : 'border-transparent hover:bg-gray-50/80'} flex items-center gap-4 group`}
                >
                  <div className="relative">
                     <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 shrink-0 border-2 border-white shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        {otherUser.profilePicture ? (
                          <Image src={otherUser.profilePicture} alt="Profile" width={56} height={56} className="object-cover w-full h-full" />
                        ) : (
                          <UserIcon className="text-gray-400" size={28} />
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                       <h3 className={`font-bold truncate ${isActive ? 'text-[#171C3C]' : 'text-gray-700 group-hover:text-[#171C3C]'}`}>{otherUser.username}</h3>
                       <span className="text-xs font-medium text-gray-400">
                         {new Date(conv.lastMessageAt).toLocaleDateString() === new Date().toLocaleDateString() 
                             ? new Date(conv.lastMessageAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                             : new Date(conv.lastMessageAt).toLocaleDateString([], {month: 'short', day: 'numeric'})}
                       </span>
                    </div>
                    <p className={`text-sm truncate ${isActive ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>{conv.lastMessage || "Start a conversation"}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white relative">
        {activeConversation ? (
          <div className="flex flex-col h-full relative z-10">
            <div className="px-8 py-5 bg-white border-b-2 border-gray-200 flex items-center justify-between z-20 shadow-sm relative">
              <div className="flex items-center gap-4">
                  {(() => {
                    const otherUser = activeConversation.participants.find(p => p._id !== currentUser._id);
                    return (
                      <>
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-[#98C4EC] to-[#D1CAF2] p-0.5">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-2 border-white overflow-hidden">
                              {otherUser?.profilePicture ? (
                                <Image src={otherUser.profilePicture} alt="Profile" width={48} height={48} className="object-cover w-full h-full" />
                              ) : (
                                <UserIcon className="text-gray-400" size={24} />
                              )}
                          </div>
                        </div>
                        <div>
                          <h2 className="font-extrabold text-lg text-[#171C3C]">{otherUser?.username}</h2>
                          <div className="flex items-center gap-1.5">
                             <div className="w-2 h-2 rounded-full bg-green-500"></div>
                             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{otherUser?.role || 'User'}</p>
                          </div>
                        </div>
                      </>
                    );
                  })()}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-12 py-8 space-y-6">
              {messages.length === 0 ? (
                 <div className="flex h-full flex-col items-center justify-center text-gray-400 text-sm">
                    <div className="w-24 h-24 mb-4 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-200">
                       <Send className="w-10 h-10 text-gray-300 ml-1" />
                    </div>
                    Say hi to start the conversation!
                 </div>
              ) : (
                messages.map((msg, idx) => {
                  const senderStr = typeof msg.senderId === 'object' ? msg.senderId?._id?.toString() : msg.senderId?.toString();
                  const isSentByMe = senderStr === currentUser._id?.toString();
                  
                  const prevSenderStr = idx > 0 ? (typeof messages[idx-1].senderId === 'object' ? messages[idx-1].senderId?._id?.toString() : messages[idx-1].senderId?.toString()) : null;
                  const isPrevSame = idx > 0 && prevSenderStr === senderStr;
                  const senderUser = msg.senderId; // Populated sender object
                  
                  return (
                    <div key={idx} className={`flex w-full ${isSentByMe ? 'justify-end' : 'justify-start'} ${isPrevSame ? 'mt-1' : 'mt-4'}`}>
                      <div className={`flex items-end gap-2 max-w-[75%] ${isSentByMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        {(!isPrevSame || idx === messages.length - 1) ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0 border border-gray-100">
                               {senderUser?.profilePicture ? (
                                 <Image src={senderUser.profilePicture} alt="Profile" width={32} height={32} className="object-cover w-full h-full" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                    <UserIcon size={16} />
                                 </div>
                               )}
                            </div>
                        ) : (
                            <div className="w-8 h-8 shrink-0"></div> // Spacer for consecutive messages
                        )}

                        {/* Bubble */}
                        <div className={`px-5 py-3 group relative
                          ${isSentByMe 
                             ? 'bg-[#171C3C] text-white rounded-2xl rounded-br-sm shadow-sm'
                             : 'bg-[#f0f2f5] text-[#171C3C] rounded-2xl rounded-bl-sm shadow-sm'}`}>
                          <p className="text-[14.5px] font-medium leading-relaxed">{msg.content}</p>
                          
                          {/* Timestamp revealed on hover or slightly visible */}
                          <div className={`absolute -bottom-5 ${isSentByMe ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
                            <p className="text-[10px] font-bold text-gray-400 whitespace-nowrap">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {isSentByMe && (
                              <CheckCheck size={12} className="text-[#98C4EC]" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white z-20 border-t-2 border-gray-100 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.05)]">
              <form onSubmit={handleSendMessage} className="flex gap-4 items-center">
                <div className="flex-1 bg-[#f0f2f5] rounded-full flex items-center h-14 px-6 border border-transparent focus-within:border-[#98C4EC] focus-within:bg-white transition-all shadow-sm">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Write Something..."
                      className="w-full bg-transparent focus:outline-none text-[#171C3C] text-[15px] font-medium placeholder-gray-400"
                    />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-14 h-14 shrink-0 rounded-full bg-[#171C3C] text-white hover:bg-[#2a3166] transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md active:scale-95"
                >
                  <Send size={22} className="ml-1" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 relative z-10">
            <div className="w-24 h-24 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mb-6">
              <Send size={40} className="text-[#98C4EC] ml-2" />
            </div>
            <h2 className="text-2xl font-bold text-[#171C3C] mb-3">Your Messages</h2>
            <p className="text-base text-gray-500 max-w-sm text-center">Select a conversation from the sidebar to start chatting with artists and buyers.</p>
          </div>
        )}
      </div>

      {isNewChatModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-xl text-[#171C3C]">New Chat</h3>
              <button 
                onClick={() => setIsNewChatModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search artists..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#98C4EC]/50 focus:border-[#98C4EC] transition-all"
                  onChange={(e) => {
                     // Simple local filter (if list is small)
                     const term = e.target.value.toLowerCase();
                     const rows = document.querySelectorAll('.artist-row');
                     rows.forEach(row => {
                       const name = row.getAttribute('data-name').toLowerCase();
                       row.style.display = name.includes(term) ? 'flex' : 'none';
                     });
                  }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {isFetchingArtists ? (
                <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                  <div className="w-8 h-8 border-3 border-[#98C4EC] border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm">Loading artists...</p>
                </div>
              ) : availableArtists.length === 0 ? (
                <div className="py-12 text-center text-gray-500 text-sm">No artists found to chat with.</div>
              ) : (
                <div className="space-y-1">
                  {availableArtists.map(artist => (
                    <div 
                      key={artist._id} 
                      data-name={artist.username}
                      onClick={() => startNewChat(artist)}
                      className="artist-row flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-200">
                         {artist.profilePicture ? (
                           <Image src={artist.profilePicture} alt="Profile" width={40} height={40} className="object-cover w-full h-full" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center bg-gray-100">
                             <UserIcon className="text-gray-400 w-5 h-5" />
                           </div>
                         )}
                      </div>
                      <div>
                        <p className="font-bold text-[#171C3C] text-sm">{artist.username}</p>
                        <p className="text-xs font-semibold text-[#FE9E8F] uppercase tracking-wider">{artist.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
