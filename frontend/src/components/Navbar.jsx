import { Link } from "react-router-dom";
import { useEffect } from "react";

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex gap-4">
      <Link to="/calendar">Calendar</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/login" onClick={() => localStorage.clear()}>Logout</Link>
    </nav>
  );
}
export default Navbar;
