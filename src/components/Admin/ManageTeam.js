import React, { useState, useEffect } from 'react';
import { Users, UserPlus, UserCheck, UserX, Search, MoreHorizontal, Edit2, Trash2, X, Save, AlertTriangle, Eye } from 'lucide-react';

const ManageTeam = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // 'all', 'artist', 'user', 'admin'

  // Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const result = await res.json();
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Derived Statistics
  const totalUsers = users.length;
  const totalArtists = users.filter(u => u.role === 'artist').length;
  const totalRegularUsers = users.filter(u => u.role === 'user').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;

  // Filtered List
  const filteredUsers = users.filter(u => {
    if (u.role === 'admin') return false;
    const matchesSearch = (u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Sub-actions
  const saveUserEdits = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUser.id,
          username: editingUser.newName,
          role: editingUser.newRole,
          email: editingUser.newEmail,
          mobile: editingUser.newMobile,
          dob: editingUser.newDob,
          bio: editingUser.newBio,
          specialization: editingUser.newSpecialization,
          experience: editingUser.newExperience
        })
      });
      const data = await res.json();
      if (data.success) {
        setEditingUser(null);
        fetchUsers(); // Refresh grid
      } else {
        alert(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/admin/users?id=${userToDelete}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setUserToDelete(null);
        fetchUsers();
      } else {
        alert(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const openEditModal = (user) => {
    setEditingUser({
      id: user._id,
      newName: user.username || user.name || '',
      newRole: user.role || 'user',
      newEmail: user.email || '',
      newMobile: user.mobile || '',
      newDob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
      newBio: user.bio || '',
      newSpecialization: user.specialization || '',
      newExperience: user.experience || ''
    });
  };

  // const getRoleColor = (role) => {
  //   switch (role) {
  //     case 'artist': return "bg-purple-100 text-purple-700";
  //     case 'admin': return "bg-rose-100 text-rose-700";
  //     default: return "bg-blue-100 text-blue-700";
  //   }
  // };

  return (
    <div className="w-full h-full bg-[#FAFAFA] text-[#171C3C] p-8 overflow-y-auto relative custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-black border-none">
            Manage Team
          </h1>
          <p className="text-[#171C3C]/70 mt-1">
            View, edit, or delete platform accounts here.
          </p>
        </div>

        {/* Search */}
        <div className="relative border border-[#D1CAF2]/40 rounded-xl overflow-hidden flex bg-white w-64 shadow-sm">
          <div className="px-3 py-2 text-[#171C3C]/40 flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search accounts or emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 py-2 pr-4 bg-transparent text-sm font-medium focus:outline-none text-[#171C3C]"
          />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="flex flex-col transition-shadow">
          <h3 className="text-lg font-semibold text-[#171C3C] mb-4">Users Overview</h3>
          <div className="flex items-center gap-4">
            <div className="w-2 h-14 rounded-l-full bg-[#98C4EC] shrink-0"></div>
            <div className="flex gap-6 w-full">
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium mb-1">Total Users</span>
                <span className="text-xl font-bold text-[#171C3C]">{loading ? 0 : totalUsers}</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium mb-1">Artists</span>
                <span className="text-xl font-bold text-[#171C3C]">{loading ? 0 : totalArtists}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* List Section */}
      <div className="bg-white rounded-2xl border border-[#D1CAF2]/40 overflow-hidden shadow-sm">

        {/* Filter Bar */}
        <div className="p-5 border-b border-[#D1CAF2]/30 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#FAFAFA]/50">
          <div></div>

          {/* Filters */}
          <div className="flex bg-[#D1CAF2]/20 rounded-xl p-1 gap-1 w-full sm:w-auto overflow-x-auto">
            {['all', 'artist', 'user'].map(role => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`text-xs px-4 py-2 rounded-lg font-bold transition-all capitalize whitespace-nowrap ${filterRole === role ? 'bg-white text-[#171C3C] shadow-sm' : 'text-[#171C3C]/60 hover:text-[#171C3C]'}`}
              >
                {role}
              </button>
            ))}
          </div>
        </div >

        {/* Table */}
        < div className="overflow-x-auto" >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#D1CAF2]/30 text-xs uppercase tracking-wider text-[#171C3C]/50">
                <th className="p-5 font-bold">User</th>
                <th className="p-5 font-bold">Contact & Info</th>
                <th className="p-5 font-bold">Role</th>
                <th className="p-5 font-bold">Expertise / Bio</th>
                <th className="p-5 font-bold">DOB</th>
                <th className="p-5 font-bold">Joined</th>
                <th className="p-5 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#171C3C]/50 font-medium">Loading user database...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#171C3C]/50 font-medium">No records match your search.</td>
                </tr>
              ) : filteredUsers.map((user, idx) => (
                <tr key={idx} className="border-b border-[#D1CAF2]/10 hover:bg-[#FAFAFA]/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-[#171C3C] bg-cover bg-center flex items-center justify-center text-sm font-bold text-white shadow-sm shrink-0" style={{ backgroundImage: user.profilePicture ? `url(${user.profilePicture})` : undefined }}>
                        {!user.profilePicture && (user.username || user.name || 'U').charAt(0).toUpperCase()}

                      </div>
                      <h4 className="font-semibold text-black text-sm line-clamp-1">{user.username || user.name || 'Anonymous User'}</h4>
                      <div>

                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-black">{user.email || 'N/A'}</span>
                      <span className="text-xs text-black mt-0.5">{user.mobile || 'No Phone'}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`text-xs  font-bold  (user.role)`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col max-w-[150px]">
                      {user.role === 'artist' ? (
                        <>
                          <span className="text-sm font-medium text-black truncate">{user.specialization || 'General Artist'}</span>
                          <span className="text-xs text-black mt-0.5 whitespace-nowrap">{user.experience ? `${user.experience} Yrs Exp.` : '-'}</span>
                          <span className="text-xs text-black mt-0.5 line-clamp-2" title={user.bio}>{user.bio || 'No bio provided'}</span>
                        </>
                      ) : (
                        <span className="text-sm text-black italic">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="text-sm font-medium text-black">
                      {user.dob ? new Date(user.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className="text-sm font-medium text-black">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </td>
                  <td className="p-5 relative">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setViewingUser(user)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors tooltip-trigger" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEditModal(user)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors tooltip-trigger" title="Edit Privileges">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setUserToDelete(user._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors tooltip-trigger" title="Delete Account" disabled={user.role === 'admin'}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div >
      </div >

      {/* View User Modal Overlay */}
      {
        viewingUser && (
          <div className="absolute inset-0 z-50 bg-[#171C3C]/80 backdrop-blur-sm flex items-center justify-center p-4 min-h-screen">
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-fade-in relative border border-[#D1CAF2] max-h-[90vh] overflow-y-auto custom-scrollbar">
              <button onClick={() => setViewingUser(null)} className="absolute right-6 top-6 text-[#171C3C]/40 hover:text-[#FE9E8F] transition-colors p-1 bg-gray-100 rounded-full hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-[#171C3C] bg-cover bg-center flex items-center justify-center text-xl font-bold text-white shadow-sm shrink-0" style={{ backgroundImage: viewingUser.profilePicture ? `url(${viewingUser.profilePicture})` : undefined }}>
                  {!viewingUser.profilePicture && (viewingUser.username || viewingUser.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#171C3C] tracking-tight m-0">{viewingUser.username || viewingUser.name || 'Anonymous User'}</h2>
                  <span className={`text-xs font-bold uppercase tracking-wider ${viewingUser.role === 'artist' ? 'text-purple-600' : viewingUser.role === 'admin' ? 'text-rose-600' : 'text-blue-600'}`}>{viewingUser.role || 'user'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#FAFAFA] p-4 rounded-xl border border-[#D1CAF2]/30">
                    <span className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider block mb-1">Email</span>
                    <span className="text-sm font-semibold text-[#171C3C] break-all">{viewingUser.email || 'N/A'}</span>
                  </div>
                  <div className="bg-[#FAFAFA] p-4 rounded-xl border border-[#D1CAF2]/30">
                    <span className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider block mb-1">Mobile</span>
                    <span className="text-sm font-semibold text-[#171C3C]">{viewingUser.mobile || 'N/A'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#FAFAFA] p-4 rounded-xl border border-[#D1CAF2]/30">
                    <span className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider block mb-1">Date of Birth</span>
                    <span className="text-sm font-semibold text-[#171C3C]">{viewingUser.dob ? new Date(viewingUser.dob).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="bg-[#FAFAFA] p-4 rounded-xl border border-[#D1CAF2]/30">
                    <span className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider block mb-1">Joined</span>
                    <span className="text-sm font-semibold text-[#171C3C]">{viewingUser.createdAt ? new Date(viewingUser.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>

                {viewingUser.role === 'artist' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#FAFAFA] p-4 rounded-xl border border-[#D1CAF2]/30">
                        <span className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider block mb-1">Specialization</span>
                        <span className="text-sm font-semibold text-[#171C3C]">{viewingUser.specialization || 'N/A'}</span>
                      </div>
                      <div className="bg-[#FAFAFA] p-4 rounded-xl border border-[#D1CAF2]/30">
                        <span className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider block mb-1">Experience</span>
                        <span className="text-sm font-semibold text-[#171C3C]">{viewingUser.experience ? `${viewingUser.experience} Years` : 'N/A'}</span>
                      </div>
                    </div>
                    <div className="bg-[#FAFAFA] p-4 rounded-xl border border-[#D1CAF2]/30">
                      <span className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider block mb-1">Bio</span>
                      <p className="text-sm font-medium text-[#171C3C]/80 leading-relaxed">{viewingUser.bio || 'No bio provided.'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      }

      {/* Edit User Modal Overlay */}
      {
        editingUser && (
          <div className="absolute inset-0 z-50 bg-[#171C3C]/80 backdrop-blur-sm flex items-center justify-center p-4 min-h-screen">
            <div className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl animate-fade-in relative border border-[#D1CAF2]">
              <button onClick={() => setEditingUser(null)} className="absolute right-6 top-6 text-[#171C3C]/40 hover:text-[#FE9E8F] transition-colors p-1 bg-gray-100 rounded-full hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-black text-[#171C3C] mb-6 tracking-tight">Modify Account</h2>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-1 block pl-1">Display Name</label>
                    <input
                      type="text"
                      value={editingUser.newName}
                      onChange={(e) => setEditingUser({ ...editingUser, newName: e.target.value })}
                      className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC] focus:ring-1 focus:ring-[#98C4EC]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-1 block pl-1">System Role</label>
                    <select
                      value={editingUser.newRole}
                      onChange={(e) => setEditingUser({ ...editingUser, newRole: e.target.value })}
                      className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC] focus:ring-1 focus:ring-[#98C4EC] appearance-none"
                    >
                      <option value="user">Standard User</option>
                      <option value="artist">Artist Account</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-1 block pl-1">Email</label>
                    <input
                      type="email"
                      value={editingUser.newEmail}
                      onChange={(e) => setEditingUser({ ...editingUser, newEmail: e.target.value })}
                      className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC] focus:ring-1 focus:ring-[#98C4EC]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-1 block pl-1">Mobile</label>
                    <input
                      type="text"
                      value={editingUser.newMobile}
                      onChange={(e) => setEditingUser({ ...editingUser, newMobile: e.target.value })}
                      className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC] focus:ring-1 focus:ring-[#98C4EC]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-1 block pl-1">Date of Birth</label>
                  <input
                    type="date"
                    value={editingUser.newDob}
                    onChange={(e) => setEditingUser({ ...editingUser, newDob: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC] focus:ring-1 focus:ring-[#98C4EC]"
                  />
                </div>

                {editingUser.newRole === 'artist' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-1 block pl-1">Specialization</label>
                        <input
                          type="text"
                          value={editingUser.newSpecialization}
                          onChange={(e) => setEditingUser({ ...editingUser, newSpecialization: e.target.value })}
                          className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC] focus:ring-1 focus:ring-[#98C4EC]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-1 block pl-1">Experience (Yrs)</label>
                        <input
                          type="number"
                          value={editingUser.newExperience}
                          onChange={(e) => setEditingUser({ ...editingUser, newExperience: e.target.value })}
                          className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC] focus:ring-1 focus:ring-[#98C4EC]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-1 block pl-1">Bio</label>
                      <textarea
                        value={editingUser.newBio}
                        onChange={(e) => setEditingUser({ ...editingUser, newBio: e.target.value })}
                        className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC] focus:ring-1 focus:ring-[#98C4EC] min-h-[80px]"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button onClick={() => setEditingUser(null)} className="flex-1 py-3 px-4 bg-gray-100 text-[#171C3C] rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={saveUserEdits} className="flex-[2] py-3 px-4 bg-[#171C3C] text-white rounded-xl font-bold shadow-md hover:bg-[#171C3C]/90 transition-all flex justify-center items-center gap-2">
                  <Save className="w-4 h-4" /> Save Configuration
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Delete Confirmation Modal */}
      {
        userToDelete && (
          <div className="absolute inset-0 z-50 bg-[#171C3C]/80 backdrop-blur-sm flex items-center justify-center p-4 min-h-screen">
            <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-fade-in relative border border-red-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-center text-[#171C3C] mb-3">Expel Account?</h2>
              <p className="text-sm text-center text-[#171C3C]/70 mb-8 font-medium">This action is dangerous and irreversible. The user will be instantly removed from the system.</p>

              <div className="flex gap-3">
                <button onClick={() => setUserToDelete(null)} className="flex-1 py-3 bg-gray-100 text-[#171C3C] rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 shadow-md shadow-red-500/20 transition-all">Yes, Expel</button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default ManageTeam;
