'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import Avtar from "../../public/Images/avtar.png";

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

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 py-4 px-8 border-b border-gray-200">
      <div className="flex items-center justify-between">
        {/* Left Side: Welcome Message */}
        <p className="text-gray-700 text-lg font-medium hidden md:block">
          Good morning! Let art inspire your day ahead.
        </p>

        {/* Right Side: User Profile */}
        <div className="flex items-center gap-3 ml-auto">
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
  );
}
