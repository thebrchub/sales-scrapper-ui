import { useState, useEffect } from "react";
import { api } from "../api/client";
import { Plus, UserPlus, Pencil, UserX, Check, X, KeyRound } from "lucide-react";
import Spinner from "../components/Spinner";
import PasswordInput from "../components/PasswordInput";
import Tooltip from "../components/Tooltip";

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
  const [passwordId, setPasswordId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");

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

  async function handleChangePassword(id: string) {
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      await api.patch(`/users/employees/${id}`, { password: newPassword });
      setPasswordId(null);
      setNewPassword("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] w-full animate-in fade-in duration-500 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Employees</h1>
          <p className="text-zinc-400 text-sm mt-1.5">Manage your team members</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors"
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
        <form onSubmit={handleCreate} className="rounded-3xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#09090b] p-6 sm:p-8 space-y-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.6)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-zinc-400 block mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-1">Password</label>
              <PasswordInput
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                inputClassName="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50"
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

      <div className="flex-1 rounded-3xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#09090b] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.6)] overflow-hidden">
        <div className="overflow-x-auto h-full">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-black/30">
              <tr className="border-b border-white/5 text-zinc-400 text-left">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-white">
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
                  <td className="px-6 py-4 text-zinc-300">{emp.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${emp.is_active !== false ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                      {emp.is_active !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-xs">{new Date(emp.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingId(emp.id); setEditName(emp.name); }}
                        className="group relative p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                        aria-label="Edit name"
                      >
                        <Pencil size={14} />
                        <Tooltip label="Edit name" />
                      </button>
                      <button
                        onClick={() => { setPasswordId(passwordId === emp.id ? null : emp.id); setNewPassword(""); }}
                        className={`group relative p-1.5 rounded-lg transition-colors ${passwordId === emp.id ? "text-orange-400 bg-orange-500/10" : "text-zinc-500 hover:text-orange-400 hover:bg-orange-500/10"}`}
                        aria-label="Change password"
                      >
                        <KeyRound size={14} />
                        <Tooltip label="Change password" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(emp)}
                        className={`group relative p-1.5 rounded-lg transition-colors ${emp.is_active !== false ? "text-zinc-500 hover:text-red-400 hover:bg-red-500/10" : "text-zinc-500 hover:text-green-400 hover:bg-green-500/10"}`}
                        aria-label={emp.is_active !== false ? "Block" : "Unblock"}
                      >
                        <UserX size={14} />
                        <Tooltip label={emp.is_active !== false ? "Block" : "Unblock"} tone={emp.is_active !== false ? "danger" : "default"} />
                      </button>
                    </div>
                    {passwordId === emp.id && (
                      <div className="flex items-center justify-end gap-2 mt-3">
                        <PasswordInput
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password"
                          className="w-44"
                          inputClassName="w-full bg-zinc-900 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-orange-500/50"
                        />
                        <button onClick={() => handleChangePassword(emp.id)} className="text-green-400 hover:text-green-300"><Check size={14} /></button>
                        <button onClick={() => { setPasswordId(null); setNewPassword(""); }} className="text-zinc-500 hover:text-zinc-300"><X size={14} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-zinc-500">
                    No employees yet. Add your first team member.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
