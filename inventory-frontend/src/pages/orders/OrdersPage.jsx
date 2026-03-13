import { useEffect, useState } from 'react';
import { getOrdersAPI, createOrderAPI, deleteOrderAPI, approveOrderAPI, receiveOrderAPI } from '../../api/orders';
import { getSuppliersAPI } from '../../api/suppliers';
import { getProductsAPI } from '../../api/products';
import { Plus, Trash2, X, ShoppingCart, CheckCircle, PackageCheck } from 'lucide-react';

const emptyForm = { supplier: '', notes: '', expected_delivery: '', items: [] };

const statusStyle = {
    draft:     'bg-gray-100 text-gray-600',
    pending:   'bg-yellow-100 text-yellow-700',
    approved:  'bg-blue-100 text-blue-700',
    received:  'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

const extractArray = (data) => {
    if (Array.isArray(data))          return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.data))    return data.data;
    return [];
};

export default function OrdersPage() {
    const [orders, setOrders]       = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts]   = useState([]);
    const [showForm, setShowForm]   = useState(false);
    const [form, setForm]           = useState(emptyForm);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState('');

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        setError('');
        try {
            const [ordersRes, suppliersRes, productsRes] = await Promise.all([
                getOrdersAPI(),
                getSuppliersAPI(),
                getProductsAPI(),
            ]);
            setOrders(extractArray(ordersRes.data));
            setSuppliers(extractArray(suppliersRes.data));
            setProducts(extractArray(productsRes.data));
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to load data. Please refresh.');
        } finally {
            setLoading(false);
        }
    };

    const addItem = () =>
        setForm(prev => ({
            ...prev,
            items: [...prev.items, { product: '', quantity: 1, unit_price: '' }]
        }));

    // ✅ Auto-fill unit price when product is selected
    const handleProductChange = (i, productId) => {
        const selectedProduct = products.find(p => String(p.id) === String(productId));
        const items = [...form.items];
        items[i] = {
            ...items[i],
            product:    productId,
            unit_price: selectedProduct ? selectedProduct.cost_price : '',
        };
        setForm(prev => ({ ...prev, items }));
    };

    const updateItem = (i, field, value) => {
        const items = [...form.items];
        items[i][field] = value;
        setForm(prev => ({ ...prev, items }));
    };

    const removeItem = (i) =>
        setForm(prev => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));

    // ✅ Calculate total for each item row
    const getItemTotal = (item) => {
        const qty   = parseFloat(item.quantity)   || 0;
        const price = parseFloat(item.unit_price) || 0;
        return (qty * price).toFixed(2);
    };

    // ✅ Calculate grand total of all items
    const getGrandTotal = () => {
        return form.items.reduce((sum, item) => {
            const qty   = parseFloat(item.quantity)   || 0;
            const price = parseFloat(item.unit_price) || 0;
            return sum + qty * price;
        }, 0).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.items.length === 0) {
            setError('Please add at least one item to the order.');
            return;
        }
        try {
            await createOrderAPI(form);
            fetchAll();
            setForm(emptyForm);
            setShowForm(false);
        } catch (err) {
            const msg = err.response?.data?.detail
                || err.response?.data?.error
                || 'Error creating order. Check all fields.';
            setError(msg);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveOrderAPI(id);
            fetchAll();
        } catch (err) {
            alert(err.response?.data?.error || 'Error approving order.');
        }
    };

    const handleReceive = async (id) => {
        try {
            await receiveOrderAPI(id);
            fetchAll();
        } catch (err) {
            alert(err.response?.data?.error || 'Error receiving order.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this order?')) {
            try {
                await deleteOrderAPI(id);
                fetchAll();
            } catch (err) {
                alert(err.response?.data?.error || 'Error deleting order.');
            }
        }
    };

    const resetForm = () => {
        setForm(emptyForm);
        setShowForm(false);
        setError('');
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

            {/* Global Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

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

                        {/* Supplier + Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Supplier *</label>
                                <select value={form.supplier} required
                                    onChange={e => set('supplier', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select Supplier</option>
                                    {suppliers.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Expected Delivery</label>
                                <input type="date" value={form.expected_delivery}
                                    onChange={e => set('expected_delivery', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Notes</label>
                            <textarea value={form.notes} rows={2} placeholder="Order notes..."
                                onChange={e => set('notes', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                        </div>

                        {/* Order Items */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Order Items
                                    {form.items.length > 0 && (
                                        <span className="ml-2 text-xs text-gray-400 font-normal">
                                            ({form.items.length} items)
                                        </span>
                                    )}
                                </label>
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
                                    <>
                                        {/* Items Table Header */}
                                        <div className="hidden sm:grid grid-cols-12 gap-2 px-3 py-2
                                            bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase">Product</div>
                                            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Qty</div>
                                            <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase">Unit Price (Rs)</div>
                                            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Total</div>
                                            <div className="col-span-1"></div>
                                        </div>

                                        {/* Item Rows */}
                                        {form.items.map((item, i) => (
                                            <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2
                                                p-3 bg-gray-50 rounded-lg border border-gray-100">

                                                {/* Product Select */}
                                                <div className="sm:col-span-4">
                                                    <label className="sm:hidden text-xs text-gray-500 mb-1 block">Product</label>
                                                    <select
                                                        value={item.product}
                                                        onChange={e => handleProductChange(i, e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">Select Product</option>
                                                        {products.map(p => (
                                                            <option key={p.id} value={p.id}>
                                                                {p.name} — Rs {p.cost_price}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Quantity */}
                                                <div className="sm:col-span-2">
                                                    <label className="sm:hidden text-xs text-gray-500 mb-1 block">Quantity</label>
                                                    <input
                                                        type="number"
                                                        placeholder="Qty"
                                                        value={item.quantity}
                                                        min={1}
                                                        onChange={e => updateItem(i, 'quantity', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                {/* Unit Price — auto filled but editable */}
                                                <div className="sm:col-span-3">
                                                    <label className="sm:hidden text-xs text-gray-500 mb-1 block">Unit Price (Rs)</label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            placeholder="Auto filled"
                                                            value={item.unit_price}
                                                            onChange={e => updateItem(i, 'unit_price', e.target.value)}
                                                            className={`w-full px-3 py-2 border rounded-lg text-sm
                                                                focus:outline-none focus:ring-2 focus:ring-blue-500
                                                                ${item.unit_price
                                                                    ? 'border-green-300 bg-green-50'
                                                                    : 'border-gray-300'
                                                                }`}
                                                        />
                                                        {/* ✅ Auto-filled indicator */}
                                                        {item.unit_price && (
                                                            <span className="absolute right-2 top-1/2 -translate-y-1/2
                                                                text-xs text-green-600 font-medium pointer-events-none">
                                                                Rs
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Row Total */}
                                                <div className="sm:col-span-2">
                                                    <label className="sm:hidden text-xs text-gray-500 mb-1 block">Total</label>
                                                    <div className="px-3 py-2 bg-white border border-gray-200
                                                        rounded-lg text-sm font-semibold text-gray-700 text-center">
                                                        Rs {getItemTotal(item)}
                                                    </div>
                                                </div>

                                                {/* Remove Button */}
                                                <div className="sm:col-span-1 flex items-center justify-end sm:justify-center">
                                                    <button type="button" onClick={() => removeItem(i)}
                                                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>

                                            </div>
                                        ))}

                                        {/* Grand Total */}
                                        <div className="flex justify-end pt-2">
                                            <div className="bg-blue-50 border border-blue-100 rounded-lg
                                                px-5 py-3 flex items-center gap-3">
                                                <span className="text-sm font-medium text-gray-600">
                                                    Grand Total:
                                                </span>
                                                <span className="text-lg font-bold text-blue-600">
                                                    Rs {getGrandTotal()}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button type="submit"
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white
                                    rounded-lg text-sm font-medium transition-colors">
                                Create Order
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

            {/* Orders Table */}
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
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                                            Rs {o.total_amount}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{o.expected_delivery || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{o.created_by_name}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {o.status === 'pending' && (
                                                    <button onClick={() => handleApprove(o.id)}
                                                        title="Approve Order"
                                                        className="p-1.5 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-600 transition-colors">
                                                        <CheckCircle size={15} />
                                                    </button>
                                                )}
                                                {o.status === 'approved' && (
                                                    <button onClick={() => handleReceive(o.id)}
                                                        title="Receive Order"
                                                        className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors">
                                                        <PackageCheck size={15} />
                                                    </button>
                                                )}
                                                {o.status === 'draft' && (
                                                    <button onClick={() => handleDelete(o.id)}
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