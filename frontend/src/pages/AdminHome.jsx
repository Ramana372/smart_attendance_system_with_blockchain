import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../api/api';
import {
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineClipboardList,
  HiOutlinePlusCircle,
  HiOutlineViewList,
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlineTrendingUp,
  HiOutlineCalendar,
  HiOutlineLightningBolt,
} from 'react-icons/hi';
import { motion } from 'framer-motion';

export default function AdminHome() {
  const [stats, setStats] = useState({ total_students: 0, total_faculty: 0, total_attendance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((r) => {
        setStats(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: 'Total Students',
      value: stats.total_students,
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      icon: <HiOutlineUserGroup className="w-8 h-8" />,
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    },
    {
      label: 'Total Faculty',
      value: stats.total_faculty,
      color: 'from-emerald-500 to-green-500',
      bg: 'bg-emerald-50',
      icon: <HiOutlineAcademicCap className="w-8 h-8" />,
      gradient: 'bg-gradient-to-br from-emerald-500 to-green-500',
    },
    {
      label: 'Attendance Records',
      value: stats.total_attendance,
      color: 'from-violet-500 to-purple-500',
      bg: 'bg-violet-50',
      icon: <HiOutlineClipboardList className="w-8 h-8" />,
      gradient: 'bg-gradient-to-br from-violet-500 to-purple-500',
    },
  ];

  const managementCards = [
    {
      title: 'Students',
      description: 'Manage student profiles, registrations, and academic details',
      gradient: 'from-blue-600 to-cyan-600',
      hoverGradient: 'hover:from-blue-700 hover:to-cyan-700',
      icon: <HiOutlineUserGroup className="w-12 h-12" />,
      actions: [
        { to: '/admin/add-student', label: 'Add New Student', icon: <HiOutlinePlusCircle className="w-5 h-5" /> },
        { to: '/admin/students', label: 'View All Students', icon: <HiOutlineViewList className="w-5 h-5" /> },
      ],
    },
    {
      title: 'Faculty',
      description: 'Manage faculty members, UIDs, and system access',
      gradient: 'from-emerald-600 to-green-600',
      hoverGradient: 'hover:from-emerald-700 hover:to-green-700',
      icon: <HiOutlineAcademicCap className="w-12 h-12" />,
      actions: [
        { to: '/admin/add-faculty', label: 'Add New Faculty', icon: <HiOutlinePlusCircle className="w-5 h-5" /> },
        { to: '/admin/faculty', label: 'View All Faculty', icon: <HiOutlineViewList className="w-5 h-5" /> },
      ],
    },
    {
      title: 'Attendance',
      description: 'Monitor, search, and analyze attendance records across all classes',
      gradient: 'from-amber-500 to-orange-500',
      hoverGradient: 'hover:from-amber-600 hover:to-orange-600',
      icon: <HiOutlineClipboardList className="w-12 h-12" />,
      actions: [
        { to: '/admin/attendance', label: 'View Records', icon: <HiOutlineEye className="w-5 h-5" /> },
        { to: '/admin/attendance', label: 'Search Attendance', icon: <HiOutlineSearch className="w-5 h-5" /> },
      ],
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section with Animated Background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  Admin Dashboard
                </h1>
                <p className="text-lg text-indigo-100 max-w-xl">
                  Complete control center for managing students, faculty, and AI-powered attendance system
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4 mt-6"
              >
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <HiOutlineLightningBolt className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">AI-Powered Face Recognition</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <HiOutlineCalendar className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-medium">Real-time Tracking</span>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <HiOutlineClipboardList className="w-20 h-20 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Animated Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl shadow-lg p-6 border border-gray-100 overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.gradient} opacity-5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150`}></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="text-4xl font-bold text-gray-800 mt-2"
                  >
                    {stat.value.toLocaleString()}
                  </motion.h3>
                  <div className="flex items-center gap-1 mt-2 text-green-600">
                    <HiOutlineTrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">Active & Growing</span>
                  </div>
                </div>
                
                <div className={`${stat.bg} rounded-2xl p-4 ${stat.color.replace('from-', 'text-').split(' ')[0]}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Management Cards */}
      <div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
        >
          <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
          Quick Management
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {managementCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              {/* Card Header with Gradient */}
              <div className={`bg-gradient-to-r ${card.gradient} ${card.hoverGradient} p-6 text-white transition-all duration-300 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold">{card.title}</h3>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                      {card.icon}
                    </div>
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
              
              {/* Card Actions */}
              <div className="p-6 space-y-3">
                {card.actions.map((action, actionIndex) => (
                  <Link
                    key={actionIndex}
                    to={action.to}
                    className="group/action flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                  >
                    <div className={`rounded-xl p-2 mr-4 transition-all duration-200 ${card.bg} group-hover/action:scale-110`}>
                      <div className={card.color.replace('from-', 'text-').split(' ')[0]}>
                        {action.icon}
                      </div>
                    </div>
                    <span className="font-medium text-gray-700 group-hover/action:text-gray-900">
                      {action.label}
                    </span>
                    <div className="ml-auto opacity-0 group-hover/action:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Tips Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 text-white"
      >
        <div className="flex items-start gap-4">
          <div className="bg-yellow-400/20 rounded-xl p-3">
            <HiOutlineLightningBolt className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Pro Tips for Efficient Management</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Use bulk operations in the Students and Faculty pages for faster updates</li>
              <li>• Search by Registration ID or Faculty UID to quickly find records</li>
              <li>• Monitor attendance trends regularly to identify patterns</li>
              <li>• Faculty can mark attendance using AI face recognition for 5 minutes per session</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
