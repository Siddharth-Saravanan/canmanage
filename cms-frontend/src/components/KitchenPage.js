// import React, { useState, useEffect, useRef } from "react";
// import { useAuth } from './AuthContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './KitchenPage.css';  // Importing the updated CSS

// const Kitchen = () => {
//     const navigate = useNavigate();
//     const [isPaneOpen, setIsPaneOpen] = useState(false);  // For collapsing/expanding left pane
//     const [selectedPage, setSelectedPage] = useState("/home");  // Default selected page

//     const [userData, setUserData] = useState({
//         user: { firstName: "Admin" },
//         organization: { organizationName: "Organization" }
//     });

//     const { logout } = useAuth();
//     const [items, setItems] = useState([]);
//     const [newItem, setNewItem] = useState({
//         itemName: '',
//         category: 'Food',
//         price: '',
//         stock: '',
//         timeSlot: 'Morning',
//     });

//     const [showDropdown, setShowDropdown] = useState(false);
//     const dropdownRef = useRef(null);

//     const handleLogout = () => {
//         logout();
//         navigate('/');
//     };

//     const toggleDropdown = (event) => {
//         event.stopPropagation();
//         setShowDropdown((prev) => !prev);
//     };

//     const handleNavigation = (path) => {
//         setSelectedPage(path);  // Set the selected page
//         navigate(path);  // Navigate to the selected path
//     };

