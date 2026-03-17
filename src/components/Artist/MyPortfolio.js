import React, { useState, useEffect } from 'react';
import { Briefcase, Award, Star, Eye, Edit2, Save, X, User } from 'lucide-react';
import toast from 'react-hot-toast';

const MyPortfolio = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ projects: 0, events: 0, rating: 4.9, views: 0 });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    specialization: '',
    experience: '',
    mobile: ''
  });

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      const userId = sessionStorage.getItem('userId');
      if (!userId) return;

      // Fetch User Profile
      const userRes = await fetch(`/api/user?userId=${userId}`);
      const userData = await userRes.json();

      if (userData.success && userData.user) {
        setProfile(userData.user);
        setEditForm({
          username: userData.user.username || '',
          bio: userData.user.bio || '',
          specialization: userData.user.specialization || '',
          experience: userData.user.experience || '',
          mobile: userData.user.mobile || ''
        });
      }

      // Fetch Stats (Products & Events)
      const [productsRes, eventsRes, galleryRes] = await Promise.all([
        fetch(`/api/product?artistId=${userId}`),
        fetch(`/api/events/artist?artistId=${userId}`),
        fetch(`/api/gallery?artistId=${userId}`)
      ]);

      const productsData = await productsRes.json();
      const eventsData = await eventsRes.json();
      const galleryData = await galleryRes.json();

      let totalProjects = 0;
      if (productsData.success) {
        totalProjects = productsData.products ? productsData.products.length : (productsData.pagination ? productsData.pagination.total : 0);
      }

      let totalEvents = 0;
      if (eventsData.success && eventsData.events) {
        totalEvents = eventsData.events.length;
      }

      let totalViews = 0;
      if (galleryData.success && galleryData.images) {
        totalViews = galleryData.images.reduce((sum, img) => sum + (img.views || 0), 0);
      }

      setStats({
        projects: totalProjects,
        events: totalEvents,
        rating: 4.8,
        views: totalViews > 0 ? totalViews : 124
      });

    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      toast.error('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          username: editForm.username,
          bio: editForm.bio,
          specialization: editForm.specialization,
          experience: Number(editForm.experience),
          mobile: editForm.mobile
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Profile updated successfully');
        setProfile(data.user);
        setIsEditing(false);
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('An error occurred while saving');
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-[#171C3C]/60 text-lg">
        Loading portfolio...
      </div>
    );
  }

  const portfolioStats = [
    {
      title: "Overview",
      barColor: "bg-[#D1CAF2]",
      items: [
        { label: "Total Artworks", value: stats.projects < 10 ? `0${stats.projects}` : stats.projects },
        { label: "Events Hosted", value: stats.events < 10 ? `0${stats.events}` : stats.events }
      ]
    },
    {
      title: "Engagement",
      barColor: "bg-[#FE9E8F]",
      items: [
        { label: "Profile Rating", value: stats.rating.toString() },
        { label: "Gallery Views", value: stats.views < 10 ? `0${stats.views}` : stats.views }
      ]
    }
  ];

  return (
    <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#171C3C] via-[#D1CAF2] to-[#FE9E8F]">
            My Portfolio
          </h1>
          <p className="text-[#171C3C]/70 mt-2">
            Showcase your best work, biography, and achievements.
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#171C3C] text-white rounded-xl hover:bg-[#171C3C]/90 transition-all font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-[#171C3C] rounded-xl hover:bg-gray-200 transition-all font-medium"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#4ADE80] text-[#171C3C] rounded-xl hover:bg-[#4ADE80]/90 transition-all font-bold shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats Grid - Dashboard Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-10 mt-6">
        {portfolioStats.map((stat, index) => (
          <div key={index} className="flex flex-col  p-6 rounded-2xl  transition-shadow">
            {/* Title */}
            <h3 className="text-xl font-semibold text-[#171C3C] mb-4 pl-1">{stat.title}</h3>

            <div className="flex items-center gap-4 px-2">
              {/* Vertical Half-Pill Bar */}
              <div className={`w-2.5 h-16 rounded-l-full rounded-r-none ${stat.barColor} shrink-0`}></div>

              <div className="flex gap-8">
                {stat.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col justify-center">
                    <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">{item.label}</span>
                    <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Information Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Avatar & Core Info */}
        <div className="lg:col-span-1 border border-[#D1CAF2]/40 rounded-2xl p-6 bg-[#D1CAF2]/5 shadow-sm flex flex-col items-center text-center h-fit">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white flex items-center justify-center mb-4">
            {profile?.profilePicture ? (
              <img src={profile.profilePicture} alt={profile.username} className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-[#D1CAF2]" />
            )}
          </div>

          {!isEditing ? (
            <>
              <h2 className="text-2xl font-bold text-[#171C3C] mb-1">{profile?.username || 'Artist Name'}</h2>
              <span className="inline-block px-3 py-1 bg-white border border-[#D1CAF2]/40 text-[#171C3C]/70 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                {profile?.specialization || 'Artist'}
              </span>

              <div className="w-full mt-4 space-y-3 text-sm text-left border-t border-[#D1CAF2]/30 pt-4">
                <div className="flex justify-between">
                  <span className="text-[#171C3C]/50 font-medium">Email:</span>
                  <span className="font-semibold text-[#171C3C] truncate max-w-[150px]">{profile?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#171C3C]/50 font-medium">Phone:</span>
                  <span className="font-semibold text-[#171C3C]">{profile?.mobile || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#171C3C]/50 font-medium">Experience:</span>
                  <span className="font-semibold text-[#171C3C]">{profile?.experience ? `${profile.experience} years` : '-'}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-[#171C3C]/70 uppercase tracking-widest mb-1">Display Name</label>
                <input type="text" name="username" value={editForm.username} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#98C4EC]/50 rounded-lg focus:outline-none focus:border-[#98C4EC] bg-white text-[#171C3C]" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#171C3C]/70 uppercase tracking-widest mb-1">Specialization</label>
                <input type="text" name="specialization" value={editForm.specialization} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#98C4EC]/50 rounded-lg focus:outline-none focus:border-[#98C4EC] bg-white text-[#171C3C]" placeholder="e.g. Visual Arts, Digital Paint..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#171C3C]/70 uppercase tracking-widest mb-1">Phone Number</label>
                <input type="text" name="mobile" value={editForm.mobile} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#98C4EC]/50 rounded-lg focus:outline-none focus:border-[#98C4EC] bg-white text-[#171C3C]" placeholder="+1 234 567 890" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#171C3C]/70 uppercase tracking-widest mb-1">Years of Experience</label>
                <input type="number" name="experience" value={editForm.experience} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#98C4EC]/50 rounded-lg focus:outline-none focus:border-[#98C4EC] bg-white text-[#171C3C]" placeholder="e.g. 5" />
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Biography */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="border border-[#98C4EC]/30 rounded-2xl p-8 bg-[#98C4EC]/5 shadow-sm h-full flex flex-col">
            <h3 className="text-xl font-bold text-[#171C3C] mb-4 flex items-center gap-2">
              Biography
            </h3>

            {!isEditing ? (
              <div className="prose prose-sm max-w-none text-[#171C3C]/80 leading-relaxed overflow-y-auto whitespace-pre-wrap flex-1">
                {profile?.bio ? profile.bio : <span className="italic text-[#171C3C]/40">No biography provided yet. Click 'Edit Profile' to introduce yourself to your audience.</span>}
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  placeholder="Tell your story, inspirations, and background..."
                  className="w-full flex-1 min-h-[250px] p-4 border border-[#98C4EC]/50 rounded-xl focus:outline-none focus:border-[#98C4EC] bg-white text-[#171C3C] resize-none leading-relaxed"
                ></textarea>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPortfolio;
