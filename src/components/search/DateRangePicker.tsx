import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Clock, Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ 
  label, 
  placeholder = "Select date", 
  value, 
  onChange,
  minDate,
  className = ""
}) => {
  // State
  const [date, setDate] = useState<Date>(value || new Date());
  const [viewDate, setViewDate] = useState<Date>(value || new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  
  // Refs for click outside
  const calendarRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  // Sync internal state with props
  useEffect(() => {
    if (value) {
      setDate(value);
      // Only update viewDate if the calendar isn't open (to avoid jumping while browsing)
      if (!isCalendarOpen) {
        setViewDate(value);
      }
    }
  }, [value, isCalendarOpen]);

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target as Node)) {
        setIsTimeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helpers
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  // Navigation
  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    setViewDate(newDate);
  };

  // Selection Handlers
  const handleDateSelect = (newDate: Date) => {
    // Preserve current time
    newDate.setHours(date.getHours());
    newDate.setMinutes(date.getMinutes());
    
    setDate(newDate);
    // Don't close immediately, let user hit Save or see selection
    // setIsCalendarOpen(false); 
  };

  const handleTimeSelect = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    
    setDate(newDate);
    setIsTimeOpen(false);
    if (onChange) onChange(newDate);
  };

  const handleSave = () => {
    if (onChange) onChange(date);
    setIsCalendarOpen(false);
  };

  // Generate Time Options (30 min intervals)
  const timeOptions = [];
  for (let i = 0; i < 24 * 2; i++) {
    const h = Math.floor(i / 2);
    const m = (i % 2) * 30;
    const d = new Date();
    d.setHours(h, m);
    timeOptions.push(d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
  }

  // Render Single Month Grid
  const renderMonth = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const monthName = monthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const days = [];
    // Empty slots
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }
    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const isSelected = 
        currentDate.getDate() === date.getDate() && 
        currentDate.getMonth() === date.getMonth() && 
        currentDate.getFullYear() === date.getFullYear();
      
      const isToday = 
        new Date().getDate() === i && 
        new Date().getMonth() === month && 
        new Date().getFullYear() === year;

      const isDisabled = minDate ? currentDate < new Date(minDate.setHours(0,0,0,0)) : false;

      days.push(
        <button
          key={i}
          disabled={isDisabled}
          onClick={() => !isDisabled && handleDateSelect(currentDate)}
          className={`
            h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all relative
            ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
            ${isSelected ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-md z-10' : 'text-gray-700'}
            ${isToday && !isSelected ? 'text-brand-600 font-bold' : ''}
          `}
        >
          {i}
          {isToday && !isSelected && <span className="absolute bottom-1 w-1 h-1 bg-brand-600 rounded-full"></span>}
        </button>
      );
    }

    return (
      <div className="w-full md:w-[320px] p-2">
        <div className="text-center font-bold text-gray-900 mb-4">{monthName}</div>
        <div className="grid grid-cols-7 mb-2">
          {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(d => (
            <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1 justify-items-center">
          {days}
        </div>
      </div>
    );
  };

  const nextMonthDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">{label}</label>}
      
      <div className="flex items-center gap-2">
        {/* Date Trigger */}
        <div className="relative" ref={calendarRef}>
          <button
            onClick={() => { setIsCalendarOpen(!isCalendarOpen); setIsTimeOpen(false); }}
            className={`
              flex items-center justify-between gap-2 min-w-[140px] px-3 py-2.5 bg-transparent hover:bg-gray-100 rounded-xl transition-all duration-200 group
              ${isCalendarOpen ? 'bg-gray-100 text-brand-600' : ''}
            `}
          >
            <span className={`text-sm font-bold truncate ${isCalendarOpen ? 'text-brand-600' : 'text-gray-900'}`}>
              {formatDate(date)}
            </span>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${isCalendarOpen ? 'rotate-180 text-brand-600' : 'group-hover:text-gray-600'}`} />
          </button>

          {/* Dual Calendar Dropdown */}
          {isCalendarOpen && (
            <div className="absolute top-full left-0 md:-left-12 mt-3 p-5 bg-white rounded-3xl shadow-xl shadow-gray-900/10 border border-gray-100 z-[100] w-[340px] md:w-[680px] animate-fade-in">
              {/* Header Tabs */}
              <div className="flex justify-center mb-6">
                 <div className="bg-gray-100 p-1 rounded-xl inline-flex">
                    <button className="px-6 py-1.5 bg-white shadow-sm rounded-lg text-sm font-bold text-gray-900">Dates</button>
                    <button className="px-6 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">Months</button>
                 </div>
              </div>

              {/* Navigation & Calendars */}
              <div className="flex items-start justify-between gap-8 relative">
                 {/* Nav Buttons */}
                 <button onClick={() => changeMonth(-1)} className="absolute left-2 top-2 p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors z-10">
                    <ChevronLeft size={20} />
                 </button>
                 <button onClick={() => changeMonth(1)} className="absolute right-2 top-2 p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors z-10">
                    <ChevronRight size={20} />
                 </button>

                 {/* Dual Month View */}
                 <div className="flex flex-col md:flex-row gap-8 w-full">
                    {renderMonth(viewDate)}
                    <div className="hidden md:block">
                       {renderMonth(nextMonthDate)}
                    </div>
                 </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                 <div className="text-sm">
                    <span className="text-gray-400">Selected: </span>
                    <span className="font-bold text-gray-900">{formatDate(date)}</span>
                 </div>
                 <div className="flex gap-3">
                    <button onClick={() => setIsCalendarOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                       Reset
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-lg shadow-brand-200 transition-all">
                       Save
                    </button>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

        {/* Time Trigger */}
        <div className="relative" ref={timeRef}>
          <button
             onClick={() => { setIsTimeOpen(!isTimeOpen); setIsCalendarOpen(false); }}
             className={`
                flex items-center justify-between gap-2 min-w-[110px] px-3 py-2.5 bg-transparent hover:bg-gray-100 rounded-xl transition-all duration-200 group
                ${isTimeOpen ? 'bg-gray-100 text-brand-600' : ''}
             `}
          >
             <span className={`text-sm font-bold ${isTimeOpen ? 'text-brand-600' : 'text-gray-900'}`}>
                {formatTime(date)}
             </span>
             <ChevronDown size={16} className={`text-gray-400 transition-transform ${isTimeOpen ? 'rotate-180 text-brand-600' : 'group-hover:text-gray-600'}`} />
          </button>

          {/* Time Dropdown */}
          {isTimeOpen && (
             <div className="absolute top-full left-0 mt-2 w-48 max-h-64 overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100 z-[100] py-2 no-scrollbar animate-fade-in">
                {timeOptions.map((time) => (
                   <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`
                         w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors
                         ${formatTime(date) === time ? 'text-brand-600 bg-brand-50' : 'text-gray-700'}
                      `}
                   >
                      {time}
                   </button>
                ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};