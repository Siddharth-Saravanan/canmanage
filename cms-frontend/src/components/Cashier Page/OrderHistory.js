import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/orders");
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching order history:", error);
        }
    };

    return (
        <div className="order-history-section">
            <h1>Order History</h1>
            <table className="items-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Total Price</th>
                        <th>Date Created</th>
                        <th>Items Ordered</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order.orderId}</td>
                            <td>{order.totalPrice}</td>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                            <td>
                                {order.items.map(item => (
                                    <div key={item._id}>
                                        {item.itemName} - {item.quantity} units
                                    </div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderHistory;
