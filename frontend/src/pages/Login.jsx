import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const Car = ({ body, accent, className }) => (
    <svg className={className} viewBox="0 0 160 70" fill="none">
      <ellipse cx="80" cy="62" rx="70" ry="4" fill="black" opacity="0.25" />
      <path d="M15 42 Q15 30 30 28 L45 14 Q50 8 60 8 L100 8 Q110 8 115 14 L130 28 Q145 30 145 42 L145 46 Q145 50 140 50 L20 50 Q15 50 15 46 Z" fill={body} />
      <path d="M50 27 L58 15 Q60 12 65 12 L95 12 Q100 12 102 15 L110 27 Z" fill={accent} opacity="0.85" />
      <rect x="54" y="15" width="20" height="11" rx="1.5" fill="#0f172a" />
      <rect x="86" y="15" width="20" height="11" rx="1.5" fill="#0f172a" />
      <circle cx="22" cy="30" r="3.5" fill="#fef3c7" />
      <circle cx="138" cy="30" r="3.5" fill="#fca5a5" />
      <g className="wheel-spin" style={{ transformOrigin: "40px 50px" }}>
        <circle cx="40" cy="50" r="12" fill="#111827" />
        <circle cx="40" cy="50" r="5" fill="#9ca3af" />
        <rect x="38.5" y="40" width="3" height="20" fill="#4b5563" />
        <rect x="30" y="48.5" width="20" height="3" fill="#4b5563" />
      </g>
      <g className="wheel-spin" style={{ transformOrigin: "120px 50px" }}>
        <circle cx="120" cy="50" r="12" fill="#111827" />
        <circle cx="120" cy="50" r="5" fill="#9ca3af" />
        <rect x="118.5" y="40" width="3" height="20" fill="#4b5563" />
        <rect x="110" y="48.5" width="20" height="3" fill="#4b5563" />
      </g>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-56 bg-slate-800/60"></div>

      <div className="absolute bottom-10 left-0 w-full h-10 bg-slate-700 border-t-2 border-b-2 border-slate-600 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-[200%] flex items-center animate-road-lines">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-10 h-1.5 bg-yellow-400/70 mx-6 rounded-full flex-shrink-0" />
          ))}
        </div>
      </div>
      <div className="absolute bottom-24 left-0 w-full h-10 bg-slate-700 border-t-2 border-b-2 border-slate-600 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-[200%] flex items-center animate-road-lines">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-10 h-1.5 bg-yellow-400/70 mx-6 rounded-full flex-shrink-0" />
          ))}
        </div>
      </div>

      <Car body="#3b82f6" accent="#93c5fd" className="absolute bottom-11 -left-48 w-44 h-20 animate-drive-fast" />
      <Car body="#f97316" accent="#fdba74" className="absolute bottom-25 -left-48 w-36 h-16 animate-drive-medium" />
      <Car body="#22c55e" accent="#86efac" className="absolute bottom-11 -left-48 w-40 h-18 animate-drive-slow" />

      <div className="relative z-10 flex flex-col items-center">
        <p className="text-slate-400 text-sm mb-3 tracking-wide">
          Your next car is just a click away
        </p>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/95 backdrop-blur p-8 rounded-xl shadow-2xl w-full max-w-sm border border-slate-700"
        >
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            Log In
          </h1>

          {error && (
            <p className="bg-red-500/20 text-red-400 text-sm p-2 rounded mb-4">
              {error}
            </p>
          )}

          <label className="block text-slate-300 text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <label className="block text-slate-300 text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            Log In
          </button>

          <p className="text-slate-400 text-sm text-center mt-4">
            No account?{" "}
            <Link to="/register" className="text-blue-400 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
