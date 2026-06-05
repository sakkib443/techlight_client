'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiUsers, FiBook, FiArrowRight, FiActivity,
  FiRefreshCw, FiCheckCircle, FiStar, FiPlay, FiGrid,
  FiZap, FiAward, FiLayers, FiUserCheck
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_URL } from '@/config/api';

// ==================== ANIMATED COUNTER ====================
const AnimatedCounter = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const numValue = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, '')) || 0;
    const increment = numValue / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numValue) {
        setCount(numValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

// ==================== STATS CARD ====================
const StatsCard = ({ title, value, icon: Icon, color, loading, subtitle }) => {
  const { isDark } = useTheme();
  return (
    <div className={`rounded-md p-5 transition-all duration-300 border ${isDark
      ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{title}</p>
          <p className={`text-2xl font-semibold mt-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {loading ? (
              <span className={`inline-block w-20 h-7 animate-pulse rounded ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
            ) : (
              <AnimatedCounter value={value} />
            )}
          </p>
          {subtitle && <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-md ${color} flex items-center justify-center text-white`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
};

// ==================== ACTIVITY ITEM ====================
const ActivityItem = ({ icon: Icon, title, description, time, color, isNew }) => {
  const { isDark } = useTheme();
  return (
    <div className={`flex items-start gap-3 p-3 transition-all ${isNew ? (isDark ? 'bg-indigo-500/10' : 'bg-indigo-50') : ''}`}>
      <div
        className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
        style={{ background: `${color}15` }}
      >
        <Icon className="text-sm" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{title}</p>
          {isNew && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
        </div>
        <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{description}</p>
      </div>
      <span className={`text-xs shrink-0 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{time}</span>
    </div>
  );
};

// ==================== HELPER ====================
const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

// ==================== MAIN DASHBOARD ====================
export default function AdminDashboard() {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalLessons: 0,
    totalStudents: 0,
    totalUsers: 0,
    totalEnrollments: 0,
    activeEnrollments: 0,
    completedEnrollments: 0,
    categories: 0,
    totalCertificates: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');

    try {
      setRefreshing(true);

      const summaryRes = await fetch(`${API_URL}/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data: summary } = await summaryRes.json();

      setDashboardData({
        totalCourses: summary?.totalCourses || 0,
        publishedCourses: summary?.publishedCourses || 0,
        totalLessons: summary?.totalLessons || 0,
        totalStudents: summary?.totalStudents || 0,
        totalUsers: summary?.totalUsers || 0,
        totalEnrollments: summary?.totalEnrollments || 0,
        activeEnrollments: summary?.activeEnrollments || 0,
        completedEnrollments: summary?.completedEnrollments || 0,
        categories: summary?.totalCategories || 0,
        totalCertificates: summary?.totalCertificates || 0,
      });

      // Recent activity from notifications
      try {
        const notifRes = await fetch(`${API_URL}/notifications?limit=6`, { headers: { Authorization: `Bearer ${token}` } });
        const notifData = await notifRes.json();
        if (notifData.data) {
          setRecentActivities(notifData.data.map((n) => ({
            icon: n.type === 'order' ? FiCheckCircle : n.type === 'enrollment' ? FiUsers : n.type === 'review' ? FiStar : FiActivity,
            title: n.title,
            description: n.message,
            time: getTimeAgo(new Date(n.createdAt)),
            color: n.type === 'order' ? '#10B981' : n.type === 'enrollment' ? '#3B82F6' : n.type === 'review' ? '#F59E0B' : '#6366F1',
            isNew: !n.isRead,
          })));
        }
      } catch (e) {
        console.log('Notifications fetch error:', e);
      }

      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Headline stats (no money)
  const mainStats = [
    {
      title: 'Total Students',
      value: dashboardData.totalStudents,
      subtitle: 'Enrolled learners',
      icon: FiUsers,
      color: 'bg-indigo-600',
    },
    {
      title: 'Total Courses',
      value: dashboardData.totalCourses,
      subtitle: `${dashboardData.publishedCourses || 0} published`,
      icon: FiBook,
      color: 'bg-amber-500',
    },
    {
      title: 'Certificates',
      value: dashboardData.totalCertificates,
      subtitle: 'Issued to students',
      icon: FiAward,
      color: 'bg-emerald-600',
    },
    {
      title: 'Total Users',
      value: dashboardData.totalUsers,
      subtitle: 'Registered accounts',
      icon: FiGrid,
      color: 'bg-rose-500',
    },
  ];

  // Content quick-links with counts
  const contentStats = [
    { title: 'Courses', value: dashboardData.totalCourses, icon: FiBook, color: 'bg-indigo-600', href: '/dashboard/admin/course' },
    { title: 'Lessons', value: dashboardData.totalLessons, icon: FiPlay, color: 'bg-cyan-600', href: '/dashboard/admin/lesson' },
    { title: 'Categories', value: dashboardData.categories, icon: FiLayers, color: 'bg-amber-500', href: '/dashboard/admin/category' },
    { title: 'Certificates', value: dashboardData.totalCertificates, icon: FiAward, color: 'bg-rose-500', href: '/dashboard/admin/certification' },
  ];

  const quickActions = [
    { title: 'Add Course', href: '/dashboard/admin/course/create', icon: FiBook, color: 'bg-amber-500' },
    { title: 'Add Lesson', href: '/dashboard/admin/lesson/create', icon: FiPlay, color: 'bg-cyan-600' },
    { title: 'Add Category', href: '/dashboard/admin/category/create', icon: FiLayers, color: 'bg-indigo-600' },
    { title: 'Add Mentor', href: '/dashboard/admin/instructor/create', icon: FiUserCheck, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* ==================== HEADER ==================== */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-md border p-4 ${isDark
        ? 'bg-slate-800 border-slate-700'
        : 'bg-white border-gray-200'
        }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-indigo-600 flex items-center justify-center">
            <FiGrid className="text-white" size={18} />
          </div>
          <div>
            <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Dashboard Overview</h1>
            <p suppressHydrationWarning className={`text-sm font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={refreshing}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-normal transition-all disabled:opacity-50 border ${isDark
            ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
            }`}
        >
          <FiRefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* ==================== MAIN STATS ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((stat) => (
          <StatsCard key={stat.title} {...stat} loading={loading} />
        ))}
      </div>

      {/* ==================== CONTENT QUICK-LINKS ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {contentStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className={`rounded-md border p-4 transition-all ${isDark
                ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-md ${stat.color} flex items-center justify-center`}>
                  <Icon className="text-white" size={18} />
                </div>
                <div>
                  <p className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {loading ? '...' : (stat.value || 0).toLocaleString()}
                  </p>
                  <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{stat.title}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ==================== QUICK ACTIONS + RECENT ACTIVITY ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className={`p-5 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-amber-100 text-amber-600 rounded-md flex items-center justify-center">
              <FiZap size={18} />
            </div>
            <div>
              <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Quick Actions</h2>
              <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Manage your platform</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className={`flex flex-col items-center gap-2 p-3 rounded-md border transition-all ${isDark
                    ? 'border-slate-700 hover:border-slate-600 hover:bg-slate-700/50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <div className={`w-9 h-9 rounded-md ${action.color} flex items-center justify-center`}>
                    <Icon className="text-white" size={16} />
                  </div>
                  <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{action.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`lg:col-span-2 rounded-md border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Recent Activity</h2>
            <Link href="/dashboard/admin/notifications" className="text-sm font-normal text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className={`divide-y max-h-[350px] overflow-y-auto ${isDark ? 'divide-slate-700' : 'divide-gray-100'}`}>
            {loading ? (
              <div className={`p-6 text-center ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                <FiRefreshCw className="animate-spin mx-auto mb-2" size={20} />
                <p className="text-sm">Loading...</p>
              </div>
            ) : recentActivities.length === 0 ? (
              <div className={`p-6 text-center ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                <FiActivity className="mx-auto mb-2" size={20} />
                <p className="text-sm">No recent activities</p>
              </div>
            ) : (
              recentActivities.map((activity, idx) => (
                <ActivityItem key={idx} {...activity} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
