import { useEffect, useState } from 'react';
import { getStockAPI, addStockAPI, removeStockAPI, adjustStockAPI, getMovementsAPI } from '../../api/stock';
import { getProductsAPI } from '../../api/products';
import { Plus, Minus, SlidersHorizontal, X, Warehouse, CheckCircle } from 'lucide-react';

const emptyForm = { product: '', quantity: 1, reference: '', notes: '' };

export default function StockPage() {
    const [stock, setStock] = useState([]);
    const [products, setProducts] = useState([]);
    const [movements, setMovements] = useState([]);
    const [action, setAction] = useState(null); // 'add' | 'remove' | 'adjust'
    const [form, setForm] = useState(emptyForm);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        await Promise.all([
            getStockAPI().then(res => setStock(res.data.results || res.data)),
            getProductsAPI().then(res => setProducts(res.data.results || res.data)),
            getMovementsAPI().then(res => setMovements(res.data.results || res.data)),
        ]);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (action === 'add') await addStockAPI(form);
            if (action === 'remove') await removeStockAPI(form);
            if (action === 'adjust') await adjustStockAPI(form);
            setMessage(`Stock ${action} successful!`);
            fetchAll();
            setForm(emptyForm);
            setAction(null);
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            alert(err.response?.data?.error || 'Error updating stock.');
        }
    };

    const resetForm = () => { setForm(emptyForm); setAction(null); };
    const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const statusStyle = (s) =>
        s.is_out ? 'bg-red-100 text-red-700' :
            s.is_low ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700';

    const statusLabel = (s) =>
        s.is_out ? 'Out of Stock' : s.is_low ? 'Low Stock' : 'In Stock';

    const actionConfig = {
        add: { label: 'Add Stock', color: 'bg-green-600 hover:bg-green-700' },
        remove: { label: 'Remove Stock', color: 'bg-red-500 hover:bg-red-600' },
        adjust: { label: 'Adjust Stock', color: 'bg-blue-600 hover:bg-blue-700' },
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">Stock Management</h2>
                    <p className="text-gray-500 text-sm">{stock.length} products tracked</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={() => { resetForm(); setAction('add'); }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700
              text-white rounded-lg transition-colors text-sm font-medium justify-center">
                        <Plus size={18} /> Add Stock
                    </button>
                    <button onClick={() => { resetForm(); setAction('remove'); }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600
              text-white rounded-lg transition-colors text-sm font-medium justify-center">
                        <Minus size={18} /> Remove Stock
                    </button>
                    <button onClick={() => { resetForm(); setAction('adjust'); }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700
              text-white rounded-lg transition-colors text-sm font-medium justify-center">
                        <SlidersHorizontal size={18} /> Adjust
                    </button>
                </div>
            </div>

            {/* Success Message */}
            {message && (
                <div className="bg-green-50 border border-green-200 text-green-700
          px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <CheckCircle size={16} />
                    {message}
                </div>
            )}

            {/* Form */}
            {action && (
                <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-800">
                            {actionConfig[action].label}
                        </h3>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Product *</label>
                                <select value={form.product} required onChange={e => set('product', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select Product</option>
                                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Quantity *</label>
                                <input type="number" value={form.quantity} min={1} required
                                    onChange={e => set('quantity', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Reference</label>
                                <input value={form.reference} placeholder="e.g. PO-001"
                                    onChange={e => set('reference', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Notes</label>
                                <input value={form.notes} placeholder="Optional notes"
                                    onChange={e => set('notes', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button type="submit"
                                className={`px-6 py-2 text-white rounded-lg text-sm font-medium transition-colors ${actionConfig[action].color}`}>
                                Confirm {actionConfig[action].label}
                            </button>
                            <button type="button" onClick={resetForm}
                                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stock Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-800">Current Stock Levels</h3>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : stock.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <Warehouse size={40} className="mb-2 opacity-40" />
                        <p className="text-sm">No stock records found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[500px]">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Product', 'SKU', 'Quantity', 'Min Stock', 'Status'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stock.map(s => (
                                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{s.product_name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{s.product_sku}</td>
                                        <td className="px-4 py-3 text-sm font-bold text-gray-800">{s.quantity}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{s.minimum_stock}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle(s)}`}>
                                                {statusLabel(s)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Movements Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-800">Recent Stock Movements</h3>
                </div>
                {movements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                        <p className="text-sm">No movements recorded yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[560px]">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Product', 'Type', 'Quantity', 'Reference', 'Notes', 'Date'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {movements.map(m => (
                                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{m.product_name}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${m.movement_type === 'in' ? 'bg-green-100 text-green-700' :
                                                    m.movement_type === 'out' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'}`}>
                                                {m.movement_type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{m.quantity}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{m.reference || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{m.notes || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {new Date(m.created_at).toLocaleDateString()}
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