import React, { useState, useEffect, useRef } from "react";
import "./AdminPage.css";
import { useAuth } from './AuthContext';
import { useNavigate, Routes, Route} from 'react-router-dom';
import axios from 'axios';

import UserManagement from './Admin Page/UserManagement';
import InventoryManagement from './Admin Page/InventoryManagement';
import FeedbackSupport from './Admin Page/FeedbackSupport';
import OrderHistory from './Admin Page/OrderHistory';
import StaffAttendance from './Admin Page/StaffAttendance';
import ReportsAnalytics from "./Admin Page/ReportsAnalytics";

const Admin = () => {
  const navigate = useNavigate();
  const [isPaneOpen, setIsPaneOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState("/admin");
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const togglePane = () => {
    setIsPaneOpen(!isPaneOpen);
  };

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  const handleNavigation = (path) => {
    setSelectedPage(path); // Set the selected page
    navigate(path); // Navigate to the selected path
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false); // Close the dropdown
      }
    };

    // Use "click" instead of "mousedown"
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        // if (!token) {
        //   navigate('/');
        //   return;
        // }

        console.log('token:',token);
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setUserData(response.data); // Assuming you have a state like setUserData
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);
  
  console.log(userData);
  return (
    <div className="whole">
      <div className="header">
        <div className="left-section">
          <span className="logo">CanManage</span>
        </div>
        <div className="right-section">
          <span className="organization-name">{userData?.organization.organizationName || 'Organization'}</span>
          <span className="dot">•</span>
          <span className="admin-name">{userData?.user.firstName || 'Admin'}</span>
          <span className="dot">•</span>
          <button 
          className="profile-icon" 
          onClick={(event) => {
            event.stopPropagation();  // Stop event propagation
            setShowDropdown(!showDropdown);  // Toggle dropdown visibility
          }}>
            {userData?.user.firstName?.charAt(0) || 'S'}
          </button>

          {showDropdown && (
            <div className="profile-dropdown" ref={dropdownRef} onClick={toggleDropdown}>
              <button onClick={() => handleNavigation("/admin/profile")}>View Profile</button>
              <button onClick={() => handleNavigation("/admin/edit-profile")}>Edit Profile</button>
              <button onClick={() => handleNavigation("/admin/change-password")}>Change Password</button>
              <button onClick={handleLogout}>Logout</button> {/* Assume logout redirects to login */}
            </div>
          )}
        </div>
      </div>
      <div className={`leftpane ${isPaneOpen ? '' : 'collapsed'}`}>
        <button className="hamburger" onClick={togglePane}>
          ☰
        </button>
        
        <div className="menu-items">
          <button 
          className={`btn home ${selectedPage === "/admin" ? "selected" : ""}`}
          onClick={() => handleNavigation("/admin")}> {/* Add Home Button */}
            <i className="fas fa-home"></i>
            {isPaneOpen && <span className="text">HOME</span>}
          </button>

          <button 
          className={`btn user ${selectedPage === "/admin/user-management" ? "selected" : ""}`}
          onClick={() => handleNavigation("/admin/user-management")}>
            <i className="fas fa-user"></i>
            {isPaneOpen && <span className="text">User Management</span>}
          </button>

          <button className={`btn invent ${selectedPage === "/admin/inventory-mgmt" ? "selected" : ""}`}
          onClick={() => handleNavigation("/admin/inventory-mgmt")}>
            <i className="fas fa-boxes"></i>
            <span className="text">Inventory Management</span>
          </button>

          <button className={`btn feed ${selectedPage === "/admin/feedback-and-support" ? "selected" : ""}`}
          onClick={() => handleNavigation("/admin/feedback-and-support")}>
            <i className="fas fa-comments"></i> 
            <span className="text">Feedback & Support</span>
          </button>

          <button className={`btn order ${selectedPage === "/admin/order-history" ? "selected" : ""}`}
          onClick={() => handleNavigation("/admin/order-history")}>
            <i className="fas fa-history"></i>
            <span className="text">Order History</span>
          </button>

          <button className={`btn attendance ${selectedPage === "/admin/staff-attendance" ? "selected" : ""}`}
          onClick={() => handleNavigation("/admin/staff-attendance")}>
            <i className="fas fa-calendar-check"></i>
            <span className="text">Staff Attendance Management</span>
          </button>

          <button className={`btn reports ${selectedPage === "/admin/reports-analytics" ? "selected" : ""}`}
          onClick={() => handleNavigation("/admin/reports-analytics")}>
            <i className="fas fa-chart-line"></i> 
            <span className="text">Reports & Analytics</span>
          </button>
        </div>
      </div>

      <div className="mainpane">
      
        
        <Routes>
          <Route 
            path="/" 
            element={
              <div>
                  <div className="welcome">
                    <div className="greet">Good Morning</div>
                    <div className="name">{userData?.user.firstName || 'User'}</div>
                  </div>

                  <div className="dashboard">
                    Dashboard
                  </div>
              </div>
            } />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/inventory-mgmt" element={<InventoryManagement />} />
          <Route path="/feedback-and-support" element={<FeedbackSupport />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/staff-attendance" element={<StaffAttendance />} />
          <Route path="/reports-analytics" element={<ReportsAnalytics />} />
        </Routes>

        
      </div>
    </div>
    
  );
};

export default Admin;

