import React, { useState } from "react";
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

// Available service images
const availableImages = [
  "backend.jpg",
  "birthdayparty.jpg",
  "birthdaypartyvideo.webp",
  "birthdayphotoshoot.jpg",
  "birthdayshoot.jpg",
  "birthshoot.jpg",
  "colourgrading.jpg",
  "commercialphoto.jpg",
  "commercialvideo.jpg",
  "corporatecombo.jpg",
  "corporatevideo.webp",
  "familyphoto.webp",
  "fashion show.webp",
  "fashionshowvideo.jpg",
  "groomsmen.jpg",
  "hicking.jpg",
  "highlightreel.webp",
  "matric-dance.jpg",
  "matricdancecombo.jpg",
  "matricdancefarewell.jpg"
];

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bookings");
  // Admin data stores (mock) for CRUD sections
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
  // Services state
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesMessage, setServicesMessage] = useState("");
  const [editingService, setEditingService] = useState(null);
  // selections for bulk actions
  const [selectedOrderIds, setSelectedOrderIds] = useState(new Set());
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [selectedReviewIds, setSelectedReviewIds] = useState(new Set());
  const [selectedServiceIds, setSelectedServiceIds] = useState(new Set());
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [availabilitySaving, setAvailabilitySaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [draftTimeSlotsByDate, setDraftTimeSlotsByDate] = useState({}); // { [date]: string[] }

  // Mock bookings data
  const [bookings, setBookings] = useState([
    {
      id: 1,
      customerName: "John Doe",
      customerEmail: "john@example.com",
      service: "Matric Dance: Video & Photography",
      date: "2024-12-15",
      time: "10:00-12:00",
      amount: 3000,
      paymentOption: "deposit",
      status: "confirmed"
    },
    {
      id: 2,
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      service: "Music Video: Reels",
      date: "2024-12-18",
      time: "14:00-16:00",
      amount: 3500,
      paymentOption: "full",
      status: "confirmed"
    },
    {
      id: 3,
      customerName: "Mike Johnson",
      customerEmail: "mike@example.com",
      service: "Custom Service",
      date: "2024-12-20",
      time: "09:00-11:00",
      amount: 2500,
      paymentOption: "deposit",
      status: "pending"
    }
  ]);

  // Available dates loaded from backend
  const [availableDates, setAvailableDates] = useState([]);

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
          ? { ...d, timeSlots: [...d.timeSlots, timeSlot] }
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
          ? { ...d, timeSlots: d.timeSlots.filter(s => s !== timeSlot) }
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


  React.useEffect(() => {
    if (activeTab !== "availability") return;
    (async () => {
      try {
        setAvailabilityMessage("");
        const res = await fetch("https://crtvshotss.atwebpages.com/save_availability.php?action=list", {
          credentials: "include"
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setAvailableDates(data);
        }
      } catch (e) {
        setAvailabilityMessage("Failed to load availability from server");
      }
    })();
  }, [activeTab]);

  // Load services when services tab is active
  React.useEffect(() => {
    if (activeTab !== "services") return;
    (async () => {
      try {
        setServicesLoading(true);
        setServicesMessage("");
        const res = await fetch("https://crtvshotss.atwebpages.com/services_list.php");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setServices(json.data);
        } else {
          setServicesMessage("Failed to load services");
        }
      } catch (e) {
        setServicesMessage("Error loading services: " + e.message);
      } finally {
        setServicesLoading(false);
      }
    })();
  }, [activeTab]);

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
        credentials: "include",
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.success) {
        setAvailabilityMessage("Availability saved successfully");
        // Clear drafts and reload from server so UI reflects DB
        setDraftTimeSlotsByDate({});
        try {
          const listRes = await fetch("https://crtvshotss.atwebpages.com/save_availability.php?action=list", {
            credentials: "include"
          });
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
        credentials: "include",
        body: JSON.stringify({ date: dateString })
      });
      const data = await res.json();
      if (data && data.success) {
        const listRes = await fetch("https://crtvshotss.atwebpages.com/save_availability.php?action=list", {
          credentials: "include"
        });
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

  // Inline forms for CRUD sections
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

  // Service form component
  const ServiceForm = ({ service, onSave, onCancel, onMessage, onLoading }) => {
    const [id, setId] = useState(service?.id || "");
    const [name, setName] = useState(service?.name || "");
    const [category, setCategory] = useState(service?.category || "photography");
    const [price, setPrice] = useState(service?.price || 0);
    const [priceType, setPriceType] = useState(service?.price_type || "fixed");
    const [description, setDescription] = useState(service?.description || "");
    const [includes, setIncludes] = useState(service?.includes ? (Array.isArray(service.includes) ? service.includes.join("\n") : (typeof service.includes === 'string' ? (service.includes.startsWith('[') ? JSON.parse(service.includes || "[]").join("\n") : service.includes) : "")) : "");
    const [image, setImage] = useState("");
    const [isActive, setIsActive] = useState(service?.is_active !== undefined ? service.is_active : 1);
    const [formLoading, setFormLoading] = useState(false);

    const handleSubmit = async () => {
      if (!id || !name || !category) {
        onMessage("ID, name, and category are required");
        return;
      }

      const includesArray = includes.split("\n").map(s => s.trim()).filter(Boolean);

      const payload = {
        id,
        name,
        category,
        price: Number(price) || 0,
        price_type: priceType,
        description: description || null,
        includes: includesArray.length > 0 ? includesArray : null,
        image: image || null,
        is_active: isActive ? 1 : 0
      };

      try {
        setFormLoading(true);
        onLoading(true);
        onMessage("");
        const endpoint = service ? "services_update.php" : "services_create.php";
        const res = await fetch(`https://crtvshotss.atwebpages.com/admin/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Send PHP session cookie for authentication
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          onMessage("Service " + (service ? "updated" : "created") + " successfully");
          onSave();
          if (!service) {
            setId(""); setName(""); setCategory("photography"); setPrice(0);
            setPriceType("fixed"); setDescription(""); setIncludes(""); setImage(""); setIsActive(1);
          }
        } else {
          onMessage(data.message || "Failed to save service");
        }
      } catch (e) {
        onMessage("Error: " + e.message);
      } finally {
        setFormLoading(false);
        onLoading(false);
      }
    };

    return (
      <div className="service-form">
        <div className="product-form-grid">
          <div>
            <label className="settings-label">Service ID *</label>
            <input className="settings-input" value={id} onChange={(e) => setId(e.target.value)} disabled={!!service} placeholder="e.g., service-001" />
          </div>
          <div>
            <label className="settings-label">Name *</label>
            <input className="settings-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Service name" />
          </div>
          <div>
            <label className="settings-label">Category *</label>
            <select className="settings-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="photography">Photography</option>
              <option value="videography">Videography</option>
              <option value="combo">Combo</option>
            </select>
          </div>
          <div>
            <label className="settings-label">Price</label>
            <input className="settings-input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className="settings-label">Price Type</label>
            <select className="settings-input" value={priceType} onChange={(e) => setPriceType(e.target.value)}>
              <option value="fixed">Fixed</option>
              <option value="starting">Starting From</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="settings-label">Active</label>
            <select className="settings-input" value={isActive} onChange={(e) => setIsActive(Number(e.target.value))}>
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </div>
          <div className="full-row">
            <label className="settings-label">Description</label>
            <textarea className="settings-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Service description" />
          </div>
          <div className="full-row">
            <label className="settings-label">Includes (one per line)</label>
            <textarea className="settings-input" value={includes} onChange={(e) => setIncludes(e.target.value)} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
          </div>
          <div className="full-row">
            <label className="settings-label">Image</label>
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <select 
                className="settings-input" 
                value={(() => {
                  if (!image) return "";
                  const imageName = image.split("/").pop();
                  return availableImages.includes(imageName) ? imageName : "";
                })()}
                onChange={(e) => {
                  const selected = e.target.value;
                  if (selected) {
                    setImage(`https://crtvshotss.atwebpages.com/bookings/${selected}`);
                  } else {
                    setImage("");
                  }
                }}
                style={{ flex: 1 }}
              >
                <option value="">Select an image...</option>
                {availableImages.map(img => (
                  <option key={img} value={img}>{img}</option>
                ))}
              </select>
              <input 
                className="settings-input" 
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
                placeholder="Or enter full URL: https://crtvshotss.atwebpages.com/bookings/..." 
                style={{ flex: 2 }}
              />
            </div>
            {image && (
              <div style={{ marginTop: "8px", padding: "8px", background: "#f9fafb", borderRadius: "4px", border: "1px solid #e5e7eb" }}>
                <img 
                  src={(() => {
                    if (!image) return "";
                    if (/^https?:\/\//i.test(image)) return image;
                    return `https://crtvshotss.atwebpages.com/${image.replace(/^\/+/, "")}`;
                  })()}
                  alt="Preview" 
                  style={{ maxWidth: "200px", maxHeight: "150px", objectFit: "contain", borderRadius: "4px" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = "block";
                    }
                  }}
                />
                <div style={{ display: "none", color: "#6b7280", fontSize: "12px", marginTop: "4px" }}>Image not found</div>
              </div>
            )}
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-primary" onClick={handleSubmit} disabled={formLoading}>
            {formLoading ? "Saving..." : (service ? "Update Service" : "Create Service")}
          </button>
          {service && <button className="btn-secondary" onClick={onCancel}>Cancel</button>}
        </div>
      </div>
    );
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      setServicesLoading(true);
      setServicesMessage("");
      const res = await fetch("https://crtvshotss.atwebpages.com/admin/services_delete.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Send PHP session cookie for authentication
        body: JSON.stringify({ id: serviceId })
      });
      const data = await res.json();
      if (data.success) {
        setServicesMessage("Service deleted successfully");
        setServices(services.filter(s => s.id !== serviceId));
        setEditingService(null);
      } else {
        setServicesMessage(data.message || "Failed to delete service");
      }
    } catch (e) {
      setServicesMessage("Error: " + e.message);
    } finally {
      setServicesLoading(false);
    }
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
          onClick={() => setActiveTab("services")}
          className={`nav-item ${activeTab === "services" ? "active" : ""}`}
        >
          <Settings size={20} />
          <span>Add Services</span>
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
                  <div className="stat-value">{bookings.filter(b => b.status === "pending").length}</div>
                  <div className="stat-label">Pending</div>
                </div>
              </div>

              <div className="bookings-table-container">
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
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking.id}>
                        <td>
                          <div>
                            <div className="font-semibold text-black">{booking.customerName}</div>
                            <div className="text-sm text-gray-600">{booking.customerEmail}</div>
                          </div>
                        </td>
                        <td className="text-black">{booking.service}</td>
                        <td className="text-black">{booking.date}</td>
                        <td className="text-black">
                          {formatTimeForDisplay(booking.time.split('-')[0])} - {formatTimeForDisplay(booking.time.split('-')[1])}
                        </td>
                        <td className="text-black font-semibold">R{booking.amount}</td>
                        <td>
                          <span className={`badge ${booking.paymentOption === "full" ? "badge-full" : "badge-deposit"}`}>
                            {booking.paymentOption === "full" ? "Full" : "50% Deposit"}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${booking.status === "confirmed" ? "badge-confirmed" : "badge-pending"}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                            {dateObj.timeSlots.length > 0 ? (
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

          {activeTab === "services" && (
            <div className="services-view">
              <h1 className="page-title">Services Management</h1>
              
              {servicesMessage && (
                <div className={`product-message ${servicesMessage.toLowerCase().includes("success") ? "success" : "error"}`}>
                  {servicesMessage}
                </div>
              )}

              {editingService ? (
                <div className="settings-card">
                  <h3 className="section-title">Edit Service</h3>
                  <ServiceForm
                    service={editingService}
                    onSave={() => {
                      setEditingService(null);
                      // Reload services
                      (async () => {
                        try {
                          const res = await fetch("https://crtvshotss.atwebpages.com/services_list.php");
                          const json = await res.json();
                          if (json.success && Array.isArray(json.data)) {
                            setServices(json.data);
                          }
                        } catch (e) {
                          console.error(e);
                        }
                      })();
                    }}
                    onCancel={() => setEditingService(null)}
                    onMessage={setServicesMessage}
                    onLoading={setServicesLoading}
                  />
                </div>
              ) : (
                <>
                  <div className="bulk-bar">
                    <div>
                      <button className="btn-secondary" onClick={() => setSelectedServiceIds(new Set(services.map(s => s.id)))}>Select All</button>
                      <button className="btn-secondary" onClick={() => setSelectedServiceIds(new Set())}>Clear</button>
                    </div>
                    <div className="bulk-actions">
                      <button className="btn-danger" onClick={async () => {
                        if (selectedServiceIds.size === 0) return;
                        if (!confirm(`Delete ${selectedServiceIds.size} service(s)?`)) return;
                        for (const id of selectedServiceIds) {
                          await handleDeleteService(id);
                        }
                        setSelectedServiceIds(new Set());
                      }}>Delete Selected</button>
                    </div>
                  </div>

                  <div className="bookings-table-container">
                    <table className="bookings-table">
                      <thead>
                        <tr>
                          <th><input type="checkbox" onChange={(e) => {
                            if (e.target.checked) setSelectedServiceIds(new Set(services.map(s => s.id)));
                            else setSelectedServiceIds(new Set());
                          }} /></th>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Price Type</th>
                          <th>Active</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {servicesLoading ? (
                          <tr>
                            <td colSpan="8" className="text-black text-center">Loading services...</td>
                          </tr>
                        ) : services.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-black text-center">No services found. Create one below.</td>
                          </tr>
                        ) : (
                          services.map(service => (
                            <tr key={service.id}>
                              <td><input type="checkbox" checked={selectedServiceIds.has(service.id)} onChange={(e) => {
                                const next = new Set(selectedServiceIds);
                                if (e.target.checked) next.add(service.id); else next.delete(service.id);
                                setSelectedServiceIds(next);
                              }} /></td>
                              <td className="text-black">{service.id}</td>
                              <td className="text-black font-semibold">{service.name}</td>
                              <td className="text-black">{service.category}</td>
                              <td className="text-black">R{service.price || 0}</td>
                              <td className="text-black">{service.price_type || "fixed"}</td>
                              <td>
                                <span className={`badge ${service.is_active ? "badge-confirmed" : "badge-pending"}`}>
                                  {service.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td>
                                <div className="table-actions">
                                  <button className="btn-secondary" onClick={() => setEditingService(service)}>Edit</button>
                                  <button className="btn-danger" onClick={() => handleDeleteService(service.id)}>Delete</button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="entity-form">
                    <h3 className="section-title">Create New Service</h3>
                    <ServiceForm
                      onSave={() => {
                        // Reload services
                        (async () => {
                          try {
                            const res = await fetch("https://crtvshotss.atwebpages.com/services_list.php");
                            const json = await res.json();
                            if (json.success && Array.isArray(json.data)) {
                              setServices(json.data);
                            }
                          } catch (e) {
                            console.error(e);
                          }
                        })();
                      }}
                      onMessage={setServicesMessage}
                      onLoading={setServicesLoading}
                    />
                  </div>
                </>
              )}
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
