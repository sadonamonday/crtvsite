import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar, CalendarDays, Settings, LogOut, Home } from "lucide-react";
import "./AdminDashboard.css";

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

// Calendar Component for setting availability
const AvailabilityCalendar = ({ availableDates, onDateSelect, onTimeSlotAdd, onTimeSlotRemove }) => {
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
          const isAvailable = availableDates.some(d => d.date === dateString);

          return (
            <button
              key={index}
              type="button"
              onClick={() => onDateSelect(dateString)}
              className={`p-2 rounded text-sm transition
                ${isAvailable ? 'bg-red-600 text-white' : 'hover:bg-gray-100 text-black border border-gray-300'}
              `}
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
  const [selectedDate, setSelectedDate] = useState("");
  
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

  // Mock available dates with time slots
  const [availableDates, setAvailableDates] = useState([
    { date: "2024-12-15", timeSlots: ["08:00-10:00", "10:00-12:00", "14:00-16:00"] },
    { date: "2024-12-18", timeSlots: ["14:00-16:00", "16:00-18:00"] },
    { date: "2024-12-20", timeSlots: ["09:00-11:00", "13:00-15:00"] }
  ]);

  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
    // Ensure date exists in availableDates
    if (!availableDates.find(d => d.date === dateString)) {
      setAvailableDates([...availableDates, { date: dateString, timeSlots: [] }]);
    }
  };

  const handleAddTimeSlot = (date, timeSlot) => {
    setAvailableDates(availableDates.map(d => 
      d.date === date 
        ? { ...d, timeSlots: [...d.timeSlots, timeSlot] }
        : d
    ));
  };

  const handleRemoveTimeSlot = (date, timeSlot) => {
    setAvailableDates(availableDates.map(d => 
      d.date === date 
        ? { ...d, timeSlots: d.timeSlots.filter(s => s !== timeSlot) }
        : d
    ));
  };

  const currentDateSlots = availableDates.find(d => d.date === selectedDate)?.timeSlots || [];

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
            onClick={() => setActiveTab("availability")}
            className={`nav-item ${activeTab === "availability" ? "active" : ""}`}
          >
            <Calendar size={20} />
            <span>Availability</span>
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
              
              <div className="availability-content">
                <div className="calendar-section">
                  <AvailabilityCalendar
                    availableDates={availableDates}
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
                          <div className="availability-date-header">
                            <span className="font-semibold text-black">{dateObj.date}</span>
                            <button
                              onClick={() => setSelectedDate(dateObj.date)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Edit
                            </button>
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
