import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Cashier Page/Home';
import CreateOrder from './Cashier Page/CreateOrder';
import OrderHistory from './Cashier Page/OrderHistory';
import './CashierPage.css';

const Cashier = () => {
    const [isPaneOpen, setIsPaneOpen] = useState(true);  // Default left pane expanded

    const togglePane = () => {
        setIsPaneOpen(!isPaneOpen);  // Toggle between collapsed and expanded state
    };

    return (
        <div className="cashier-container">
            {/* Left Pane */}
            <div className={`left-pane ${isPaneOpen ? '' : 'collapsed'}`}>
                <button className="hamburger" onClick={togglePane}>☰</button>
                <ul>
                    <li><Link to="/cashier/home">Home</Link></li>
                    <li><Link to="/cashier/order-history">Order History</Link></li>
                    <li><Link to="/cashier/create-order">Create Order</Link></li>
                </ul>
            </div>

            {/* Main Content with fixed header */}
            <div className="main-content">
                <div className="headers">
                    <div className="left-section1">
                        <span className="logo">CanManage</span>
                    </div>
                    <div className="right-section1">
                        <span className="organization-name">Organization</span>
                        <span className="dot">•</span>
                        <span className="admin-name">Cashier</span>
                        <span className="dot">•</span>
                        <button className="profile-icon1">C</button>
                    </div>
                </div>

                {/* Routes for page content */}
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/create-order" element={<CreateOrder />} />
                    <Route path="/order-history" element={<OrderHistory />} />
                </Routes>
            </div>
        </div>
    );
};

export default Cashier;



