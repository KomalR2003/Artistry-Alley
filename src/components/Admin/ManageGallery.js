import React, { useState, useEffect } from 'react';
import { Image, Images, Heart, Trash2, Search, AlertTriangle, User, Folder, Edit2 } from 'lucide-react';
const ManageGallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery');
      const result = await res.json();
      if (result.success) {
        setArtworks(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  // Derived Statistics
  const totalArtworks = artworks.length;
  const totalLikes = artworks.reduce((acc, curr) => acc + (curr.likes || 0), 0);
  const uniqueAlbums = new Set(artworks.map(a => a.category).filter(Boolean)).size;

  // Filtered Artworks
  const filteredArtworks = artworks.filter(a => {
    return (a.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.artistId?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.artistId?.username || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${itemToDelete}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setItemToDelete(null);
        fetchGallery();
      } else {
        alert(data.message || 'Failed to delete artwork');
      }
    } catch (error) {
      console.error("Error deleting artwork:", error);
    }
  };

  const openEditModal = (item) => {
    setEditingItem({
      id: item._id,
      title: item.title || '',
      category: item.category || ''
    });
  };

  const saveItemEdits = async () => {
    if (!editingItem) return;
    try {
      const res = await fetch(`/api/admin/gallery`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem.id,
          title: editingItem.title,
          category: editingItem.category
        })
      });
      const data = await res.json();
      if (data.success) {
        setEditingItem(null);
        fetchGallery();
      } else {
        alert(data.message || 'Failed to update artwork');
      }
    } catch (error) {
      console.error("Error updating artwork:", error);
    }
  };

  return (
    <div className="w-full h-full bg-[#FAFAFA] text-[#171C3C] p-8 overflow-y-auto relative custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black border-none">
            Manage Gallery
          </h1>
          <p className="text-[#171C3C]/70 mt-1">
            Moderate, review, and delete user portfolio posts here.
          </p>
        </div>

        {/* Search */}
        <div className="relative border border-[#D1CAF2]/40 rounded-xl overflow-hidden flex bg-white w-64 shadow-sm">
          <div className="px-3 py-2 text-[#171C3C]/40 flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search portfolios or artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 py-2 pr-4 bg-transparent text-sm font-medium focus:outline-none text-[#171C3C]"
          />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex flex-col transition-shadow">
          <h3 className="text-lg font-bold text-[#171C3C] mb-4">Gallery Overview</h3>
          <div className="flex items-center gap-4">
            <div className="w-2 h-14 rounded-l-full bg-[#4ADE80] shrink-0"></div>
            <div className="flex gap-6 w-full">
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium mb-1">Total Artworks</span>
                <span className="text-xl font-bold text-[#171C3C]">{loading ? 0 : totalArtworks}</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium mb-1">Unique Albums</span>
                <span className="text-xl font-bold text-[#171C3C]">{loading ? 0 : uniqueAlbums}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col transition-shadow">
          <h3 className="text-lg font-bold text-[#171C3C] mb-4">Community Reach</h3>
          <div className="flex items-center gap-4">
            <div className="w-2 h-14 rounded-l-full bg-[#FE9E8F] shrink-0"></div>
            <div className="flex gap-6 w-full">
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium mb-1">Global Likes</span>
                <span className="text-xl font-bold text-[#171C3C]">{loading ? 0 : totalLikes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-2xl border border-[#D1CAF2]/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFAFA]/50 border-b border-[#D1CAF2]/30">
                <th className="p-5 font-bold text-[#171C3C] text-sm tracking-wide">Preview</th>
                <th className="p-5 font-bold text-[#171C3C] text-sm tracking-wide">Artist & Title</th>
                <th className="p-5 font-bold text-[#171C3C] text-sm tracking-wide">Category</th>
                <th className="p-5 font-bold text-[#171C3C] text-sm tracking-wide">Engagement</th>
                <th className="p-5 font-bold text-[#171C3C] text-sm tracking-wide text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-[#171C3C]/50 font-medium">Scanning galleries...</td></tr>
              ) : filteredArtworks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <Images className="w-12 h-12 text-[#D1CAF2] mx-auto mb-4" />
                    <p className="text-[#171C3C]/60 font-medium">No artworks found in the database.</p>
                  </td>
                </tr>
              ) : (
                filteredArtworks.map((item, idx) => (
                  <tr key={idx} className="border-b border-[#D1CAF2]/10 hover:bg-[#FAFAFA]/40 transition-colors group">
                    <td className="p-5 w-32">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center shadow-sm border border-slate-200">
                        {item.imageUrl ? (
                          <img src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:3000${item.imageUrl}`} alt="Artwork" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <Image className="w-6 h-6 text-gray-300" />
                        )}
                      </div>
                    </td>
                    <td className="p-5">
                      <h4 className="font-bold text-black text-base mb-1">{item.title || 'Untitled Masterpiece'}</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full overflow-hidden bg-[#D1CAF2]">
                          {item.artistId?.profilePicture ? (
                            <img src={item.artistId.profilePicture} alt="Artist" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-white bg-indigo-500">
                              {(item.artistId?.username || item.artistId?.name || 'A').charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-black">
                          {item.artistId?.username || item.artistId?.name || 'Unknown Artist'}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-black font-bold tracking-wider flex items-center gap-2">
                        {/* <Folder className="w-4 h-4 text-indigo-400" /> */}
                        {item.category || 'Drafts'}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex gap-4 items-center">
                        <span className="flex items-center gap-1.5 text-sm font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-lg">
                          <Heart className="w-4 h-4 fill-rose-500" /> {item.likes || 0}
                        </span>
                        <span className="text-xs font-semibold text-black uppercase tracking-wider">
                          Likes
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors tooltip-trigger"
                          title="Edit Artwork"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setItemToDelete(item._id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors tooltip-trigger"
                          title="Delete Artwork"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="absolute inset-0 z-[60] bg-[#171C3C]/80 backdrop-blur-sm flex items-center justify-center p-4 min-h-screen">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-fade-in relative border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-center text-[#171C3C] mb-3">Remove Artwork?</h2>
            <p className="text-sm text-center text-[#171C3C]/70 mb-8 font-medium">This action is irreversible. It will wipe this post from public galleries globally.</p>

            <div className="flex gap-3">
              <button onClick={() => setItemToDelete(null)} className="flex-1 py-3 bg-gray-100 text-[#171C3C] rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 shadow-md shadow-red-500/20 transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editingItem && (
        <div className="absolute inset-0 z-50 bg-[#171C3C]/80 backdrop-blur-sm flex items-center justify-center p-4 min-h-screen">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-fade-in relative border border-[#D1CAF2]/30">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-6 right-6 text-[#171C3C]/40 hover:text-[#171C3C] transition-colors bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="mb-8">
              <div className="w-12 h-12 bg-[#D1CAF2]/20 rounded-2xl flex items-center justify-center mb-4 border border-[#D1CAF2]/30 shadow-sm mt-2">
                <Images className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-black text-[#171C3C] tracking-tight">Modify Post Details</h2>
              <p className="text-sm text-[#171C3C]/60 mt-1 font-medium">Update the public information for this community portfolio upload.</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#171C3C]/70 uppercase tracking-wider ml-1">Artwork Title</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#98C4EC]/50 focus:border-[#98C4EC] transition-all font-medium text-[#171C3C]"
                    placeholder="Enter post title"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#171C3C]/70 uppercase tracking-wider ml-1">Category</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#98C4EC]/50 focus:border-[#98C4EC] transition-all font-medium text-[#171C3C]"
                    placeholder="e.g. Digital Art, Photography"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-3">
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 py-3.5 bg-white border-2 border-gray-100 text-[#171C3C] rounded-xl font-bold hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm"
              >
                Discard Changes
              </button>
              <button
                onClick={saveItemEdits}
                className="flex-1 py-3.5 bg-[#171C3C] text-white rounded-xl font-bold hover:bg-black shadow-md shadow-black/10 transition-all flex items-center justify-center gap-2"
              >
                Save Edits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGallery;
