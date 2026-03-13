import { useEffect, useState } from 'react';
import { getOrdersAPI, createOrderAPI, deleteOrderAPI, approveOrderAPI, receiveOrderAPI } from '../../api/orders';
import { getSuppliersAPI } from '../../api/suppliers';
import { getProductsAPI } from '../../api/products';
import { Plus, Trash2, X, ShoppingCart, CheckCircle, PackageCheck } from 'lucide-react';

const emptyForm = { supplier: '', notes: '', expected_delivery: '', items: [] };

const statusStyle = {
    draft: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    received: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        await Promise.all([
            getOrdersAPI().then(res => setOrders(res.data.results || res.data)),
            getSuppliersAPI().then(res => setSuppliers(res.data.results || res.data)),
            getProductsAPI().then(res => setProducts(res.data.results || res.data)),
        ]);
        setLoading(false);
    };

    const addItem = () =>
        setForm(prev => ({ ...prev, items: [...prev.items, { product: '', quantity: 1, unit_price: '' }] }));

    const updateItem = (i, field, value) => {
        const items = [...form.items];
        items[i][field] = value;
        setForm(prev => ({ ...prev, items }));
    };

    const removeItem = (i) =>
        setForm(prev => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createOrderAPI(form);
            fetchAll();
            setForm(emptyForm);
            setShowForm(false);
        } catch {
            alert('Error creating order.');
        }
    };

    const resetForm = () => {
        setForm(emptyForm);
        setShowForm(false);
    };

    const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">Purchase Orders</h2>
                    <p className="text-gray-500 text-sm">{orders.length} orders total</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700
            text-white rounded-lg transition-colors text-sm font-medium w-full sm:w-auto justify-center">
                    <Plus size={18} /> New Order
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-800">Create Purchase Order</h3>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Supplier *</label>
                                <select value={form.supplier} required onChange={e => set('supplier', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select Supplier</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Expected Delivery</label>
                                <input type="date" value={form.expected_delivery}
                                    onChange={e => set('expected_delivery', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Notes</label>
                            <textarea value={form.notes} rows={3} placeholder="Order notes..."
                                onChange={e => set('notes', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                        </div>

                        {/* Order Items */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">Order Items</label>
                                <button type="button" onClick={addItem}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    <Plus size={15} /> Add Item
                                </button>
                            </div>
                            <div className="space-y-2">
                                {form.items.length === 0 ? (
                                    <p className="text-sm text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-lg">
                                        No items added yet. Click "Add Item" to start.
                                    </p>
                                ) : (
                                    form.items.map((item, i) => (
                                        <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-gray-50 rounded-lg">
                                            <select value={item.product}
                                                onChange={e => updateItem(i, 'product', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="">Select Product</option>
                                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                            <input type="number" placeholder="Quantity" value={item.quantity} min={1}
                                                onChange={e => updateItem(i, 'quantity', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            <div className="flex gap-2">
                                                <input type="number" placeholder="Unit Price" value={item.unit_price}
                                                    onChange={e => updateItem(i, 'unit_price', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                <button type="button" onClick={() => removeItem(i)}
                                                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button type="submit"
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                                Create Order
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
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <ShoppingCart size={40} className="mb-2 opacity-40" />
                        <p className="text-sm">No orders found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Order #', 'Supplier', 'Status', 'Total Amount', 'Expected Delivery', 'Created By', 'Actions'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map(o => (
                                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{o.order_number}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{o.supplier_name}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle[o.status]}`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">Rs {o.total_amount}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{o.expected_delivery || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{o.created_by_name}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {o.status === 'pending' && (
                                                    <button onClick={() => approveOrderAPI(o.id).then(fetchAll)}
                                                        title="Approve Order"
                                                        className="p-1.5 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-600 transition-colors">
                                                        <CheckCircle size={15} />
                                                    </button>
                                                )}
                                                {o.status === 'approved' && (
                                                    <button onClick={() => receiveOrderAPI(o.id).then(fetchAll)}
                                                        title="Receive Order"
                                                        className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors">
                                                        <PackageCheck size={15} />
                                                    </button>
                                                )}
                                                {o.status === 'draft' && (
                                                    <button onClick={() => { if (window.confirm('Delete this order?')) deleteOrderAPI(o.id).then(fetchAll); }}
                                                        title="Delete Order"
                                                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
                                                        <Trash2 size={15} />
                                                    </button>
                                                )}
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