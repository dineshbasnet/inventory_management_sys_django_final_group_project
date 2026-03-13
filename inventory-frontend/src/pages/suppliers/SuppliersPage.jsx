import { useEffect, useState } from 'react';
import { getSuppliersAPI, createSupplierAPI, updateSupplierAPI, deleteSupplierAPI } from '../../api/suppliers';
import { Plus, Pencil, Trash2, X, Truck } from 'lucide-react';

const emptyForm = {
    name: '', company: '', email: '', phone: '', address: '', is_active: true
};

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        await getSuppliersAPI()
            .then(res => setSuppliers(res.data.results || res.data))
            .finally(() => setLoading(false));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            editing
                ? await updateSupplierAPI(editing.id, form)
                : await createSupplierAPI(form);
            fetchAll();
            resetForm();
        } catch {
            alert('Error saving supplier. Check all fields.');
        }
    };

    const handleEdit = (s) => {
        setEditing(s);
        setForm({
            name: s.name, company: s.company, email: s.email,
            phone: s.phone, address: s.address, is_active: s.is_active,
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this supplier?')) {
            await deleteSupplierAPI(id);
            fetchAll();
        }
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditing(null);
        setShowForm(false);
    };

    const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">Suppliers</h2>
                    <p className="text-gray-500 text-sm">{suppliers.length} suppliers total</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700
            text-white rounded-lg transition-colors text-sm font-medium w-full sm:w-auto justify-center">
                    <Plus size={18} /> Add Supplier
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-800">
                            {editing ? 'Edit Supplier' : 'Add New Supplier'}
                        </h3>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Name *</label>
                                <input value={form.name} required placeholder="Supplier name"
                                    onChange={e => set('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Company</label>
                                <input value={form.company} placeholder="Company name"
                                    onChange={e => set('company', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Email *</label>
                                <input value={form.email} required type="email" placeholder="email@example.com"
                                    onChange={e => set('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Phone *</label>
                                <input value={form.phone} required placeholder="Phone number"
                                    onChange={e => set('phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Address</label>
                            <textarea value={form.address} rows={3} placeholder="Supplier address..."
                                onChange={e => set('address', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button type="submit"
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                                {editing ? 'Update Supplier' : 'Save Supplier'}
                            </button>
                            <button type="button" onClick={resetForm}
                                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors">
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
                ) : suppliers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <Truck size={40} className="mb-2 opacity-40" />
                        <p className="text-sm">No suppliers found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Name', 'Company', 'Email', 'Phone', 'Address', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {suppliers.map(s => (
                                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{s.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{s.company || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{s.email}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{s.phone}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{s.address || '—'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {s.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleEdit(s)}
                                                    className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors">
                                                    <Pencil size={15} />
                                                </button>
                                                <button onClick={() => handleDelete(s.id)}
                                                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}