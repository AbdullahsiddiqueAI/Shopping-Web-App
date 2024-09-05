import React, { useState } from 'react';
import '../../css/OrderTable.css'; // Assuming CSS is in this file
import { FaTrashAlt } from 'react-icons/fa'; // Import the delete icon

const OrderTable = () => {
  // Fake data to simulate order information
  const [orders, setOrders] = useState([
    {
      order_id: '1e94a8c1-85e2-4b59-85a5-5a5e08544bca',
      order_date: '2023-09-04T15:30:00',
      total_amount: '100.50',
      status: 'Placed',
    },
    {
      order_id: '2a65b0f4-9f7b-4cbe-8a9d-2b5d4376b074',
      order_date: '2023-09-03T10:45:00',
      total_amount: '250.00',
      status: 'Processing',
    },
    {
      order_id: '3f93c60a-6b1f-4f79-a251-1d4bb0e7c7c7',
      order_date: '2023-09-02T13:20:00',
      total_amount: '300.99',
      status: 'Shipped',
    },
    {
      order_id: '4b3422b7-b215-4ec8-b5f7-f7f99e5cb207',
      order_date: '2023-09-01T11:00:00',
      total_amount: '50.00',
      status: 'Delivered',
    },
  ]);

  // Function to delete an order
  const handleDelete = (order_id) => {
    const updatedOrders = orders.filter(order => order.order_id !== order_id);
    setOrders(updatedOrders);
  };

  // Function to dynamically assign a class based on the order status
  const getStatusClass = (status) => {
    switch (status) {
      case 'Placed':
        return 'status-placed';
      case 'Processing':
        return 'status-processing';
      case 'Shipped':
        return 'status-shipped';
      case 'Delivered':
        return 'status-delivered';
      default:
        return '';
    }
  };

  return (
    <div className="order-table-container">
      <h2>Your Orders</h2>
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Action</th> {/* Action column for delete icon */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{new Date(order.order_date).toLocaleDateString()}</td>
              <td>${order.total_amount}</td>
              <td className={getStatusClass(order.status)}>{order.status}</td>
              <td>
                <FaTrashAlt 
                  className="delete-icon"
                  onClick={() => handleDelete(order.order_id)} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
