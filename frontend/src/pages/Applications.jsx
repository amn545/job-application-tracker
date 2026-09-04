import { useEffect, useState } from "react";
import api from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";

const STATUS_OPTIONS = ["applied", "oa", "interview", "offer", "rejected"];

const emptyForm = { company: "", role: "", status: "applied", link: "", notes: "" };

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState("all");

  const fetchApps = async () => {
    const res = await api.get("/applications");
    setApps(res.data);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleChange = (e) => {
    // Computed property name — [e.target.name] se pata chalta hai kaunsa input change hua
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/applications", form);
    setForm(emptyForm); // form reset
    fetchApps(); // list refresh
  };

  const handleStatusChange = async (id, newStatus) => {
    await api.put(`/applications/${id}`, { status: newStatus });
    fetchApps();
  };

  const handleDelete = async (id) => {
    await api.delete(`/applications/${id}`);
    fetchApps();
  };

  const filteredApps = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Applications</h1>

        {/* Naya application add karne ka form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-2 gap-3">
          <input
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            name="link"
            placeholder="Job link (optional)"
            value={form.link}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />
          <button type="submit" className="bg-slate-900 text-white py-2 rounded col-span-2">
            Add Application
          </button>
        </form>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {["all", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded text-sm ${
                filter === s ? "bg-slate-900 text-white" : "bg-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <div key={app._id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{app.company} — {app.role}</p>
                {app.notes && <p className="text-sm text-slate-500">{app.notes}</p>}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                  className="border p-1 rounded text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleDelete(app._id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filteredApps.length === 0 && <p className="text-slate-500">Koi application nahi mili.</p>}
        </div>
      </div>
    </div>
  );
}
