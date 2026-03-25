import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getFacultyDashboard, markAttendance, openAttendanceWindow, closeAttendanceWindow } from '../api/api';
import Toast from '../components/Toast';
import {
  HiOutlineCheckCircle,
  HiOutlineVideoCamera,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineCamera,
  HiOutlineLightBulb,
} from 'react-icons/hi';

export default function FacultyDashboard() {
  const [meta, setMeta] = useState(null);
  const [form, setForm] = useState({ branch: '', year: '', section: '' });
  const [activePeriod, setActivePeriod] = useState('');
  const [cameraOn, setCameraOn] = useState(false);
  const [windowOpen, setWindowOpen] = useState(false);
  const [windowCutoff, setWindowCutoff] = useState('');
  const [windowCutoffIso, setWindowCutoffIso] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [todayRecords, setTodayRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [toast, setToast] = useState(null);
  const [lastMarked, setLastMarked] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [openingWindow, setOpeningWindow] = useState(false);
  const [closingWindow, setClosingWindow] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const autoCloseTriggeredRef = useRef(false);

  useEffect(() => {
    getFacultyDashboard().then((r) => {
      setMeta(r.data);
      setForm({
        branch: r.data.branches[0] || '',
        year: r.data.years[0] || '',
        section: r.data.sections[0] || '',
      });
    }).catch(() => {});
    return () => stopCamera();
  }, []);

  const selectedPeriodTime = meta?.period_slots?.[activePeriod] || '';

  useEffect(() => {
    if (!windowOpen || !windowCutoffIso) {
      setTimeLeft('');
      return;
    }

    const cutoffMs = new Date(windowCutoffIso).getTime();

    const formatTimeLeft = (ms) => {
      const totalSeconds = Math.max(0, Math.floor(ms / 1000));
      const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      return `${minutes}:${seconds}`;
    };

    const tick = async () => {
      const diff = cutoffMs - Date.now();

      if (diff <= 0) {
        setTimeLeft('00:00');
        if (autoCloseTriggeredRef.current) return;
        autoCloseTriggeredRef.current = true;

        try {
          const res = await closeAttendanceWindow(buildAttendanceFormData());
          setWindowOpen(false);
          setActivePeriod('');
          setWindowCutoff('');
          setWindowCutoffIso('');
          stopCamera();
          setTodayRecords(res.data.records || []);
          setSummary(res.data.summary || null);
          setToast({ msg: 'Attendance window closed automatically at cutoff.', type: 'warning' });
        } catch (err) {
          setWindowOpen(false);
          setActivePeriod('');
          setWindowCutoff('');
          setWindowCutoffIso('');
          stopCamera();
          setToast({ msg: err.response?.data?.error || 'Attendance window closed at cutoff.', type: 'warning' });
        }
        return;
      }

      setTimeLeft(formatTimeLeft(diff));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [windowOpen, windowCutoffIso, form.branch, form.year, form.section, activePeriod]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      setToast({ msg: 'Camera activated successfully', type: 'success' });
    } catch (err) {
      setToast({ msg: 'Camera access denied: ' + err.message, type: 'error' });
      setCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  };

  const buildAttendanceFormData = (faceImage = '') => {
    const fd = new FormData();
    fd.append('branch', form.branch);
    fd.append('year', form.year);
    fd.append('section', form.section);
    if (activePeriod) fd.append('period', activePeriod);
    if (faceImage) fd.append('face_image_data', faceImage);
    return fd;
  };

  const openWindow = async () => {
    setOpeningWindow(true);
    try {
      const res = await openAttendanceWindow(buildAttendanceFormData());
      autoCloseTriggeredRef.current = false;
      setWindowOpen(true);
      setActivePeriod(res.data.period || '');
      setWindowCutoff(res.data.window_cutoff || '');
      setWindowCutoffIso(res.data.window_cutoff_iso || '');
      setToast({ msg: `Attendance window opened for Period ${res.data.period}. Cutoff: ${res.data.window_cutoff || 'N/A'}`, type: 'success' });
      
      // Wait a brief moment for state to settle, then start camera
      setTimeout(() => {
        startCamera();
      }, 300);
    } catch (err) {
      setWindowOpen(false);
      setActivePeriod('');
      setWindowCutoff('');
      setWindowCutoffIso('');
      stopCamera();
      setSummary(err.response?.data?.summary || null);
      setToast({ msg: err.response?.data?.error || 'Could not open attendance window', type: 'error' });
    } finally {
      setOpeningWindow(false);
    }
  };

  const captureAndSubmit = async () => {
    if (!windowOpen) {
      setToast({ msg: 'Open attendance window first.', type: 'warning' });
      return;
    }
    if (!cameraOn) {
      setToast({ msg: 'Camera is not active.', type: 'warning' });
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');

    setSubmitting(true);
    try {
      const res = await markAttendance(buildAttendanceFormData(dataUrl));
      setTodayRecords(res.data.records);
      setSummary(res.data.summary);
      setLastMarked(`${res.data.marked_student_name} (${res.data.marked_student_id})`);
      setToast({ msg: `Marked Present: ${res.data.marked_student_id}`, type: 'success' });
    } catch (err) {
      const unidentified = err.response?.data?.unidentified;
      const cutoffReached = (err.response?.data?.error || '').toLowerCase().includes('window closed');

      if (cutoffReached) {
        setWindowOpen(false);
        setActivePeriod('');
        setWindowCutoff('');
        setWindowCutoffIso('');
        stopCamera();
        if (err.response?.data?.summary) setSummary(err.response.data.summary);
      }

      setToast({
        msg: unidentified ? 'Unidentified face. Attendance not marked.' : (err.response?.data?.error || 'Error marking attendance'),
        type: unidentified ? 'warning' : 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const closeWindow = async () => {
    setClosingWindow(true);
    try {
      const res = await closeAttendanceWindow(buildAttendanceFormData());
      setWindowOpen(false);
      setActivePeriod('');
      setWindowCutoff('');
      setWindowCutoffIso('');
      stopCamera();
      setTodayRecords(res.data.records || []);
      setSummary(res.data.summary || null);
      setToast({ msg: `Window closed. ${res.data.absent_marked_now || 0} students marked absent.`, type: 'success' });
    } catch (err) {
      setToast({ msg: err.response?.data?.error || 'Error closing attendance window', type: 'error' });
    } finally {
      setClosingWindow(false);
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'branch', label: 'Branch', options: meta.branches },
                { name: 'year', label: 'Year', options: meta.years },
                { name: 'section', label: 'Section', options: meta.sections },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <select
                    value={form[f.name]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                    disabled={windowOpen}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {f.options.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {windowOpen && selectedPeriodTime && (
              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-sm text-indigo-700">
                Current Period: <span className="font-semibold">{activePeriod}</span>
                <span className="ml-2">({selectedPeriodTime})</span>
                {windowCutoff && <span className="ml-3">Cutoff: <span className="font-semibold">{windowCutoff}</span></span>}
                {windowOpen && timeLeft && (
                  <span className="ml-3">Time Left: <span className="font-semibold text-red-600">{timeLeft}</span></span>
                )}
              </div>
            )}

            {!windowOpen && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-sm text-blue-700">
                Period is auto-detected from current time when attendance window opens.
              </div>
            )}

            {lastMarked && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-100 text-sm text-green-700">
                Last marked: <span className="font-semibold">{lastMarked}</span>
              </div>
            )}

            {/* Camera Area */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-dashed border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <HiOutlineVideoCamera className="w-5 h-5 mr-2 text-blue-600" />
                  AI Face Recognition {windowOpen ? '(Window Open - 5 min)' : '(Window Closed)'}
                </label>
                {windowOpen && timeLeft && (
                  <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
                    ⏱️ {timeLeft}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-center">
                <video
                  ref={videoRef}
                  width="320"
                  height="240"
                  className="rounded-lg border-4 border-white shadow-lg bg-black"
                  autoPlay
                  playsInline
                  style={{ display: cameraOn ? 'block' : 'none' }}
                />
                {!cameraOn && windowOpen && (
                  <div className="text-gray-400 text-sm mt-4">Camera starting...</div>
                )}
                {!cameraOn && !windowOpen && (
                  <div className="text-gray-400 text-sm mt-4">Open window to activate camera</div>
                )}
                <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />

                {/* Button Container */}
                <div className="flex flex-wrap gap-3 mt-4 justify-center">
                  {!windowOpen && (
                    <button type="button" onClick={openWindow} disabled={openingWindow}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-md flex items-center transition-all">
                      <HiOutlineVideoCamera className="w-5 h-5 mr-2" /> {openingWindow ? 'Opening...' : 'Open Attendance Window'}
                    </button>
                  )}

                  {windowOpen && cameraOn && (
                    <button type="button" onClick={captureAndSubmit} disabled={submitting}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg shadow-md flex items-center transition-all disabled:opacity-50">
                      <HiOutlineCamera className="w-5 h-5 mr-2" /> {submitting ? 'Submitting...' : 'Capture & Mark Present'}
                    </button>
                  )}

                  {windowOpen && cameraOn && (
                    <button type="button" onClick={stopCamera}
                      className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg shadow-md flex items-center transition-all">
                      <HiOutlineVideoCamera className="w-5 h-5 mr-2" /> Stop Camera
                    </button>
                  )}

                  {windowOpen && (
                    <button type="button" onClick={closeWindow} disabled={closingWindow}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg shadow-md flex items-center transition-all disabled:opacity-50">
                      <HiOutlineCheckCircle className="w-5 h-5 mr-2" /> {closingWindow ? 'Closing...' : 'Close Window & Mark Absent'}
                    </button>
                  )}
                </div>

                {windowOpen && (
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    💡 Tip: Use <span className="font-semibold">Stop Camera</span> to temporarily pause, or <span className="font-semibold">Close Window</span> to end and mark absentees.
                  </p>
                )}
              </div>
            </div>
          </div>
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
                    <td className="px-6 py-4 text-sm text-gray-600">{a.period_time || a.time}</td>
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
