import { useState, useEffect } from 'react';
import { getFaculty } from '../api/api';

export default function ViewFaculty() {
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    getFaculty().then((r) => setFaculties(r.data)).catch(() => {});
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">All Faculty Members</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['#', 'Name', 'Email', 'Phone', 'UID'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {faculties.length > 0 ? faculties.map((f, i) => (
              <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-600">{i + 1}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{f.first_name} {f.last_name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{f.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{f.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{f.uid}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">No faculty found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
