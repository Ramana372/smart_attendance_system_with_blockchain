import { useState, useEffect } from 'react';
import { getAttendance } from '../api/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

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

  const chartData = {
    labels: ['Present', 'Absent'],
    datasets: [{
      data: [presentCount, absentCount],
      backgroundColor: ['#34d399', '#f87171'],
      borderWidth: 0,
    }],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-6xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold">Attendance Records</h2>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search by Registration No. or Faculty UID</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter registration no. or UID"
            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400 w-72"
          />
        </div>
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">Search</button>
        {search && (
          <button type="button" onClick={() => { setSearch(''); fetchData(''); }} className="text-sm text-gray-500 underline ml-2">Clear</button>
        )}
      </form>

      {/* Chart */}
      {(presentCount > 0 || absentCount > 0) && (
        <div className="max-w-xs">
          <h4 className="font-semibold mb-2">Attendance Analytics</h4>
          <Pie data={chartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
        </div>
      )}

      {/* Table */}
      {records.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Date', 'Time', 'Faculty', 'Student', 'Branch', 'Year', 'Section', 'Period', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-2 text-left text-sm font-medium text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {records.map((a, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{a.date}</td>
                  <td className="px-4 py-2 text-sm">{a.time}</td>
                  <td className="px-4 py-2 text-sm">{a.faculty_name}</td>
                  <td className="px-4 py-2 text-sm">{a.student_name} ({a.student_id})</td>
                  <td className="px-4 py-2 text-sm">{a.branch}</td>
                  <td className="px-4 py-2 text-sm">{a.year}</td>
                  <td className="px-4 py-2 text-sm">{a.section}</td>
                  <td className="px-4 py-2 text-sm">{a.period}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${a.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No attendance records found.</p>
      )}
    </div>
  );
}
