import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar, CalendarDays, Settings, LogOut, Home, ChevronsUpDown, ArrowUp, ArrowDown } from "lucide-react";
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

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  
  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
        Previous
      </button>
      
      <div className="pagination-pages">
        {startPage > 1 && (
          <>
            <button className="pagination-btn" onClick={() => onPageChange(1)}>1</button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button className="pagination-btn" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
          </>
        )}
      </div>
      
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

// Sortable Table Header Component
const SortableHeader = ({ field, currentSortField, currentSortDirection, onSort, children }) => {
  const handleClick = () => {
    if (currentSortField === field) {
      onSort(field, currentSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(field, 'asc');
    }
  };
  
  return (
    <th className="sortable-header" onClick={handleClick}>
      <div className="sortable-header-content">
        <span>{children}</span>
        <span className="sort-icon">
          {currentSortField === field ? (
            currentSortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
          ) : (
            <ChevronsUpDown size={14} />
          )}
        </span>
      </div>
    </th>
  );
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

// Bookings Calendar Component
const BookingsCalendar = ({ orders, onDateSelect, selectedDate }) => {
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

  // Count bookings per date (robust against various DB formats)
  const bookingsByDate = {};
  orders.forEach(order => {
    const raw = (order && order.date != null) ? String(order.date).trim() : '';
    if (!raw || raw.toUpperCase() === 'NULL') return;
    // Handle both "YYYY-MM-DD" and "YYYY-MM-DD HH:MM:SS" formats
    const dateOnly = raw.split(' ')[0].trim();
    // Basic YYYY-MM-DD validation
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
      bookingsByDate[dateOnly] = (bookingsByDate[dateOnly] || 0) + 1;
    }
  });

  console.log('Bookings by date (calendar):', bookingsByDate);
  console.log('Bookings total (calendar):', Array.isArray(orders) ? orders.length : 0);

  // Find max bookings for color scaling
  const maxBookings = Math.max(...Object.values(bookingsByDate), 1);

  const getDateColor = (dateString) => {
    const count = bookingsByDate[dateString] || 0;
    if (count === 0) return 'hover:bg-gray-100 text-black border border-gray-300';
    
    // Calculate opacity based on booking count (0.3 to 1.0)
    const opacity = 0.3 + (count / maxBookings) * 0.7;
    const isSelected = dateString === selectedDate;
    
    if (isSelected) {
      return `bg-blue-700 text-white font-bold`;
    }
    
    // Use inline style for dynamic opacity
    return `text-white font-semibold`;
  };

  const getBackgroundStyle = (dateString) => {
    const count = bookingsByDate[dateString] || 0;
    if (count === 0 || dateString === selectedDate) return {};

    // Threshold-based heat: 1 -> light, 2-3 -> medium, 4+ -> dark
    let opacity = 0.35;
    if (count === 1) opacity = 0.35;
    else if (count <= 3) opacity = 0.6;
    else opacity = 1.0;

    return {
      backgroundColor: `rgba(37, 99, 235, ${opacity})`
    };
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
          const bookingCount = bookingsByDate[dateString] || 0;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onDateSelect(dateString)}
              className={`p-2 rounded text-sm transition ${getDateColor(dateString)}`}
              style={getBackgroundStyle(dateString)}
              title={bookingCount > 0 ? `${bookingCount} booking${bookingCount > 1 ? 's' : ''}` : 'No bookings'}
            >
              <span className="relative inline-flex items-center justify-center w-5 h-5">
                {index + 1}
                {bookingCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'rgba(37, 99, 235, 1)' }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p className="font-semibold mb-2">Legend:</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border border-gray-300 rounded"></div>
            <span>No bookings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-300 rounded"></div>
            <span>Few bookings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded"></div>
            <span>Many bookings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Bookings Date Details Component
const BookingsDateDetails = ({ date, orders }) => {
  const dateOrders = orders.filter(o => {
    if (!o.date) return false;
    // Handle both "YYYY-MM-DD" and "YYYY-MM-DD HH:MM:SS" formats
    const orderDate = o.date.split(' ')[0];
    return orderDate === date;
  });

  if (dateOrders.length === 0) {
    return (
      <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg">
        <h4 className="font-semibold text-black mb-3">Bookings for {date}</h4>
        <p className="text-gray-500 text-sm">No bookings on this date</p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-white border border-blue-300 rounded-lg">
      <h4 className="font-semibold text-black mb-3">
        Bookings for {date} ({dateOrders.length})
      </h4>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {dateOrders.map((order, idx) => (
          <div key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="font-semibold text-black text-base">{order.customer_name}</p>
                <p className="text-sm text-gray-700 font-medium">{order.item_name || order.service}</p>
                {order.time_start && order.time_end && (
                  <p className="text-sm text-blue-600 font-semibold mt-1">
                    ⏰ {formatTimeForDisplay(order.time_start)} - {formatTimeForDisplay(order.time_end)}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-1">📧 {order.customer_email}</p>
                {order.customer_phone && (
                  <p className="text-sm text-gray-600">📞 {order.customer_phone}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Order: {order.order_id}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-black text-lg">R{parseFloat(order.amount).toFixed(2)}</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                  order.payment_option === 'full' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.payment_option === 'full' ? 'Paid' : '50% Deposit'}
                </span>
                {order.payment_option && (
                  <p className="text-xs text-gray-500 mt-1 capitalize">{order.payment_option} payment</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bookings");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Sample orders data for Orders page (bookings tab)
  const [sampleOrders] = useState([
    { 
      id: 101, 
      order_id: "ORD-2024-001",
      customer_name: "John Doe",
      customer_email: "john@example.com",
      customer_phone: "+27 82 123 4567",
      service: "Matric Dance Photography",
      amount: 1800,
      status: "paid",
      date: "2024-12-10",
      time_start: "14:00",
      time_end: "18:00",
      created_at: "2024-12-10 10:30:00"
    },
    { 
      id: 102, 
      order_id: "ORD-2024-002",
      customer_name: "Jane Smith",
      customer_email: "jane@example.com",
      customer_phone: "+27 83 234 5678",
      service: "Wedding Videography",
      amount: 9500,
      status: "pending",
      date: "2024-12-12",
      time_start: "09:00",
      time_end: "17:00",
      created_at: "2024-12-12 08:15:00"
    },
    { 
      id: 103, 
      order_id: "ORD-2024-003",
      customer_name: "Mike Johnson",
      customer_email: "mike@example.com",
      customer_phone: "+27 84 345 6789",
      service: "Corporate Event Combo",
      amount: 4400,
      status: "paid",
      date: "2024-12-08",
      time_start: "10:00",
      time_end: "15:00",
      created_at: "2024-12-08 09:20:00"
    },
    { 
      id: 104, 
      order_id: "ORD-2024-004",
      customer_name: "Sarah Williams",
      customer_email: "sarah@example.com",
      customer_phone: "+27 85 456 7890",
      service: "Birthday Party Photography",
      amount: 1500,
      status: "pending",
      date: "2024-12-15",
      time_start: "15:00",
      time_end: "18:00",
      created_at: "2024-12-15 12:45:00"
    },
    { 
      id: 105, 
      order_id: "ORD-2024-005",
      customer_name: "David Brown",
      customer_email: "david@example.com",
      customer_phone: "+27 86 567 8901",
      service: "Complete Music Video Package",
      amount: 12500,
      status: "paid",
      date: "2024-12-05",
      time_start: "08:00",
      time_end: "20:00",
      created_at: "2024-12-05 07:30:00"
    },
    { 
      id: 106, 
      order_id: "ORD-2024-006",
      customer_name: "Emily Davis",
      customer_email: "emily@example.com",
      customer_phone: "+27 87 678 9012",
      service: "Fashion Show Videography",
      amount: 5000,
      status: "pending",
      date: "2024-12-18",
      time_start: "18:00",
      time_end: "23:00",
      created_at: "2024-12-18 16:10:00"
    },
    { 
      id: 107, 
      order_id: "ORD-2024-007",
      customer_name: "Chris Wilson",
      customer_email: "chris@example.com",
      customer_phone: "+27 88 789 0123",
      service: "Commercial Photography",
      amount: 5000,
      status: "paid",
      date: "2024-12-03",
      time_start: "09:00",
      time_end: "13:00",
      created_at: "2024-12-03 08:00:00"
    },
    { 
      id: 108, 
      order_id: "ORD-2024-008",
      customer_name: "Lisa Anderson",
      customer_email: "lisa@example.com",
      customer_phone: "+27 89 890 1234",
      service: "Personal Photo Shoot - Family",
      amount: 1800,
      status: "paid",
      date: "2024-12-11",
      time_start: "11:00",
      time_end: "14:00",
      created_at: "2024-12-11 09:30:00"
    },
    { 
      id: 109, 
      order_id: "ORD-2024-009",
      customer_name: "Robert Taylor",
      customer_email: "robert@example.com",
      customer_phone: "+27 71 901 2345",
      service: "Matric Dance Combo",
      amount: 3500,
      status: "pending",
      date: "2024-12-20",
      time_start: "16:00",
      time_end: "22:00",
      created_at: "2024-12-20 14:20:00"
    },
    { 
      id: 110, 
      order_id: "ORD-2024-010",
      customer_name: "Amanda Martinez",
      customer_email: "amanda@example.com",
      customer_phone: "+27 72 012 3456",
      service: "Professional Color Grading",
      amount: 3000,
      status: "paid",
      date: "2024-12-07",
      time_start: "10:00",
      time_end: "16:00",
      created_at: "2024-12-07 09:00:00"
    },
    { 
      id: 111, 
      order_id: "ORD-2024-011",
      customer_name: "James Lee",
      customer_email: "james@example.com",
      customer_phone: "+27 73 123 4567",
      service: "Music Video Reels(DJI Osmo)",
      amount: 3500,
      status: "pending",
      date: "2024-12-19",
      time_start: "13:00",
      time_end: "17:00",
      created_at: "2024-12-19 11:45:00"
    },
    { 
      id: 112, 
      order_id: "ORD-2024-012",
      customer_name: "Maria Garcia",
      customer_email: "maria@example.com",
      customer_phone: "+27 74 234 5678",
      service: "Wedding Combo Package",
      amount: 15000,
      status: "paid",
      date: "2024-12-01",
      time_start: "10:00",
      time_end: "22:00",
      created_at: "2024-12-01 08:30:00"
    }
  ]);
  // Orders from database (for orders tab)
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "customer" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "customer" }
  ]);
  const [reviews, setReviews] = useState([]);
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
  const [selectedBookingDate, setSelectedBookingDate] = useState("");
  
  // Pagination and sorting state
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersSortField, setOrdersSortField] = useState(null);
  const [ordersSortDirection, setOrdersSortDirection] = useState('asc');
  const [servicesPage, setServicesPage] = useState(1);
  const [servicesSortField, setServicesSortField] = useState(null);
  const [servicesSortDirection, setServicesSortDirection] = useState('asc');
  const [usersPage, setUsersPage] = useState(1);
  const [usersSortField, setUsersSortField] = useState(null);
  const [usersSortDirection, setUsersSortDirection] = useState('asc');
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsSortField, setReviewsSortField] = useState(null);
  const [reviewsSortDirection, setReviewsSortDirection] = useState('asc');
  
  const ITEMS_PER_PAGE = 10;

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

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("https://crtvshotss.atwebpages.com/sessions/logout_simple.php", {
        method: "POST",
        credentials: "include"
      });
      localStorage.removeItem('user');
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem('user');
      navigate("/login");
    }
  };

  // Check admin authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking admin authentication...");
        
        // Check localStorage first (primary source of truth for cross-domain auth)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            console.log("Found user in localStorage:", userData);
            
            if (userData.is_admin === 1) {
              console.log("User is admin (from localStorage), granting access");
              setIsAuthenticated(true);
              setIsLoading(false);
              return;
            } else {
              console.log("User is not admin (from localStorage), redirecting to home");
              navigate("/");
              setIsLoading(false);
              return;
            }
          } catch (parseError) {
            console.error("Error parsing user data from localStorage:", parseError);
            localStorage.removeItem('user');
          }
        }
        
        // Fallback: Check server session (for direct server access or same-domain)
        console.log("No localStorage, checking server session...");
        const res = await fetch("https://crtvshotss.atwebpages.com/sessions/check_admin_simple.php", {
          credentials: "include"
        });
        
        const text = await res.text();
        console.log("Admin check raw response:", text);
        
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error("Failed to parse admin check response:", text.substring(0, 200));
          navigate("/login");
          setIsLoading(false);
          return;
        }
        
        console.log("Admin check data:", data);
        
        if (data.success && data.is_admin) {
          console.log("User is admin (from server), granting access");
          setIsAuthenticated(true);
        } else {
          console.log("Not admin or not authenticated, redirecting to login");
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

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

  // Load merch orders when orders tab is active (from database)
  React.useEffect(() => {
    if (activeTab !== "orders") return;
    (async () => {
      try {
        setServicesLoading(true);
        setServicesMessage("");
        const res = await fetch("https://crtvshotss.atwebpages.com/merch_orders_list.php", {
          credentials: "include"
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setOrders(json.data);
          setOrdersPage(1); // Reset to first page when data loads
        } else {
          setServicesMessage("Failed to load orders");
        }
      } catch (e) {
        setServicesMessage("Error loading orders: " + e.message);
      } finally {
        setServicesLoading(false);
      }
    })();
  }, [activeTab]);

  // Load service bookings when bookings tab is active (from database)
  const [bookingsData, setBookingsData] = React.useState([]);
  React.useEffect(() => {
    if (activeTab !== "bookings") return;
    (async () => {
      try {
        setServicesLoading(true);
        setServicesMessage("");
        const res = await fetch("https://crtvshotss.atwebpages.com/orders_list.php", {
          credentials: "include"
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setBookingsData(json.data);
          setOrdersPage(1); // Reset to first page when data loads
        } else {
          setServicesMessage("Failed to load bookings");
        }
      } catch (e) {
        setServicesMessage("Error loading bookings: " + e.message);
      } finally {
        setServicesLoading(false);
      }
    })();
  }, [activeTab]);

  // Load users when users tab is active (from database)
  React.useEffect(() => {
    if (activeTab !== "users") return;
    (async () => {
      try {
        setServicesLoading(true);
        setServicesMessage("");
        const res = await fetch("https://crtvshotss.atwebpages.com/get_users.php", {
          credentials: "include"
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          // Ensure is_admin is properly converted to number
          const mappedUsers = json.data.map(u => ({
            ...u,
            is_admin: parseInt(u.is_admin) || 0,
            email_verified: parseInt(u.email_verified) || 0
          }));
          setUsers(mappedUsers);
          setSelectedUserIds(new Set());
        } else {
          setServicesMessage("Failed to load users");
        }
      } catch (e) {
        setServicesMessage("Error loading users: " + e.message);
      } finally {
        setServicesLoading(false);
      }
    })();
  }, [activeTab]);

  // Load reviews when reviews tab is active (admin view: all reviews)
  React.useEffect(() => {
    if (activeTab !== 'reviews') return;
    (async () => {
      try {
        setServicesLoading(true);
        setServicesMessage('');

        // Fetch services (to map service_id -> name) and reviews in parallel
        const [servicesRes, reviewsRes] = await Promise.all([
          fetch('https://crtvshotss.atwebpages.com/services_list.php'),
          fetch('https://crtvshotss.atwebpages.com/reviews_admin_list.php', { credentials: 'include' })
        ]);

        const servicesJson = await servicesRes.json().catch(() => ({}));
        const reviewsJson = await reviewsRes.json();

        const serviceMap = {};
        if (servicesJson && servicesJson.success && Array.isArray(servicesJson.data)) {
          servicesJson.data.forEach(s => { serviceMap[s.id] = s.name; });
          setServices(servicesJson.data);
        }

        if (reviewsJson && reviewsJson.success && Array.isArray(reviewsJson.data)) {
          const mapped = reviewsJson.data.map(r => ({
            id: r.id,
            user: r.name || r.user || r.email || '',
            name: r.name || r.user || r.email || '',
            email: r.email || '',
            quote: r.quote || r.comment || '',
            comment: r.quote || r.comment || '',
            rating: r.rating || 0,
            is_approved: r.is_approved ? 1 : 0,
            approved: r.is_approved ? true : false,
            service_id: r.service_id || 0,
            service_name: serviceMap[r.service_id] || (r.service_name || '—'),
            created_at: r.created_at || ''
          }));

          setReviews(mapped);
          setSelectedReviewIds(new Set());
          setReviewsPage(1);
        } else {
          setServicesMessage('Failed to load reviews');
        }
      } catch (e) {
        setServicesMessage('Error loading reviews: ' + e.message);
      } finally {
        setServicesLoading(false);
      }
    })();
  }, [activeTab]);
  
  // Sorting function
  const sortData = (data, sortField, sortDirection) => {
    if (!sortField) return data;
    
    return [...data].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      // Handle nested properties
      if (sortField === 'created_at' || sortField === 'date') {
        aVal = new Date(aVal || 0);
        bVal = new Date(bVal || 0);
      } else if (sortField === 'amount' || sortField === 'price') {
        aVal = parseFloat(aVal || 0);
        bVal = parseFloat(bVal || 0);
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };
  
  // Orders sorting and pagination - use bookingsData for bookings tab, orders for orders tab
  const currentOrdersData = activeTab === "orders" ? orders : bookingsData;
  
  const handleOrdersSort = (field, direction) => {
    setOrdersSortField(field);
    setOrdersSortDirection(direction);
    setOrdersPage(1); // Reset to first page when sorting changes
  };
  
  const sortedOrders = useMemo(() => {
    return sortData(currentOrdersData, ordersSortField, ordersSortDirection);
  }, [currentOrdersData, ordersSortField, ordersSortDirection]);
  
  const paginatedOrders = useMemo(() => {
    const startIndex = (ordersPage - 1) * ITEMS_PER_PAGE;
    return sortedOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedOrders, ordersPage]);
  
  const totalOrdersPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
  
  // Services sorting and pagination
  const handleServicesSort = (field, direction) => {
    setServicesSortField(field);
    setServicesSortDirection(direction);
    setServicesPage(1); // Reset to first page when sorting changes
  };
  
  const sortedServices = useMemo(() => {
    return sortData(services, servicesSortField, servicesSortDirection);
  }, [services, servicesSortField, servicesSortDirection]);
  
  const paginatedServices = useMemo(() => {
    const startIndex = (servicesPage - 1) * ITEMS_PER_PAGE;
    return sortedServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedServices, servicesPage]);
  
  const totalServicesPages = Math.ceil(sortedServices.length / ITEMS_PER_PAGE);
  
  // Users sorting and pagination
  const handleUsersSort = (field, direction) => {
    setUsersSortField(field);
    setUsersSortDirection(direction);
    setUsersPage(1);
  };
  
  const sortedUsers = useMemo(() => {
    return sortData(users, usersSortField, usersSortDirection);
  }, [users, usersSortField, usersSortDirection]);
  
  const paginatedUsers = useMemo(() => {
    const startIndex = (usersPage - 1) * ITEMS_PER_PAGE;
    return sortedUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedUsers, usersPage]);
  
  const totalUsersPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
  
  // Reviews sorting and pagination
  const handleReviewsSort = (field, direction) => {
    setReviewsSortField(field);
    setReviewsSortDirection(direction);
    setReviewsPage(1);
  };
  
  const sortedReviews = useMemo(() => {
    return sortData(reviews, reviewsSortField, reviewsSortDirection);
  }, [reviews, reviewsSortField, reviewsSortDirection]);
  
  const paginatedReviews = useMemo(() => {
    const startIndex = (reviewsPage - 1) * ITEMS_PER_PAGE;
    return sortedReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedReviews, reviewsPage]);
  
  const totalReviewsPages = Math.ceil(sortedReviews.length / ITEMS_PER_PAGE);

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
    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [service, setService] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [timeStart, setTimeStart] = useState("");
    const [timeEnd, setTimeEnd] = useState("");
    const [notes, setNotes] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentOption, setPaymentOption] = useState("full");
    const [status, setStatus] = useState("pending");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleCreate = async () => {
      if (!customerName || !email || !phone || !service || !amount) {
        alert("Name, email, phone, service, and amount are required");
        return;
      }
      
      try {
        setIsSubmitting(true);
        const res = await fetch('https://crtvshotss.atwebpages.com/bookings_create.php', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: customerName,
            customer_email: email,
            customer_phone: phone,
            customer_address: address,
            service,
            date: bookingDate,
            time_start: timeStart,
            time_end: timeEnd,
            notes,
            amount: parseFloat(amount),
            payment_option: paymentOption,
            status
          })
        });
        const data = await res.json();
        
        if (data.success) {
          onCreate({
            id: data.booking_id,
            order_id: data.order_id || 'ORD-' + Date.now(),
            customer_name: customerName,
            customer_email: email,
            customer_phone: phone,
            customer_address: address,
            service,
            date: bookingDate,
            time_start: timeStart,
            time_end: timeEnd,
            notes,
            amount,
            payment_option: paymentOption,
            status,
            created_at: new Date().toISOString().split('T')[0]
          });
          // Reset form
          setCustomerName("");
          setEmail("");
          setPhone("");
          setAddress("");
          setService("");
          setBookingDate("");
          setTimeStart("");
          setTimeEnd("");
          setNotes("");
          setAmount("");
          setPaymentOption("full");
          setStatus("pending");
        } else {
          alert('Failed to create booking: ' + (data.message || 'Unknown error'));
        }
      } catch (e) {
        alert('Error creating booking: ' + e.message);
      } finally {
        setIsSubmitting(false);
      }
    };
    
    return (
      <div className="entity-form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <input className="settings-input" placeholder="Customer Name *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        <input className="settings-input" placeholder="Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="settings-input" placeholder="Phone *" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input className="settings-input" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input className="settings-input" placeholder="Service *" value={service} onChange={(e) => setService(e.target.value)} />
        <input className="settings-input" placeholder="Booking Date" type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
        <input className="settings-input" placeholder="Start Time" type="time" value={timeStart} onChange={(e) => setTimeStart(e.target.value)} />
        <input className="settings-input" placeholder="End Time" type="time" value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)} />
        <input className="settings-input" placeholder="Amount (R) *" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <select className="settings-input" value={paymentOption} onChange={(e) => setPaymentOption(e.target.value)}>
          <option value="full">Full Payment</option>
          <option value="deposit">50% Deposit</option>
        </select>
        <select className="settings-input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
        </select>
        <input className="settings-input" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ gridColumn: 'span 2' }} />
        <button className="btn-primary" onClick={handleCreate} disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Booking'}
        </button>
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
        const res = await fetch(`https://crtvshotss.atwebpages.com/${endpoint}`, {
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
      const res = await fetch("https://crtvshotss.atwebpages.com/services_delete.php", {
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

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="admin-dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid #3498db', 
            borderRadius: '50%', 
            width: '40px', 
            height: '40px', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, component will redirect to login via useEffect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2 className="admin-logo">CRTV Admin</h2>
        </div>

        <nav className="sidebar-nav">
          <button
            onClick={() => setActiveTab("orders")}
            className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
          >
            <Calendar size={20} />
            <span>Orders</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`nav-item ${activeTab === "bookings" ? "active" : ""}`}
          >
            <CalendarDays size={20} />
            <span>Bookings</span>
          </button>

         <button
          onClick={() => setActiveTab("services")}
          className={`nav-item ${activeTab === "services" ? "active" : ""}`}
        >
          <PlusCircle size={20} />
          <span>Add Services</span>
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
          onClick={() => setActiveTab("users")}
          className={`nav-item ${activeTab === "users" ? "active" : ""}`}
        >
          <Settings size={20} />
          <span>Users</span>
        </button>

          

        <button
          onClick={() => setActiveTab("reviews")}
          className={`nav-item ${activeTab === "reviews" ? "active" : ""}`}
        >
          <Settings size={20} />
          <span>Reviews</span>
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
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-content">
          {activeTab === "orders" && (
            <div className="orders-view">
              <h1 className="page-title">Merchandise Orders</h1>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{orders.length}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{orders.filter(o => o.order_status === "processing").length}</div>
                  <div className="stat-label">Processing</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{orders.filter(o => o.order_status === "shipping").length}</div>
                  <div className="stat-label">Shipping</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{orders.filter(o => o.order_status === "delivered").length}</div>
                  <div className="stat-label">Delivered</div>
                </div>
              </div>

              <div className="bulk-bar">
                <div>
                  <button className="btn-secondary" onClick={() => {
                    const next = new Set(sortedOrders.map(o => o.id));
                    setSelectedOrderIds(next);
                  }}>Select All</button>
                  <button className="btn-secondary" onClick={() => setSelectedOrderIds(new Set())}>Clear</button>
                </div>
                <div className="bulk-actions">
                  <button className="btn-danger" onClick={async () => {
                    if (selectedOrderIds.size === 0) {
                      alert('Please select orders to delete');
                      return;
                    }
                    const confirmed = window.confirm(`Delete ${selectedOrderIds.size} order(s)? This cannot be undone.`);
                    if (!confirmed) return;
                    try {
                      const res = await fetch('https://crtvshotss.atwebpages.com/merch_orders_delete.php', {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ order_ids: Array.from(selectedOrderIds) })
                      });
                      const data = await res.json();
                      if (data.success) {
                        setOrders(prev => prev.filter(o => !selectedOrderIds.has(o.id)));
                        setSelectedOrderIds(new Set());
                        alert('Orders deleted');
                      } else {
                        alert('Failed: ' + (data.message || 'Unknown error'));
                      }
                    } catch (e) {
                      alert('Error: ' + e.message);
                    }
                  }}>Delete</button>
                </div>
              </div>

              <div className="bookings-table-container orders-table-container">
                <table className="bookings-table orders-table">
                  <thead>
                    <tr>
                      <th>
                        <input 
                          type="checkbox" 
                          checked={sortedOrders.length > 0 && sortedOrders.every(o => selectedOrderIds.has(o.id))}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedOrderIds(new Set(sortedOrders.map(o => o.id)));
                            else setSelectedOrderIds(new Set());
                          }} 
                        />
                      </th>
                      <SortableHeader
                        field="order_id"
                        currentSortField={ordersSortField}
                        currentSortDirection={ordersSortDirection}
                        onSort={handleOrdersSort}
                      >
                        Order ID
                      </SortableHeader>
                      <SortableHeader
                        field="customer_name"
                        currentSortField={ordersSortField}
                        currentSortDirection={ordersSortDirection}
                        onSort={handleOrdersSort}
                      >
                        Customer
                      </SortableHeader>
                      <th>Email</th>
                      <th>Address</th>
                      <th>Items</th>
                      <SortableHeader
                        field="subtotal"
                        currentSortField={ordersSortField}
                        currentSortDirection={ordersSortDirection}
                        onSort={handleOrdersSort}
                      >
                        Subtotal
                      </SortableHeader>
                      <SortableHeader
                        field="total"
                        currentSortField={ordersSortField}
                        currentSortDirection={ordersSortDirection}
                        onSort={handleOrdersSort}
                      >
                        Total
                      </SortableHeader>
                      <SortableHeader
                        field="order_status"
                        currentSortField={ordersSortField}
                        currentSortDirection={ordersSortDirection}
                        onSort={handleOrdersSort}
                      >
                        Order Status
                      </SortableHeader>
                      <SortableHeader
                        field="created_at"
                        currentSortField={ordersSortField}
                        currentSortDirection={ordersSortDirection}
                        onSort={handleOrdersSort}
                      >
                        Date
                      </SortableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map(order => (
                      <tr key={order.id}>
                        <td><input type="checkbox" checked={selectedOrderIds.has(order.id)} onChange={(e) => {
                          const next = new Set(selectedOrderIds);
                          if (e.target.checked) next.add(order.id); else next.delete(order.id);
                          setSelectedOrderIds(next);
                        }} /></td>
                        <td className="text-black">{order.order_id}</td>
                        <td className="text-black">{order.customer_name}</td>
                        <td className="text-black text-ellipsis" style={{ maxWidth: '200px' }} title={order.customer_email}>{order.customer_email}</td>
                        <td className="text-black text-ellipsis" style={{ maxWidth: '200px' }} title={order.customer_address}>{order.customer_address || '—'}</td>
                        <td className="text-black text-ellipsis" style={{ maxWidth: '200px' }} title={order.items}>{order.items ? (JSON.parse(order.items).length > 0 ? `${JSON.parse(order.items).length} item(s)` : '—') : '—'}</td>
                        <td className="text-black font-semibold">R{parseFloat(order.subtotal || 0).toFixed(2)}</td>
                        <td className="text-black font-semibold">R{parseFloat(order.total || 0).toFixed(2)}</td>
                        <td>
                          <select
                            className="status-select"
                            value={order.order_status || 'processing'}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              try {
                                const res = await fetch('https://crtvshotss.atwebpages.com/merch_orders_update_status.php', {
                                  method: 'POST',
                                  credentials: 'include',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ order_id: order.id, order_status: newStatus })
                                });
                                const data = await res.json();
                                if (data.success) {
                                  setOrders(prev => prev.map(o => o.id === order.id ? { ...o, order_status: newStatus } : o));
                                } else {
                                  alert('Failed to update status: ' + (data.message || 'Unknown error'));
                                }
                              } catch (e) {
                                alert('Error updating status: ' + e.message);
                              }
                            }}
                          >
                            <option value="processing">Processing</option>
                            <option value="shipping">Shipping</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="text-black text-sm">{order.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sortedOrders.length > ITEMS_PER_PAGE && (
                <Pagination
                  currentPage={ordersPage}
                  totalPages={totalOrdersPages}
                  onPageChange={setOrdersPage}
                />
              )}
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

          {activeTab === "bookings" && (
            <div className="bookings-view">
              <h1 className="page-title">Service Bookings</h1>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{bookingsData.length}</div>
                  <div className="stat-label">Total Bookings</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{bookingsData.filter(o => o.payment_option === "full").length}</div>
                  <div className="stat-label">Paid</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{bookingsData.filter(o => o.payment_option === "deposit").length}</div>
                  <div className="stat-label">Deposit</div>
                </div>
              </div>

              <div className="availability-content" style={{ marginBottom: '2rem' }}>
                <div className="calendar-section">
                  <h3 className="section-title" style={{ marginBottom: '1rem' }}>Bookings Calendar</h3>
                  <BookingsCalendar
                    orders={bookingsData}
                    onDateSelect={setSelectedBookingDate}
                    selectedDate={selectedBookingDate}
                  />
                  {selectedBookingDate && (
                    <BookingsDateDetails
                      date={selectedBookingDate}
                      orders={bookingsData}
                    />
                  )}
                </div>
              </div>

              <div className="bulk-bar">
                <div>
                  <button className="btn-secondary" onClick={() => {
                    const next = new Set(sortedOrders.map(o => o.id));
                    setSelectedOrderIds(next);
                  }}>Select All</button>
                  <button className="btn-secondary" onClick={() => setSelectedOrderIds(new Set())}>Clear</button>
                </div>
                <div className="bulk-actions">
                  <button className="btn-primary" onClick={async () => {
                    if (selectedOrderIds.size === 0) {
                      alert('Please select bookings to mark as paid');
                      return;
                    }
                    try {
                      const promises = Array.from(selectedOrderIds).map(id => 
                        fetch('https://crtvshotss.atwebpages.com/bookings_update.php', {
                          method: 'POST',
                          credentials: 'include',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id, status: 'paid' })
                        })
                      );
                      await Promise.all(promises);
                      const updated = bookingsData.map(o => selectedOrderIds.has(o.id) ? { ...o, status: "paid" } : o);
                      setBookingsData(updated);
                      setSelectedOrderIds(new Set());
                    } catch (e) {
                      alert('Error updating bookings: ' + e.message);
                    }
                  }}>Mark Paid</button>
                  <button className="btn-secondary" onClick={async () => {
                    if (selectedOrderIds.size === 0) {
                      alert('Please select bookings to mark as refunded');
                      return;
                    }
                    try {
                      const promises = Array.from(selectedOrderIds).map(id => 
                        fetch('https://crtvshotss.atwebpages.com/bookings_update.php', {
                          method: 'POST',
                          credentials: 'include',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id, status: 'refunded' })
                        })
                      );
                      await Promise.all(promises);
                      const updated = bookingsData.map(o => selectedOrderIds.has(o.id) ? { ...o, status: "refunded" } : o);
                      setBookingsData(updated);
                      setSelectedOrderIds(new Set());
                    } catch (e) {
                      alert('Error updating bookings: ' + e.message);
                    }
                  }}>Mark Refunded</button>
                  <button className="btn-danger" onClick={async () => {
                    if (selectedOrderIds.size === 0) {
                      alert('Please select bookings to delete');
                      return;
                    }
                    if (!confirm(`Delete ${selectedOrderIds.size} booking(s)?`)) return;
                    try {
                      const promises = Array.from(selectedOrderIds).map(id => 
                        fetch('https://crtvshotss.atwebpages.com/bookings_delete.php', {
                          method: 'POST',
                          credentials: 'include',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id })
                        })
                      );
                      await Promise.all(promises);
                      setBookingsData(bookingsData.filter(o => !selectedOrderIds.has(o.id)));
                      setSelectedOrderIds(new Set());
                    } catch (e) {
                      alert('Error deleting bookings: ' + e.message);
                    }
                  }}>Delete</button>
                </div>
              </div>

              <div className="bookings-table-container orders-table-container">
                <table className="bookings-table orders-table">
                  <thead>
                    <tr>
                      <th>
                        <input 
                          type="checkbox" 
                          checked={sortedOrders.length > 0 && sortedOrders.every(o => selectedOrderIds.has(o.id))}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedOrderIds(new Set(sortedOrders.map(o => o.id)));
                            else setSelectedOrderIds(new Set());
                          }} 
                        />
                      </th>
                      <SortableHeader
                        field="order_id"
                        currentSortField={ordersSortField}
                        currentSortDirection={ordersSortDirection}
                        onSort={handleOrdersSort}
                      >
                        Order ID
                      </SortableHeader>
                      <SortableHeader
                        field="customer_name"
                        currentSortField={ordersSortField}
                        currentSortDirection={ordersSortDirection}
                        onSort={handleOrdersSort}
                      >
                        Customer
                      </SortableHeader>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Service</th>
                      <SortableHeader
                        field="date"
                        currentSortField={ordersSortField}
                        currentSortDirection={ordersSortDirection}
                        onSort={handleOrdersSort}
                      >
                        Booking Date
                      </SortableHeader>
                      <th>Time Slot</th>
                      <SortableHeader
                        field="amount"
                        currentSortField={ordersSortField}
                        currentSortDirection={ordersSortDirection}
                        onSort={handleOrdersSort}
                      >
                        Amount
                      </SortableHeader>
                      <SortableHeader
                        field="payment_option"
                        currentSortField={ordersSortField}
                        currentSortDirection={ordersSortDirection}
                        onSort={handleOrdersSort}
                      >
                        Payment
                      </SortableHeader>
                      <SortableHeader
                        field="created_at"
                        currentSortField={ordersSortField}
                        currentSortDirection={ordersSortDirection}
                        onSort={handleOrdersSort}
                      >
                        Order Date
                      </SortableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="text-black text-center">No orders found.</td>
                      </tr>
                    ) : (
                      paginatedOrders.map(order => (
                        <tr key={order.id}>
                          <td><input type="checkbox" checked={selectedOrderIds.has(order.id)} onChange={(e) => {
                            const next = new Set(selectedOrderIds);
                            if (e.target.checked) next.add(order.id); else next.delete(order.id);
                            setSelectedOrderIds(next);
                          }} /></td>
                          <td className="text-black">{order.order_id}</td>
                          <td className="text-black">{order.customer_name}</td>
                          <td className="text-black text-ellipsis" style={{ maxWidth: '200px' }} title={order.customer_email}>{order.customer_email}</td>
                          <td className="text-black">{order.customer_phone}</td>
                          <td className="text-black text-ellipsis" style={{ maxWidth: '250px' }} title={order.item_name || order.service}>{order.item_name || order.service}</td>
                          <td className="text-black text-sm">
                            {order.date ? new Date(order.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                          </td>
                          <td className="text-black text-sm">
                            {order.time_start && order.time_end ? `${formatTimeForDisplay(order.time_start)}-${formatTimeForDisplay(order.time_end)}` : '—'}
                          </td>
                          <td className="text-black font-semibold">R{parseFloat(order.amount).toFixed(2)}</td>
                          <td>
                            <span className={`badge ${order.payment_option === "full" ? "badge-confirmed" : "badge-yellow"}`}>
                              {order.payment_option === "full" ? "Paid" : "50% Deposit"}
                            </span>
                          </td>
                          <td className="text-black text-sm">{order.created_at}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {sortedOrders.length > ITEMS_PER_PAGE && (
                <Pagination
                  currentPage={ordersPage}
                  totalPages={totalOrdersPages}
                  onPageChange={setOrdersPage}
                />
              )}

              <div className="entity-form">
                <h3 className="section-title">Create Booking</h3>
                <OrderForm onCreate={(newOrder) => setBookingsData([newOrder, ...bookingsData])} />
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="users-view">
              <h1 className="page-title">Users</h1>
              {servicesMessage && (
                <div className={`product-message ${servicesMessage.toLowerCase().includes("success") ? "success" : "error"}`}>
                  {servicesMessage}
                </div>
              )}
              <div className="bulk-bar">
                <div>
                  <button className="btn-secondary" onClick={() => setSelectedUserIds(new Set(sortedUsers.map(u => u.user_id || u.id)))}>Select All</button>
                  <button className="btn-secondary" onClick={() => setSelectedUserIds(new Set())}>Clear</button>
                </div>
                <div className="bulk-actions">
                  <button 
                    className="btn-primary" 
                    disabled={selectedUserIds.size === 0}
                    onClick={async () => {
                      try {
                        await Promise.all(Array.from(selectedUserIds).map(user_id => 
                          fetch('https://crtvshotss.atwebpages.com/users_update_admin.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({ user_id, is_admin: true })
                          }).then(res => res.json())
                        ));
                        setUsers(users.map(u => selectedUserIds.has(u.user_id) ? { ...u, is_admin: 1 } : u));
                        setSelectedUserIds(new Set());
                      } catch (err) {
                        console.error('Error making admin:', err);
                        alert('Failed to update users');
                      }
                    }}
                  >
                    Make Admin
                  </button>
                  <button 
                    className="btn-secondary" 
                    disabled={selectedUserIds.size === 0}
                    onClick={async () => {
                      try {
                        await Promise.all(Array.from(selectedUserIds).map(user_id => 
                          fetch('https://crtvshotss.atwebpages.com/users_update_admin.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({ user_id, is_admin: false })
                          }).then(res => res.json())
                        ));
                        setUsers(users.map(u => selectedUserIds.has(u.user_id) ? { ...u, is_admin: 0 } : u));
                        setSelectedUserIds(new Set());
                      } catch (err) {
                        console.error('Error removing admin:', err);
                        alert('Failed to update users');
                      }
                    }}
                  >
                    Make Customer
                  </button>
                  <button 
                    className="btn-danger" 
                    disabled={selectedUserIds.size === 0}
                    onClick={async () => {
                      if (!confirm(`Delete ${selectedUserIds.size} user(s)?`)) return;
                      try {
                        await Promise.all(Array.from(selectedUserIds).map(user_id => 
                          fetch('https://crtvshotss.atwebpages.com/users_delete.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({ user_id })
                          }).then(res => res.json())
                        ));
                        setUsers(users.filter(u => !selectedUserIds.has(u.user_id)));
                        setSelectedUserIds(new Set());
                      } catch (err) {
                        console.error('Error deleting users:', err);
                        alert('Failed to delete users');
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="bookings-table-container">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th><input type="checkbox" onChange={(e) => {
                        if (e.target.checked) setSelectedUserIds(new Set(sortedUsers.map(u => u.user_id || u.id)));
                        else setSelectedUserIds(new Set());
                      }} /></th>
                      <SortableHeader
                        field="user_id"
                        currentSortField={usersSortField}
                        currentSortDirection={usersSortDirection}
                        onSort={handleUsersSort}
                      >
                        ID
                      </SortableHeader>
                      <SortableHeader
                        field="user_firstname"
                        currentSortField={usersSortField}
                        currentSortDirection={usersSortDirection}
                        onSort={handleUsersSort}
                      >
                        First Name
                      </SortableHeader>
                      <SortableHeader
                        field="user_surname"
                        currentSortField={usersSortField}
                        currentSortDirection={usersSortDirection}
                        onSort={handleUsersSort}
                      >
                        Last Name
                      </SortableHeader>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <SortableHeader
                        field="email_verified"
                        currentSortField={usersSortField}
                        currentSortDirection={usersSortDirection}
                        onSort={handleUsersSort}
                      >
                        Verified
                      </SortableHeader>
                      <SortableHeader
                        field="is_admin"
                        currentSortField={usersSortField}
                        currentSortDirection={usersSortDirection}
                        onSort={handleUsersSort}
                      >
                        Admin
                      </SortableHeader>
                      <SortableHeader
                        field="created_at"
                        currentSortField={usersSortField}
                        currentSortDirection={usersSortDirection}
                        onSort={handleUsersSort}
                      >
                        Joined
                      </SortableHeader>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicesLoading ? (
                      <tr>
                        <td colSpan="11" className="text-black text-center">Loading users...</td>
                      </tr>
                    ) : sortedUsers.length === 0 ? (
                      <tr>
                        <td colSpan="11" className="text-black text-center">No users found.</td>
                      </tr>
                    ) : (
                      paginatedUsers.map(u => (
                        <tr key={u.user_id || u.id}>
                          <td><input type="checkbox" checked={selectedUserIds.has(u.user_id || u.id)} onChange={(e) => {
                            const next = new Set(selectedUserIds);
                            if (e.target.checked) next.add(u.user_id || u.id); else next.delete(u.user_id || u.id);
                            setSelectedUserIds(next);
                          }} /></td>
                          <td className="text-black text-sm">{u.user_id || u.id}</td>
                          <td className="text-black">{u.user_firstname || '-'}</td>
                          <td className="text-black">{u.user_surname || '-'}</td>
                          <td className="text-black">{u.user_username || '-'}</td>
                          <td className="text-black text-ellipsis" style={{ maxWidth: '200px' }} title={u.user_email}>{u.user_email}</td>
                          <td className="text-black">{u.user_contact || '-'}</td>
                          <td>
                            <span className={`badge ${u.email_verified == 1 || u.email_verified === 1 || u.email_verified === '1' ? "badge-confirmed" : "badge-pending"}`}>
                              {u.email_verified == 1 || u.email_verified === 1 || u.email_verified === '1' ? "Yes" : "No"}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${u.is_admin == 1 || u.is_admin === 1 || u.is_admin === '1' ? "badge-confirmed" : "badge-pending"}`}>
                              {u.is_admin == 1 || u.is_admin === 1 || u.is_admin === '1' ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="text-black text-sm">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</td>
                          <td>
                            <div className="table-actions">
                              <button 
                                className="btn-secondary" 
                                onClick={async () => {
                                  try {
                                    const res = await fetch('https://crtvshotss.atwebpages.com/users_update_admin.php', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      credentials: 'include',
                                      body: JSON.stringify({ user_id: u.user_id, is_admin: !u.is_admin })
                                    });
                                    const json = await res.json();
                                    if (json.success) {
                                      const currentIsAdmin = u.is_admin == 1 || u.is_admin === 1 || u.is_admin === '1';
                                      setUsers(users.map(x => x.user_id === u.user_id ? { ...x, is_admin: currentIsAdmin ? 0 : 1 } : x));
                                    }
                                  } catch (err) {
                                    console.error('Error updating admin status:', err);
                                    alert('Failed to update user');
                                  }
                                }}
                              >
                                {(u.is_admin == 1 || u.is_admin === 1 || u.is_admin === '1') ? 'Remove Admin' : 'Make Admin'}
                              </button>
                              <button 
                                className="btn-danger" 
                                onClick={async () => {
                                  if (!confirm(`Delete user ${u.user_firstname} ${u.user_surname}?`)) return;
                                  try {
                                    const res = await fetch('https://crtvshotss.atwebpages.com/users_delete.php', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      credentials: 'include',
                                      body: JSON.stringify({ user_id: u.user_id })
                                    });
                                    const json = await res.json();
                                    if (json.success) {
                                      setUsers(users.filter(x => x.user_id !== u.user_id));
                                    }
                                  } catch (err) {
                                    console.error('Error deleting user:', err);
                                    alert('Failed to delete user');
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {sortedUsers.length > ITEMS_PER_PAGE && (
                <Pagination
                  currentPage={usersPage}
                  totalPages={totalUsersPages}
                  onPageChange={setUsersPage}
                />
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="reviews-view">
              <h1 className="page-title">Reviews</h1>
              <div className="bulk-bar">
                <div>
                  <button className="btn-secondary" onClick={() => setSelectedReviewIds(new Set(sortedReviews.map(r => r.id)))}>Select All</button>
                  <button className="btn-secondary" onClick={() => setSelectedReviewIds(new Set())}>Clear</button>
                </div>
                <div className="bulk-actions">
                  <button className="btn-primary" onClick={async () => {
                    try {
                      await Promise.all(Array.from(selectedReviewIds).map(id => 
                        fetch('https://crtvshotss.atwebpages.com/reviews_update.php', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          credentials: 'include',
                          body: JSON.stringify({ id, is_approved: true })
                        }).then(res => res.json())
                      ));
                      setReviews(reviews.map(r => selectedReviewIds.has(r.id) ? { ...r, is_approved: 1 } : r));
                      setSelectedReviewIds(new Set());
                    } catch (err) {
                      console.error('Error approving reviews:', err);
                      alert('Failed to approve reviews');
                    }
                  }}>Approve</button>
                  <button className="btn-secondary" onClick={async () => {
                    try {
                      await Promise.all(Array.from(selectedReviewIds).map(id => 
                        fetch('https://crtvshotss.atwebpages.com/reviews_update.php', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          credentials: 'include',
                          body: JSON.stringify({ id, is_approved: false })
                        }).then(res => res.json())
                      ));
                      setReviews(reviews.map(r => selectedReviewIds.has(r.id) ? { ...r, is_approved: 0 } : r));
                      setSelectedReviewIds(new Set());
                    } catch (err) {
                      console.error('Error unapproving reviews:', err);
                      alert('Failed to unapprove reviews');
                    }
                  }}>Unapprove</button>
                  <button className="btn-danger" onClick={async () => {
                    if (!confirm(`Delete ${selectedReviewIds.size} review(s)?`)) return;
                    try {
                      await Promise.all(Array.from(selectedReviewIds).map(id => 
                        fetch('https://crtvshotss.atwebpages.com/reviews_delete.php', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          credentials: 'include',
                          body: JSON.stringify({ id })
                        }).then(res => res.json())
                      ));
                      setReviews(reviews.filter(r => !selectedReviewIds.has(r.id)));
                      setSelectedReviewIds(new Set());
                    } catch (err) {
                      console.error('Error deleting reviews:', err);
                      alert('Failed to delete reviews');
                    }
                  }}>Delete</button>
                </div>
              </div>

              <div className="bookings-table-container">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th><input type="checkbox" onChange={(e) => {
                        if (e.target.checked) setSelectedReviewIds(new Set(sortedReviews.map(r => r.id)));
                        else setSelectedReviewIds(new Set());
                      }} /></th>
                      <SortableHeader
                        field="id"
                        currentSortField={reviewsSortField}
                        currentSortDirection={reviewsSortDirection}
                        onSort={handleReviewsSort}
                      >
                        ID
                      </SortableHeader>
                      <SortableHeader
                        field="name"
                        currentSortField={reviewsSortField}
                        currentSortDirection={reviewsSortDirection}
                        onSort={handleReviewsSort}
                      >
                        Name
                      </SortableHeader>
                      <SortableHeader
                        field="rating"
                        currentSortField={reviewsSortField}
                        currentSortDirection={reviewsSortDirection}
                        onSort={handleReviewsSort}
                      >
                        Rating
                      </SortableHeader>
                      <th>Quote</th>
                      <SortableHeader
                        field="is_approved"
                        currentSortField={reviewsSortField}
                        currentSortDirection={reviewsSortDirection}
                        onSort={handleReviewsSort}
                      >
                        Approved
                      </SortableHeader>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedReviews.map(r => (
                      <tr key={r.id}>
                        <td><input type="checkbox" checked={selectedReviewIds.has(r.id)} onChange={(e) => {
                          const next = new Set(selectedReviewIds);
                          if (e.target.checked) next.add(r.id); else next.delete(r.id);
                          setSelectedReviewIds(next);
                        }} /></td>
                        <td className="text-black">{r.id}</td>
                        <td className="text-black">{r.name}</td>
                        <td className="text-black">{r.rating}</td>
                        <td className="text-black">{r.quote}</td>
                        <td className="text-black">{r.is_approved ? "Yes" : "No"}</td>
                        <td>
                          <div className="table-actions">
                            <button className="btn-secondary" onClick={async () => {
                              try {
                                const res = await fetch('https://crtvshotss.atwebpages.com/reviews_update.php', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  credentials: 'include',
                                  body: JSON.stringify({ id: r.id, is_approved: !r.is_approved })
                                });
                                const json = await res.json();
                                if (json.success) {
                                  setReviews(reviews.map(x => x.id === r.id ? { ...x, is_approved: x.is_approved ? 0 : 1 } : x));
                                }
                              } catch (err) {
                                console.error('Error toggling approval:', err);
                                alert('Failed to update review');
                              }
                            }}>{r.is_approved ? 'Unapprove' : 'Approve'}</button>
                            <button className="btn-danger" onClick={async () => {
                              if (!confirm('Are you sure you want to delete this review?')) return;
                              try {
                                const res = await fetch('https://crtvshotss.atwebpages.com/reviews_delete.php', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  credentials: 'include',
                                  body: JSON.stringify({ id: r.id })
                                });
                                const json = await res.json();
                                if (json.success) {
                                  setReviews(reviews.filter(x => x.id !== r.id));
                                }
                              } catch (err) {
                                console.error('Error deleting review:', err);
                                alert('Failed to delete review');
                              }
                            }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sortedReviews.length > ITEMS_PER_PAGE && (
                <Pagination
                  currentPage={reviewsPage}
                  totalPages={totalReviewsPages}
                  onPageChange={setReviewsPage}
                />
              )}
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
                              setServicesPage(1); // Reset to first page when data loads
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
                      <button className="btn-secondary" onClick={() => setSelectedServiceIds(new Set(sortedServices.map(s => s.id)))}>Select All</button>
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
                          <th>
                            <input 
                              type="checkbox" 
                              checked={sortedServices.length > 0 && sortedServices.every(s => selectedServiceIds.has(s.id))}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedServiceIds(new Set(sortedServices.map(s => s.id)));
                                else setSelectedServiceIds(new Set());
                              }} 
                            />
                          </th>
                          <SortableHeader
                            field="id"
                            currentSortField={servicesSortField}
                            currentSortDirection={servicesSortDirection}
                            onSort={handleServicesSort}
                          >
                            ID
                          </SortableHeader>
                          <SortableHeader
                            field="name"
                            currentSortField={servicesSortField}
                            currentSortDirection={servicesSortDirection}
                            onSort={handleServicesSort}
                          >
                            Name
                          </SortableHeader>
                          <SortableHeader
                            field="category"
                            currentSortField={servicesSortField}
                            currentSortDirection={servicesSortDirection}
                            onSort={handleServicesSort}
                          >
                            Category
                          </SortableHeader>
                          <SortableHeader
                            field="price"
                            currentSortField={servicesSortField}
                            currentSortDirection={servicesSortDirection}
                            onSort={handleServicesSort}
                          >
                            Price
                          </SortableHeader>
                          <SortableHeader
                            field="price_type"
                            currentSortField={servicesSortField}
                            currentSortDirection={servicesSortDirection}
                            onSort={handleServicesSort}
                          >
                            Price Type
                          </SortableHeader>
                          <SortableHeader
                            field="is_active"
                            currentSortField={servicesSortField}
                            currentSortDirection={servicesSortDirection}
                            onSort={handleServicesSort}
                          >
                            Active
                          </SortableHeader>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {servicesLoading ? (
                          <tr>
                            <td colSpan="8" className="text-black text-center">Loading services...</td>
                          </tr>
                        ) : sortedServices.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-black text-center">No services found. Create one below.</td>
                          </tr>
                        ) : (
                          paginatedServices.map(service => (
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

                  {sortedServices.length > ITEMS_PER_PAGE && (
                    <Pagination
                      currentPage={servicesPage}
                      totalPages={totalServicesPages}
                      onPageChange={setServicesPage}
                    />
                  )}

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
                              setServicesPage(1); // Reset to first page when data loads
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
