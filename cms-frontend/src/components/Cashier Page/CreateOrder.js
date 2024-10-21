import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateOrder = () => {
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [totalPrice, setTotalPrice] = useState(0);  // New field to track total price

    useEffect(() => {
        fetchItems();
    }, [searchTerm, filterCategory]);

    const fetchItems = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/items?search=${searchTerm}&category=${filterCategory}`);
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const handleAddItem = (item) => {
        setSelectedItems((prevItems) => {
            const existingItem = prevItems.find((i) => i._id === item._id);
            if (existingItem) {
                return prevItems.map((i) =>
                    i._id === item._id ? { ...i, quantity: i.quantity + 1, total: i.price * (i.quantity + 1) } : i
                );
            }
            return [...prevItems, { ...item, quantity: 1, total: item.price }];
        });
        calculateTotalPrice();
    };

    const handleIncreaseQuantity = (itemId) => {
        setSelectedItems((prevItems) =>
            prevItems.map((item) =>
                item._id === itemId ? { ...item, quantity: item.quantity + 1, total: item.price * (item.quantity + 1) } : item
            )
        );
        calculateTotalPrice();
    };

    const handleDecreaseQuantity = (itemId) => {
        setSelectedItems((prevItems) =>
            prevItems.map((item) =>
                item._id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1, total: item.price * (item.quantity - 1) } : item
            )
        );
        calculateTotalPrice();
    };

    const handleRemoveItem = (itemId) => {
        setSelectedItems((prevItems) =>
            prevItems.filter((item) => item._id !== itemId)
        );
        calculateTotalPrice();
    };

    const calculateTotalPrice = () => {
        const total = selectedItems.reduce((acc, item) => acc + item.total, 0);
        setTotalPrice(total);
    };

    const handleSubmitOrder = async () => {
        try {
            const newOrder = {
                items: selectedItems,
                totalPrice
            };
            await axios.post("http://localhost:5000/api/orders", newOrder);
            alert("Order created successfully");
            setSelectedItems([]);  // Reset after submission
            setTotalPrice(0);
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };

    return (
        <div>
            <h1>Create Order</h1>

            <div className="search-filter">
                <input
                    type="text"
                    placeholder="Search by Item Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="All">All Categories</option>
                    <option value="Food">Food</option>
                    <option value="Beverage">Beverage</option>
                </select>
            </div>

            <div className="create-order-section">
                {/* Available Items Table */}
                <div className="items-table" style={{ flex: 0.6 }}>
                    <h3>Available Items</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Availability</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.itemName}</td>
                                    <td>{item.category}</td>
                                    <td>{item.price}</td>
                                    <td>{item.availability ? "Available" : "Unavailable"}</td>
                                    <td>
                                        <button onClick={() => handleAddItem(item)}>Add to Order</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Order Summary Section */}
                <div className="order-summary" style={{ flex: 0.4 }}>
                    <h3>Order Summary</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedItems.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.itemName}</td>
                                    <td>{item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.total}</td>
                                    <td>
                                        <button onClick={() => handleIncreaseQuantity(item._id)}>+</button>
                                        <button onClick={() => handleDecreaseQuantity(item._id)}>-</button>
                                        <button onClick={() => handleRemoveItem(item._id)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="total-price">
                        <h3>Total Price: {totalPrice} Rupees</h3>
                    </div>

                    <button className="submit-btn" onClick={handleSubmitOrder}>Submit Order</button>
                </div>
            </div>
        </div>
    );
};

export default CreateOrder;
