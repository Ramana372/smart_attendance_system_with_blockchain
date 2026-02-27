import { Link } from 'react-router-dom';
import {
  HiOutlineLogin,
  HiOutlineInformationCircle,
  HiOutlineVideoCamera,
  HiOutlineLightningBolt,
  HiOutlineChartBar,
  HiOutlineLockClosed,
  HiOutlineClock,
} from 'react-icons/hi';

export default function Landing() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl shadow-2xl p-12 text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
              Digital ID Attendance System
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8">
              🤖 AI-Powered Face Recognition for Smart Attendance Management
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/login"
                className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center"
              >
                <HiOutlineLogin className="w-6 h-6 mr-2" />
                Get Started
              </Link>
              <a
                href="#features"
                className="bg-indigo-500 bg-opacity-30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white hover:bg-opacity-40 transition-all flex items-center"
              >
                <HiOutlineInformationCircle className="w-6 h-6 mr-2" />
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">✨ Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {[
            {
              icon: <HiOutlineVideoCamera className="w-10 h-10 text-white" />,
              gradient: 'from-blue-500 to-cyan-500',
              title: 'Face Recognition',
              desc: 'Advanced AI-powered facial recognition using FaceNet technology for accurate, contactless attendance marking.',
            },
            {
              icon: <HiOutlineLightningBolt className="w-10 h-10 text-white" />,
              gradient: 'from-green-500 to-emerald-500',
              title: 'Real-time Tracking',
              desc: 'Instant attendance updates with live dashboards for students and faculty to monitor progress.',
            },
            {
              icon: <HiOutlineChartBar className="w-10 h-10 text-white" />,
              gradient: 'from-purple-500 to-pink-500',
              title: 'Analytics Dashboard',
              desc: 'Comprehensive analytics with visual charts and reports to track attendance patterns and performance.',
            },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow transform hover:-translate-y-2">
              <div className={`bg-gradient-to-br ${f.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-4`}>
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-6">
            <h4 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <HiOutlineLockClosed className="w-6 h-6 mr-2 text-orange-600" />
              Secure & Private
            </h4>
            <p className="text-gray-700">
              Bank-level security with encrypted face embeddings. Your biometric data is stored as mathematical vectors, not images.
            </p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl shadow-lg p-6">
            <h4 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <HiOutlineClock className="w-6 h-6 mr-2 text-cyan-600" />
              Lightning Fast
            </h4>
            <p className="text-gray-700">
              Mark attendance in under 1 second with pre-computed embeddings and optimized AI algorithms.
            </p>
          </div>
        </div>
      </div>

      {/* User Roles */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl p-10">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">👥 Who Can Use?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { color: 'blue', title: 'Students', items: ['View attendance history', 'Track attendance percentage', 'Visual analytics dashboard'] },
            { color: 'green', title: 'Faculty', items: ['Mark attendance via face scan', 'View class attendance records', 'Search attendance history'] },
            { color: 'purple', title: 'Administrators', items: ['Manage students & faculty', 'Monitor system-wide attendance', 'Generate reports & analytics'] },
          ].map((r, i) => (
            <div key={i} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className={`bg-${r.color}-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className={`text-${r.color}-600 text-3xl font-bold`}>{r.title[0]}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{r.title}</h3>
              <ul className="text-left text-gray-600 space-y-2 text-sm">
                {r.items.map((item, j) => (
                  <li key={j} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-white rounded-2xl shadow-xl p-10">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">🚀 Powered By</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Python', sub: 'Backend', grad: 'from-green-400 to-emerald-500', code: 'Py' },
            { label: 'Django', sub: 'Framework', grad: 'from-green-600 to-green-700', code: 'Dj' },
            { label: 'FaceNet', sub: 'AI Model', grad: 'from-orange-400 to-red-500', code: 'FN' },
            { label: 'React', sub: 'Frontend', grad: 'from-blue-400 to-indigo-500', code: 'Re' },
          ].map((t, i) => (
            <div key={i} className="text-center p-4">
              <div className={`bg-gradient-to-br ${t.grad} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                <span className="text-white font-bold text-2xl">{t.code}</span>
              </div>
              <p className="font-semibold text-gray-700">{t.label}</p>
              <p className="text-xs text-gray-500">{t.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-indigo-100 mb-8">Join thousands of institutions using AI-powered attendance systems</p>
        <Link
          to="/login"
          className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          Login to Dashboard →
        </Link>
      </div>
    </div>
  );
}
