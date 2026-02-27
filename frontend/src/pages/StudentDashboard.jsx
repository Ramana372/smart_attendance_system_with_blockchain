import { useState, useEffect } from 'react';
import { getStudentDashboard } from '../api/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
  HiOutlineCheckCircle,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineBookOpen,
  HiOutlineUser,
  HiOutlineChartBar,
} from 'react-icons/hi';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StudentDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getStudentDashboard().then((r) => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  const { student, records, summary } = data;

  const chartData = {
    labels: ['Present', 'Absent'],
    datasets: [{
      data: [summary.present, summary.absent],
      backgroundColor: ['#10b981', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back, {student.first_name}! 👋</h1>
            <p className="text-indigo-100">Track your attendance and academic progress</p>
          </div>
          <HiOutlineUser className="w-24 h-24 text-white opacity-20 hidden md:block" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Attendance Rate', value: `${summary.percentage}%`, color: 'green', icon: <HiOutlineCheckCircle className="w-8 h-8 text-green-600" /> },
          { label: 'Present Days', value: summary.present, color: 'blue', icon: <HiOutlineCheck className="w-8 h-8 text-blue-600" /> },
          { label: 'Absent Days', value: summary.absent, color: 'red', icon: <HiOutlineX className="w-8 h-8 text-red-600" /> },
          { label: 'Total Classes', value: summary.total, color: 'purple', icon: <HiOutlineBookOpen className="w-8 h-8 text-purple-600" /> },
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

      {/* Profile + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <HiOutlineUser className="w-5 h-5 mr-2 text-indigo-600" />
            Profile Information
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Name', value: `${student.first_name} ${student.last_name}` },
              { label: 'Registration ID', value: student.registration_id },
              { label: 'Branch', value: student.branch },
              { label: 'Year', value: student.year },
              { label: 'Section', value: student.section },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between pb-2 border-b last:border-b-0">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <HiOutlineChartBar className="w-5 h-5 mr-2 text-indigo-600" />
            Attendance Analytics
          </h3>
          {summary.total > 0 ? (
            <div className="flex items-center justify-center">
              <div className="w-72 h-72">
                <Doughnut data={chartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { padding: 20, font: { size: 14 } } } },
                }} />
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <HiOutlineChartBar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No attendance data available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <HiOutlineCheckCircle className="w-5 h-5 mr-2 text-indigo-600" />
          Attendance History
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Date', 'Time', 'Faculty', 'Period', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.length > 0 ? records.map((a, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{a.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{a.time}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{a.faculty_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{a.period}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${a.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {a.status === 'Present' ? '✓ Present' : '✗ Absent'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No attendance records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
