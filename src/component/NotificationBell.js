import React from 'react';
import { Link } from 'react-router-dom';

const NotificationBell = ({ unreadNotifications }) => {
  return (
    <Link to="/dashboard/notifications" className="flex items-center ml-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-500 hover:text-orange-500 cursor-pointer"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2z"></path>
        <path d="M18 8c0-3.3-2.7-6-6-6S6 4.7 6 8c0 7-3 9-3 9h18s-3-2-3-9z"></path>
      </svg>
      <span className="ml-2">Notifications</span>
      <span className="ml-2 text-orange-500">{unreadNotifications}</span>
    </Link>
  );
};

export default NotificationBell; 