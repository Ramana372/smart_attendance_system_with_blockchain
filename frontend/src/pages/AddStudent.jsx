import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addStudent } from '../api/api';
import Toast from '../components/Toast';

const BRANCHES = ['CSE', 'IT', 'ECE', 'CHEM', 'MECH', 'EEE'];
const YEARS = ['1', '2', '3', '4'];

export default function AddStudent() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    registration_id: '', branch: 'CSE', year: '1', section: '', profile_pic: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((p) => ({ ...p, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== null) fd.append(k, v); });
    try {
      await addStudent(fd);
      setToast({ msg: 'Student added successfully!', type: 'success' });
      setTimeout(() => navigate('/admin/students'), 1200);
    } catch (err) {
      setToast({ msg: err.response?.data?.error || 'Error adding student', type: 'error' });
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Add New Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input name="first_name" value={form.first_name} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input name="last_name" value={form.last_name} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration ID</label>
            <input name="registration_id" value={form.registration_id} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400" required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select name="branch" value={form.branch} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400">
                {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select name="year" value={form.year} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400">
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <input name="section" value={form.section} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <input name="profile_pic" type="file" accept="image/*" onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <p className="text-xs text-gray-500">Username and password will be the registration number.</p>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow font-medium">
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
}
