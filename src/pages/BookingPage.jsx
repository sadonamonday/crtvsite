import React, { useEffect, useState, useMemo } from "react";
import Header from "../components/Header.jsx";
import { CheckCircle, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Footer from "../components/Footer";

// Add this image error handler function
const handleImageError = (e) => {
  console.log('Image failed to load:', e.target.src);
  e.target.style.display = 'none';
  // The parent div will show the gradient background as fallback
};

const steps = [
  { id: 1, name: "Service" },
  { id: 2, name: "Date & Time" },
  { id: 3, name: "Your Details" },
  { id: 4, name: "Review" },
  { id: 5, name: "Payment" },
];

// Service data organized by categories
const serviceCategories = [
  {
    id: "all",
    name: "All Services",
    description: "Browse all our photography and videography services"
  },
  {
    id: "photography",
    name: "Photography",
    description: "Professional photography services for all occasions"
  },
  {
    id: "videography",
    name: "Videography", 
    description: "Cinematic videography and video production services"
  },
  {
    id: "combo",
    name: "Combo (Video + Photo)",
    description: "Best value packages combining both photography and videography"
  },
  {
    id: "custom",
    name: "Custom Request",
    description: "Describe your specific event and any special requirements"
  }
];

const services = [
  // Photography Services
  {
    id: "matric-dance-photo",
    name: "Matric Dance Photography",
    category: "photography",
    price: "R1800",
    description: "Capture the magic of your matric dance with professional photography that preserves every special moment from preparations to the final dance.",
    includes: [
      "Professional photography coverage",
      "Pre-dance preparations shots",
      "Formal portraits",
      "Candid dance floor moments", 
      "100+ professionally edited digital photos",
      "Online gallery for sharing"
    ],
    image: "/Images/services/services/matric-dance.jpg"
  },
  {
    id: "wedding-photo",
    name: "Wedding Photography",
    category: "photography", 
    price: "R8500",
    description: "Beautiful, timeless wedding photography that tells the story of your special day from getting ready to the reception celebrations.",
    includes: [
      "Complete wedding day coverage",
      "Bridal preparations",
      "Ceremony coverage",
      "Family formals",
      "Couple portrait session",
      "Reception highlights",
      "300+ edited digital photos",
      "Online gallery and USB delivery"
    ],
    image: "/Images/services/services/pexels-edwardeyer-1247756.jpg"
  },
  {
    id: "corporate-photo",
    name: "Corporate Events Photography",
    category: "photography",
    price: "R1200/hour",
    description: "Professional corporate event photography for conferences, product launches, team buildings, and company celebrations.",
    includes: [
      "Professional event coverage",
      "Candid networking shots",
      "Speaker and presentation photos",
      "Team and group photos",
      "Brand-consistent editing",
      "Quick turnaround delivery",
      "Digital files with commercial rights"
    ],
    image: "/Images/services/services/pexels-rdne-7648474.jpg"
  },
  {
    id: "birthday-photo",
    name: "Birthday Party Photography",
    category: "photography",
    price: "R1500", 
    description: "Fun and vibrant photography for birthday celebrations, capturing the joy and excitement of your special day.",
    includes: [
      "Professional party coverage",
      "Decor and venue shots",
      "Cake cutting ceremony",
      "Guest interactions",
      "Group photos",
      "60+ edited digital photos",
      "Online gallery"
    ],
    image: "/Images/services/services/birthdayparty.jpg"
  },
  {
    id: "commercial-photo",
    name: "Commercial Photography",
    category: "photography",
    price: "R2500/hour",
    description: "Professional commercial photography for products, fashion, architecture, and business branding needs.",
    includes: [
      "Professional lighting setup",
      "Product styling assistance",
      "Multiple angles and compositions",
      "High-resolution files",
      "Basic retouching included",
      "Commercial usage rights",
      "Quick digital delivery"
    ],
    image: "/Images/services/services/commercialphoto.jpg"
  },
  {
    id: "fashion-photo",
    name: "Fashion Show Photography",
    category: "photography",
    price: "R2000/hour",
    description: "Dynamic runway and backstage photography capturing the energy and artistry of fashion events.",
    includes: [
      "Runway coverage",
      "Backstage moments",
      "Designer collections",
      "Model portraits",
      "Backstage preparations",
      "Fast editing turnaround",
      "Digital delivery within 48 hours"
    ],
    image: "/Images/services/services/fashion show.webp"
  },
  {
    id: "personal-single-photo",
    name: "Personal Photo Shoot - Single",
    category: "photography",
    price: "R1200",
    description: "Professional portrait session for individuals, perfect for professional headshots, social media, or personal keepsakes.",
    includes: [
      "Professional portrait session",
      "Multiple outfit changes",
      "Different locations/backgrounds",
      "Professional posing guidance",
      "25 edited digital photos",
      "Online gallery",
      "Print release"
    ],
    image: "/Images/services/services/personalphoto.jpg"
  },
  {
    id: "personal-family-photo",
    name: "Personal Photo Shoot - Family",
    category: "photography",
    price: "R1800", 
    description: "Beautiful family portraits capturing the love and connection between family members in natural, relaxed settings.",
    includes: [
      "Family portrait session",
      "Multiple family groupings",
      "Candid and posed shots",
      "Location of your choice",
      "40+ edited digital photos", 
      "Online gallery",
      "Print release"
    ],
    image: "/Images/services/services/familyphoto.webp"
  },

  // Videography Services
  {
    id: "matric-dance-video",
    name: "Matric Dance Videography",
    category: "videography",
    price: "R2200",
    description: "Cinematic video coverage of your matric dance, from preparations to dance floor celebrations, edited into a beautiful highlight film.",
    includes: [
      "Professional video coverage",
      "Multiple camera angles",
      "Pre-dance preparations",
      "Formal moments",
      "Dance floor energy",
      "3-5 minute highlight film",
      "Full ceremony recording",
      "Digital delivery"
    ],
    image: "/Images/services/services/matricdancevideo.jpeg"
  },
  {
    id: "wedding-video",
    name: "Wedding Videography",
    category: "videography",
    price: "R9500", 
    description: "Emotional and cinematic wedding video that captures the story, emotions, and beauty of your wedding day.",
    includes: [
      "Complete wedding coverage",
      "Multiple videographers",
      "Ceremony full recording",
      "Reception highlights",
      "5-7 minute cinematic film",
      "Full ceremony edit",
      "Drone footage (if applicable)",
      "Digital delivery"
    ],
    image: "/Images/services/services/weddingvideo.jpg"
  },
  {
    id: "corporate-video",
    name: "Corporate Event Videography",
    category: "videography",
    price: "R1500/hour",
    description: "Professional event videography for corporate functions, conferences, and business events with polished editing.",
    includes: [
      "Professional video coverage",
      "Multiple camera setup",
      "Speaker recordings",
      "B-roll of event activities",
      "3-5 minute event highlight video",
      "Full presentations recording",
      "Branded graphics and titles"
    ],
    image: "/Images/services/services/corporatevideo.webp"
  },
  {
    id: "birthday-video",
    name: "Birthday Party Videography",
    category: "videography",
    price: "R1800",
    description: "Fun and energetic video coverage of birthday celebrations, capturing the excitement and special moments.",
    includes: [
      "Party video coverage",
      "Key moments coverage",
      "Guest messages/interviews",
      "Cake cutting ceremony",
      "2-3 minute highlight video",
      "Fun editing with music",
      "Digital delivery"
    ],
    image: "/Images/services/services/birthdaypartyvideo.webp"
  },
  {
    id: "commercial-video",
    name: "Commercial Videography",
    category: "videography", 
    price: "R3000/hour",
    description: "Professional commercial video production for advertisements, brand content, and marketing materials.",
    includes: [
      "Professional camera equipment",
      "Lighting and sound setup",
      "Script development support",
      "Multiple takes and angles",
      "Professional editing",
      "Color grading",
      "Motion graphics (basic)",
      "Commercial usage rights"
    ],
    image: "/Images/services/services/commercialvideo.jpg"
  },
  {
    id: "fashion-video",
    name: "Fashion Show Videography",
    category: "videography",
    price: "R2500/hour",
    description: "Dynamic fashion show videography capturing the movement, energy, and artistry of runway presentations.",
    includes: [
      "Multiple camera angles",
      "Runway coverage",
      "Backstage access",
      "Designer interviews",
      "3-5 minute highlight reel",
      "Slow motion sequences",
      "Music synchronization"
    ],
    image: "/Images/services/services/fashionshowvideo.jpg"
  },
  {
    id: "music-video",
    name: "Music Video DJI Osmo(Visualizer)",
    category: "videography",
    price: "R5000",
    description: "Music Video Curated and directed by CRTV Shots",
    includes: [
      "Professional video coverage",
      "Multiple camera angles",
      "Pre-dance preparations",
      "Formal moments",
      "Fun energy moments",
      "3-5 minute highlight film",
      "Full music video recording with additional clips",
      "Digital delivery"
    ],
    image: "/Images/services/services/musicvideophoto.jpg"
  },
  {
    id: "reel-video",
    name: "Music Video Reels(DJI Osmo)",
    category: "videography",
    price: "R3500",
    description: "Cinematic video coverage of your music video, from preparations to behind the scence clips, edited into a beautiful highlight film.",
    includes: [
      "Professional video coverage",
      "Multiple camera angles",
      "behind the scenes clips",
      "Formal moments",
      "Dance floor energy",
      "3-5 minute highlight film",
      "Digital delivery"
    ],
    image: "/Images/services/services/highlightreel.webp"
  },
  {
    id: "music-video-editing",
    name: "Music Video Editing",
    category: "videography",
    price: "R3000",
    description: "Your music video files edited into a beautiful professional cinamatic music video curated by CRTV Shots.  ",
    includes: [
      "Professional video editing",
      "B-Roll footage",
      "Video Filters",
      "Syncing videos",
      "Dance floor energy",
      "Digital delivery"
    ],
    image: "/Images/services/services/musicvideoediting.jpg"
  },
  {
  id: "color-grading",
  name: "Professional Color Grading",
  category: "videography", 
  price: "R3000",
  description: "Transform your footage with cinematic color grading that evokes emotion, establishes mood, and gives your video a professional, polished look. Our expert colorists use advanced techniques to enhance your visuals and create a consistent, beautiful color palette throughout your project.",
  includes: [
    "Primary color correction for exposure and balance",
    "Creative color grading with cinematic LUTs",
    "Skin tone correction and enhancement",
    "Scene-to-scene color consistency",
    "Mood and atmosphere enhancement",
    "Professional film emulation looks",
    "Final export in your preferred format",
    "Unlimited revisions until perfect"
  ],
  image: "Images/services/services/colourgrading.jpg"
},

  // Combo Services (Photography + Videography)
  {
    id: "matric-dance-combo",
    name: "Matric Dance Combo",
    category: "combo",
    price: "R3500",
    description: "Complete coverage package with both photography and videography to capture every angle of your matric dance.",
    includes: [
      "Combined photo and video coverage",
      "Photographer + Videographer",
      "100+ edited photos",
      "3-5 minute highlight video",
      "Full ceremony recording",
      "Online gallery for photos",
      "Digital delivery of all files",
      "15% savings vs booking separately"
    ],
    image: "/Images/services/services/matricdancecombo.jpg"
  },
  {
    id: "wedding-combo",
    name: "Wedding Combo Package",
    category: "combo",
    price: "R15000",
    description: "The ultimate wedding coverage with both stunning photography and cinematic videography.",
    includes: [
      "Photographer + 2 Videographers",
      "Complete wedding day coverage",
      "300+ edited photos",
      "5-7 minute cinematic film",
      "Full ceremony recording",
      "Engagement session included",
      "Premium photo album",
      "USB delivery in presentation box",
      "20% savings vs separate booking"
    ],
    image: "/Images/services/services/weddingcombo.webp"
  },
  {
    id: "corporate-combo",
    name: "Corporate Event Combo",
    category: "combo",
    price: "R2200/hour",
    description: "Complete corporate event coverage with both photography and videography for comprehensive marketing materials.",
    includes: [
      "Photographer + Videographer",
      "Professional event coverage",
      "Still photos and video footage",
      "Event highlight video (3-5 min)",
      "Full presentation recordings",
      "Brand-consistent editing",
      "Commercial usage rights",
      "Quick turnaround delivery"
    ],
    image: "/Images/services/services/corporatecombo.jpg"
  },
  {
  id: "music-video-combo",
  name: "Complete Music Video Package",
  category: "combo",
  price: "R12,500",
  description: "All-in-one music video production package that covers everything from concept to final delivery. We handle the entire creative process - shooting your performance with multiple cinematic angles, capturing authentic behind-the-scenes moments, professional editing with rhythm-perfect cuts, and finishing with Hollywood-grade color grading that makes your video stand out.",
  includes: [
    "Full music video shoot (4-6 hours) with multiple camera setups",
    "Cinematic 4K video recording with professional audio sync",
    "Professional color grading for cinematic visual style",
    "Rhythm-perfect editing matched to your music's beat",
    "Behind-the-scenes photography (50+ edited photos)",
    "Behind-the-scenes video footage and mini-documentary",
    "1-2 minute social media highlight reel",
    "Full 3-5 minute music video master",
    "Multiple location setups and scene changes",
    "Basic lighting and professional audio recording support",
    "Lyric video version for social media",
    "All raw footage and photos delivered",
    "3 revision rounds for perfect results"
  ],
  image: "Images/services/services/musicvideocombo.jpg"
}
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
          className="p-2 rounded transition-colors hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-semibold">
          {monthName} {year}
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm py-1">
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
                ${isSelected ? 'bg-green-600 text-white' : 'hover:bg-gray-100'}
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

const TimeDropdownSelector = ({ selectedTime, onTimeSelect }) => {
  const timeOptions = generateTimeOptions();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (selectedTime) {
      const [start, end] = selectedTime.split('-');
      setStartTime(start || "");
      setEndTime(end || "");
    }
  }, [selectedTime]);

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
    
    if (endTime && newStartTime >= endTime) {
      setEndTime("");
    }
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const getEndTimeOptions = () => {
    if (!startTime) return timeOptions;
    return timeOptions.filter(time => time > startTime);
  };

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
          <label className="block text-sm font-medium mb-2">Start Time</label>
          <select
            value={startTime}
            onChange={handleStartTimeChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:border-black-500 focus:ring-2 focus:ring-black-200 transition"
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
          <label className="block text-sm font-medium mb-2">End Time</label>
          <select
            value={endTime}
            onChange={handleEndTimeChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:border-black-500 focus:ring-2 focus:ring-black-200 transition"
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
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-center">
            <div className="text-lg font-semibold">
              {formatTimeForDisplay(startTime)} - {formatTimeForDisplay(endTime)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Duration: {getDuration()}
            </div>
          </div>
        </div>
      )}

      {!startTime && (
        <p className="text-sm text-gray-400 text-center">
          Please select a start time first
        </p>
      )}
    </div>
  );
};

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

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [service, setService] = useState("");
  const [expandedService, setExpandedService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [details, setDetails] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    address: "", 
    notes: "" 
  });
  const [customService, setCustomService] = useState({ title: "", description: "", budget: "" });
  const [paymentOption, setPaymentOption] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const servicePricing = {
    // Photography
    "matric-dance-photo": { name: "Matric Dance Photography", price: 1800, type: "fixed" },
    "wedding-photo": { name: "Wedding Photography", price: 8500, type: "fixed" },
    "corporate-photo": { name: "Corporate Events Photography", price: 1200, type: "hourly" },
    "birthday-photo": { name: "Birthday Party Photography", price: 1500, type: "fixed" },
    "commercial-photo": { name: "Commercial Photography", price: 2500, type: "hourly" },
    "fashion-photo": { name: "Fashion Show Photography", price: 2000, type: "hourly" },
    "personal-single-photo": { name: "Personal Photo Shoot - Single", price: 1200, type: "fixed" },
    "personal-family-photo": { name: "Personal Photo Shoot - Family", price: 1800, type: "fixed" },

    
    // Videography
    "matric-dance-video": { name: "Matric Dance Videography", price: 2200, type: "fixed" },
    "wedding-video": { name: "Wedding Videography", price: 9500, type: "fixed" },
    "corporate-video": { name: "Corporate Event Videography", price: 1500, type: "hourly" },
    "birthday-video": { name: "Birthday Party Videography", price: 1800, type: "fixed" },
    "commercial-video": { name: "Commercial Videography", price: 3000, type: "hourly" },
    "fashion-video": { name: "Fashion Show Videography", price: 2500, type: "hourly" },
    "music-video": { name: "Music Video DJI Osmo(Visualizer)", price: 5000, type: "fixed" }, 
    "reel-video": { name: "Music Video Reels(DJI Osmo)", price: 3500, type: "fixed" },
    "music-video-editing": { name: "Music Video Editing", price: 3000, type: "fixed" },
    "color-grading": { name: "Professional Color Grading", price: 3000, type: "fixed" }, 
    
    // Combo
    "matric-dance-combo": { name: "Matric Dance Combo", price: 3500, type: "fixed" },
    "wedding-combo": { name: "Wedding Combo Package", price: 15000, type: "fixed" },
    "corporate-combo": { name: "Corporate Event Combo", price: 2200, type: "hourly" },
    "music-video-combo": { name: "Complete Music Video Package", price: 12500, type: "fixed" }
  };

  // Filter services based on active category
  const filteredServices = useMemo(() => {
    if (activeCategory === "all") return services;
    return services.filter(service => service.category === activeCategory);
  }, [activeCategory]);

  const parseBudgetNumber = (txt) => {
    if (!txt) return 0;
    const m = txt.replace(/[, ]/g, "").match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  };

  const paymentAmounts = useMemo(() => {
    if (service === "other") {
      const customPrice = parseBudgetNumber(customService.budget);
      return { full: customPrice || 0, deposit: Math.round((customPrice || 0) * 0.5) };
    }
    const info = servicePricing[service];
    if (!info) return { full: 0, deposit: 0 };
    const full = info.type === "hourly" ? info.price * 2 : info.price;
    return { full, deposit: Math.round(full * 0.5) };
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
    setActiveCategory("all");
  };

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
  };

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
    
    if (currentStep === 4 && service === "other") {
      handleConfirmCustom();
      return;
    }
    
    setCurrentStep((p) => Math.min(p + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep((p) => Math.max(p - 1, 1));
  };

  const handlePay = async () => {
    if (!validateStep(5)) {
      alert('Please select a payment option (Full Payment or Deposit)');
      return;
    }
    
    setIsProcessing(true);
    
    const bookingData = {
      service: service,
      customer_name: details.name,
      customer_email: details.email,
      customer_phone: details.phone || '',
      customer_address: details.address || '',
      amount: paymentAmounts[paymentOption] || 0,
      item_name: getServiceDisplayName(),
      item_description: `${getServiceDisplayName()} - ${date} ${time} - ${paymentOption === 'full' ? 'Full Payment' : '50% Deposit'}`
    };
    
    try {
      const response = await fetch('https://crtvshots.atwebpages.com/form_booking.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });
      
      const responseText = await response.text();
      
      if (response.ok) {
        const result = JSON.parse(responseText);
        
        if (result.success && result.redirectUrl) {
          window.location.href = result.redirectUrl;
        } else {
          alert('Invalid response from server: ' + JSON.stringify(result));
          setIsProcessing(false);
        }
      } else {
        alert('Payment processing failed: ' + responseText.substring(0, 200));
        setIsProcessing(false);
      }
    } catch (error) {
      alert('Network error: ' + error.message);
      setIsProcessing(false);
    }
  };

  const handleConfirmCustom = async () => {
  setIsProcessing(true);
  
  const bookingData = {
    service: "other",
    customer_name: details.name,
    customer_email: details.email,
    customer_phone: details.phone || '',
    customer_address: details.address || '',
    amount: parseBudgetNumber(customService.budget) || 1,
    item_name: customService.title || 'Custom Service',
    item_description: `${customService.title} - ${customService.description} - Custom Service Request`
  };
  
  try {
    const response = await fetch('https://crtvshots.atwebpages.com/form_booking.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });
    
    const responseText = await response.text();
    
    if (response.ok) {
      const result = JSON.parse(responseText);
      
      if (result.success && result.redirectUrl) {
        // Show confirmation message before redirecting
        alert('Your custom service request has been submitted successfully! We will contact you shortly to discuss the details.');
        window.location.href = result.redirectUrl;
      } else {
        alert('Invalid response from server: ' + JSON.stringify(result));
        setIsProcessing(false);
      }
    } else {
      alert('Custom service submission failed: ' + responseText.substring(0, 200));
      setIsProcessing(false);
    }
  } catch (error) {
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
         <div className="relative w-full max-w-xl mx-4 bg-white rounded-lg p-6 shadow-lg border border-gray-200">
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
                 className="w-full p-2 rounded bg-white border"
                 placeholder="e.g., Corporate Event Videography"
               />
             </div>
             <div>
               <label className="block text-sm mb-1">Description *</label>
               <textarea
                 required
                 value={form.description}
                 onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                 className="w-full p-2 rounded bg-white border min-h-28"
                 placeholder="Describe what you need, duration, locations, deliverables..."
               />
             </div>
             <div>
               <label className="block text-sm mb-1">Budget (optional)</label>
               <input
                 value={form.budget}
                 onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
                 className="w-full p-2 rounded bg-white border"
                 placeholder="e.g., R3000"
               />
             </div>
             <div className="flex justify-end gap-3">
               <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">
                 Cancel
               </button>
               <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white">
                 Save & Use
               </button>
             </div>
           </form>
         </div>
       </div>
     );
   };

  const renderCustomRequestForm = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Tell Us About Your Event</h3>
        <p className="text-green-600">
          Describe your specific event requirements and any special needs. We'll create a custom package just for you.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block font-medium">Event Type *</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
            placeholder="e.g., Corporate Gala, Private Birthday, Product Launch, etc."
            value={customService.title}
            onChange={(e) => handleCustomServiceChange("title", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block font-medium">Event Description & Requirements *</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg min-h-32 bg-white"
            placeholder="Please describe your event in detail, including:
• Number of guests
• Specific shots or coverage needed
• Special equipment requirements
• Any unique aspects of your event
• Timeline and key moments to capture"
            value={customService.description}
            onChange={(e) => handleCustomServiceChange("description", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block font-medium">Preferred Service Type</label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
            onChange={(e) => {
              if (e.target.value) {
                setService(e.target.value);
                setExpandedService(e.target.value);
              }
            }}
          >
            <option value="">Select if you have a preference</option>
            <option value="photography">Photography Only</option>
            <option value="videography">Videography Only</option>
            <option value="combo">Both Photography & Videography</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block font-medium">Budget Estimate (Optional)</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
            placeholder="e.g., R5000"
            value={customService.budget}
            onChange={(e) => handleCustomServiceChange("budget", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button 
          type="button" 
          className="px-6 py-3 border border-gray-600 text-gray-600 rounded-lg hover:bg-gray-600 hover:text-white transition"
          onClick={() => setActiveCategory("all")}
        >
          ← Back to Services
        </button>
        <button
          type="button"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          onClick={() => {
            setService("other");
            nextStep();
          }}
          disabled={!customService.title.trim() || !customService.description.trim()}
        >
          Continue to Date & Time
        </button>
      </div>
    </div>
  );

  const renderServiceGrid = () => (
    <div className="space-y-6">
      {/* Category Tabs - Centered */}
      <div className="border-b border-gray-200">
        <nav className="flex justify-center space-x-8 overflow-x-auto">
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeCategory === category.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Category Description - Green Background */}
      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <p className="text-green-800 text-center">
          {serviceCategories.find(cat => cat.id === activeCategory)?.description}
        </p>
      </div>

      {/* Custom Request Form */}
      {activeCategory === "custom" ? (
        renderCustomRequestForm()
      ) : (
        /* Services Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServices.map((s) => {
            const isExpanded = expandedService === s.id;
            return (
              <div
                key={s.id}
                className={`flex flex-col border rounded-lg overflow-hidden transition-all duration-200 ${
                  isExpanded ? "border-green-500 shadow-lg" : "border-gray-300 hover:shadow-md"
                }`}
              >
                {/* Service Image */}
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                   <img 
                     src={s.image} 
                     alt={s.name}
                     className="w-full h-full object-cover"
                     onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-lg">{s.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                     <span className="font-semibold text-green-300">{s.price}</span>
                     <span className="text-sm bg-black/50 px-2 py-1 rounded">Flexible Duration</span>
                   </div>
                 </div>
                  </div>

                {/* Service Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-gray-600 text-sm mb-4 flex-1">{s.description}</p>
                  
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleServiceClick(s.id)}
                      className="w-full text-left flex items-center justify-between text-green-600 hover:text-green-700 font-medium"
                    >
                      <span>View Details</span>
                      <ChevronRight 
                        size={16} 
                        className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="space-y-4 pt-4 border-t border-gray-200">
                        {/* What's Included */}
                        <div>
                          <h4 className="font-semibold text-sm mb-2">What's Included:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {s.includes.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Select Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setService(s.id);
                            setCurrentStep(2);
                          }}
                          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition"
                        >
                          Select & Continue
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
           <div className="space-y-6">
             <h2 className="text-2xl font-bold text-center">
               {service === "other" ? "Describe Your Custom Service Request" : "Choose Your Service"}
             </h2>
 
             {service === "other" ? (
               renderCustomRequestForm()
             ) : (
               renderServiceGrid()
             )}
           </div>
         );

      // ... rest of the steps remain the same
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
                />
              </div>

              <div>
                <label className="block mb-4 font-medium">Select Time</label>
                <TimeDropdownSelector 
                  selectedTime={time} 
                  onTimeSelect={setTime} 
                />
                <p className="mt-2 text-sm text-gray-400">
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
                 <input type="text" name="name" className="w-full p-2 border rounded bg-white" value={details.name} onChange={handleInputChange} required />
               </div>
               <div className="space-y-2">
                 <label className="block">Email *</label>
                 <input type="email" name="email" className="w-full p-2 border rounded bg-white" value={details.email} onChange={handleInputChange} required />
               </div>
               <div className="space-y-2">
                 <label className="block">Phone</label>
                 <input type="tel" name="phone" className="w-full p-2 border rounded bg-white" value={details.phone} onChange={handleInputChange} />
               </div>
               <div className="sm:col-span-2 space-y-2">
                 <label className="block">Address</label>
                 <textarea 
                   name="address" 
                   className="w-full p-2 border rounded min-h-20 bg-white" 
                   value={details.address} 
                   onChange={handleInputChange} 
                   placeholder="Enter your full address for service delivery or event location"
                 />
               </div>
               <div className="sm:col-span-2 space-y-2">
                 <label className="block">Additional Notes</label>
                 <textarea name="notes" className="w-full p-2 border rounded min-h-24 bg-white" value={details.notes} onChange={handleInputChange} placeholder={service === "other" ? "Any additional information about your custom request..." : "Any special requirements or questions..."} />
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
                    <div className="bg-green-50 rounded p-3">
                      <div>
                        <strong>Event Type:</strong> {customService.title || "Not specified"}
                      </div>
                      <div>
                        <strong>Description:</strong> {customService.description || "Not specified"}
                      </div>
                      {customService.budget && (
                        <div>
                          <strong>Budget:</strong> <span className="text-green-600">{customService.budget}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-green-50 rounded p-3">{servicePricing[service]?.name || service}</div>
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
              {details.address && (
                <div>
                  <span className="font-medium">Address:</span>
                  <div className="mt-1 bg-gray-50 rounded p-3">{details.address}</div>
                </div>
              )}
              {details.notes && (
                <div>
                  <span className="font-medium">Additional Notes:</span>
                  <div className="mt-1 bg-gray-50 rounded p-3">{details.notes}</div>
                </div>
              )}
            </div>

            {service === "other" && (
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
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
                  <div className="flex justify-between text-lg font-semibold mt-4 pt-4 border-t border-gray-300">
                    <span>Total Amount:</span>
                    <span className="text-green-600">R{paymentAmounts.full}</span>
                  </div>
                )}
                {service === "other" && customService.budget && (
                  <div className="flex justify-between text-lg font-semibold mt-4 pt-4 border-t border-gray-300">
                    <span>Estimated Budget:</span>
                    <span className="text-green-600">{customService.budget}</span>
                  </div>
                )}
              </div>
            </div>

            {service === "other" ? (
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <p className="font-medium">Custom service — no online payment here.</p>
                <p className="text-sm mt-1">We will contact you to agree final details and payment terms.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentOption("full")}
                    className={`border-2 rounded-lg p-6 text-left transition ${paymentOption === "full" ? "border-green-500 bg-green-50" : "border-green-300 hover:border-green-400"}`}
                  >
                    <h4 className="text-lg font-semibold mb-2">Pay Full Amount</h4>
                    <div className="text-2xl font-bold text-green-600 mb-2">R{paymentAmounts.full || "TBD"}</div>
                    <p className="text-gray-600 text-sm">Secure your booking with full payment</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentOption("deposit")}
                    className={`border-2 rounded-lg p-6 text-left transition ${paymentOption === "deposit" ? "border-green-500 bg-green-50" : "border-green-300 hover:border-green-400"}`}
                  >
                    <h4 className="text-lg font-semibold mb-2">Pay 50% Deposit</h4>
                    <div className="text-2xl font-bold text-green-600 mb-2">R{paymentAmounts.deposit || "TBD"}</div>
                    <p className="text-gray-600 text-sm">Pay half now, balance due before service</p>
                  </button>
                </div>

                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold mb-2">Payment Information</h4>
                  <p className="text-gray-600 text-sm">
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
    <div className="bg-white flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2 text-center">Book Services</h1>
          <p className="text-red-600 text-center mb-10">Capture your special moments ONE SHOT AT A TIME</p>

          <div className="mb-8">
            <div className="flex justify-between bg-white rounded-lg p-3 border border-gray-300">
               {steps
                 .filter((s) => !(s.id === 5 && service === "other"))
                 .map((step) => {
                   const completed = step.id < currentStep;
                   const active = step.id === currentStep;
                   return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          active ? "border-green-500 bg-green-600 text-white" : "border-gray-400 bg-white text-gray-600"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle size={18} className="text-green-600" />
                        ) : (
                          <span className={active ? "text-white" : "text-gray-600"}>{step.id}</span>
                        )}
                      </div>
                      <span className={`text-sm mt-1 text-gray-600`}>{step.name}</span>
                     </div>
                   );
                 })}
             </div>
           </div>
 
          <div className="bg-white rounded-lg p-6 mb-8 border border-gray-300">{renderStep()}</div>

          <div className="flex justify-between">
            <button 
              onClick={prevStep} 
              type="button" 
              className={`px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition ${currentStep === 1 ? "invisible" : ""}`}
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button onClick={nextStep} type="button" className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition ${!validateStep(currentStep) ? "opacity-50 pointer-events-none" : ""}`}>
                Next
              </button>
            ) : currentStep === 4 ? (
              service === "other" ? (
                <button
                  onClick={handleConfirmCustom}
                  type="button"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Confirm Request"}
                </button>
              ) : (
                <button onClick={nextStep} type="button" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                  Continue to Payment
                </button>
              )
            ) : (
              service !== "other" && (
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
              )
            )}
          </div>

          <CustomServiceModal open={showCustomModal} onClose={() => setShowCustomModal(false)} initial={customService} onSave={handleSaveCustomService} />
        </div>
      </main>
      
      <div className="bg-white">
        <Footer />
      </div>
    </div>
  );
}