import React, { useEffect, useState, useMemo } from "react";
import Header from "../components/Header.jsx";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "../components/Footer";

const steps = [
  { id: 1, name: "Service" },
  { id: 2, name: "Date & Time" },
  { id: 3, name: "Your Details" },
  { id: 4, name: "Review" },
  { id: 5, name: "Payment" },
];

const services = [
  {
    id: "matricdance",
    name: "Matric Dance: Video & Photography",
    price: "R1500/h",
    description:
      "Full video coverage and photography for matric dance events. Includes highlights edit and photo gallery.",
  },
  {
    id: "mdphotography",
    name: "Matric Dance: Photography ONLY",
    price: "R1000",
    description:
      "Photography-only package for matric dances — professional shots, retouching and an online gallery.",
  },
  {
    id: "promo",
    name: "Music Video: DJI Osmo (Visualizer)",
    price: "R5000",
    description:
      "High-quality music video captured with DJI Osmo — ideal for visualizers and short promos.",
  },
  {
    id: "music",
    name: "Music Video: Reels",
    price: "R3500",
    description:
      "Short-form music video / reels package optimized for social media platforms.",
  },
  {
    id: "editing",
    name: "Music Video Editing",
    price: "R3000",
    description:
      "Professional editing service for your footage — cuts, sync, basic color and export masters.",
  },
  {
    id: "grading",
    name: "Color Grading",
    price: "R2000",
    description:
      "Standalone color grading service to give your footage a cinematic look and consistent color profile.",
  },
  {
    id: "other",
    name: "Other / Custom Service",
    price: "TBD",
    description: "Custom requests — describe what you need and we'll provide a tailored quote.",
  },
];

const Calendar = ({ selectedDate, onSelectDate }) => {
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

  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateClick = (date) => {
    const formattedDate = formatDateString(date);
    onSelectDate(formattedDate);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded transition-colors hover:bg-gray-700 text-gray-300"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-semibold">
          {monthName} {year}
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 hover:bg-gray-700 rounded text-gray-300"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm text-black py-1">
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
          const isSelected = selectedDate === dateString;

          return (
             <button
               key={index}
               type="button"
               onClick={() => handleDateClick(date)}
               className={`p-2 rounded text-sm transition
                ${isSelected ? 'bg-red-600 text-white' : 'hover:bg-gray-100 text-black'}
              `}
             >
               <span>
                 {index + 1}
               </span>
             </button>
           );
         })}
       </div>
     </div>
   );
 };