//     // Collapse/Expand Left Pane
//     const togglePane = () => {
//         setIsPaneOpen(!isPaneOpen);
//     };

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (showDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setShowDropdown(false);  // Close the dropdown if clicked outside
//             }
//         };
//         document.addEventListener("click", handleClickOutside);

//         return () => {
//             document.removeEventListener("click", handleClickOutside);
//         };
//     }, [showDropdown]);

//     useEffect(() => {
//         fetchItems();
//     }, []);

//     const fetchItems = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/api/items');
//             setItems(response.data);
//         } catch (error) {
//             console.error('Error fetching items:', error);
//         }
//     };

//     const handleInputChange = (e) => {
//         setNewItem({ ...newItem, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post('http://localhost:5000/api/items', newItem);
//             fetchItems();  // Refresh items
//             setNewItem({ itemName: '', category: 'Food', price: '', stock: '', timeSlot: 'Morning' });
//         } catch (error) {
//             console.error('Error adding item:', error);
//         }
//     };

//     return (
//         <div className="kitchen-container">
//             {/* Left Pane */}
//             <div className={`left-pane ${isPaneOpen ? '' : 'collapsed'}`}>
//                 <button className="hamburger" onClick={togglePane}>
//                     ☰
//                 </button>
//                 <ul>
//                     <li
//                         className={selectedPage === '/home' ? 'selected' : ''}
//                         onClick={() => handleNavigation('/home')}
//                     >
//                         Home
//                     </li>
//                     <li
//                         className={selectedPage === '/order-status' ? 'selected' : ''}
//                         onClick={() => handleNavigation('/order-status')}
//                     >
//                         Order Status
//                     </li>
//                 </ul>
//             </div>

//             {/* Main Content */}
//             <div className="main-content">
//                 {/* Top User Info Header */}
//                 <div className="headers">
//                     <div className="left-section1">
//                         <span className="logo">CanManage</span>
//                     </div>
//                     <div className="right-section1">
//                         <span className="organization-name">{userData?.organization.organizationName}</span>
//                         <span className="dot">•</span>
//                         <span className="admin-name">{userData?.user.firstName}</span>
//                         <span className="dot">•</span>
//                         <button
//                             className="profile-icon1"
//                             onClick={(event) => {
//                                 event.stopPropagation();
//                                 setShowDropdown(!showDropdown);
//                             }}>
//                             {userData?.user.firstName?.charAt(0) || 'S'}
//                         </button>

//                         {showDropdown && (
//                             <div className="profile-dropdown1" ref={dropdownRef} onClick={toggleDropdown}>
//                                 <button onClick={() => handleNavigation("/admin/profile")}>View Profile</button>
//                                 <button onClick={() => handleNavigation("/admin/edit-profile")}>Edit Profile</button>
//                                 <button onClick={() => handleNavigation("/admin/change-password")}>Change Password</button>
//                                 <button onClick={handleLogout}>Logout</button>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Form and Menu Table Divisions */}
//                 <div className="form-section">
//                     <h2>Kitchen Staff Dashboard</h2>

//                     <form onSubmit={handleSubmit} className="item-form">
//                         <input
//                             type="text"
//                             name="itemName"
//                             value={newItem.itemName}
//                             onChange={handleInputChange}
//                             placeholder="Item Name"
//                             required
//                             className="form-input"
//                         />
//                         <select name="category" value={newItem.category} onChange={handleInputChange} className="form-select">
//                             <option value="Food">Food</option>
//                             <option value="Beverage">Beverage</option>
//                         </select>
//                         <input
//                             type="number"
//                             name="price"
//                             value={newItem.price}
//                             onChange={handleInputChange}
//                             placeholder="Price"
//                             required
//                             className="form-input"
//                         />
//                         <input
//                             type="number"
//                             name="stock"
//                             value={newItem.stock}
//                             onChange={handleInputChange}
//                             placeholder="Stock"
//                             required
//                             className="form-input"
//                         />
//                         <select name="timeSlot" value={newItem.timeSlot} onChange={handleInputChange} className="form-select">
//                             <option value="Morning">Morning</option>
//                             <option value="Noon">Noon</option>
//                             <option value="Evening">Evening</option>
//                             <option value="Night">Night</option>
//                             <option value="Any">Any</option>
//                         </select>
//                         <button type="submit" className="submit-btn">Add Item</button>
//                     </form>
//                 </div>

//                 <div className="table-section">
//                     <h3>Current Menu</h3>
//                     <table className="items-table">
//                         <thead>
//                             <tr>
//                                 <th>Item Name</th>
//                                 <th>Category</th>
//                                 <th>Price</th>
//                                 <th>Stock</th>
//                                 <th>Time Slot</th>
//                                 <th>Availability</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {items.map((item) => (
//                                 <tr key={item._id}>
//                                     <td>{item.itemName}</td>
//                                     <td>{item.category}</td>
//                                     <td>{item.price}</td>
//                                     <td>{item.stock}</td>
//                                     <td>{item.timeSlot}</td>
//                                     <td>{item.availability ? 'Available' : 'Unavailable'}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Kitchen;

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './KitchenPage.css';  // Importing the updated CSS

const Kitchen = () => {
    const navigate = useNavigate();
    const [isPaneOpen, setIsPaneOpen] = useState(true);  // Default expanded left pane
    const [selectedPage, setSelectedPage] = useState("/home");

    const [userData, setUserData] = useState({
        user: { firstName: "Rohit" },
        organization: { organizationName: "Amrita Vishwa Vidyapeetham" }
    });

    const { logout } = useAuth();
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({
        itemName: '',
        category: 'Food',
        price: '',
        stock: '',
        timeSlot: 'Morning',
    });

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleDropdown = (event) => {
        event.stopPropagation();
        setShowDropdown((prev) => !prev);
    };

    const handleNavigation = (path) => {
        setSelectedPage(path);
        navigate(path);
    };

    // Collapse/Expand Left Pane
    const togglePane = () => {
        setIsPaneOpen(!isPaneOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [showDropdown]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/items');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleInputChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const handleStockChange = async (e, id) => {
        const updatedStock = e.target.value;
        try {
            await axios.put(`http://localhost:5000/api/items/${id}`, { stock: updatedStock });
            fetchItems();
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/items/${id}`);
            fetchItems();  // Refresh the item list after deletion
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/items', newItem);
            fetchItems();
            setNewItem({ itemName: '', category: 'Food', price: '', stock: '', timeSlot: 'Morning' });
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    return (
        <div className="kitchen-container">
            {/* Left Pane */}
            <div className={`left-pane ${isPaneOpen ? '' : 'collapsed'}`}>
                <button className="hamburger" onClick={togglePane}>
                    ☰
                </button>
                <ul>
                    <li
                        className={selectedPage === '/home' ? 'selected' : ''}
                        onClick={() => handleNavigation('/home')}
                    >
                        Home
                    </li>
                    <li
                        className={selectedPage === '/order-status' ? 'selected' : ''}
                        onClick={() => handleNavigation('/order-status')}
                    >
                        Order Status
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Top User Info Header */}
                <div className="headers">
                    <div className="left-section1">
                        <span className="logo">CanManage</span>
                    </div>
                    <div className="right-section1">
                        <span className="organization-name">{userData?.organization.organizationName}</span>
                        <span className="dot">•</span>
                        <span className="admin-name">{userData?.user.firstName}</span>
                        <span className="dot">•</span>
                        <button
                            className="profile-icon1"
                            onClick={(event) => {
                                event.stopPropagation();
                                setShowDropdown(!showDropdown);
                            }}>
                            {userData?.user.firstName?.charAt(0) || 'S'}
                        </button>

                        {showDropdown && (
                            <div className="profile-dropdown1" ref={dropdownRef} onClick={toggleDropdown}>
                                <button onClick={() => handleNavigation("/admin/profile")}>View Profile</button>
                                <button onClick={() => handleNavigation("/admin/edit-profile")}>Edit Profile</button>
                                <button onClick={() => handleNavigation("/admin/change-password")}>Change Password</button>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="greeting-section">
                    <h1>
                        Good Morning <br />
                        {userData.user.firstName}
                    </h1>
                </div>

                {/* Form and Menu Table Divisions */}
                <div className="content-container">
                    <div className="form-section">
                        <h3>Add New Item</h3>
                        <form onSubmit={handleSubmit} className="item-form">
                            <input
                                type="text"
                                name="itemName"
                                value={newItem.itemName}
                                onChange={handleInputChange}
                                placeholder="Item Name"
                                required
                                className="form-input"
                            />
                            <select name="category" value={newItem.category} onChange={handleInputChange} className="form-select">
                                <option value="Food">Food</option>
                                <option value="Snack">Snack</option>
                                <option value="Beverage">Beverage</option>
                                <option value="Fresh Juice">Fresh Juice</option>
                            </select>
                            <input
                                type="number"
                                name="price"
                                value={newItem.price}
                                onChange={handleInputChange}
                                placeholder="Price"
                                required
                                className="form-input"
                            />
                            <input
                                type="number"
                                name="stock"
                                value={newItem.stock}
                                onChange={handleInputChange}
                                placeholder="Stock"
                                required
                                className="form-input"
                            />
                            <select name="timeSlot" value={newItem.timeSlot} onChange={handleInputChange} className="form-select">
                                <option value="Morning">Morning</option>
                                <option value="Noon">Noon</option>
                                <option value="Evening">Evening</option>
                                <option value="Night">Night</option>
                                <option value="Any">Any</option>
                            </select>
                            <button type="submit" className="submit-btn">Add Item</button>
                        </form>
                    </div>

                    <div className="table-section">
                        <h3>Current Menu</h3>
                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock (Editable)</th>
                                    <th>Time Slot</th>
                                    <th>Availability</th>
                                    <th>Actions</th> {/* New column for delete button */}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.itemName}</td>
                                        <td>{item.category}</td>
                                        <td>{item.price}</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.stock}
                                                onChange={(e) => handleStockChange(e, item._id)}
                                                className="form-input"
                                            />
                                        </td>
                                        <td>{item.timeSlot}</td>
                                        <td>{item.availability ? 'Available' : 'Unavailable'}</td>
                                        <td>
                                            <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Kitchen;


