import { useState, useEffect } from 'react';
import { getAttendance } from '../api/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { HiOutlineSearch, HiOutlineCalendar, HiOutlineClipboardCheck } from 'react-icons/hi';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ViewAttendance() {
  const [records, setRecords] = useState([]);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [search, setSearch] = useState('');

  const fetchData = (q = '') => {
    getAttendance(q).then((r) => {
      setRecords(r.data.records);
      setPresentCount(r.data.present_count);
      setAbsentCount(r.data.absent_count);
    }).catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(search);
  };

  const attendanceRate = presentCount + absentCount > 0 
    ? ((presentCount / (presentCount + absentCount)) * 100).toFixed(1) 
    : 0;

  const chartData = {
    labels: ['Present', 'Absent'],
    datasets: [{
      data: [presentCount, absentCount],
      backgroundColor: ['#10b981', '#ef4444'],
      borderWidth: 0,
      borderRadius: 8,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 12, weight: '600' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 12,
        titleFont: { size: 14, weight: '600' },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      }
    },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <HiOutlineClipboardCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Attendance Records</h1>
              <p className="text-amber-100 text-sm">Monitor and analyze attendance across all classes</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <HiOutlineSearch className="w-5 h-5 text-amber-600" />
              Search Records
            </label>
            <div className="flex gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Registration ID or Faculty UID"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button 
                type="submit" 
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Search
              </button>
              {search && (
                <button 
                  type="button" 
                  onClick={() => { setSearch(''); fetchData(''); }} 
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Analytics Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <HiOutlineCalendar className="w-5 h-5 text-amber-600" />
              Attendance Analytics
            </h4>
            {(presentCount > 0 || absentCount > 0) ? (
              <div className="space-y-4">
                <div className="h-40">
                  <Pie data={chartData} options={chartOptions} />
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                    <div className="text-xs text-gray-500 font-medium">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                    <div className="text-xs text-gray-500 font-medium">Absent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">{attendanceRate}%</div>
                    <div className="text-xs text-gray-500 font-medium">Rate</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                No data available
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                {['Date', 'Time', 'Faculty', 'Student', 'Class', 'Period', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.length > 0 ? (
                records.map((a, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.5) }}
                    whileHover={{ backgroundColor: 'rgb(249, 250, 251)' }}
                    className="transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <HiOutlineCalendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{a.date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-gray-100 rounded-full font-medium text-xs">
                        {a.period_time || a.time}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{a.faculty_name}</div>
                        <div className="text-xs text-gray-500 font-mono">{a.faculty_uid}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{a.student_name}</div>
                        <div className="text-xs text-gray-500 font-mono">{a.student_id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                          {a.branch}
                        </span>
                        <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full">
                          Year {a.year}
                        </span>
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full">
                          {a.section}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                        Period {a.period}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold ${
                        a.status === 'Present' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {a.status === 'Present' ? '✓' : '✗'} {a.status}
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <HiOutlineClipboardCheck className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No attendance records found</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {search ? 'Try adjusting your search' : 'Records will appear here once attendance is marked'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
