import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { FiDownload, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const statusOptions = ["Full Day", "Half Day", "Absent", "Holiday"];
const statusColors = {
  "Full Day": "bg-green-100 text-green-800",
  "Half Day": "bg-yellow-100 text-yellow-800",
  "Absent": "bg-red-100 text-red-800",
  "Holiday": "bg-blue-100 text-blue-800",
  "": "bg-gray-50 text-gray-600"
};

function CalendarPage() {
  const userId = localStorage.getItem("userId");
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [status, setStatus] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`https://attendance-tracker-bktf.onrender.com/api/attendance/${userId}`);
      setAttendance(res.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    
    try {
      const response = await fetch("https://attendance-tracker-bktf.onrender.com/api/attendance/report", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Attendance_Report_${dayjs().format('MMM-YYYY')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Download error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const record = attendance.find(a => a.date === date);
    setStatus(record?.status || "");
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await axios.post("https://attendance-tracker-bktf.onrender.com/api/attendance/mark", {
        userId,
        date: selectedDate,
        status: newStatus,
      });
      fetchAttendance();
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const getDays = () => {
    const days = [];
    const start = currentMonth.startOf("month").startOf("week");
    const end = currentMonth.endOf("month").endOf("week");

    let date = start.clone();
    while (date.isBefore(end, "day")) {
      days.push(date);
      date = date.add(1, "day");
    }
    return days;
  };

  const getStatusForDate = (dateStr) => {
    const record = attendance.find(a => a.date === dateStr);
    return record?.status || "";
  };

  const changeMonth = (months) => {
    setCurrentMonth(currentMonth.add(months, "month"));
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Attendance Calendar
          </h1>
          <button
            onClick={downloadReport}
            disabled={isLoading}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
          >
            <FiDownload className="mr-2" />
            {isLoading ? "Generating..." : "Download PDF Report"}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <button 
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-full hover:bg-indigo-700 transition-colors"
            >
              <FiChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold">
              {currentMonth.format("MMMM YYYY")}
            </h2>
            <button 
              onClick={() => changeMonth(1)}
              className="p-2 rounded-full hover:bg-indigo-700 transition-colors"
            >
              <FiChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="bg-gray-100 p-2 text-center font-semibold text-gray-600">
                {day}
              </div>
            ))}

            {getDays().map(date => {
              const dateStr = date.format("YYYY-MM-DD");
              const status = getStatusForDate(dateStr);
              const isCurrentMonth = date.month() === currentMonth.month();
              const isToday = date.isSame(dayjs(), "day");

              return (
                <div
                  key={dateStr}
                  onClick={() => handleDateClick(dateStr)}
                  className={`min-h-20 p-2 border-b border-r border-gray-200 cursor-pointer transition-all duration-200
                    ${isCurrentMonth ? "bg-white" : "bg-gray-50"}
                    ${isToday ? "ring-2 ring-indigo-400" : ""}
                    ${statusColors[status]}
                    hover:shadow-md hover:z-10 hover:scale-[1.02]`}
                >
                  <div className={`flex justify-between items-start ${!isCurrentMonth ? "opacity-50" : ""}`}>
                    <span className={`text-sm font-medium ${isToday ? "font-bold text-indigo-600" : ""}`}>
                      {date.date()}
                    </span>
                    {isToday && (
                      <span className="text-xs bg-indigo-600 text-white px-1 rounded">Today</span>
                    )}
                  </div>
                  {status && (
                    <div className="mt-1 text-xs font-medium px-1 py-0.5 rounded-full inline-block">
                      {status}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {selectedDate && (
          <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Attendance for {dayjs(selectedDate).format("MMMM D, YYYY")}
            </h3>
            <div className="space-y-4">
              <select
                value={status}
                onChange={handleStatusChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">-- Select Status --</option>
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {status && (
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                    Current status: {status}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarPage;