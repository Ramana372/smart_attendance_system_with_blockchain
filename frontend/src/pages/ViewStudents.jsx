import { useState, useEffect } from 'react';
import { getStudents } from '../api/api';

export default function ViewStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents().then((r) => setStudents(r.data)).catch(() => {});
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">All Students</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['#', 'Name', 'Registration', 'Branch', 'Year', 'Section'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length > 0 ? students.map((s, i) => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-600">{i + 1}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.first_name} {s.last_name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{s.registration_id}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{s.branch}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{s.year}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{s.section}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
