import { useEffect, useState } from 'react';
import {
    getUsersAPI, createUserAPI, updateUserAPI, toggleUserStatusAPI
} from '../../api/auth';
import { Plus, Pencil, X, Users, ShieldCheck, UserCog, User } from 'lucide-react';

const emptyForm = {
     email: '',
    username: '', password: '', role: 'staff', is_active: true,
};

const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Staff' },
];

const roleStyle = {
    admin: 'bg-purple-100 text-purple-700',
    manager: 'bg-blue-100 text-blue-700',
    staff: 'bg-gray-100 text-gray-600',
};

const roleIcon = {
    admin: ShieldCheck,
    manager: UserCog,
    staff: User,
};

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        await getUsersAPI()
            .then(res => setUsers(res.data.results || res.data))
            .catch(() => setError('Failed to load users.'))
            .finally(() => setLoading(false));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editing) {
                // Don't send password if empty during edit
                const payload = { ...form };
                if (!payload.password) delete payload.password;
                await updateUserAPI(editing.id, payload);
            } else {
                await createUserAPI(form);
            }
            fetchAll();
            resetForm();
        } catch (err) {
            const data = err.response?.data;
            if (data?.email) setError('Email: ' + data.email[0]);
            else if (data?.username) setError('Username: ' + data.username[0]);
            else if (data?.password) setError('Password: ' + data.password[0]);
            else setError('Error saving user. Check all fields.');
        }
    };

    const handleEdit = (u) => {
        setEditing(u);
        setForm({
            email: u.email,
            username: u.username,
            password: '',          
            role: u.role,
            is_active: u.is_active,
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggleStatus = async (u) => {
        const action = u.is_active ? 'deactivate' : 'activate';
        if (window.confirm(`Are you sure you want to ${action} ${u.first_name}?`)) {
            try {
                await toggleUserStatusAPI(u.id, { is_active: !u.is_active });
                fetchAll();
            } catch {
                alert('Error updating user status.');
            }
        }
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditing(null);
        setShowForm(false);
        setError('');
    };

    const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">Users</h2>
                    <p className="text-gray-500 text-sm">{users.length} users total</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700
            text-white rounded-lg transition-colors text-sm font-medium w-full sm:w-auto justify-center">
                    <Plus size={18} /> Add User
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-800">
                            {editing ? 'Edit User' : 'Add New User'}
                        </h3>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3
              rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Email *</label>
                                <input value={form.email} required type="email" placeholder="email@example.com"
                                    onChange={e => set('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Username *</label>
                                <input value={form.username} required placeholder="username"
                                    onChange={e => set('username', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                    Password {editing && <span className="text-gray-400 font-normal">(leave blank to keep)</span>}
                                    {!editing && ' *'}
                                </label>
                                <input value={form.password} type="password"
                                    required={!editing} placeholder={editing ? 'Leave blank to keep current' : 'Password'}
                                    onChange={e => set('password', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Role *</label>
                                <select value={form.role} onChange={e => set('role', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    {roleOptions.map(r => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                                <select value={form.is_active}
                                    onChange={e => set('is_active', e.target.value === 'true')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button type="submit"
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white
                  rounded-lg text-sm font-medium transition-colors">
                                {editing ? 'Update User' : 'Save User'}
                            </button>
                            <button type="button" onClick={resetForm}
                                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700
                  rounded-lg text-sm font-medium transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <Users size={40} className="mb-2 opacity-40" />
                        <p className="text-sm">No users found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Username', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold
                      text-gray-600 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map(u => {
                                    const RoleIcon = roleIcon[u.role] || User;
                                    return (
                                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">

                                            <td className="px-4 py-3 text-sm text-gray-500">{u.username}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>

                                            {/* Role Badge */}
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1
                          rounded-full text-xs font-medium ${roleStyle[u.role]}`}>
                                                    <RoleIcon size={12} />
                                                    {u.role}
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {u.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {/* Edit */}
                                                    <button onClick={() => handleEdit(u)}
                                                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100
                              text-blue-600 transition-colors" title="Edit User">
                                                        <Pencil size={15} />
                                                    </button>

                                                    {/* Toggle Active/Inactive */}
                                                    <button onClick={() => handleToggleStatus(u)}
                                                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors
                              ${u.is_active
                                                                ? 'bg-red-50 hover:bg-red-100 text-red-600'
                                                                : 'bg-green-50 hover:bg-green-100 text-green-600'
                                                            }`}>
                                                        {u.is_active ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}