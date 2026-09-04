import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";

// Har status ke liye ek fixed color — isse chart consistent dikhega
const COLORS = {
  applied: "#64748b",
  oa: "#f59e0b",
  interview: "#3b82f6",
  offer: "#22c55e",
  rejected: "#ef4444",
};

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, statusCounts: [] });
  const [loading, setLoading] = useState(true);

  // useEffect([]) — component pehli baar screen pe aane par ye code EK BAAR chalega
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/applications/stats/summary");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Backend se { _id: "applied", count: 5 } jaisa data aata hai,
  // Recharts ko { name: "applied", value: 5 } chahiye — isliye transform kar rahe hain
  const chartData = stats.statusCounts.map((s) => ({
    name: s._id,
    value: s.count,
  }));

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <p className="text-slate-500">Total Applications</p>
          <p className="text-4xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-4">Status Breakdown</h2>
          {loading ? (
            <p>Loading...</p>
          ) : chartData.length === 0 ? (
            <p className="text-slate-500">Koi application nahi hai abhi. Applications page se add karo.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[entry.name] || "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
