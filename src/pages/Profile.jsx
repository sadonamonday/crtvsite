import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// If you already have a global config/env, prefer using that.
const API_BASE = 'https://crtvshotss.atwebpages.com/';

const TABS = {
    OVERVIEW: 'overview',
    ORDERS: 'orders',
    BOOKINGS: 'bookings',
    SETTINGS: 'settings',
};

function classNames(...arr) {
    return arr.filter(Boolean).join(' ');
}

function useFetchJson(url, deps = []) {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        async function run() {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(url, { credentials: 'include' });
                const text = await res.text();
                let json;
                try {
                    json = JSON.parse(text);
                } catch (e) {
                    throw new Error('Server did not return JSON. Raw: ' + text.slice(0, 300));
                }
                if (!json.success) {
                    throw new Error(json.message || 'Request failed');
                }
                if (!cancelled) setData(json.data);
            } catch (err) {
                if (!cancelled) setError(err.message || 'Network error');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        run();
        return () => { cancelled = true; };
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps

    return { data, error, loading };
}

function formatMoney(cents, currency = 'USD') {
    try {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format((cents || 0) / 100);
    } catch {
        return (cents || 0) / 100 + ' ' + currency;
    }
}

function formatDate(d) {
    if (!d) return '';
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return String(d);
    return date.toLocaleString();
}

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);

    // Basic gate: if you rely on a session cookie only, we still fetch.
    // Optionally also ensure email stored by Login.jsx
    const email = typeof window !== 'undefined' ? sessionStorage.getItem('user_email') : null;
    useEffect(() => {
        // If you want to force login flow, redirect when email missing
        if (!email) {
            // navigate('/login'); // Uncomment if you want hard protection
        }
    }, [email, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 mt-35">
            <header className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="text-xl font-semibold">

                    </Link>
                    <nav className="flex gap-2">
                        <TabButton label="Overview" active={activeTab === TABS.OVERVIEW} onClick={() => setActiveTab(TABS.OVERVIEW)} />
                        <TabButton label="Orders" active={activeTab === TABS.ORDERS} onClick={() => setActiveTab(TABS.ORDERS)} />
                        <TabButton label="Bookings" active={activeTab === TABS.BOOKINGS} onClick={() => setActiveTab(TABS.BOOKINGS)} />
                        <TabButton label="Settings" active={activeTab === TABS.SETTINGS} onClick={() => setActiveTab(TABS.SETTINGS)} />
                    </nav>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-6">
                {activeTab === TABS.OVERVIEW && <OverviewTab />}
                {activeTab === TABS.ORDERS && <OrdersTab />}
                {activeTab === TABS.BOOKINGS && <BookingsTab />}
                {activeTab === TABS.SETTINGS && <SettingsTab />}
            </main>
        </div>
    );
};

function TabButton({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={classNames(
                'px-3 py-2 rounded-md text-sm font-medium',
                active ? 'bg-[#06d6a0] text-black' : 'text-gray-700 hover:bg-gray-100'
            )}
        >
            {label}
        </button>
    );
}

