import { useState, useEffect } from "react";
import { api } from "../api/client";
import { Loader2, Plus, UserPlus, Pencil, UserX, Check, X } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  function fetchEmployees() {
    setLoading(true);
    api.get<{ data: Employee[] }>("/users/employees")
      .then((res) => setEmployees(res.data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/users/employees", formData);
      setFormData({ name: "", email: "", password: "" });
      setShowForm(false);
      fetchEmployees();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(id: string) {
    try {
      await api.patch(`/users/employees/${id}`, { name: editName });
      setEditingId(null);
      fetchEmployees();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleToggleActive(emp: Employee) {
    const action = emp.is_active ? "deactivate" : "reactivate";
    if (!confirm(`Are you sure you want to ${action} ${emp.name}?`)) return;
    try {
      await api.patch(`/users/employees/${emp.id}`, { is_active: !emp.is_active });
      fetchEmployees();
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your team members</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-colors"
        >
          {showForm ? <Plus size={16} className="rotate-45" /> : <UserPlus size={16} />}
          {showForm ? "Cancel" : "Add Employee"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          {error}
          <button onClick={() => setError("")} className="ml-2 underline">dismiss</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
          >
            {creating ? "Creating..." : "Create Employee"}
          </button>
        </form>
      )}

      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-zinc-400 text-left">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium text-white">
                  {editingId === emp.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-zinc-900 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-orange-500/50 w-32"
                      />
                      <button onClick={() => handleUpdate(emp.id)} className="text-green-400 hover:text-green-300"><Check size={14} /></button>
                      <button onClick={() => setEditingId(null)} className="text-zinc-500 hover:text-zinc-300"><X size={14} /></button>
                    </div>
                  ) : (
                    emp.name
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-300">{emp.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${emp.is_active !== false ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                    {emp.is_active !== false ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-400 text-xs">{new Date(emp.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => { setEditingId(emp.id); setEditName(emp.name); }}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                      title="Edit name"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleToggleActive(emp)}
                      className={`p-1.5 rounded-lg transition-colors ${emp.is_active !== false ? "text-zinc-500 hover:text-red-400 hover:bg-red-500/10" : "text-zinc-500 hover:text-green-400 hover:bg-green-500/10"}`}
                      title={emp.is_active !== false ? "Deactivate" : "Reactivate"}
                    >
                      <UserX size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-zinc-500">
                  No employees yet. Add your first team member.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
