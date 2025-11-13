import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar, CalendarDays, Settings, LogOut, Home } from "lucide-react";
import "./AdminDashboard.css";
import AdminAddProduct from './AdminAddProduct';
import { PlusCircle } from 'lucide-react';

// Helper functions (same as BookingPage)
const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 20; hour++) {
        const hourStr = hour.toString().padStart(2, '0');
        times.push(`${hourStr}:00`);
        if (hour < 20) {
            times.push(`${hourStr}:30`);
        }
    }
    return times;
};

const formatTimeForDisplay = (time) => {
    if (!time) return "—";
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
};

const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Calendar Component for setting availability
const AvailabilityCalendar = ({ availableDates, draftDates, onDateSelect, onTimeSlotAdd, onTimeSlotRemove }) => {
    const [currentMonth, setCurrentMonth] = useState(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    });

    const daysInMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    ).getDay();

    const monthName = currentMonth.toLocaleString('default', { month: 'long' });
    const year = currentMonth.getFullYear();

    const nextMonth = () => {
        setCurrentMonth(prevMonth => {
            const next = new Date(prevMonth);
            next.setMonth(next.getMonth() + 1);
            return next;
        });
    };

    const prevMonth = () => {
        setCurrentMonth(prevMonth => {
            const prev = new Date(prevMonth);
            prev.setMonth(prev.getMonth() - 1);
            return prev;
        });
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={prevMonth}
                    className="p-2 rounded transition-colors hover:bg-gray-200 text-black"
                >
                    <ChevronLeft size={20} />
                </button>
                <h3 className="text-lg font-semibold text-black">
                    {monthName} {year}
                </h3>
                <button
                    type="button"
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-200 rounded text-black"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm text-black py-1 font-medium">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} className="p-2" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), index + 1);
                    const dateString = formatDateString(date);
                    const isSaved = availableDates.some(d => d.date === dateString);
                    const isDraft = !isSaved && draftDates.includes(dateString);

                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => onDateSelect(dateString)}
                            className={`p-2 rounded text-sm transition ${
                                isSaved
                                    ? 'bg-red-600 text-white'
                                    : isDraft
                                        ? 'bg-red-300 text-black'
                                        : 'hover:bg-gray-100 text-black border border-gray-300'
                            }`}
                        >
                            <span>{index + 1}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// Time Slot Manager Component