// Overview / Dashboard
function OverviewTab() {
    const { data, error, loading } = useFetchJson(`${API_BASE}/dashboard.php`, []);

    if (loading) return <Skeleton text="Loading dashboard..." />;
    if (error) return <ErrorBox message={error} />;

    const user = data?.user;
    const totals = data?.totals || {};
    const latestOrders = data?.latest_orders || [];
    const latestBookings = data?.latest_bookings || [];

    return (
        <div className="space-y-6">
            <section className="bg-white rounded-xl shadow p-5">
                <div className="flex items-center gap-4">
                    <img
                        src={user?.avatar_url || 'https://via.placeholder.com/96x96?text=Avatar'}
                        alt="Avatar"
                        className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">{user?.first_name || ''} {user?.last_name || ''}</h2>
                        <p className="text-gray-600 text-sm">{user?.email}</p>
                        <p className="text-gray-500 text-sm">Member since {formatDate(user?.created_at)}</p>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Orders" value={totals.orders_total} />
                <StatCard label="Paid/Completed Orders" value={totals.orders_paid} />
                <StatCard label="Bookings" value={totals.bookings_total} />
                <StatCard label="Upcoming Bookings" value={totals.bookings_upcoming} />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow p-5">
                    <h3 className="text-lg font-semibold mb-3">Latest Orders</h3>
                    <div className="divide-y">
                        {latestOrders.length === 0 && (
                            <div className="text-gray-500 text-sm">No orders yet.</div>
                        )}
                        {latestOrders.map((o) => (
                            <div key={o.id} className="py-3 flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{o.order_number}</div>
                                    <div className="text-gray-500 text-sm">{formatDate(o.placed_at)} • {o.status}</div>
                                </div>
                                <div className="text-sm">{formatMoney(o.total_cents, o.currency)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-5">
                    <h3 className="text-lg font-semibold mb-3">Latest Bookings</h3>
                    <div className="divide-y">
                        {latestBookings.length === 0 && (
                            <div className="text-gray-500 text-sm">No bookings yet.</div>
                        )}
                        {latestBookings.map((b) => (
                            <div key={b.id} className="py-3 flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{b.title}</div>
                                    <div className="text-gray-500 text-sm">Ref: {b.reference} • {b.status}</div>
                                </div>
                                <div className="text-sm">{formatDate(b.start_at)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="bg-white rounded-xl shadow p-5">
            <div className="text-gray-500 text-sm">{label}</div>
            <div className="text-2xl font-semibold">{value ?? 0}</div>
        </div>
    );
}

// Orders tab with pagination and filters
function OrdersTab() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [status, setStatus] = useState('');
    const [q, setQ] = useState('');

    const query = useMemo(() => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('page_size', String(pageSize));
        if (status) params.set('status', status);
        if (q) params.set('q', q);
        return params.toString();
    }, [page, pageSize, status, q]);

    const { data, error, loading } = useFetchJson(`${API_BASE}/order_list.php?${query}`, [query]);

    const total = data?.total || 0;
    const orders = data?.orders || [];
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-4">
                <div className="flex flex-col md:flex-row md:items-end gap-3">
                    <div className="flex-1">
                        <label className="block text-sm text-gray-700">Search by Order #</label>
                        <input
                            value={q}
                            onChange={(e) => { setPage(1); setQ(e.target.value); }}
                            placeholder="e.g. ORD-12345"
                            className="mt-1 w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Status</label>
                        <select
                            value={status}
                            onChange={(e) => { setPage(1); setStatus(e.target.value); }}
                            className="mt-1 p-2 border rounded"
                        >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Page Size</label>
                        <select
                            value={pageSize}
                            onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}
                            className="mt-1 p-2 border rounded"
                        >
                            {[10, 20, 50, 100].map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow">
                {loading && <Skeleton text="Loading orders..." />}
                {error && <ErrorBox message={error} />}
                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                            <tr className="text-left text-sm text-gray-600 border-b">
                                <th className="py-3 px-4">Order #</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Placed</th>
                                <th className="py-3 px-4">Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-6 px-4 text-center text-gray-500">No orders found.</td>
                                </tr>
                            )}
                            {orders.map((o) => (
                                <tr key={o.id} className="border-b last:border-0">
                                    <td className="py-3 px-4 font-medium">{o.order_number}</td>
                                    <td className="py-3 px-4">{o.status}</td>
                                    <td className="py-3 px-4">{formatDate(o.placed_at)}</td>
                                    <td className="py-3 px-4">{formatMoney(o.total_cents, o.currency)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
    );
}

// Bookings tab with pagination and filters
function BookingsTab() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [status, setStatus] = useState('');
    const [from, setFrom] = useState(''); // YYYY-MM-DD
    const [to, setTo] = useState('');

    const query = useMemo(() => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('page_size', String(pageSize));
        if (status) params.set('status', status);
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        return params.toString();
    }, [page, pageSize, status, from, to]);

    const { data, error, loading } = useFetchJson(`${API_BASE}/bookings_list.php?${query}`, [query]);

    const total = data?.total || 0;
    const bookings = data?.bookings || [];
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                    <div className="md:col-span-2">
                        <label className="block text-sm text-gray-700">Status</label>
                        <select
                            value={status}
                            onChange={(e) => { setPage(1); setStatus(e.target.value); }}
                            className="mt-1 p-2 border rounded w-full"
                        >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">From</label>
                        <input
                            type="date"
                            value={from}
                            onChange={(e) => { setPage(1); setFrom(e.target.value); }}
                            className="mt-1 p-2 border rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">To</label>
                        <input
                            type="date"
                            value={to}
                            onChange={(e) => { setPage(1); setTo(e.target.value); }}
                            className="mt-1 p-2 border rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Page Size</label>
                        <select
                            value={pageSize}
                            onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}
                            className="mt-1 p-2 border rounded w-full"
                        >
                            {[10, 20, 50, 100].map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow">
                {loading && <Skeleton text="Loading bookings..." />}
                {error && <ErrorBox message={error} />}
                {!loading && !error && (
                    <div className="divide-y">
                        {bookings.length === 0 && (
                            <div className="py-6 px-4 text-center text-gray-500">No bookings found.</div>
                        )}
                        {bookings.map((b) => (
                            <div key={b.id} className="py-3 px-4 flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{b.title}</div>
                                    <div className="text-gray-500 text-sm">Ref: {b.reference} • {b.status}</div>
                                </div>
                                <div className="text-sm text-right">
                                    <div>Start: {formatDate(b.start_at)}</div>
                                    <div>End: {formatDate(b.end_at)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
    );
}

// Settings tab: Profile info + avatar upload
function SettingsTab() {
    // Load current profile for initial values
    const { data, error, loading } = useFetchJson(`${API_BASE}/profile_get.php`, []);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);

    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [saveErr, setSaveErr] = useState('');

    useEffect(() => {
        if (data?.user) {
            setFirstName(data.user.first_name || '');
            setLastName(data.user.last_name || '');
            setPhone(data.user.phone || '');
        }
    }, [data]);

    async function handleSaveProfile(e) {
        e.preventDefault();
        setSaving(true);
        setSaveErr('');
        setSaveMsg('');

        const fd = new FormData();
        fd.append('first_name', firstName);
        fd.append('last_name', lastName);
        fd.append('phone', phone);

        try {
            const res = await fetch(`${API_BASE}/profile_update.php`, {
                method: 'POST',
                body: fd,
                credentials: 'include',
            });
            const text = await res.text();
            let json;
            try { json = JSON.parse(text); } catch (e) { throw new Error('Bad JSON'); }
            if (!json.success) throw new Error(json.message || 'Update failed');
            setSaveMsg('Profile updated successfully.');
        } catch (err) {
            setSaveErr(err.message || 'Failed to save profile.');
        } finally {
            setSaving(false);
        }
    }

    async function handleUploadAvatar(e) {
        e.preventDefault();
        setSaving(true);
        setSaveErr('');
        setSaveMsg('');

        if (!avatarFile) {
            setSaveErr('Please choose an image first.');
            setSaving(false);
            return;
        }

        const fd = new FormData();
        fd.append('avatar', avatarFile);

        try {
            const res = await fetch(`${API_BASE}/upload_avatar.php`, {
                method: 'POST',
                body: fd,
                credentials: 'include',
            });
            const text = await res.text();
            let json;
            try { json = JSON.parse(text); } catch (e) { throw new Error('Bad JSON'); }
            if (!json.success) throw new Error(json.message || 'Upload failed');
            setSaveMsg('Avatar updated.');
            // Optionally refresh profile
            window.location.reload();
        } catch (err) {
            setSaveErr(err.message || 'Failed to upload avatar.');
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <Skeleton text="Loading profile..." />;
    if (error) return <ErrorBox message={error} />;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleSaveProfile} className="bg-white rounded-xl shadow p-5 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Profile Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-700">First Name</label>
                        <input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="mt-1 w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Last Name</label>
                        <input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="mt-1 w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm text-gray-700">Phone</label>
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 w-full p-2 border rounded"
                            placeholder="+1 555 000 1111"
                        />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#06d6a0] text-black px-4 py-2 rounded font-semibold hover:bg-[#05b88c] disabled:opacity-60"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    {saveMsg && <span className="text-green-600 text-sm">{saveMsg}</span>}
                    {saveErr && <span className="text-red-600 text-sm">{saveErr}</span>}
                </div>
            </form>

            <div className="bg-white rounded-xl shadow p-5">
                <h3 className="text-lg font-semibold mb-4">Avatar</h3>
                <div className="space-y-3">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-700"
                    />
                    <button
                        onClick={handleUploadAvatar}
                        disabled={saving}
                        className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-black disabled:opacity-60"
                    >
                        {saving ? 'Uploading...' : 'Upload Avatar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Pagination({ page, setPage, totalPages }) {
    return (
        <div className="flex items-center justify-between">
            <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-2 rounded border bg-white disabled:opacity-50"
            >
                Prev
            </button>
            <div className="text-sm text-gray-700">Page {page} of {totalPages}</div>
            <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-2 rounded border bg-white disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}

function ErrorBox({ message }) {
    return (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded">{message}</div>
    );
}

function Skeleton({ text }) {
    return (
        <div className="p-6">
            <div className="animate-pulse flex flex-col gap-3">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            {text && <div className="mt-3 text-sm text-gray-500">{text}</div>}
        </div>
    );
}

export default Profile;