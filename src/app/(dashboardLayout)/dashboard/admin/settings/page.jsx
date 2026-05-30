'use client';
import { API_URL } from '@/config/api';
import React, { useState } from 'react';
import { FiSettings, FiSave, FiLock } from 'react-icons/fi';

export default function SettingsPage() {
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }

    setUpdatingPassword(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/update-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(passwordData)
      });
      const result = await response.json();
      if (response.ok) {
        setPasswordSuccess('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        setPasswordError(result.message || 'Failed to update password.');
      }
    } catch (err) {
      setPasswordError('Something went wrong. Please try again.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-5 rounded-md border border-gray-200 dark:border-slate-700">
        <div className="w-10 h-10 bg-slate-700 dark:bg-slate-600 rounded-md flex items-center justify-center">
          <FiSettings className="text-white" size={18} />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Settings</h1>
          <p className="text-sm text-slate-500">Manage your account security</p>
        </div>
      </div>

      {/* Security / Password */}
      <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 p-5 max-w-2xl">
        <h3 className="text-base font-semibold text-slate-800 dark:text-white pb-3 border-b border-gray-200 dark:border-slate-700">Security Settings</h3>

        <form onSubmit={handlePasswordUpdate} className="mt-5 p-4 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <FiLock className="text-blue-500" size={16} />
            <p className="text-sm font-medium text-slate-800 dark:text-white">Update Password</p>
          </div>

          {passwordError && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-xs border border-red-200">{passwordError}</div>
          )}
          {passwordSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 rounded-md text-xs border border-emerald-200">{passwordSuccess}</div>
          )}

          <div className="space-y-3 max-w-md">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">Current Password</label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-blue-400 outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">New Password</label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-blue-400 outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordData.confirmNewPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-blue-400 outline-none text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={updatingPassword}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <FiSave size={14} />
              {updatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
