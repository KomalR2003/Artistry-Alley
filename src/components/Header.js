'use client';
import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import Avtar from "../../public/Images/avtar.png";
import { Bell, CheckCheck } from "lucide-react";
import toast from 'react-hot-toast';

export default function Header() {
  const [username, setUsername] = useState('Guest');
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit before compression
        alert("Original image size must be less than 50MB");
        return;
      }

      setUploading(true);

      // Create a canvas to compress the image
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);

      img.onload = async () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimensions
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.7 quality
        const base64String = canvas.toDataURL('image/jpeg', 0.7);

        try {
          const userId = sessionStorage.getItem('userId');
          if (!userId) {
            setUploading(false);
            return;
          }

          const response = await fetch('/api/user', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, profilePicture: base64String }),
          });
          const data = await response.json();
          if (data.success) {
            setProfilePicture(data.profilePicture);
          } else {
            console.error(data.message);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          setUploading(false);
        }
      };
    }
  };

  useEffect(() => {
    // Fetch username from backend API
    const fetchUserData = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
          setUsername('Guest');
          return;
        }

        const response = await fetch(`/api/user?userId=${userId}`);
        const data = await response.json();

        if (data.success && data.user) {
          setUsername(data.user.username);
          if (data.user.profilePicture) {
            setProfilePicture(data.user.profilePicture);
          }
        } else {
          setUsername('Guest');
          setProfilePicture(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUsername('Guest');
      }
    };

    fetchUserData();
  }, []);

  // Notifications State & Logic
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notifiedSet = useRef(new Set());

  useEffect(() => {
      const fetchNotifications = async () => {
          try {
              const userId = sessionStorage.getItem('userId');
              if (!userId) return;
              const res = await fetch(`/api/notifications?userId=${userId}`);
              const data = await res.json();
              if (data.success) {
                  setNotifications(data.notifications);
                  setUnreadNotifications(data.notifications.filter(n => !n.isRead).length);
                  
                  // Pop up unread notifications that we haven't shown yet
                  const newUnread = data.notifications.filter(n => !n.isRead && !notifiedSet.current.has(n._id));
                  if (notifiedSet.current.size > 0 && newUnread.length > 0) {
                      newUnread.forEach(n => {
                          toast(n.message, {
                              icon: '🔔',
                              duration: 5000,
                          });
                      });
                  }
                  
                  // Update notified set
                  data.notifications.forEach(n => notifiedSet.current.add(n._id));
              }
          } catch (error) {
              console.error('Error fetching notifications:', error);
          }
      };
      
      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 10000); // Poll every 10s
      return () => clearInterval(intervalId);
  }, []);

  const handleToggleNotifications = async () => {
      const willOpen = !isNotificationsOpen;
      setIsNotificationsOpen(willOpen);
      
      if (willOpen && unreadNotifications > 0) {
          try {
              const userId = sessionStorage.getItem('userId');
              if(userId) {
                  await fetch(`/api/notifications/all/read?userId=${userId}`, { method: 'PUT' });
                  setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                  setUnreadNotifications(0);
              }
          } catch (error) {
              console.error('Error auto-marking read:', error);
          }
      }
  };

  const markAllAsRead = async () => {
      try {
          const userId = sessionStorage.getItem('userId');
          if(!userId) return;
          await fetch(`/api/notifications/all/read?userId=${userId}`, { method: 'PUT' });
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
          setUnreadNotifications(0);
      } catch (error) {
          console.error('Error marking notifications as read:', error);
      }
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 py-4 px-8 border-b border-gray-200">
      <div className="flex items-center justify-between">
        {/* Left Side: Welcome Message */}
        <p className="text-gray-700 text-lg font-medium hidden md:block">
          Good morning! Let art inspire your day ahead.
        </p>

        {/* Right Side: Notifications & User Profile */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Notifications Bell */}
          <div className="relative">
              <button 
                  onClick={handleToggleNotifications}
                  className="p-2 relative bg-white border border-gray-100 shadow-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              >
                  <Bell size={22} className={unreadNotifications > 0 ? "text-[#FE9E8F]" : ""} />
                  {unreadNotifications > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
              </button>
              
              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                          <h3 className="font-semibold text-gray-800">Notifications</h3>
                          {unreadNotifications > 0 && (
                              <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium px-2 py-1 rounded-md hover:bg-blue-50 transition-colors">
                                  <CheckCheck size={14} /> Mark all read
                              </button>
                          )}
                      </div>
                      <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                          {notifications.length === 0 ? (
                              <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                                  <Bell className="w-8 h-8 mb-2 opacity-20" />
                                  <span className="text-sm">You're all caught up!</span>
                              </div>
                          ) : (
                              <div className="divide-y divide-gray-50">
                                  {notifications.map(notification => (
                                      <div key={notification._id} className={`p-4 transition-colors hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50/30' : ''}`}>
                                          <div className="flex gap-3">
                                              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notification.isRead ? 'bg-[#FE9E8F]' : 'bg-transparent'}`}></div>
                                              <div>
                                                  <p className={`text-sm ${!notification.isRead ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{notification.message}</p>
                                                  <p className="text-[10px] text-gray-400 mt-1.5 font-medium uppercase tracking-wider">{new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {new Date(notification.createdAt).toLocaleDateString([], {month:'short', day:'numeric'})}</p>
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  </div>
              )}
          </div>

          {/* User Profile - EXACT ORIGINAL LAYOUT */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-blue-200 shadow-md group cursor-pointer">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={`${username}'s Avatar`}
                  className="object-cover h-full w-full"
                />
              ) : (
                <Image
                  src={Avtar}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="object-cover h-full w-full"
                />
              )}

              <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {uploading ? (
                  <span className="text-[8px] text-white animate-pulse">Wait</span>
                ) : (
                  <span className="text-[10px] text-white font-semibold flex items-center gap-1">
                    Edit
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            <p className="text-gray-800 font-semibold">{username}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
