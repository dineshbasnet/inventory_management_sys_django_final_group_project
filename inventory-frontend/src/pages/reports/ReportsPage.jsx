import { useEffect, useState } from 'react';
import { getStockReportAPI, getMovementReportAPI, getDashboardAPI } from '../../api/reports';
import { BarChart3, TrendingUp, TrendingDown, RefreshCw, AlertTriangle, DollarSign, Package, ShoppingCart, XCircle } from 'lucide-react';

const movementIconMap = {
    in: { icon: TrendingUp, color: 'bg-green-100 text-green-700' },
    out: { icon: TrendingDown, color: 'bg-red-100 text-red-700' },
    adjustment: { icon: RefreshCw, color: 'bg-blue-100 text-blue-700' },
    damage: { icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-700' },
};

export default function ReportsPage() {
    const [dashboard, setDashboard] = useState(null);
    const [stockReport, setStockReport] = useState([]);
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(30);

    useEffect(() => { fetchAll(); }, [days]);

    const fetchAll = () => {
        setLoading(true);
        Promise.all([
            getDashboardAPI(),
            getStockReportAPI(),
            getMovementReportAPI(days),
        ])
            .then(([dashRes, stockRes, movRes]) => {
                setDashboard(dashRes.data);
                setStockReport(stockRes.data.report || []);
                setMovements(movRes.data.movements_by_type || []);
            })
            .finally(() => setLoading(false));
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">Reports</h2>
                    <p className="text-gray-500 text-sm">Inventory overview and stock analysis</p>
                </div>
                <select value={days} onChange={e => setDays(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full sm:w-auto">
                    <option value={7}>Last 7 Days</option>
                    <option value={30}>Last 30 Days</option>
                    <option value={60}>Last 60 Days</option>
                    <option value={90}>Last 90 Days</option>
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { title: 'Total Products', value: dashboard?.total_products, icon: Package, bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500' },
                    { title: 'Out of Stock', value: dashboard?.out_of_stock, icon: XCircle, bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-500' },
                    { title: 'Pending Orders', value: dashboard?.pending_orders, icon: ShoppingCart, bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-500' },
                    { title: 'Inventory Value Rs', value: dashboard?.total_inventory_value, icon: DollarSign, bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-500' },
                ].map(card => {
                    const Icon = card.icon;
                    return (
                        <div key={card.title} className={`bg-white rounded-xl p-5 border-l-4 ${card.border} shadow-sm flex items-center gap-4`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${card.bg}`}>
                                <Icon size={22} className={card.text} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-800 mt-0.5">{card.value ?? 0}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Movement Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-800">
                        Stock Movements — Last {days} Days
                    </h3>
                </div>
                {movements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-24 text-gray-400">
                        <p className="text-sm">No movements found for this period.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {movements.map(m => {
                            const config = movementIconMap[m.movement_type] || { icon: BarChart3, color: 'bg-gray-100 text-gray-600' };
                            const Icon = config.icon;
                            return (
                                <div key={m.movement_type}
                                    className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${config.color}`}>
                                        <Icon size={20} />
                                    </div>
                                    <p className="text-xs text-gray-500 capitalize font-medium">{m.movement_type}</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">{m.count}</p>
                                    <p className="text-xs text-gray-400 mt-1">movements</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Stock Valuation Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 md:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row
          sm:items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-gray-800">Stock Valuation Report</h3>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{stockReport.length} products</span>
                        <span className="text-sm font-semibold text-green-600">
                            Total: Rs {stockReport.reduce((sum, i) => sum + Number(i.total_value), 0).toFixed(2)}
                        </span>
                    </div>
                </div>
                {stockReport.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <BarChart3 size={40} className="mb-2 opacity-40" />
                        <p className="text-sm">No stock data available</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Product', 'SKU', 'Category', 'Quantity', 'Cost Price', 'Total Value', 'Status'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stockReport.map(item => (
                                    <tr key={item.product_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.product_name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{item.sku}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{item.category || '—'}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{item.quantity}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">Rs {item.cost_price}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-green-600">
                                            Rs {Number(item.total_value).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${item.status === 'out' ? 'bg-red-100 text-red-700' :
                                                    item.status === 'low' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-green-100 text-green-700'}`}>
                                                {item.status === 'out' ? 'Out of Stock' :
                                                    item.status === 'low' ? 'Low Stock' : 'In Stock'}
                                            </span>
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