import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const userId = localStorage.getItem("userId");
  const [summary, setSummary] = useState({
    fullDays: 0,
    halfDays: 0,
    absentDays: 0,
    holidays: 0,
    totalMarked: 0,
    percentage: 0,
  });

  const calculateSummary = (data) => {
    let full = 0, half = 0, absent = 0, holiday = 0;

    data.forEach(rec => {
      if (rec.status === "Full Day") full++;
      else if (rec.status === "Half Day") half++;
      else if (rec.status === "Absent") absent++;
      else if (rec.status === "Holiday") holiday++;
    });

    const presentEquivalent = full + (half * 0.5);
    const workingDays = full + half + absent;

    const percentage = workingDays === 0 ? 0 : (presentEquivalent / workingDays) * 100;

    setSummary({
      fullDays: full,
      halfDays: half,
      absentDays: absent,
      holidays: holiday,
      totalMarked: data.length,
      percentage: percentage.toFixed(2),
    });
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      const res = await axios.get(`https://attendance-tracker-bktf.onrender.com/api/attendance/${userId}`);
      calculateSummary(res.data);
    };
    fetchAttendance();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold text-green-600">Full Days</h2>
          <p className="text-3xl">{summary.fullDays}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold text-yellow-600">Half Days</h2>
          <p className="text-3xl">{summary.halfDays}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold text-red-600">Absent</h2>
          <p className="text-3xl">{summary.absentDays}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold text-blue-600">Holidays</h2>
          <p className="text-3xl">{summary.holidays}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center col-span-2 md:col-span-1">
          <h2 className="text-xl font-semibold">Total Days Marked</h2>
          <p className="text-3xl">{summary.totalMarked}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center col-span-2">
          <h2 className="text-xl font-semibold">Attendance %</h2>
          <p className="text-4xl font-bold">{summary.percentage}%</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
