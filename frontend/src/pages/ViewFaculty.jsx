import { useState, useEffect } from 'react';
import { getFaculty, updateFaculty, deleteFaculty } from '../api/api';
import Toast from '../components/Toast';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

export default function ViewFaculty() {
  const [faculties, setFaculties] = useState([]);
  const [toast, setToast] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = () => {
    getFaculty().then((r) => setFaculties(r.data)).catch(() => {
      setToast({ msg: 'Failed to load faculty', type: 'error' });
    });
  };

  const handleEdit = (faculty) => {
    setEditing(faculty.id);
    setEditForm({
      first_name: faculty.first_name,
      last_name: faculty.last_name,
      email: faculty.email,
      phone: faculty.phone,
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setEditForm({});
  };

  const handleSave = async (id) => {
    const formData = new FormData();
    Object.keys(editForm).forEach(key => {
      formData.append(key, editForm[key]);
    });

    try {
      await updateFaculty(id, formData);
      setToast({ msg: 'Faculty member updated successfully', type: 'success' });
      handleCancel();
      loadFaculty();
    } catch (err) {
      setToast({ msg: err.response?.data?.error || 'Failed to update faculty', type: 'error' });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete faculty member "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteFaculty(id);
      setToast({ msg: 'Faculty member deleted successfully', type: 'success' });
      loadFaculty();
    } catch (err) {
      setToast({ msg: err.response?.data?.error || 'Failed to delete faculty', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="bg-white p-6 rounded-xl shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="w-2 h-6 bg-purple-600 rounded mr-2"></span>
          All Faculty Members
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['#', 'Name', 'Email', 'Phone', 'UID', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {faculties.length > 0 ? faculties.map((f, i) => (
                <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-600">{i + 1}</td>
                  
                  {editing === f.id ? (
                    <>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editForm.first_name}
                            onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                            className="w-24 px-2 py-1 text-sm border rounded"
                            placeholder="First"
                          />
                          <input
                            type="text"
                            value={editForm.last_name}
                            onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                            className="w-24 px-2 py-1 text-sm border rounded"
                            placeholder="Last"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-40 px-2 py-1 text-sm border rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-32 px-2 py-1 text-sm border rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{f.uid}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(f.id)}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            ✓ Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{f.first_name} {f.last_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{f.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{f.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{f.uid}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(f)}
                            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 text-sm font-medium"
                            title="Edit faculty"
                          >
                            <HiOutlinePencil className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(f.id, `${f.first_name} ${f.last_name}`)}
                            className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1 text-sm font-medium"
                            title="Delete faculty"
                          >
                            <HiOutlineTrash className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No faculty found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
