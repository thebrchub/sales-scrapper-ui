import { useState, useEffect } from "react";
import { api } from "../api/client";
import { Plus, UserPlus, Pencil, Trash2, Check, X } from "lucide-react";
import Spinner from "../components/Spinner";
import PasswordInput from "../components/PasswordInput";
import Tooltip from "../components/Tooltip";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  function fetchAdmins() {
    setLoading(true);
    api.get<{ data: Admin[] }>("/users/admins")
      .then((res) => setAdmins(res.data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/users/admins", formData);
      setFormData({ name: "", email: "", password: "" });
      setShowForm(false);
      fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(id: string) {
    try {
      await api.patch(`/users/admins/${id}`, { name: editName });
      setEditingId(null);
      fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete(admin: Admin) {
    if (!confirm(`Are you sure you want to deactivate ${admin.name}? This will also deactivate all their employees.`)) return;
    try {
      await api.delete(`/users/admins/${admin.id}`);
      fetchAdmins();
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
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Admins</h1>
          <p className="text-zinc-400 text-sm mt-1.5">Manage admin accounts</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors"
        >
          {showForm ? <Plus size={16} className="rotate-45" /> : <UserPlus size={16} />}
          {showForm ? "Cancel" : "Add Admin"}
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
            {creating ? "Creating..." : "Create Admin"}
          </button>
        </form>
      )}

      <div className="flex-1 rounded-3xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#09090b] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.6)] overflow-hidden">
        <div className="overflow-x-auto h-full">
          <table className="w-full min-w-[760px] text-sm">
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
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-white">
                    {editingId === admin.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-zinc-900 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-orange-500/50 w-32"
                        />
                        <button onClick={() => handleUpdate(admin.id)} className="text-green-400 hover:text-green-300"><Check size={14} /></button>
                        <button onClick={() => setEditingId(null)} className="text-zinc-500 hover:text-zinc-300"><X size={14} /></button>
                      </div>
                    ) : (
                      admin.name
                    )}
                  </td>
                  <td className="px-6 py-4 text-zinc-300">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${admin.is_active !== false ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                      {admin.is_active !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-xs">{new Date(admin.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingId(admin.id); setEditName(admin.name); }}
                        className="group relative p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                        aria-label="Edit name"
                      >
                        <Pencil size={14} />
                        <Tooltip label="Edit name" />
                      </button>
                      <button
                        onClick={() => handleDelete(admin)}
                        className="group relative p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        aria-label="Deactivate admin and employees"
                      >
                        <Trash2 size={14} />
                        <Tooltip label="Deactivate admin and employees" tone="danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-zinc-500">
                    No admins yet.
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
