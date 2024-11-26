import React, { useEffect, useState } from 'react';
import '../css/Dashboard/DashboardPage.css';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashboardPage = () => {
  const { token } = useSelector((state) => state.auth);
  const toastId = 'dashboardToast';
  // State for stats and recent orders
  const [totalSales, setTotalSales] = useState('0');
  const [totalOrders, setTotalOrders] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  
  useEffect(() => {
    const socket = new WebSocket(`${import.meta.env.VITE_BACKEND_WS_END_POINT}ws/DashboardStats/?token=${token}`);

   
    socket.onopen = () => {
      toast.dismiss()
      toast.success('Connected to server!');
    };

   
    socket.onclose = () => {
  
    };

    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("received",data)
      setTotalSales(String(data.total_sales));
      setTotalOrders(data.total_orders);
      setNewUsers(data.new_users);
      setTotalProducts(data.total_products);
      setRecentOrders(data.recent_orders);
      toast.dismiss()
      toast.info('Dashboard data updated.');
    };

    return () => {
      socket.close(); // Cleanup on component unmount
    };
  }, [token]);
  return (
    <div className="dashboard-page">
     
      <h1>Dashboard</h1>

      {/* Statistics Cards */}
      <div className="dashboard-stats">
        <div className="stats-card">
          <h3>Total Sales</h3>
          <p>${totalSales}</p>
        </div>
        <div className="stats-card">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>
        <div className="stats-card">
          <h3>New Users</h3>
          <p>{newUsers}</p>
        </div>
        <div className="stats-card">
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="dashboard-recent-activity">
        <h2>Recent Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.order_id}>
                <td>{"#"+String(order.order_id).slice(0,5)}</td>
                <td>{order.user_id}</td>
                <td>${order.total_amount}</td>
                <td className={`status-${String(order.status).toLowerCase()}`}>{order.status}</td>
                <td>{order.order_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