// TimeDropdownSelector component for selecting start and end times
const TimeDropdownSelector = ({ selectedTime, onTimeSelect }) => {
  const timeOptions = generateTimeOptions();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Initialize from selectedTime if it exists (format: "08:00-10:00")
  useEffect(() => {
    if (selectedTime) {
      const [start, end] = selectedTime.split('-');
      setStartTime(start || "");
      setEndTime(end || "");
    }
  }, [selectedTime]);

  // Update parent component when both times are selected
  useEffect(() => {
    if (startTime && endTime) {
      onTimeSelect(`${startTime}-${endTime}`);
    } else {
      onTimeSelect("");
    }
  }, [startTime, endTime, onTimeSelect]);

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    
    // If end time is before new start time, clear end time
    if (endTime && newStartTime >= endTime) {
      setEndTime("");
    }
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  // Filter end time options to only show times after start time
  const getEndTimeOptions = () => {
    if (!startTime) return timeOptions;
    return timeOptions.filter(time => time > startTime);
  };

  // Calculate duration
  const getDuration = () => {
    if (!startTime || !endTime) return "";
    
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    const durationMinutes = (end - start) / (1000 * 60);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minutes`;
    }
  };

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-red-600 mb-2">Start Time</label>
          <select
            value={startTime}
            onChange={handleStartTimeChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
            required
          >
            <option value="">Select start time</option>
            {timeOptions.map(time => (
              <option key={`start-${time}`} value={time}>
                {formatTimeForDisplay(time)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-red-600 mb-2">End Time</label>
          <select
            value={endTime}
            onChange={handleEndTimeChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
            required
            disabled={!startTime}
          >
            <option value="">Select end time</option>
            {getEndTimeOptions().map(time => (
              <option key={`end-${time}`} value={time}>
                {formatTimeForDisplay(time)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {startTime && endTime && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-red-800">
              {formatTimeForDisplay(startTime)} - {formatTimeForDisplay(endTime)}
            </div>
            <div className="text-sm text-red-600 mt-1">
              Duration: {getDuration()}
            </div>
          </div>
        </div>
      )}

      {!startTime && (
        <p className="text-sm text-red-400 text-center">
          Please select a start time first
        </p>
      )}
    </div>
  );
};

// Helper function to generate time options from 8:00 AM to 8:00 PM in 30-minute intervals
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 8; hour <= 20; hour++) {
    const hourStr = hour.toString().padStart(2, '0');
    times.push(`${hourStr}:00`);
    // Don't add :30 for the last hour (20:30 would be 8:30 PM, which is beyond 8:00 PM)
    if (hour < 20) {
      times.push(`${hourStr}:30`);
    }
  }
  return times;
};

// Helper function to format time for display (e.g., "08:00" -> "8:00 AM")
const formatTimeForDisplay = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [service, setService] = useState("");
  const [expandedService, setExpandedService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [details, setDetails] = useState({ name: "", email: "", phone: "", notes: "" });
  const [customService, setCustomService] = useState({ title: "", description: "", budget: "" });
  const [submitted, setSubmitted] = useState(false);
  const [paymentOption, setPaymentOption] = useState(""); // "full" or "deposit"
  const [availableDates, setAvailableDates] = useState([]);
  const [loadingAvail, setLoadingAvail] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // modal visibility for custom service
  const [showCustomModal, setShowCustomModal] = useState(false);
  // hide the page-level Pay Now button briefly after "Save & Use"
  const [hidePayNow, setHidePayNow] = useState(false);

  const servicePricing = {
    matricdance: { name: "Matric Dance: Video & Photography", price: 1500, type: "hourly" },
    mdphotography: { name: "Matric Dance: Photography ONLY", price: 1000, type: "fixed" },
    promo: { name: "Music Video: DJI Osmo (Visualizer)", price: 5000, type: "fixed" },
    music: { name: "Music Video: Reels", price: 3500, type: "fixed" },
    editing: { name: "Music Video Editing", price: 3000, type: "fixed" },
    grading: { name: "Colour Grading", price: 2000, type: "fixed" },
    other: { name: "Custom Service", price: 0, type: "custom" },
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mockDates = ["2024-01-15", "2024-01-16", "2024-01-17"];
        if (!cancelled) setAvailableDates(mockDates);
      } catch (e) {
        // ignore
      } finally {
        if (!cancelled) setLoadingAvail(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const parseBudgetNumber = (txt) => {
    if (!txt) return 0;
    const m = txt.replace(/[, ]/g, "").match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  };

  const paymentAmounts = useMemo(() => {
    if (service === "other") {
      const customPrice = parseBudgetNumber(customService.budget);
      const amounts = { full: customPrice || 0, deposit: Math.round((customPrice || 0) * 0.5) };
      console.log('Custom service amounts:', amounts);
      return amounts;
    }
    const info = servicePricing[service];
    if (!info) return { full: 0, deposit: 0 };
    const full = info.type === "hourly" ? info.price * 2 : info.price;
    const amounts = { full, deposit: Math.round(full * 0.5) };
    console.log('Regular service amounts:', amounts, 'for service:', service, 'info:', info);
    return amounts;
  }, [service, customService]);

  const getServiceDisplayName = () => {
    if (service === "other") return customService.title || "Custom Service";
    return servicePricing[service]?.name || service || "—";
  };

  const handleCustomServiceChange = (field, value) => {
    setCustomService((p) => ({ ...p, [field]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails((p) => ({ ...p, [name]: value }));
  };

  const resetToServiceSelection = () => {
    setService("");
    setCustomService({ title: "", description: "", budget: "" });
    setExpandedService(null);
    setCurrentStep(1);
  };

  // One-by-one expansion: clicking opens this block and collapses others.
  // Clicking the custom block opens modal to edit custom fields.
  const handleServiceClick = (serviceId) => {
    if (serviceId === "other") {
      setShowCustomModal(true);
      setExpandedService("other");
      return;
    }
    setExpandedService((prev) => (prev === serviceId ? null : serviceId));
    setService(serviceId);
  };

  const handleSaveCustomService = (form) => {
    setCustomService(form);
    setService("other");
    setExpandedService("other");
    setShowCustomModal(false);
    // hide the Pay Now button (page-level) immediately after saving custom service
    setHidePayNow(true);
  };

  useEffect(() => {
    // clear the temporary hide flag when user navigates away from step 1
    if (currentStep !== 1) setHidePayNow(false);
  }, [currentStep]);

  const validateStep = (step = currentStep) => {
    if (step === 1) {
      if (service === "other") return !!customService.title.trim() && !!customService.description.trim();
      return !!service;
    }
    if (step === 2) {
      return !!date && !!time;
    }
    if (step === 3) return !!details.name && !!details.email;
    if (step === 4) return true;
    if (step === 5) return !!paymentOption && (service !== "other" || !!customService.budget);
    return false;
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) return;
    
    // CUSTOM SERVICE: Stop at review step (step 4) and don't go to payment
    if (currentStep === 4 && service === "other") {
      // We're already on the review step for custom service - handle confirmation
      handleConfirmCustom();
      return;
    }
    
    // REGULAR SERVICE: Normal navigation
    setCurrentStep((p) => Math.min(p + 1, 5));
    // clear hidePayNow when user actually navigates
    setHidePayNow(false);
  };

  const prevStep = () => {
    setCurrentStep((p) => Math.max(p - 1, 1));
    setHidePayNow(false);
  };

  // Updated to use fetch with CORS
  const handlePay = async () => {
    console.log('=== HANDLEPAY CALLED ===');
    console.log('paymentOption:', paymentOption);
    console.log('validateStep(5):', validateStep(5));
    console.log('service:', service);
    console.log('customService.budget:', customService.budget);
    console.log('currentStep:', currentStep);
    console.log('isProcessing:', isProcessing);
    
    if (!validateStep(5)) {
      console.log('❌ Validation failed for step 5');
      alert('Please select a payment option (Full Payment or Deposit)');
      return;
    }
    
    console.log('✅ Validation passed, proceeding with fetch request');
    setIsProcessing(true);
    
    // Prepare booking data for new backend structure
    const bookingData = {
      service: service,
      customer_name: details.name,
      customer_email: details.email,
      customer_phone: details.phone || '',
      amount: paymentAmounts[paymentOption] || 0,
      item_name: getServiceDisplayName(),
      item_description: `${getServiceDisplayName()} - ${date} ${time} - ${paymentOption === 'full' ? 'Full Payment' : '50% Deposit'}`
    };
    
    console.log('Booking data:', bookingData);
    console.log('Service value being sent:', JSON.stringify(service));
    console.log('Service type:', typeof service);
    console.log('Service length:', service ? service.length : 'null/undefined');
    console.log('About to make fetch request to: https://crtvshots.atwebpages.com/form_booking.php');
    
    try {
      const response = await fetch('https://crtvshots.atwebpages.com/form_booking.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Get response text first to debug
      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        try {
          const result = JSON.parse(responseText);
          console.log('Parsed JSON response:', result);
          
          if (result.success && result.redirectUrl) {
            console.log('Redirecting to PayFast:', result.redirectUrl);
            window.location.href = result.redirectUrl;
          } else {
            console.error('Invalid response:', result);
            alert('Invalid response from server: ' + JSON.stringify(result));
            setIsProcessing(false);
          }
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          console.error('Response was not valid JSON:', responseText);
          alert('Server returned invalid JSON: ' + responseText.substring(0, 200));
          setIsProcessing(false);
        }
      } else {
        console.error('Error response:', responseText);
        alert('Payment processing failed: ' + responseText.substring(0, 200));
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Network error: ' + error.message);
      setIsProcessing(false);
    }
  };

  // Updated to use fetch for custom services
  const handleConfirmCustom = async () => {
    setIsProcessing(true);
    
    // Prepare booking data for new backend structure (custom service)
    const bookingData = {
      service: service,
      customer_name: details.name,
      customer_email: details.email,
      customer_phone: details.phone || '',
      amount: parseBudgetNumber(customService.budget) || 1, // Minimum amount for PayFast
      item_name: customService.title || 'Custom Service',
      item_description: `${customService.title} - ${customService.description} - Custom Service Request`
    };
    
    console.log('Custom service booking data:', bookingData);
    
    try {
      const response = await fetch('https://crtvshots.atwebpages.com/form_booking.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });
      
      console.log('Custom service response status:', response.status);
      
      // Get response text first to debug
      const responseText = await response.text();
      console.log('Custom service raw response text:', responseText);
      
      if (response.ok) {
        try {
          const result = JSON.parse(responseText);
          console.log('Custom service parsed JSON response:', result);
          
          if (result.success && result.redirectUrl) {
            console.log('Custom service redirecting to PayFast:', result.redirectUrl);
            window.location.href = result.redirectUrl;
          } else {
            console.error('Invalid custom service response:', result);
            alert('Invalid response from server: ' + JSON.stringify(result));
            setIsProcessing(false);
          }
        } catch (jsonError) {
          console.error('Custom service JSON parse error:', jsonError);
          console.error('Custom service response was not valid JSON:', responseText);
          alert('Server returned invalid JSON: ' + responseText.substring(0, 200));
          setIsProcessing(false);
        }
      } else {
        console.error('Custom service error response:', responseText);
        alert('Custom service submission failed: ' + responseText.substring(0, 200));
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Custom service fetch error:', error);
      alert('Network error: ' + error.message);
      setIsProcessing(false);
    }
  };

  const CustomServiceModal = ({ open, onClose, initial, onSave }) => {
    const [form, setForm] = useState(initial || { title: "", description: "", budget: "" });
    useEffect(() => setForm(initial || { title: "", description: "", budget: "" }), [initial, open]);
    useEffect(() => {
      if (!open) return;
      const onKey = (e) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    if (!open) return null;
    return (
       <div className="fixed inset-0 z-50 flex items-center justify-center">
         <div className="absolute inset-0 bg-black/70" onClick={onClose} />
         <div className="relative w-full max-w-xl mx-4 bg-white rounded-lg p-6 text-black shadow-lg border border-gray-200">
           <h2 className="text-xl font-semibold mb-4">Custom Service Request</h2>
           <form
             onSubmit={(e) => {
               e.preventDefault();
               onSave(form);
             }}
             className="space-y-3"
           >
             <div>
               <label className="block text-sm mb-1">Service Title *</label>
               <input
                 required
                 value={form.title}
                 onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                 className="w-full p-2 rounded bg-white border text-black"
                 placeholder="e.g., Corporate Event Videography"
               />
             </div>
             <div>
               <label className="block text-sm mb-1">Description *</label>
               <textarea
                 required
                 value={form.description}
                 onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                 className="w-full p-2 rounded bg-white border text-black min-h-28"
                 placeholder="Describe what you need, duration, locations, deliverables..."
               />
             </div>
             <div>
               <label className="block text-sm mb-1">Budget (optional)</label>
               <input
                 value={form.budget}
                 onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
                 className="w-full p-2 rounded bg-white border text-black"
                 placeholder="e.g., R3000"
               />
             </div>
             <div className="flex justify-end gap-3">
               <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-800">
                 Cancel
               </button>
               <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white">
                 Save & Use
               </button>
             </div>
           </form>
         </div>
       </div>
     );
   };

  const renderServiceGrid = () => (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
       {services.map((s) => {
         const isExpanded = expandedService === s.id;
         return (
           <div
             key={s.id}
             className={`flex flex-col border rounded-lg overflow-hidden transition-shadow duration-200 ${
               isExpanded ? "border-red-500 shadow-lg" : "border-red-300 hover:shadow-md"
             }`}
           >
             <button
               type="button"
               onClick={() => handleServiceClick(s.id)}
               className="w-full text-left p-3 flex items-start justify-between bg-transparent"
               aria-expanded={isExpanded}
             >
               <div className="flex-1">
                 <h3 className="font-semibold text-sm text-black">{s.name}</h3>
                 <div className="mt-0.5">
                   <span className="font-medium text-red-600 text-sm">{s.price}</span>
                 </div>
               </div>

               <div className="ml-2 flex items-center">
                 {isExpanded ? <CheckCircle size={16} className="text-white" /> : null}
               </div>
             </button>

             <div
               className={`px-3 pb-3 text-sm text-black transition-[max-height] duration-300 ease-in-out overflow-hidden bg-white ${
                 isExpanded ? "max-h-48" : "max-h-0"
               }`}
             >
               <p className="mb-2 leading-relaxed">{s.description}</p>

               <div className="flex items-center justify-between">
                 <button
                   type="button"
                   onClick={() => {
                     setService(s.id);
                     setCurrentStep(2);
                   }}
                   className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                 >
                   Select & Continue
                 </button>
  
                 <div className="text-xs text-gray-400">
                   <span className="text-red-600 font-medium">{s.price}</span>
                 </div>
               </div>
             </div>
           </div>
         );
       })}
     </div>
   );

  const renderStep = () => {
    if (submitted) {
      // show different confirmation for custom service vs normal booking
      if (service === "other") {
        return (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold mb-2">Booking Request Received</h2>
            <p className="text-red-400">
              We shall contact you soon to discuss the booking.
            </p>
          </div>
        );
      }

      return (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold mb-2">Thanks! Your booking was confirmed.</h2>
          <p className="text-red-400">We will contact you shortly with more details about your session.</p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
           <div className="space-y-4">
             <h2 className="text-2xl font-bold">{service === "other" ? "Describe Your Custom Service Request" : "Choose a service"}</h2>
 
             {service === "other" ? (
               <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="block">Service Title *</label>
                   <input
                     type="text"
                     className="w-full p-2 border rounded bg-white text-black"
                     placeholder="e.g., Corporate Event Videography, Wedding Highlights, etc."
                     value={customService.title}
                     onChange={(e) => handleCustomServiceChange("title", e.target.value)}
                     required
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="block">Detailed Description *</label>
                   <textarea
                     className="w-full p-2 border rounded min-h-32 bg-white text-black"
                     placeholder="Please describe exactly what you need..."
                     value={customService.description}
                     onChange={(e) => handleCustomServiceChange("description", e.target.value)}
                     required
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="block">Budget Estimate (Optional)</label>
                   <input
                     type="text"
                     className="w-full p-2 border rounded bg-white text-black"
                     placeholder="e.g., R2000"
                     value={customService.budget}
                     onChange={(e) => handleCustomServiceChange("budget", e.target.value)}
                   />
                 </div>

                 <div className="flex justify-between mt-6">
                   <button type="button" className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition" onClick={resetToServiceSelection}>
                     ← Back to Services
                   </button>
                   <button
                     type="button"
                     className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                     onClick={nextStep}
                     disabled={!customService.title.trim() || !customService.description.trim()}
                   >
                     Next
                   </button>
                 </div>
               </div>
             ) : (
               renderServiceGrid()
             )}
           </div>
         );

      case 2:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Select date & time</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block mb-4 font-medium">Select Date</label>
                <Calendar
                  selectedDate={date}
                  onSelectDate={setDate}
                  availableDates={availableDates}
                />
              </div>

              <div>
                <label className="block mb-4 font-medium">Select Time</label>
                <TimeDropdownSelector 
                  selectedTime={time} 
                  onTimeSelect={setTime} 
                />
                <p className="mt-2 text-sm text-red-400">
                  Available hours: 8:00 AM - 8:00 PM, in 30-minute intervals
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
           <div className="space-y-4">
             <h2 className="text-2xl font-bold">Your details</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="block">Name *</label>
                 <input type="text" name="name" className="w-full p-2 border rounded bg-white text-black" value={details.name} onChange={handleInputChange} required />
               </div>
               <div className="space-y-2">
                 <label className="block">Email *</label>
                 <input type="email" name="email" className="w-full p-2 border rounded bg-white text-black" value={details.email} onChange={handleInputChange} required />
               </div>
               <div className="space-y-2">
                 <label className="block">Phone</label>
                 <input type="tel" name="phone" className="w-full p-2 border rounded bg-white text-black" value={details.phone} onChange={handleInputChange} />
               </div>
               <div className="sm:col-span-2 space-y-2">
                 <label className="block">Additional Notes</label>
                 <textarea name="notes" className="w-full p-2 border rounded min-h-24 bg-white text-black" value={details.notes} onChange={handleInputChange} placeholder={service === "other" ? "Any additional information about your custom request..." : "Any special requirements or questions..."} />
               </div>
             </div>
           </div>
         );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Review & Confirm</h2>
            <div className="space-y-4 p-4 border rounded">
              <div>
                <span className="font-medium">Service:</span>
                <div className="mt-1">
                  {service === "other" ? (
                    <div className="bg-gray-800 rounded p-3 text-white">
                      <div>
                        <strong>Title:</strong> {customService.title || "Not specified"}
                      </div>
                      <div>
                        <strong>Description:</strong> {customService.description || "Not specified"}
                      </div>
                      {customService.budget && (
                        <div>
                          <strong>Budget:</strong> <span className="text-red-600">{customService.budget}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-800 rounded p-3 text-white">{servicePricing[service]?.name || service}</div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{date || "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Time:</span>
                <span>
                  {time ? `${formatTimeForDisplay(time.split('-')[0])} - ${formatTimeForDisplay(time.split('-')[1])}` : "Not specified"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{details.name || "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{details.email || "Not specified"}</span>
              </div>
              {details.phone && (
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span>{details.phone}</span>
                </div>
              )}
              {details.notes && (
                <div>
                  <span className="font-medium">Additional Notes:</span>
                  <div className="mt-1 bg-gray-800 rounded p-3 text-white">{details.notes}</div>
                </div>
              )}
            </div>

            {/* If custom service, show a note that we'll contact them (and do not show payment) */}
            {service === "other" && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-100">
                <p className="font-medium">We will contact you to discuss details and provide a tailored quote.</p>
                <p className="text-sm mt-1">NO PAYMENT IS REQUIRED NOW.</p>
                <p className="font-medium">Please confirm your request below</p>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Payment Options</h2>

            <div className="border rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold mb-4">Booking Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span>{getServiceDisplayName()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>
                    {date || "—"} {time ? `at ${formatTimeForDisplay(time.split('-')[0])} - ${formatTimeForDisplay(time.split('-')[1])}` : ""}
                  </span>
                </div>
                {service !== "other" && paymentAmounts.full > 0 && (
                  <div className="flex justify-between text-lg font-semibold mt-4 pt-4 border-t border-gray-700">
                    <span>Total Amount:</span>
                    <span className="text-red-600">R{paymentAmounts.full}</span>
                  </div>
                )}
                {service === "other" && customService.budget && (
                  <div className="flex justify-between text-lg font-semibold mt-4 pt-4 border-t border-gray-700">
                    <span>Estimated Budget:</span>
                    <span className="text-red-600">{customService.budget}</span>
                  </div>
                )}
              </div>
            </div>

            {/* If somehow reached payment step with a custom service, hide payment options */}
            {service === "other" ? (
              <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-100">
                <p className="font-medium">Custom service — no online payment here.</p>
                <p className="text-sm mt-1">We will contact you to agree final details and payment terms.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentOption("full")}
                    className={`border-2 rounded-lg p-6 text-left transition ${paymentOption === "full" ? "border-red-500 bg-red-800 text-white" : "border-gray-300 hover:border-red-400"}`}
                  >
                    <h4 className="text-lg font-semibold mb-2">Pay Full Amount</h4>
                    <div className="text-2xl font-bold text-red-600 mb-2">R{paymentAmounts.full || "TBD"}</div>
                    <p className="text-gray-400 text-sm">Secure your booking with full payment</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentOption("deposit")}
                    className={`border-2 rounded-lg p-6 text-left transition ${paymentOption === "deposit" ? "border-red-500 bg-red-800 text-white" : "border-gray-300 hover:border-red-400"}`}
                  >
                    <h4 className="text-lg font-semibold mb-2">Pay 50% Deposit</h4>
                    <div className="text-2xl font-bold text-red-600 mb-2">R{paymentAmounts.deposit || "TBD"}</div>
                    <p className="text-gray-400 text-sm">Pay half now, balance due before service</p>
                  </button>
                </div>

                <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-6 text-yellow-100">
                  <h4 className="font-semibold text-yellow-100 mb-2">Payment Information</h4>
                  <p className="text-yellow-200 text-sm">
                    {paymentOption === "deposit"
                      ? `50% deposit of R${paymentAmounts.deposit} is required to secure your booking. The remaining balance will be due before the service date.`
                      : "Full payment secures your booking and ensures availability for your selected date and time."}
                   </p>
                 </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white flex flex-col min-h-screen text-black">
      <Header />

      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2 text-center">Book Services</h1>
          <p className="text-red-600 text-center mb-10">Capture your special moments ONE SHOT AT A TIME</p>

          <div className="mb-8">
            <div className="flex justify-between bg-white rounded-lg p-3 border border-red-500">
               {steps
                 .filter((s) => !(s.id === 5 && service === "other"))
                 .map((step) => {
                   const completed = step.id < currentStep;
                   const active = step.id === currentStep;
                   return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          active ? "border-red-500 bg-red-600 text-white" : "border-red-400 bg-white text-red-600"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle size={18} className="text-red-600" />
                        ) : (
                          <span className={active ? "text-white" : "text-red-600"}>{step.id}</span>
                        )}
                      </div>
                      <span className={`text-sm mt-1 text-red-600`}>{step.name}</span>
                     </div>
                   );
                 })}
             </div>
           </div>
 
          <div className="bg-white rounded-lg p-6 mb-8 border border-red-500 text-black">{renderStep()}</div>

          {!submitted && (
            <div className="flex justify-between">
              <button 
                onClick={prevStep} 
                type="button" 
                className={`px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition ${currentStep === 1 ? "invisible" : ""}`}
              >
                Previous
              </button>

              {currentStep < 4 ? (
                // Steps 1-3: Show Next button for both regular and custom services
                <button onClick={nextStep} type="button" className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition ${!validateStep(currentStep) ? "opacity-50 pointer-events-none" : ""}`}>
                  Next
                </button>
              ) : currentStep === 4 ? (
                // Step 4: Different buttons for custom vs regular services
                service === "other" ? (
                  // Custom service: Show Confirm Request button
                  <button
                    onClick={handleConfirmCustom}
                    type="button"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Confirm Request"}
                  </button>
                ) : (
                  // Regular service: Show Continue to Payment button
                  <button onClick={nextStep} type="button" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                    Continue to Payment
                  </button>
                )
              ) : (
                // Step 5: Payment step (only for regular services)
                (!hidePayNow && service !== "other" ? (
                  <div>
                    <button
                      type="button"
                      className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                      onClick={handlePay}
                      disabled={!paymentOption || isProcessing}
                    >
                      {isProcessing ? "Processing..." : `Pay Now - R${paymentOption === "full" ? paymentAmounts.full : paymentAmounts.deposit}`}
                    </button>
                  </div>
                ) : (
                  <div />
                ))
              )}
            </div>
          )}

          <CustomServiceModal open={showCustomModal} onClose={() => setShowCustomModal(false)} initial={customService} onSave={handleSaveCustomService} />
        </div>
      </main>
      
      {/* Footer with white background */}
      <div className="bg-white">
        <Footer />
      </div>
    </div>
  );
}