import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", { email, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800/95 backdrop-blur p-8 rounded-xl shadow-2xl w-full max-w-sm border border-slate-700"
      >
        <h1 className="text-2xl font-bold text-white mb-1 text-center">
          Create Account
        </h1>
        <p className="text-slate-400 text-sm text-center mb-6">
          Join us to browse and buy your next car
        </p>

        {error && (
          <p className="bg-red-500/20 text-red-400 text-sm p-2 rounded mb-4 border border-red-500/30">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-green-500/20 text-green-400 text-sm p-2 rounded mb-4 border border-green-500/30">
            Registered! Redirecting to login...
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
          Register
        </button>

        <p className="text-slate-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
