import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFaculty } from '../api/api';
import Toast from '../components/Toast';

export default function AddFaculty() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', uid: '', phone: '', profile_pic: null,
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
      await addFaculty(fd);
      setToast({ msg: 'Faculty added successfully!', type: 'success' });
      setTimeout(() => navigate('/admin/faculty'), 1200);
    } catch (err) {
      setToast({ msg: err.response?.data?.error || 'Error adding faculty', type: 'error' });
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-green-700">Add New Faculty</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input name="first_name" value={form.first_name} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input name="last_name" value={form.last_name} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faculty UID <span className="text-xs text-gray-500">(Used as username & password)</span>
            </label>
            <input name="uid" value={form.uid} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <input name="profile_pic" type="file" accept="image/*" onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <p className="text-xs text-gray-500">Username and password will be the Faculty UID.</p>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow font-medium">
            Add Faculty
          </button>
        </form>
      </div>
    </div>
  );
}
