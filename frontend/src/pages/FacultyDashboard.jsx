import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getFacultyDashboard, markAttendance } from '../api/api';
import Toast from '../components/Toast';
import {
  HiOutlineCheckCircle,
  HiOutlineVideoCamera,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineCamera,
  HiOutlineLightBulb,
} from 'react-icons/hi';

export default function FacultyDashboard() {
  const [meta, setMeta] = useState(null);
  const [form, setForm] = useState({ branch: '', year: '', section: '', period: '' });
  const [cameraOn, setCameraOn] = useState(false);
  const [captured, setCaptured] = useState(null);
  const [todayRecords, setTodayRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    getFacultyDashboard().then((r) => {
      setMeta(r.data);
      setForm({
        branch: r.data.branches[0] || '',
        year: r.data.years[0] || '',
        section: r.data.sections[0] || '',
        period: r.data.periods[0] || '',
      });
    }).catch(() => {});
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraOn(true);
    } catch (err) {
      setToast({ msg: 'Camera access denied: ' + err.message, type: 'error' });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setCaptured(dataUrl);
    stopCamera();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captured) {
      setToast({ msg: 'Please capture a face image before submitting!', type: 'warning' });
      return;
    }
    setSubmitting(true);
    const fd = new FormData();
    fd.append('branch', form.branch);
    fd.append('year', form.year);
    fd.append('section', form.section);
    fd.append('period', form.period);
    fd.append('face_image_data', captured);
    try {
      const res = await markAttendance(fd);
      setTodayRecords(res.data.records);
      setSummary(res.data.summary);
      setToast({ msg: 'Attendance recorded successfully!', type: 'success' });
      setCaptured(null);
    } catch (err) {
      setToast({ msg: err.response?.data?.error || 'Error marking attendance', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!meta) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {meta.faculty_name}! 🎓</h1>
            <p className="text-blue-100">Manage attendance with AI-powered face recognition</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <p className="text-sm text-gray-600 font-medium">Today's Records</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-1">{todayRecords.length}</h3>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 font-medium">Quick Actions</p>
          <h3 className="text-lg font-semibold text-gray-800 mt-1">Mark Attendance</h3>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600 font-medium">Search Records</p>
          <h3 className="text-lg font-semibold text-gray-800 mt-1">View History</h3>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <HiOutlineCheckCircle className="w-5 h-5 mr-2 text-blue-600" />
            Mark Attendance - Face Recognition
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'branch', label: 'Branch', options: meta.branches },
                { name: 'year', label: 'Year', options: meta.years },
                { name: 'section', label: 'Section', options: meta.sections },
                { name: 'period', label: 'Period', options: meta.periods },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <select
                    value={form[f.name]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {/* Camera Area */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-dashed border-blue-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <HiOutlineVideoCamera className="w-5 h-5 mr-2 text-blue-600" />
                AI Face Recognition
              </label>
              <div className="flex flex-col items-center">
                <video ref={videoRef} width="320" height="240" className="rounded-lg border-4 border-white shadow-lg" style={{ display: cameraOn ? 'block' : 'none' }} />
                <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />

                {!cameraOn && !captured && (
                  <button type="button" onClick={startCamera}
                    className="mt-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-md flex items-center">
                    <HiOutlineVideoCamera className="w-5 h-5 mr-2" /> Turn On Camera
                  </button>
                )}

                {cameraOn && (
                  <button type="button" onClick={captureImage}
                    className="mt-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg shadow-md flex items-center">
                    <HiOutlineCamera className="w-5 h-5 mr-2" /> Capture Face
                  </button>
                )}

                {captured && (
                  <>
                    <img src={captured} alt="Preview" className="mt-4 rounded-lg shadow-lg border-4 border-white w-40" />
                    <button type="button" onClick={() => { setCaptured(null); startCamera(); }}
                      className="mt-2 text-sm text-blue-600 hover:underline">Retake Photo</button>
                  </>
                )}
              </div>
            </div>

            <button type="submit" disabled={submitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md flex items-center justify-center disabled:opacity-50">
              <HiOutlineCheckCircle className="w-5 h-5 mr-2" />
              {submitting ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <HiOutlineSearch className="w-5 h-5 mr-2 text-indigo-600" />
              Quick Actions
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/admin/attendance" className="flex items-center p-3 rounded-lg hover:bg-indigo-50 transition-colors">
                  <HiOutlineSearch className="w-5 h-5 mr-3 text-indigo-600" />
                  <span className="text-sm font-medium">Search Records</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="flex items-center p-3 rounded-lg hover:bg-indigo-50 transition-colors">
                  <HiOutlineUser className="w-5 h-5 mr-3 text-indigo-600" />
                  <span className="text-sm font-medium">My Profile</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <HiOutlineLightBulb className="w-5 h-5 mr-2" /> Pro Tip
            </h3>
            <p className="text-sm text-indigo-100">Use face recognition for faster, contactless attendance marking!</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{summary.present}</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{summary.absent}</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-blue-600">{summary.total}</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Percentage</p>
              <p className="text-2xl font-bold text-purple-600">{summary.percentage}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Today's Records */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
          <span className="flex items-center">
            <HiOutlineCheckCircle className="w-5 h-5 mr-2 text-blue-600" />
            Today's Attendance Records
          </span>
          <span className="text-sm text-gray-500">{todayRecords.length} records</span>
        </h3>
        {todayRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Time', 'Student ID', 'Name', 'Class', 'Period', 'Status'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todayRecords.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{a.time}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{a.student_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{a.student_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{a.class_info}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{a.period}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${a.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {a.status === 'Present' ? '✓ Present' : '✗ Absent'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <HiOutlineCheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No attendance records for today yet</p>
            <p className="text-sm text-gray-400 mt-1">Mark attendance to see records here</p>
          </div>
        )}
      </div>
    </div>
  );
}
