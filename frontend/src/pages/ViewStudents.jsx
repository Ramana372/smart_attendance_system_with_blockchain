import { useState, useEffect, useRef } from 'react';
import { getStudents, updateStudent, deleteStudent } from '../api/api';
import Toast from '../components/Toast';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';

export default function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [toast, setToast] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    getStudents().then((r) => setStudents(r.data)).catch(() => {
      setToast({ msg: 'Failed to load students', type: 'error' });
    });
  };

  const handleEdit = (student) => {
    setEditing(student.id);
    setEditForm({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      branch: student.branch,
      year: student.year,
      section: student.section,
    });
    setProfilePic(null);
  };

  const handleCancel = () => {
    setEditing(null);
    setEditForm({});
    setProfilePic(null);
  };

  const handleSave = async (id) => {
    const formData = new FormData();
    Object.keys(editForm).forEach(key => {
      formData.append(key, editForm[key]);
    });
    if (profilePic) {
      formData.append('profile_pic', profilePic);
    }

    try {
      await updateStudent(id, formData);
      setToast({ msg: 'Student updated successfully', type: 'success' });
      handleCancel();
      loadStudents();
    } catch (err) {
      setToast({ msg: err.response?.data?.error || 'Failed to update student', type: 'error' });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete student "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteStudent(id);
      setToast({ msg: 'Student deleted successfully', type: 'success' });
      loadStudents();
    } catch (err) {
      setToast({ msg: err.response?.data?.error || 'Failed to delete student', type: 'error' });
    }
  };

  const handlePicClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="w-2 h-6 bg-blue-600 rounded mr-2"></span>
          All Students
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['#', 'Name', 'Registration', 'Branch', 'Year', 'Section', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.length > 0 ? students.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-600">{i + 1}</td>
                  
                  {editing === s.id ? (
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
                      <td className="px-4 py-3 text-sm text-gray-600">{s.registration_id}</td>
                      <td className="px-4 py-3">
                        <select
                          value={editForm.branch}
                          onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                          className="px-2 py-1 text-sm border rounded"
                        >
                          <option value="CSE">CSE</option>
                          <option value="ECE">ECE</option>
                          <option value="EEE">EEE</option>
                          <option value="MECH">MECH</option>
                          <option value="CIVIL">CIVIL</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={editForm.year}
                          onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                          className="px-2 py-1 text-sm border rounded"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editForm.section}
                          onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
                          className="w-16 px-2 py-1 text-sm border rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(s.id)}
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
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.first_name} {s.last_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.registration_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.branch}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.year}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.section}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(s)}
                            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 text-sm font-medium"
                            title="Edit student"
                          >
                            <HiOutlinePencil className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s.id, `${s.first_name} ${s.last_name}`)}
                            className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1 text-sm font-medium"
                            title="Delete student"
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
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
