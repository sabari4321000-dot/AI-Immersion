import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { storage } from '../services/storage';
import { Announcement, AnnouncementCategory } from '../types';
import {
  Megaphone,
  Pin,
  Search,
  Plus,
  Trash2,
  Calendar,
  X,
  AlertCircle,
  Tag,
  CheckCircle2,
} from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const { showToast, triggerRefresh, currentUser } = useApp();

  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    storage.getAnnouncements()
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal
  const [isPublishing, setIsPublishing] = useState(false);
  const [newNotice, setNewNotice] = useState<Omit<Announcement, 'id'>>({
    title: '',
    content: '',
    category: 'academic',
    date: new Date().toISOString().split('T')[0],
    authorName: currentUser.name,
    authorRole: currentUser.role === 'faculty' ? 'Faculty' : 'Registrar Office',
    isPinned: false,
    departmentScope: 'All',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const refreshData = () => {
    setAnnouncements(storage.getAnnouncements());
    triggerRefresh();
  };

  const categories: Array<{ id: string; label: string }> = [
    { id: 'All', label: 'All Notices' },
    { id: 'academic', label: 'Academic' },
    { id: 'exam', label: 'Examinations' },
    { id: 'event', label: 'Events & Hackathons' },
    { id: 'urgent', label: 'Urgent Advisories' },
  ];

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const pinnedAnnouncements = filteredAnnouncements.filter((a) => a.isPinned);
  const regularAnnouncements = filteredAnnouncements.filter((a) => !a.isPinned);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!newNotice.title.trim()) errors.title = 'Title is required';
    if (!newNotice.content.trim()) errors.content = 'Notice announcement content is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    storage.addAnnouncement(newNotice);
    showToast(`Circular "${newNotice.title}" published!`, 'success');
    setIsPublishing(false);
    setNewNotice({
      title: '',
      content: '',
      category: 'academic',
      date: new Date().toISOString().split('T')[0],
      authorName: currentUser.name,
      authorRole: currentUser.role,
      isPinned: false,
      departmentScope: 'All',
    });
    refreshData();
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete circular "${title}"?`)) {
      storage.deleteAnnouncement(id);
      showToast('Announcement deleted', 'info');
      refreshData();
    }
  };

  const handleTogglePin = (id: string) => {
    storage.togglePinAnnouncement(id);
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Campus Announcements & Circulars
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Official university notices, exam notifications, and campus events.
          </p>
        </div>

        <button
          onClick={() => {
            setFormErrors({});
            setIsPublishing(true);
          }}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Notice</span>
        </button>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search circulars by keyword..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto self-start sm:self-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === c.id
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pinned Circulars Spotlight */}
      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
            <Pin className="w-3.5 h-3.5 rotate-45" />
            <span>Pinned University Notices</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-2xl border border-indigo-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {ann.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                      {ann.date}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2">{ann.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{ann.content}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    By <strong className="text-slate-800">{ann.authorName}</strong> ({ann.authorRole})
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePin(ann.id)}
                      className="p-1 text-indigo-600 hover:text-indigo-800 rounded"
                      title="Unpin"
                    >
                      <Pin className="w-3.5 h-3.5 rotate-45" />
                    </button>
                    <button
                      onClick={() => handleDelete(ann.id, ann.title)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Announcements Stream */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Recent Bulletins
        </h3>
        <div className="space-y-3">
          {regularAnnouncements.length > 0 ? (
            regularAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        ann.category === 'exam'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : ann.category === 'urgent'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {ann.category}
                    </span>
                    <span className="text-[11px] text-slate-400">·</span>
                    <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                      {ann.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePin(ann.id)}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                      title="Pin notice"
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(ann.id, ann.title)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      title="Delete notice"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug mb-1.5">{ann.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{ann.content}</p>

                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  Published by <span className="font-semibold text-slate-700">{ann.authorName}</span> · {ann.authorRole}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
              No bulletins found.
            </div>
          )}
        </div>
      </div>

      {/* PUBLISH MODAL */}
      {isPublishing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">Publish Campus Announcement</h3>
              <button
                onClick={() => setIsPublishing(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Headline *</label>
                <input
                  type="text"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="e.g. Schedule for Autumn Semester Mid-Term Examinations"
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
                {formErrors.title && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newNotice.category}
                    onChange={(e) =>
                      setNewNotice({ ...newNotice, category: e.target.value as AnnouncementCategory })
                    }
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none capitalize"
                  >
                    <option value="academic">Academic Circular</option>
                    <option value="exam">Examination Notice</option>
                    <option value="event">Campus Event / Hackathon</option>
                    <option value="urgent">Urgent Advisory</option>
                    <option value="cultural">Cultural & Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={newNotice.authorName}
                    onChange={(e) => setNewNotice({ ...newNotice, authorName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Content *</label>
                <textarea
                  rows={5}
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Full circular text, guidelines, instructions, or venue details..."
                  className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                />
                {formErrors.content && (
                  <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.content}</p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinToggle"
                  checked={newNotice.isPinned}
                  onChange={(e) => setNewNotice({ ...newNotice, isPinned: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="pinToggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Pin this circular to top of dashboard & announcements
                </label>
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 -mx-5 -mb-5">
                <button
                  type="button"
                  onClick={() => setIsPublishing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs"
                >
                  Publish Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