const TimeSlotManager = ({ date, timeSlots, onAddSlot, onRemoveSlot }) => {
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const timeOptions = generateTimeOptions();

    const handleAddSlot = () => {
        if (startTime && endTime) {
            onAddSlot(date, `${startTime}-${endTime}`);
            setStartTime("");
            setEndTime("");
        }
    };

    const getEndTimeOptions = () => {
        if (!startTime) return timeOptions;
        return timeOptions.filter(time => time > startTime);
    };

    return (
        <div className="mt-4 p-4 bg-white border border-red-300 rounded-lg">
            <h4 className="font-semibold text-black mb-3">Available Time Slots for {date}</h4>

            <div className="flex gap-2 mb-4">
                <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded bg-white text-black"
                >
                    <option value="">Start Time</option>
                    {timeOptions.map(time => (
                        <option key={time} value={time}>{formatTimeForDisplay(time)}</option>
                    ))}
                </select>

                <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={!startTime}
                    className="flex-1 p-2 border border-gray-300 rounded bg-white text-black"
                >
                    <option value="">End Time</option>
                    {getEndTimeOptions().map(time => (
                        <option key={time} value={time}>{formatTimeForDisplay(time)}</option>
                    ))}
                </select>

                <button
                    onClick={handleAddSlot}
                    disabled={!startTime || !endTime}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add Slot
                </button>
            </div>

            <div className="space-y-2">
                {timeSlots.length > 0 ? (
                    timeSlots.map((slot, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded">
              <span className="text-black">
                {formatTimeForDisplay(slot.split('-')[0])} - {formatTimeForDisplay(slot.split('-')[1])}
              </span>
                            <button
                                onClick={() => onRemoveSlot(date, slot)}
                                className="text-red-600 hover:text-red-800 text-sm font-semibold"
                            >
                                Remove
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No time slots set for this date</p>
                )}
            </div>
        </div>
    );
};

// Edit Booking Modal
const EditBookingModal = ({ open, onClose, booking, onSave }) => {
    const [paymentStatus, setPaymentStatus] = useState(booking?.payment_status || "none");
    const [status, setStatus] = useState(booking?.status || "new");
    const [notes, setNotes] = useState(booking?.notes || "");

    useEffect(() => {
        if (open) {
            setPaymentStatus(booking?.payment_status || "none");
            setStatus(booking?.status || "new");
            setNotes(booking?.notes || "");
        }
    }, [open, booking]);

    if (!open || !booking) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg p-6 shadow-lg border border-gray-300">
                <h2 className="text-xl font-semibold mb-4">Edit Booking #{booking.id}</h2>

                <div className="grid grid-cols-1 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Customer</label>
                        <div className="mt-1 text-gray-900">{booking.customer_name} — {booking.customer_email}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Service</label>
                        <div className="mt-1 text-gray-900">{booking.item_name || booking.service_id}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <div className="mt-1 text-gray-900">{booking.date || "—"}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Time</label>
                            <div className="mt-1 text-gray-900">
                                {booking.time_start ? `${formatTimeForDisplay(booking.time_start)} - ${formatTimeForDisplay(booking.time_end)}` : '—'}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                        <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="w-full p-2 border rounded">
                            <option value="none">none</option>
                            <option value="pending">pending</option>
                            <option value="paid">paid</option>
                            <option value="failed">failed</option>
                            <option value="refunded">refunded</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Booking Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded">
                            <option value="new">new</option>
                            <option value="confirmed">confirmed</option>
                            <option value="cancelled">cancelled</option>
                            <option value="completed">completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 border rounded min-h-24" />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
                        <button onClick={() => onSave({ id: booking.id, payment_status: paymentStatus, status, notes })} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("bookings");
    // Admin data stores (mock) for other CRUD sections (kept as-is)
    const [orders, setOrders] = useState([
        { id: 101, user: "john@example.com", total: 1500, status: "paid", createdAt: "2024-12-10" },
        { id: 102, user: "jane@example.com", total: 2200, status: "pending", createdAt: "2024-12-12" }
    ]);
    const [users, setUsers] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", role: "customer" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "customer" }
    ]);
    const [reviews, setReviews] = useState([
        { id: 1, user: "john@example.com", rating: 5, comment: "Amazing!", approved: true },
        { id: 2, user: "mike@example.com", rating: 4, comment: "Great work", approved: false }
    ]);
    const [galleryImages, setGalleryImages] = useState([
        { id: 1, url: "/Images/services/services/birthdayparty.jpg", title: "Birthday Photography", visible: true, category: "services" },
        { id: 2, url: "/Images/services/services/fashionshowvideo.jpg", title: "Fashion Show Photography", visible: true, category: "services" },
        { id: 3, url: "/Images/sample1.jpg", title: "Urban Portrait", visible: false, category: "photography" }
    ]);
    // selections for bulk actions
    const [selectedOrderIds, setSelectedOrderIds] = useState(new Set());
    const [selectedUserIds, setSelectedUserIds] = useState(new Set());
    const [selectedReviewIds, setSelectedReviewIds] = useState(new Set());
    const [selectedGalleryIds, setSelectedGalleryIds] = useState(new Set());
    const [galleryVisibilityFilter, setGalleryVisibilityFilter] = useState("all"); // all | visible | hidden
    const [gallerySearch, setGallerySearch] = useState("");
    const [availabilityMessage, setAvailabilityMessage] = useState("");
    const [availabilitySaving, setAvailabilitySaving] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [draftTimeSlotsByDate, setDraftTimeSlotsByDate] = useState({}); // { [date]: string[] }

    // Bookings state (now loaded from backend)
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [bookingsError, setBookingsError] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);

    // Available dates loaded from backend
    useEffect(() => {
        if (activeTab !== "availability") return;
        (async () => {
            try {
                setAvailabilityMessage("");
                const res = await fetch("https://crtvshotss.atwebpages.com/save_availability.php?action=list");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setAvailableDates(data);
                }
            } catch (e) {
                setAvailabilityMessage("Failed to load availability from server");
            }
        })();
    }, [activeTab]);

    // Load bookings when admin opens the Bookings tab
    useEffect(() => {
        if (activeTab !== "bookings") return;

        const loadBookings = async () => {
            setBookingsLoading(true);
            setBookingsError("");
            try {
                const res = await fetch("https://crtvshotss.atwebpages.com/admin/bookings_list.php", {
                    credentials: "include"
                });
                const data = await res.json();
                if (data && data.success && Array.isArray(data.data)) {
                    // Normalize times into one string for display if needed
                    setBookings(data.data.map(b => ({
                        ...b,
                        // Ensure fields exist
                        time: (b.time_start && b.time_end) ? `${b.time_start}-${b.time_end}` : (b.time || ""),
                        customer_name: b.customer_name || b.customerName || b.customer || "",
                        customer_email: b.customer_email || b.customerEmail || b.email || "",
                        item_name: b.item_name || b.itemName || "",
                        amount: Number(b.amount || 0),
                    })));
                } else if (data && data.success && Array.isArray(data)) {
                    // Support older endpoint that returned raw array
                    setBookings(data);
                } else {
                    setBookingsError(data && data.message ? data.message : "Unexpected response from server");
                }
            } catch (err) {
                setBookingsError("Failed to fetch bookings: " + err.message);
            } finally {
                setBookingsLoading(false);
            }
        };

        loadBookings();
    }, [activeTab]);

    // Bookings actions: edit, update, delete
    const handleOpenEdit = (booking) => {
        setEditingBooking(booking);
        setEditModalOpen(true);
    };

    const handleUpdateBooking = async (payload) => {
        // payload: { id, payment_status, status, notes }
        try {
            const res = await fetch("https://crtvshotss.atwebpages.com/admin/booking_update.php", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data && data.success) {
                // update local copy
                setBookings(prev => prev.map(b => b.id === payload.id ? { ...b, payment_status: payload.payment_status, status: payload.status, notes: payload.notes, updated_at: new Date().toISOString() } : b));
                setEditModalOpen(false);
                setEditingBooking(null);
                alert("Booking updated");
            } else {
                alert("Failed to update booking: " + (data && data.message ? data.message : "Unknown error"));
            }
        } catch (err) {
            alert("Network error updating booking: " + err.message);
        }
    };

    const handleDeleteBooking = async (id) => {
        if (!window.confirm("Delete this booking? This cannot be undone.")) return;
        try {
            const res = await fetch("https://crtvshotss.atwebpages.com/admin/booking_delete.php", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data && data.success) {
                setBookings(prev => prev.filter(b => b.id !== id));
                alert("Booking deleted");
            } else {
                alert("Failed to delete booking: " + (data && data.message ? data.message : "Unknown error"));
            }
        } catch (err) {
            alert("Network error deleting booking: " + err.message);
        }
    };

    // Availability handlers (kept as is)
    const handleDateSelect = (dateString) => {
        const exists = availableDates.find(d => d.date === dateString);
        if (exists) {
            // Saved date: do not toggle off on click; just select for editing
            setSelectedDate(dateString);
            return;
        }
        // Not saved: toggle draft selection
        setSelectedDate(dateString);
        setDraftTimeSlotsByDate(prev => {
            const isDraft = Object.prototype.hasOwnProperty.call(prev, dateString);
            if (isDraft) {
                // remove draft selection entirely
                const next = { ...prev };
                delete next[dateString];
                return next;
            }
            return { ...prev, [dateString]: [] };
        });
    };

    const handleAddTimeSlot = (date, timeSlot) => {
        const isSaved = availableDates.some(d => d.date === date);
        if (isSaved) {
            setAvailableDates(availableDates.map(d =>
                d.date === date
                    ? { ...d, timeSlots: [...(d.timeSlots || []), timeSlot] }
                    : d
            ));
        } else {
            setDraftTimeSlotsByDate(prev => ({
                ...prev,
                [date]: [...(prev[date] || []), timeSlot]
            }));
        }
    };

    const handleRemoveTimeSlot = (date, timeSlot) => {
        const isSaved = availableDates.some(d => d.date === date);
        if (isSaved) {
            setAvailableDates(availableDates.map(d =>
                d.date === date
                    ? { ...d, timeSlots: (d.timeSlots || []).filter(s => s !== timeSlot) }
                    : d
            ));
        } else {
            setDraftTimeSlotsByDate(prev => ({
                ...prev,
                [date]: (prev[date] || []).filter(s => s !== timeSlot)
            }));
        }
    };

    const currentDateSaved = availableDates.find(d => d.date === selectedDate);
    const currentDateSlots = currentDateSaved ? (currentDateSaved.timeSlots || []) : (draftTimeSlotsByDate[selectedDate] || []);

    const handleSaveAvailability = async () => {
        try {
            setAvailabilitySaving(true);
            setAvailabilityMessage("");
            const draftEntries = Object.entries(draftTimeSlotsByDate)
                .filter(([, slots]) => Array.isArray(slots) && slots.length > 0)
                .map(([date, slots]) => ({ date, timeSlots: slots }));
            const payload = { availableDates: [...availableDates, ...draftEntries] };

            const res = await fetch("https://crtvshotss.atwebpages.com/save_availability.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data && data.success) {
                setAvailabilityMessage("Availability saved successfully");
                // Clear drafts and reload from server so UI reflects DB
                setDraftTimeSlotsByDate({});
                try {
                    const listRes = await fetch("https://crtvshotss.atwebpages.com/save_availability.php?action=list");
                    const listData = await listRes.json();
                    if (Array.isArray(listData)) setAvailableDates(listData);
                } catch {}
            } else {
                setAvailabilityMessage(data && data.message ? data.message : "Failed to save availability");
            }
        } catch (e) {
            setAvailabilityMessage("Error saving availability: " + e.message);
        } finally {
            setAvailabilitySaving(false);
        }
    };

    const handleDeleteAvailability = async (dateString) => {
        try {
            setAvailabilityMessage("");
            const res = await fetch("https://crtvshotss.atwebpages.com/save_availability.php?action=delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: dateString })
            });
            const data = await res.json();
            if (data && data.success) {
                const listRes = await fetch("https://crtvshotss.atwebpages.com/save_availability.php?action=list");
                const listData = await listRes.json();
                if (Array.isArray(listData)) setAvailableDates(listData);
                setAvailabilityMessage("Date deleted");
            } else {
                setAvailabilityMessage(data && data.message ? data.message : "Failed to delete date");
            }
        } catch (e) {
            setAvailabilityMessage("Error deleting: " + e.message);
        }
    };

    // Inline forms for CRUD sections (kept as existing)
    const OrderForm = ({ onCreate }) => {
        const [email, setEmail] = useState("");
        const [total, setTotal] = useState("");
        const [status, setStatus] = useState("pending");
        return (
            <div className="entity-form-grid">
                <input className="settings-input" placeholder="User Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="settings-input" placeholder="Total (R)" type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))} />
                <select className="settings-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="refunded">refunded</option>
                </select>
                <button className="btn-primary" onClick={() => {
                    if (!email || !total) return;
                    onCreate({ user: email, total: Number(total), status, createdAt: new Date().toISOString().slice(0,10) });
                    setEmail(""); setTotal(""); setStatus("pending");
                }}>Create</button>
            </div>
        );
    };

    const UserForm = ({ onCreate }) => {
        const [name, setName] = useState("");
        const [email, setEmail] = useState("");
        const [role, setRole] = useState("customer");
        return (
            <div className="entity-form-grid">
                <input className="settings-input" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="settings-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <select className="settings-input" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="customer">customer</option>
                    <option value="admin">admin</option>
                </select>
                <button className="btn-primary" onClick={() => {
                    if (!name || !email) return;
                    onCreate({ name, email, role });
                    setName(""); setEmail(""); setRole("customer");
                }}>Create</button>
            </div>
        );
    };

    const ReviewForm = ({ onCreate }) => {
        const [email, setEmail] = useState("");
        const [rating, setRating] = useState(5);
        const [comment, setComment] = useState("");
        return (
            <div className="entity-form-grid">
                <input className="settings-input" placeholder="User Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <select className="settings-input" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <input className="settings-input" placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
                <button className="btn-primary" onClick={() => {
                    if (!email || !comment) return;
                    onCreate({ user: email, rating, comment });
                    setEmail(""); setRating(5); setComment("");
                }}>Add</button>
            </div>
        );
    };

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2 className="admin-logo">CRTV Admin</h2>
                </div>

                <nav className="sidebar-nav">
                    <button
                        onClick={() => setActiveTab("bookings")}
                        className={`nav-item ${activeTab === "bookings" ? "active" : ""}`}
                    >
                        <CalendarDays size={20} />
                        <span>Bookings</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
                    >
                        <Calendar size={20} />
                        <span>Orders</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("users")}
                        className={`nav-item ${activeTab === "users" ? "active" : ""}`}
                    >
                        <Settings size={20} />
                        <span>Users</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("availability")}
                        className={`nav-item ${activeTab === "availability" ? "active" : ""}`}
                    >
                        <Calendar size={20} />
                        <span>Availability</span>
                    </button>

                    <button onClick={() => setActiveTab("products")} className={`nav-item ${activeTab === "products" ? "active" : ""}`}>
                        <PlusCircle size={20} /><span>Add Product</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("reviews")}
                        className={`nav-item ${activeTab === "reviews" ? "active" : ""}`}
                    >
                        <Settings size={20} />
                        <span>Reviews</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("sales")}
                        className={`nav-item ${activeTab === "sales" ? "active" : ""}`}
                    >
                        <Settings size={20} />
                        <span>Sales</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("gallery")}
                        className={`nav-item ${activeTab === "gallery" ? "active" : ""}`}
                    >
                        <Settings size={20} />
                        <span>Gallery</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
                    >
                        <Settings size={20} />
                        <span>Settings</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button
                        onClick={() => navigate("/")}
                        className="nav-item back-to-site-btn"
                    >
                        <Home size={20} />
                        <span>Back to Site</span>
                    </button>
                    <button className="nav-item logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <div className="admin-content">
                    {activeTab === "bookings" && (
                        <div className="bookings-view">
                            <h1 className="page-title">Bookings Management</h1>

                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-value">{bookings.length}</div>
                                    <div className="stat-label">Total Bookings</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{bookings.filter(b => b.status === "confirmed").length}</div>
                                    <div className="stat-label">Confirmed</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{bookings.filter(b => b.status === "new" || b.status === "pending").length}</div>
                                    <div className="stat-label">Pending</div>
                                </div>
                            </div>

                            <div className="bookings-table-container">
                                {bookingsLoading ? (
                                    <div className="p-6">Loading bookings...</div>
                                ) : bookingsError ? (
                                    <div className="p-6 text-red-600">Error: {bookingsError}</div>
                                ) : (
                                    <table className="bookings-table">
                                        <thead>
                                        <tr>
                                            <th>Customer</th>
                                            <th>Service</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Amount</th>
                                            <th>Payment</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {bookings.map(booking => (
                                            <tr key={booking.id}>
                                                <td>
                                                    <div>
                                                        <div className="font-semibold text-black">{booking.customer_name}</div>
                                                        <div className="text-sm text-gray-600">{booking.customer_email}</div>
                                                        {booking.customer_phone && <div className="text-sm text-gray-500">{booking.customer_phone}</div>}
                                                    </div>
                                                </td>
                                                <td className="text-black">
                                                    <div className="font-medium">{booking.item_name || booking.service_id}</div>
                                                    {booking.item_description && <div className="text-sm text-gray-600">{booking.item_description}</div>}
                                                </td>
                                                <td className="text-black">{booking.date || "—"}</td>
                                                <td className="text-black">
                                                    {booking.time_start ? `${formatTimeForDisplay(booking.time_start)} - ${formatTimeForDisplay(booking.time_end)}` : (booking.time || "—")}
                                                </td>
                                                <td className="text-black font-semibold">R{Number(booking.amount || 0).toFixed(2)}</td>
                                                <td>
                            <span className={`badge ${booking.payment_status === "paid" ? "badge-full" : booking.payment_status === "pending" ? "badge-deposit" : "badge-none"}`}>
                              {booking.payment_status}
                            </span>
                                                </td>
                                                <td>
                            <span className={`badge ${booking.status === "confirmed" ? "badge-confirmed" : booking.status === "completed" ? "badge-completed" : "badge-pending"}`}>
                              {booking.status}
                            </span>
                                                </td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="btn-secondary" onClick={() => handleOpenEdit(booking)}>Edit</button>
                                                        <button className="btn-danger" onClick={() => handleDeleteBooking(booking.id)}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            <EditBookingModal
                                open={editModalOpen}
                                onClose={() => { setEditModalOpen(false); setEditingBooking(null); }}
                                booking={editingBooking}
                                onSave={handleUpdateBooking}
                            />
                        </div>
                    )}

                    {activeTab === "availability" && (
                        <div className="availability-view">
                            <h1 className="page-title">Set Availability</h1>
                            <div className="sync-bar">
                                <div className={`sync-message ${availabilityMessage ? (availabilityMessage.toLowerCase().includes("success") ? 'success' : 'error') : ''}`}>
                                    {availabilityMessage}
                                </div>
                                <div className="sync-actions">
                                    <button type="button" className="btn-primary" onClick={handleSaveAvailability} disabled={availabilitySaving}>
                                        {availabilitySaving ? "Saving..." : "Save Availability"}
                                    </button>
                                </div>
                            </div>

                            <div className="availability-content">
                                <div className="calendar-section">
                                    <AvailabilityCalendar
                                        availableDates={availableDates}
                                        draftDates={Object.keys(draftTimeSlotsByDate)}
                                        onDateSelect={handleDateSelect}
                                        onTimeSlotAdd={handleAddTimeSlot}
                                        onTimeSlotRemove={handleRemoveTimeSlot}
                                    />

                                    {selectedDate && (
                                        <TimeSlotManager
                                            date={selectedDate}
                                            timeSlots={currentDateSlots}
                                            onAddSlot={handleAddTimeSlot}
                                            onRemoveSlot={handleRemoveTimeSlot}
                                        />
                                    )}
                                </div>

                                <div className="availability-list-section">
                                    <h3 className="section-title">Available Dates</h3>
                                    <div className="availability-list">
                                        {availableDates.length > 0 ? (
                                            availableDates.map(dateObj => (
                                                <div key={dateObj.date} className="availability-item">
                                                    <div className="availability-date-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                                        <span className="font-semibold text-black">{dateObj.date}</span>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <button
                                                                onClick={() => setSelectedDate(dateObj.date)}
                                                                className="btn-secondary"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteAvailability(dateObj.date)}
                                                                className="btn-danger"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="availability-time-slots">
                                                        {dateObj.timeSlots && dateObj.timeSlots.length > 0 ? (
                                                            dateObj.timeSlots.map((slot, idx) => (
                                                                <span key={idx} className="time-slot-tag">
                                  {formatTimeForDisplay(slot.split('-')[0])} - {formatTimeForDisplay(slot.split('-')[1])}
                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-500 text-sm">No slots set</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-center py-8">No availability set. Select dates on the calendar.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "products" && <AdminAddProduct />}

                    {activeTab === "orders" && (
                        <div className="orders-view">
                            <h1 className="page-title">Orders</h1>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-value">{orders.length}</div>
                                    <div className="stat-label">Total Orders</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{orders.filter(o => o.status === "paid").length}</div>
                                    <div className="stat-label">Paid</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{orders.filter(o => o.status === "pending").length}</div>
                                    <div className="stat-label">Pending</div>
                                </div>
                            </div>

                            <div className="bulk-bar">
                                <div>
                                    <button className="btn-secondary" onClick={() => {
                                        const next = new Set(orders.map(o => o.id));
                                        setSelectedOrderIds(next);
                                    }}>Select All</button>
                                    <button className="btn-secondary" onClick={() => setSelectedOrderIds(new Set())}>Clear</button>
                                </div>
                                <div className="bulk-actions">
                                    <button className="btn-primary" onClick={() => setOrders(orders.map(o => selectedOrderIds.has(o.id) ? { ...o, status: "paid" } : o))}>Mark Paid</button>
                                    <button className="btn-secondary" onClick={() => setOrders(orders.map(o => selectedOrderIds.has(o.id) ? { ...o, status: "refunded" } : o))}>Mark Refunded</button>
                                    <button className="btn-danger" onClick={() => setOrders(orders.filter(o => !selectedOrderIds.has(o.id)))}>Delete</button>
                                </div>
                            </div>

                            <div className="bookings-table-container">
                                <table className="bookings-table">
                                    <thead>
                                    <tr>
                                        <th><input type="checkbox" onChange={(e) => {
                                            if (e.target.checked) setSelectedOrderIds(new Set(orders.map(o => o.id)));
                                            else setSelectedOrderIds(new Set());
                                        }} /></th>
                                        <th>ID</th>
                                        <th>User</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td><input type="checkbox" checked={selectedOrderIds.has(order.id)} onChange={(e) => {
                                                const next = new Set(selectedOrderIds);
                                                if (e.target.checked) next.add(order.id); else next.delete(order.id);
                                                setSelectedOrderIds(next);
                                            }} /></td>
                                            <td className="text-black">#{order.id}</td>
                                            <td className="text-black">{order.user}</td>
                                            <td className="text-black">R{order.total}</td>
                                            <td className="text-black">{order.status}</td>
                                            <td className="text-black">{order.createdAt}</td>
                                            <td>
                                                <div className="table-actions">
                                                    <button className="btn-secondary" onClick={() => setOrders(orders.map(o => o.id === order.id ? { ...o, status: o.status === "paid" ? "refunded" : "paid" } : o))}>
                                                        Toggle Paid
                                                    </button>
                                                    <button className="btn-danger" onClick={() => setOrders(orders.filter(o => o.id !== order.id))}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="entity-form">
                                <h3 className="section-title">Create Order</h3>
                                <OrderForm onCreate={(newOrder) => setOrders([{ ...newOrder, id: Date.now() }, ...orders])} />
                            </div>
                        </div>
                    )}

                    {activeTab === "users" && (
                        <div className="users-view">
                            <h1 className="page-title">Users</h1>
                            <div className="bulk-bar">
                                <div>
                                    <button className="btn-secondary" onClick={() => setSelectedUserIds(new Set(users.map(u => u.id)))}>Select All</button>
                                    <button className="btn-secondary" onClick={() => setSelectedUserIds(new Set())}>Clear</button>
                                </div>
                                <div className="bulk-actions">
                                    <button className="btn-primary" onClick={() => setUsers(users.map(u => selectedUserIds.has(u.id) ? { ...u, role: "admin" } : u))}>Make Admin</button>
                                    <button className="btn-secondary" onClick={() => setUsers(users.map(u => selectedUserIds.has(u.id) ? { ...u, role: "customer" } : u))}>Make Customer</button>
                                    <button className="btn-danger" onClick={() => setUsers(users.filter(u => !selectedUserIds.has(u.id)))}>Delete</button>
                                </div>
                            </div>

                            <div className="bookings-table-container">
                                <table className="bookings-table">
                                    <thead>
                                    <tr>
                                        <th><input type="checkbox" onChange={(e) => {
                                            if (e.target.checked) setSelectedUserIds(new Set(users.map(u => u.id)));
                                            else setSelectedUserIds(new Set());
                                        }} /></th>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td><input type="checkbox" checked={selectedUserIds.has(u.id)} onChange={(e) => {
                                                const next = new Set(selectedUserIds);
                                                if (e.target.checked) next.add(u.id); else next.delete(u.id);
                                                setSelectedUserIds(next);
                                            }} /></td>
                                            <td className="text-black">{u.id}</td>
                                            <td className="text-black">{u.name}</td>
                                            <td className="text-black">{u.email}</td>
                                            <td className="text-black">{u.role}</td>
                                            <td>
                                                <div className="table-actions">
                                                    <button className="btn-secondary" onClick={() => setUsers(users.map(x => x.id === u.id ? { ...x, role: x.role === "admin" ? "customer" : "admin" } : x))}>Toggle Admin</button>
                                                    <button className="btn-danger" onClick={() => setUsers(users.filter(x => x.id !== u.id))}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="entity-form">
                                <h3 className="section-title">Create User</h3>
                                <UserForm onCreate={(newUser) => setUsers([{ ...newUser, id: Date.now() }, ...users])} />
                            </div>
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <div className="reviews-view">
                            <h1 className="page-title">Reviews</h1>
                            <div className="bulk-bar">
                                <div>
                                    <button className="btn-secondary" onClick={() => setSelectedReviewIds(new Set(reviews.map(r => r.id)))}>Select All</button>
                                    <button className="btn-secondary" onClick={() => setSelectedReviewIds(new Set())}>Clear</button>
                                </div>
                                <div className="bulk-actions">
                                    <button className="btn-primary" onClick={() => setReviews(reviews.map(r => selectedReviewIds.has(r.id) ? { ...r, approved: true } : r))}>Approve</button>
                                    <button className="btn-secondary" onClick={() => setReviews(reviews.map(r => selectedReviewIds.has(r.id) ? { ...r, approved: false } : r))}>Unapprove</button>
                                    <button className="btn-danger" onClick={() => setReviews(reviews.filter(r => !selectedReviewIds.has(r.id)))}>Delete</button>
                                </div>
                            </div>

                            <div className="bookings-table-container">
                                <table className="bookings-table">
                                    <thead>
                                    <tr>
                                        <th><input type="checkbox" onChange={(e) => {
                                            if (e.target.checked) setSelectedReviewIds(new Set(reviews.map(r => r.id)));
                                            else setSelectedReviewIds(new Set());
                                        }} /></th>
                                        <th>ID</th>
                                        <th>User</th>
                                        <th>Rating</th>
                                        <th>Comment</th>
                                        <th>Approved</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {reviews.map(r => (
                                        <tr key={r.id}>
                                            <td><input type="checkbox" checked={selectedReviewIds.has(r.id)} onChange={(e) => {
                                                const next = new Set(selectedReviewIds);
                                                if (e.target.checked) next.add(r.id); else next.delete(r.id);
                                                setSelectedReviewIds(next);
                                            }} /></td>
                                            <td className="text-black">{r.id}</td>
                                            <td className="text-black">{r.user}</td>
                                            <td className="text-black">{r.rating}</td>
                                            <td className="text-black">{r.comment}</td>
                                            <td className="text-black">{r.approved ? "Yes" : "No"}</td>
                                            <td>
                                                <div className="table-actions">
                                                    <button className="btn-secondary" onClick={() => setReviews(reviews.map(x => x.id === r.id ? { ...x, approved: !x.approved } : x))}>Toggle Approve</button>
                                                    <button className="btn-danger" onClick={() => setReviews(reviews.filter(x => x.id !== r.id))}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="entity-form">
                                <h3 className="section-title">Add Review</h3>
                                <ReviewForm onCreate={(newReview) => setReviews([{ ...newReview, id: Date.now(), approved: false }, ...reviews])} />
                            </div>
                        </div>
                    )}

                    {activeTab === "sales" && (
                        <div className="sales-view">
                            <h1 className="page-title">Sales Overview</h1>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-value">R{orders.reduce((sum, o) => sum + (o.status === "paid" ? o.total : 0), 0)}</div>
                                    <div className="stat-label">Total Paid Revenue</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{orders.filter(o => o.status === "paid").length}</div>
                                    <div className="stat-label">Paid Orders</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{orders.filter(o => o.status !== "paid").length}</div>
                                    <div className="stat-label">Unpaid/Other</div>
                                </div>
                            </div>

                            <div className="bulk-bar">
                                <div>
                                    <button className="btn-secondary" onClick={() => setSelectedOrderIds(new Set(orders.map(o => o.id)))}>Select All</button>
                                    <button className="btn-secondary" onClick={() => setSelectedOrderIds(new Set())}>Clear</button>
                                </div>
                                <div className="bulk-actions">
                                    <button className="btn-primary" onClick={() => setOrders(orders.map(o => selectedOrderIds.has(o.id) ? { ...o, status: "paid" } : o))}>Mark Paid</button>
                                    <button className="btn-secondary" onClick={() => setOrders(orders.map(o => selectedOrderIds.has(o.id) ? { ...o, status: "refunded" } : o))}>Mark Refunded</button>
                                    <button className="btn-danger" onClick={() => setOrders(orders.filter(o => !selectedOrderIds.has(o.id)))}>Delete</button>
                                </div>
                            </div>

                            <div className="sales-table-container bookings-table-container">
                                <table className="bookings-table">
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th>Order</th>
                                        <th>User</th>
                                        <th>Status</th>
                                        <th>Total</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map(o => (
                                        <tr key={o.id}>
                                            <td><input type="checkbox" checked={selectedOrderIds.has(o.id)} onChange={(e) => {
                                                const next = new Set(selectedOrderIds);
                                                if (e.target.checked) next.add(o.id); else next.delete(o.id);
                                                setSelectedOrderIds(next);
                                            }} /></td>
                                            <td className="text-black">#{o.id}</td>
                                            <td className="text-black">{o.user}</td>
                                            <td className="text-black">{o.status}</td>
                                            <td className="text-black">R{o.total}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "gallery" && (
                        <div className="gallery-view">
                            <h1 className="page-title">Gallery</h1>
                            <div className="bulk-bar">
                                <div className="gallery-controls">
                                    <select className="settings-input" value={galleryVisibilityFilter} onChange={(e) => setGalleryVisibilityFilter(e.target.value)}>
                                        <option value="all">All</option>
                                        <option value="visible">Visible</option>
                                        <option value="hidden">Hidden</option>
                                    </select>
                                    <input className="settings-input" placeholder="Search title..." value={gallerySearch} onChange={(e) => setGallerySearch(e.target.value)} />
                                </div>
                                <div>
                                    <button className="btn-secondary" onClick={() => setSelectedGalleryIds(new Set(galleryImages.map(g => g.id)))}>Select All</button>
                                    <button className="btn-secondary" onClick={() => setSelectedGalleryIds(new Set())}>Clear</button>
                                </div>
                                <div className="bulk-actions">
                                    <button className="btn-primary" onClick={() => setGalleryImages(galleryImages.map(g => selectedGalleryIds.has(g.id) ? { ...g, visible: true } : g))}>Show</button>
                                    <button className="btn-secondary" onClick={() => setGalleryImages(galleryImages.map(g => selectedGalleryIds.has(g.id) ? { ...g, visible: false } : g))}>Hide</button>
                                    <button className="btn-danger" onClick={() => setGalleryImages(galleryImages.filter(g => !selectedGalleryIds.has(g.id)))}>Delete</button>
                                </div>
                            </div>

                            <div className="image-grid">
                                {galleryImages.filter(g => (galleryVisibilityFilter === 'all' || (galleryVisibilityFilter === 'visible' ? g.visible : !g.visible)) && g.title.toLowerCase().includes(gallerySearch.toLowerCase())).length === 0 && (
                                    <p className="text-gray-500">No images in gallery.</p>
                                )}
                                {galleryImages
                                    .filter(img => (galleryVisibilityFilter === 'all' || (galleryVisibilityFilter === 'visible' ? img.visible : !img.visible)))
                                    .filter(img => img.title.toLowerCase().includes(gallerySearch.toLowerCase()))
                                    .map(img => (
                                        <div key={img.id} className={`image-card ${!img.visible ? 'image-card-hidden' : ''}`}>
                                            <div className="image-container">
                                                <img src={img.url} alt={img.title} />
                                                <div className="image-overlay">
                                                    <p>{img.title}</p>
                                                </div>
                                                <span className={`visibility-badge ${img.visible ? 'visible' : 'hidden'}`}>{img.visible ? 'VISIBLE' : 'HIDDEN'}</span>
                                                <label className="image-select">
                                                    <input type="checkbox" checked={selectedGalleryIds.has(img.id)} onChange={(e) => {
                                                        const next = new Set(selectedGalleryIds);
                                                        if (e.target.checked) next.add(img.id); else next.delete(img.id);
                                                        setSelectedGalleryIds(next);
                                                    }} />
                                                </label>
                                            </div>
                                            <div className="image-meta">
                                                <div className="text-black font-medium">{img.title}</div>
                                                <div className="table-actions">
                                                    <button className="btn-secondary" onClick={() => setGalleryImages(galleryImages.map(x => x.id === img.id ? { ...x, visible: !x.visible } : x))}>{img.visible ? 'Hide' : 'Show'}</button>
                                                    <button className="btn-secondary" onClick={() => setGalleryImages(galleryImages.map(x => x.id === img.id ? { ...x, title: prompt("Rename image title", x.title) || x.title } : x))}>Rename</button>
                                                    <button className="btn-danger" onClick={() => setGalleryImages(galleryImages.filter(x => x.id !== img.id))}>Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="settings-view">
                            <h1 className="page-title">Settings</h1>

                            <div className="settings-content">
                                <div className="settings-card">
                                    <h3 className="settings-card-title">General Settings</h3>
                                    <div className="settings-item">
                                        <label className="settings-label">Site Name</label>
                                        <input type="text" className="settings-input" defaultValue="CRTV Shots" />
                                    </div>
                                    <div className="settings-item">
                                        <label className="settings-label">Contact Email</label>
                                        <input type="email" className="settings-input" defaultValue="admin@crtvshots.com" />
                                    </div>
                                </div>

                                <div className="settings-card">
                                    <h3 className="settings-card-title">Service Settings</h3>
                                    <div className="settings-item">
                                        <label className="settings-label">Default Booking Duration (hours)</label>
                                        <input type="number" className="settings-input" defaultValue="2" />
                                    </div>
                                    <div className="settings-item">
                                        <label className="settings-label">Minimum Booking Notice (days)</label>
                                        <input type="number" className="settings-input" defaultValue="3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
