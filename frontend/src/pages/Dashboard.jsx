import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

const CONFETTI_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899", "#a855f7"];

function Confetti() {
  const pieces = Array.from({ length: 24 });
  return (
    <div className="absolute inset-0 overflow-visible pointer-events-none">
      {pieces.map((_, i) => {
        const angle = (360 / pieces.length) * i;
        const distance = 60 + Math.random() * 60;
        const dx = Math.cos((angle * Math.PI) / 180) * distance;
        const dy = Math.sin((angle * Math.PI) / 180) * distance;
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        return (
          <span
            key={i}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-sm animate-confetti"
            style={{
              backgroundColor: color,
              "--dx": `${dx}px`,
              "--dy": `${dy}px`,
              animationDelay: `${Math.random() * 0.15}s`,
            }}
          />
        );
      })}
    </div>
  );
}

function Dashboard({ token, setToken }) {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ make: "", model: "", category: "", price: "", quantity: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ make: "", model: "", category: "", price: "", quantity: "" });
  const [celebration, setCelebration] = useState(null);
  const navigate = useNavigate();

  const user = decodeToken(token);
  const isAdmin = user?.role === "admin";

  const fetchVehicles = async (query = "") => {
    setLoading(true);
    try {
      const url = query ? `/vehicles/search?make=${query}` : "/vehicles";
      const res = await api.get(url);
      setVehicles(res.data);
    } catch (err) {
      setError("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const lowestStock = vehicles.length
    ? Math.min(...vehicles.filter((v) => v.quantity > 0).map((v) => v.quantity))
    : null;

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVehicles(search);
  };

  const handlePurchase = async (v) => {
    try {
      await api.post(`/vehicles/${v.id}/purchase`);
      setCelebration({ name: `${v.make} ${v.model}`, price: v.price });
      setTimeout(() => setCelebration(null), 3200);
      fetchVehicles(search);
    } catch (err) {
      setError(err.response?.data?.message || "Purchase failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles(search);
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const handleRestock = async (id) => {
    try {
      await api.post(`/vehicles/${id}/restock`, { amount: 5 });
      fetchVehicles(search);
    } catch (err) {
      setError(err.response?.data?.message || "Restock failed");
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/vehicles", {
        make: form.make,
        model: form.model,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity),
      });
      setForm({ make: "", model: "", category: "", price: "", quantity: "" });
      setShowForm(false);
      fetchVehicles(search);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add vehicle");
    }
  };

  const startEdit = (v) => {
    setEditingId(v.id);
    setEditForm({
      make: v.make,
      model: v.model,
      category: v.category,
      price: v.price,
      quantity: v.quantity,
    });
  };

  const cancelEdit = () => setEditingId(null);

  const handleUpdateVehicle = async (id) => {
    setError("");
    try {
      await api.put(`/vehicles/${id}`, {
        make: editForm.make,
        model: editForm.model,
        category: editForm.category,
        price: Number(editForm.price),
        quantity: Number(editForm.quantity),
      });
      setEditingId(null);
      fetchVehicles(search);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update vehicle");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const categoryColors = {
    sedan: "bg-blue-500/20 text-blue-300",
    suv: "bg-purple-500/20 text-purple-300",
    coupe: "bg-pink-500/20 text-pink-300",
    convertible: "bg-teal-500/20 text-teal-300",
    hatchback: "bg-orange-500/20 text-orange-300",
    truck: "bg-amber-500/20 text-amber-300",
  };

  const getCategoryClass = (cat) =>
    categoryColors[cat?.toLowerCase()] || "bg-slate-500/20 text-slate-300";

  const CarIcon = () => (
    <svg className="w-9 h-9 text-blue-400 inline-block -mt-1 mr-2" viewBox="0 0 64 40" fill="none">
      <path d="M6 24 L10 12 Q12 7 18 7 H40 Q46 7 49 12 L57 22 Q60 23 60 27 V31 Q60 33 58 33 H6 Q4 33 4 31 V27 Q4 25 6 24 Z" fill="currentColor" opacity="0.15"/>
      <path d="M6 24 L10 12 Q12 7 18 7 H40 Q46 7 49 12 L57 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M4 27 Q4 24 8 24 H56 Q60 24 60 27 V31 Q60 33 58 33 H6 Q4 33 4 31 Z" fill="currentColor"/>
      <rect x="18" y="12" width="11" height="9" rx="1" fill="#0f172a"/>
      <rect x="32" y="12" width="12" height="9" rx="1" fill="#0f172a"/>
      <circle cx="16" cy="33" r="5.5" fill="#0f172a" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="48" cy="33" r="5.5" fill="#0f172a" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-8 relative">
      {celebration && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="relative">
            <Confetti />
            <div className="relative bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 text-white px-7 py-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-green-400 animate-scale-in">
              <span className="text-4xl">??</span>
              <div>
                <p className="font-extrabold text-xl leading-tight">SOLD! It's yours.</p>
                <p className="text-sm text-green-100 mt-0.5">
                  {celebration.name} · {formatPrice(celebration.price)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center">
              <CarIcon />
              Car Dealership Inventory
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Browse the lot, grab a deal, drive away happy.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-lg shadow-green-900/30"
            >
              {showForm ? "Cancel" : "+ Add Vehicle"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition border border-slate-700"
            >
              Log Out
            </button>
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={handleAddVehicle}
            className="bg-slate-800 p-5 rounded-2xl mb-6 grid grid-cols-2 sm:grid-cols-5 gap-3 border border-slate-700 shadow-xl"
          >
            <input
              placeholder="Make"
              value={form.make}
              onChange={(e) => setForm({ ...form, make: e.target.value })}
              className="p-2.5 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              placeholder="Model"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              className="p-2.5 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="p-2.5 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="p-2.5 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              placeholder="Quantity"
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="p-2.5 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="col-span-2 sm:col-span-5 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition"
            >
              Save Vehicle
            </button>
          </form>
        )}

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Search by make..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-slate-800 text-white outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Search
          </button>
        </form>

        {error && (
          <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 border border-red-500/30">
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {vehicles.map((v) =>
                editingId === v.id ? (
                  <div
                    key={v.id}
                    className="bg-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-2 border-2 border-blue-500"
                  >
                    <input
                      value={editForm.make}
                      onChange={(e) => setEditForm({ ...editForm, make: e.target.value })}
                      className="p-2 rounded-lg bg-slate-700 text-white outline-none text-sm"
                      placeholder="Make"
                    />
                    <input
                      value={editForm.model}
                      onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                      className="p-2 rounded-lg bg-slate-700 text-white outline-none text-sm"
                      placeholder="Model"
                    />
                    <input
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="p-2 rounded-lg bg-slate-700 text-white outline-none text-sm"
                      placeholder="Category"
                    />
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="p-2 rounded-lg bg-slate-700 text-white outline-none text-sm"
                      placeholder="Price"
                    />
                    <input
                      type="number"
                      value={editForm.quantity}
                      onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                      className="p-2 rounded-lg bg-slate-700 text-white outline-none text-sm"
                      placeholder="Quantity"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleUpdateVehicle(v.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg font-medium transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 bg-slate-600 hover:bg-slate-500 text-white text-sm py-2 rounded-lg font-medium transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={v.id}
                    className={`relative bg-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between border border-slate-700 hover:border-slate-600 hover:-translate-y-1 transition-all duration-200 ${
                      v.quantity === 0 ? "opacity-60" : ""
                    }`}
                  >
                    {v.quantity === 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg rotate-3">
                        SOLD OUT
                      </span>
                    )}
                    {v.quantity > 0 && v.quantity === lowestStock && (
                      <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg -rotate-3 animate-pulse">
                        POPULAR
                      </span>
                    )}

                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h2 className="text-xl font-bold text-white capitalize">
                          {v.make} {v.model}
                        </h2>
                        <button
                          onClick={() => startEdit(v)}
                          className="text-slate-500 hover:text-blue-400 text-xs font-medium transition"
                        >
                          Edit
                        </button>
                      </div>
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${getCategoryClass(v.category)}`}>
                        {v.category}
                      </span>
                      <p className="text-2xl font-extrabold text-white mt-3">
                        {formatPrice(v.price)}
                      </p>
                      <p className="text-slate-400 text-sm mt-1">
                        {v.quantity > 0 ? `${v.quantity} in stock` : "Currently unavailable"}
                      </p>
                    </div>

                    <button
                      onClick={() => handlePurchase(v)}
                      disabled={v.quantity === 0}
                      className={`mt-4 py-2.5 rounded-lg font-semibold transition ${
                        v.quantity === 0
                          ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/30"
                      }`}
                    >
                      {v.quantity === 0 ? "Out of Stock" : "Purchase"}
                    </button>

                    {isAdmin && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleRestock(v.id)}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium py-1.5 rounded-lg transition"
                        >
                          Restock +5
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-1.5 rounded-lg transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {vehicles.length === 0 && (
              <div className="text-center mt-16">
                <p className="text-slate-500">No vehicles found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
