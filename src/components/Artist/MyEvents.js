import React, { useState, useEffect } from 'react';
import { Calendar, Plus, MapPin, Clock, Edit2, Trash2, IndianRupee, Users, Image as ImageIcon, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'Event',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    isFree: true,
    isMultiDay: true,
    price: '',
    image: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const artistId = localStorage.getItem('userId');
      if (!artistId) return;

      const res = await fetch(`/api/events/artist?artistId=${artistId}`);
      const data = await res.json();

      if (data.success) {
        setEvents(data.events);
      } else {
        toast.error(data.error || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      // toast.error('An error occurred while fetching events');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (event = null) => {
    if (event) {
      // Edit mode
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        startDate: new Date(event.startDate).toISOString().split('T')[0],
        endDate: new Date(event.endDate).toISOString().split('T')[0],
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        isFree: event.isFree,
        isMultiDay: event.startDate !== event.endDate,
        price: event.price || '',
        image: event.image || ''
      });
    } else {
      // Add mode
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        eventType: 'Event',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        location: '',
        isFree: true,
        isMultiDay: true,
        price: '',
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.startDate || !formData.startTime || !formData.endTime || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.isMultiDay && !formData.endDate) {
      toast.error('Please select an end date for multi-day events');
      return;
    }

    if (!formData.isFree) {
      if (!formData.price || formData.price <= 0) {
        toast.error('Please enter a valid price for a paid event');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const artistId = localStorage.getItem('userId');
      const url = editingEvent
        ? `/api/events/artist/${editingEvent._id}`
        : '/api/events/artist';

      const method = editingEvent ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        artistId,
        endDate: formData.isMultiDay ? formData.endDate : formData.startDate,
        price: formData.isFree ? 0 : Number(formData.price)
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(editingEvent ? 'Event updated successfully' : 'Event created successfully');
        closeModal();
        fetchEvents();
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setEventToDelete(id);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      const res = await fetch(`/api/events/artist/${eventToDelete}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Event deleted successfully');
        fetchEvents();
      } else {
        toast.error(data.error || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('An error occurred while deleting');
    } finally {
      setEventToDelete(null);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-[#FAFAFA]">
        <div className="w-10 h-10 border-4 border-[#171C3C] border-t-[#98C4EC] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#FAFAFA] text-[#171C3C] p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#171C3C]">My Events & Exhibitions</h1>
            <p className="text-gray-500 mt-1">Manage all your upcoming and past events</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-[#171C3C] to-[#2a3154] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add New Event
          </button>
        </div>

        {/* Empty State */}
        {!loading && events.length === 0 ? (
          <div className="mt-16 bg-white border border-dashed border-gray-300 rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-24 h-24 bg-gradient-to-br from-[#FE9E8F]/20 to-[#D1CAF2]/20 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-12 h-12 text-[#171C3C]/60" />
            </div>
            <h2 className="text-2xl font-bold text-[#171C3C] mb-3">No event or exhibition added yet</h2>
            <p className="text-gray-500 max-w-md mb-8">
              Start sharing your creative journey with the world. Add your first event or exhibition to invite your audience.
            </p>
            <button
              onClick={() => openModal()}
              className="bg-[#171C3C] text-white px-8 py-3.5 rounded-xl hover:bg-[#2a3154] hover:shadow-lg transition-all flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add New
            </button>
          </div>
        ) : (
          /* Events Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <div key={evt._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative flex flex-col">
                {/* Image / Placeholder */}
                <div className="h-48 bg-gradient-to-br from-[#e0e0e0] to-[#f5f5f5] relative">
                  {evt.image ? (
                    <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${evt.eventType === 'Exhibition'
                      ? 'bg-[#FE9E8F] text-white'
                      : 'bg-[#98C4EC] text-white'
                      }`}>
                      {evt.eventType}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 ${evt.isFree
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {evt.isFree ? 'Free' : `₹${evt.price}`}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-[#171C3C] mb-2 line-clamp-1" title={evt.title}>{evt.title}</h3>

                  <div className="space-y-2 mt-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                      <Calendar className="w-4 h-4 text-[#98C4EC]" />
                      <span>
                        {new Date(evt.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {new Date(evt.startDate).getTime() !== new Date(evt.endDate).getTime() &&
                          ` - ${new Date(evt.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                        }
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                      <Clock className="w-4 h-4 text-[#D1CAF2]" />
                      <span>{evt.startTime} - {evt.endTime}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                      <MapPin className="w-4 h-4 text-[#FE9E8F]" />
                      <span className="line-clamp-1" title={evt.location}>{evt.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm line-clamp-2 mt-auto mb-4 border-t pt-4 border-gray-100">
                    {evt.description}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => openModal(evt)}
                      className="flex-1 bg-gray-50 hover:bg-gray-100 text-[#171C3C] border border-gray-200 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(evt._id)}
                      className="px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 py-2 rounded-lg flex items-center justify-center transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl my-8">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-[#171C3C]">
                {editingEvent ? 'Edit Event Details' : 'Add New Event'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title & Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="E.g., Summer Art Festival 2026"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Type <span className="text-red-500">*</span></label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#98C4EC] outline-none transition-all appearance-none"
                    required
                  >
                    <option value="Event">Event</option>
                    <option value="Exhibition">Exhibition</option>
                  </select>
                </div>
              </div>

              {/* Duration Type Toggle */}
              <div className="bg-[#f8f9fa] border border-[#e9ecef] rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#171C3C]">Event Duration</h3>
                    <p className="text-sm text-gray-500">Is this a 1-day event or spread across multiple days?</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isMultiDay"
                      checked={formData.isMultiDay}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-purple-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-500"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700 whitespace-nowrap">
                      {formData.isMultiDay ? 'Multiple Days' : '1 Day Only'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Date, Time, Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{formData.isMultiDay ? 'Start Date' : 'Date'} <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#98C4EC] outline-none transition-all"
                    required
                  />
                </div>
                {formData.isMultiDay && (
                  <div className="space-y-2 animate-fadeIn">
                    <label className="text-sm font-medium text-gray-700">End Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      min={formData.startDate}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#98C4EC] outline-none transition-all"
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Start Time <span className="text-red-500">*</span></label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#98C4EC] outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">End Time <span className="text-red-500">*</span></label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#98C4EC] outline-none transition-all"
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Location / Venue <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Full address or virtual link"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#98C4EC] outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Free/Paid Toggle & Pricing */}
              <div className="bg-[#f8f9fa] border border-[#e9ecef] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[#171C3C]">Entry Fee Configuration</h3>
                    <p className="text-sm text-gray-500">Is this a free event or paid entry?</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-blue-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {formData.isFree ? 'Free Event' : 'Paid Event'}
                    </span>
                  </label>
                </div>

                {!formData.isFree && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Ticket Price (₹) <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          min="1"
                          placeholder="500"
                          className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#98C4EC] outline-none transition-all"
                          required={!formData.isFree}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell your audience about what to expect..."
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#98C4EC] outline-none transition-all resize-y"
                  required
                />
              </div>

              {/* Event Image */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Banner Image (Optional)</label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File Upload Option */}
                  <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 flex flex-col items-center justify-center hover:bg-gray-100 hover:border-[#98C4EC] transition-all cursor-pointer group h-32">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#98C4EC] transition-colors mb-2" />
                    <span className="text-sm text-gray-600 font-medium">Click to upload</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                  </label>

                  {/* URL Option */}
                  <div className="flex flex-col justify-center h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-[1px] flex-1 bg-gray-200"></div>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">OR</span>
                      <div className="h-[1px] flex-1 bg-gray-200"></div>
                    </div>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        name="image"
                        value={formData.image && formData.image.startsWith('data:') ? '' : formData.image}
                        onChange={handleInputChange}
                        placeholder="Paste image URL here..."
                        className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#98C4EC] outline-none transition-all text-sm"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 ml-1">Provide a direct link to an image.</p>
                  </div>
                </div>

                {/* Image Preview */}
                {formData.image && (
                  <div className="relative mt-4 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center h-48 w-full group">
                    <img src={formData.image} alt="Event banner preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="absolute top-3 right-3 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-xl transition-all shadow-md opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

            </form>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#171C3C] text-white rounded-xl font-medium hover:bg-[#2a3154] transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</>
                ) : (
                  <>Save {formData.eventType}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-[#171C3C] mb-2">Delete Event?</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete this event? This action cannot be undone and will permanently remove it from your profile.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setEventToDelete(null)}
                  className="px-6 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors w-full"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors w-full"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
