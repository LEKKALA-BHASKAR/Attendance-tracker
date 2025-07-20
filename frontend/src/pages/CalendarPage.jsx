import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";

const statusOptions = ["Full Day", "Half Day", "Absent", "Holiday"];

function CalendarPage() {
  const userId = localStorage.getItem("userId");
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [status, setStatus] = useState("");
  const [attendance, setAttendance] = useState([]);

  const fetchAttendance = async () => {
    const res = await axios.get(`https://attendance-tracker-bktf.onrender.com/api/attendance/${userId}`);
    setAttendance(res.data);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const record = attendance.find(a => a.date === date);
    setStatus(record?.status || "");
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    await axios.post("https://attendance-tracker-bktf.onrender.com/api/attendance/mark", {
      userId,
      date: selectedDate,
      status: newStatus,
    });
    fetchAttendance();
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

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Attendance Calendar</h1>

      <div className="grid grid-cols-7 gap-2 bg-white p-4 rounded shadow-md">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="text-center font-semibold">{day}</div>
        ))}

        {getDays().map(date => {
          const dateStr = date.format("YYYY-MM-DD");
          const status = getStatusForDate(dateStr);
          return (
            <div
              key={dateStr}
              onClick={() => handleDateClick(dateStr)}
              className={`h-20 p-2 text-sm border rounded cursor-pointer hover:bg-blue-100 
                ${date.month() !== currentMonth.month() ? "text-gray-400" : ""}
                ${status === "Full Day" ? "bg-green-200" :
                  status === "Half Day" ? "bg-yellow-200" :
                  status === "Absent" ? "bg-red-200" :
                  status === "Holiday" ? "bg-blue-200" : ""}`}
            >
              <div>{date.date()}</div>
              <div className="text-xs">{status}</div>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-6 bg-white p-4 rounded shadow-md w-full max-w-md mx-auto">
          <h3 className="text-xl font-bold mb-2">Mark Attendance for {selectedDate}</h3>
          <select
            value={status}
            onChange={handleStatusChange}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select --</option>
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
