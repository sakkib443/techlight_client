'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FiFolder, FiPlus, FiRefreshCw, FiSearch, FiEdit3, FiTrash2, FiX, FiCheck, FiImage, FiGrid, FiLoader, FiAlertCircle, FiUpload } from 'react-icons/fi';
import { API_URL } from '@/config/api';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editData, setEditData] = useState(null);
  const [editErrors, setEditErrors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const imageInputRef = useRef(null);

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);
    setImageUploading(true);
    try {
      const res = await fetch(`${API_URL}/upload/single`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        setEditData(prev => ({ ...prev, image: data.data.url }));
        toast.success('Image uploaded!');
      } else { toast.error(data.message || 'Upload failed'); }
    } catch { toast.error('Upload failed'); }
    finally { setImageUploading(false); }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/categories/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setCategories(json?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openEdit = (cat) => { setEditErrors([]); setEditData({ ...cat }); };
  const closeEdit = () => { setEditErrors([]); setEditData(null); };

  const filtered = categories.filter((cat) => cat.name?.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: categories.length,
    active: categories.filter((c) => c.status === 'active').length,
    inactive: categories.filter((c) => c.status !== 'active').length,
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/categories/admin/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      if (res.ok && result.success) {
        toast.success('Category deleted');
        fetchCategories();
      } else {
        toast.error(result.message || 'Failed to delete');
      }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditErrors([]);
    if (!editData.name?.trim()) {
      setEditErrors([{ path: 'name', message: 'Name is required' }]);
      return;
    }
    setSaving(true);
    const payload = {
      name: editData.name.trim(),
      slug: editData.slug || '',
      description: editData.description || '',
      image: editData.image || '',
      status: editData.status || 'active',
    };
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/categories/admin/${editData._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        toast.success('Category updated');
        closeEdit();
        fetchCategories();
      } else {
        setEditErrors(result.errorMessages?.length ? result.errorMessages : [{ path: '', message: result.message || 'Failed to update' }]);
      }
    } catch (err) {
      setEditErrors([{ path: '', message: 'Network error. Please try again.' }]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <FiFolder className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Categories</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Organize your courses</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchCategories} className="p-2.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg transition-colors">
            <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link href="/dashboard/admin/category/create">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">
              <FiPlus size={16} /> New Category
            </button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-slate-600 dark:text-slate-300' },
          { label: 'Active', value: stats.active, color: 'text-emerald-500' },
          { label: 'Inactive', value: stats.inactive, color: 'text-gray-400' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
            <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          placeholder="Search categories by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/15 outline-none text-sm transition-all"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <FiLoader className="animate-spin text-blue-500" size={32} />
          <p className="text-sm text-slate-500">Loading categories...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
          <FiFolder size={48} className="text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white">
            {categories.length === 0 ? 'No Categories Yet' : 'No categories match your search'}
          </h3>
          {categories.length === 0 && (
            <>
              <p className="text-sm text-slate-500 mt-1">Create your first category to get started.</p>
              <Link href="/dashboard/admin/category/create">
                <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg">
                  <FiPlus size={16} /> Create Category
                </button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((cat) => (
            <div key={cat._id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center text-white overflow-hidden shrink-0">
                  {cat.image ? <img src={cat.image} className="w-full h-full object-cover" alt="" /> : <FiFolder size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-slate-800 dark:text-white truncate">{cat.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">/{cat.slug}</p>
                </div>
              </div>
              {cat.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{cat.description}</p>
              )}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${cat.status === 'active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-gray-100 text-gray-500 dark:bg-slate-700'}`}>
                  {cat.status}
                </span>
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-slate-700">
                <button onClick={() => openEdit(cat)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors">
                  <FiEdit3 size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50 p-4">
          <div className="bg-white dark:bg-slate-800 h-full w-full max-w-md rounded-xl shadow-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white bg-blue-500">
                  <FiEdit3 size={18} />
                </div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-white">Edit Category</h3>
              </div>
              <button onClick={closeEdit} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-4 space-y-4 overflow-y-auto flex-1">
              {editErrors.length > 0 && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg space-y-1">
                  {editErrors.map((err, i) => (
                    <p key={i} className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1.5">
                      <FiAlertCircle size={12} /> {err.path ? `${err.path.split('.').pop()}: ${err.message}` : err.message}
                    </p>
                  ))}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/15 outline-none transition-all"
                  placeholder="Category name"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">Slug</label>
                <input
                  type="text"
                  value={editData.slug || ''}
                  onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-mono focus:border-blue-400 focus:ring-2 focus:ring-blue-400/15 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">Image</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input type="text" value={editData.image || ''}
                      onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                      className="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/15 outline-none transition-all"
                      placeholder="https://... or upload" />
                    <button type="button" onClick={() => imageInputRef.current?.click()} disabled={imageUploading}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-medium rounded-lg border border-indigo-200 transition-all disabled:opacity-50">
                      {imageUploading ? <FiLoader size={14} className="animate-spin" /> : <FiUpload size={14} />} Upload
                    </button>
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
                  </div>
                  {editData.image && <img src={editData.image} alt="preview" className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-slate-700" onError={(e) => (e.currentTarget.style.display = 'none')} />}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">Description</label>
                <textarea
                  value={editData.description || ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/15 outline-none transition-all resize-none"
                  placeholder="Category description..."
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</p>
                  <p className="text-xs text-slate-500">{editData.status === 'active' ? 'Visible to users' : 'Hidden'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditData({ ...editData, status: editData.status === 'active' ? 'inactive' : 'active' })}
                  className={`w-12 h-6 rounded-full transition-colors flex items-center p-0.5 ${editData.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${editData.status === 'active' ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex gap-2 pt-4">
                <button type="button" onClick={closeEdit} className="flex-1 py-2.5 bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                  {saving ? <FiLoader className="animate-spin" size={16} /> : <FiCheck size={16} />} Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
