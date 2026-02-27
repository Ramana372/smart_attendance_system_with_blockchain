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
} from 'react-icons/hi';

export default function AdminHome() {
  const [stats, setStats] = useState({ total_students: 0, total_faculty: 0, total_attendance: 0 });

  useEffect(() => {
    getAdminStats().then((r) => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard 👨‍💼</h1>
            <p className="text-purple-100">Manage students, faculty, and attendance system</p>
          </div>
          <HiOutlineClipboardList className="w-24 h-24 text-white opacity-20 hidden md:block" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Students', value: stats.total_students, color: 'blue', icon: <HiOutlineUserGroup className="w-8 h-8 text-blue-600" /> },
          { label: 'Total Faculty', value: stats.total_faculty, color: 'green', icon: <HiOutlineAcademicCap className="w-8 h-8 text-green-600" /> },
          { label: 'Total Records', value: stats.total_attendance, color: 'yellow', icon: <HiOutlineClipboardList className="w-8 h-8 text-yellow-600" /> },
        ].map((s, i) => (
          <div key={i} className={`bg-white rounded-xl shadow-md p-6 border-l-4 border-${s.color}-500 hover:shadow-lg transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{s.label}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{s.value}</h3>
              </div>
              <div className={`bg-${s.color}-100 rounded-full p-3`}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Students */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Students</h3>
              <HiOutlineUserGroup className="w-10 h-10 opacity-70" />
            </div>
            <p className="text-blue-100 text-sm mt-2">Manage student profiles and information</p>
          </div>
          <div className="p-6 space-y-3">
            <Link to="/admin/add-student" className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors group">
              <div className="bg-blue-100 rounded-full p-2 mr-3 group-hover:bg-blue-200">
                <HiOutlinePlusCircle className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-medium text-gray-700">Add New Student</span>
            </Link>
            <Link to="/admin/students" className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors group">
              <div className="bg-blue-100 rounded-full p-2 mr-3 group-hover:bg-blue-200">
                <HiOutlineViewList className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-medium text-gray-700">View All Students</span>
            </Link>
          </div>
        </div>

        {/* Faculty */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Faculty</h3>
              <HiOutlineAcademicCap className="w-10 h-10 opacity-70" />
            </div>
            <p className="text-green-100 text-sm mt-2">Manage faculty profiles and access</p>
          </div>
          <div className="p-6 space-y-3">
            <Link to="/admin/add-faculty" className="flex items-center p-3 rounded-lg hover:bg-green-50 transition-colors group">
              <div className="bg-green-100 rounded-full p-2 mr-3 group-hover:bg-green-200">
                <HiOutlinePlusCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-medium text-gray-700">Add New Faculty</span>
            </Link>
            <Link to="/admin/faculty" className="flex items-center p-3 rounded-lg hover:bg-green-50 transition-colors group">
              <div className="bg-green-100 rounded-full p-2 mr-3 group-hover:bg-green-200">
                <HiOutlineViewList className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-medium text-gray-700">View All Faculty</span>
            </Link>
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Attendance</h3>
              <HiOutlineClipboardList className="w-10 h-10 opacity-70" />
            </div>
            <p className="text-yellow-100 text-sm mt-2">Monitor and search attendance records</p>
          </div>
          <div className="p-6 space-y-3">
            <Link to="/admin/attendance" className="flex items-center p-3 rounded-lg hover:bg-yellow-50 transition-colors group">
              <div className="bg-yellow-100 rounded-full p-2 mr-3 group-hover:bg-yellow-200">
                <HiOutlineEye className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="font-medium text-gray-700">View Records</span>
            </Link>
            <Link to="/admin/attendance" className="flex items-center p-3 rounded-lg hover:bg-yellow-50 transition-colors group">
              <div className="bg-yellow-100 rounded-full p-2 mr-3 group-hover:bg-yellow-200">
                <HiOutlineSearch className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="font-medium text-gray-700">Search Attendance</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
