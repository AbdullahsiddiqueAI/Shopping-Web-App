import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../css/Dashboard/DashboardPage.css';

// Register the necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  // Data for the line chart (Sales Trend)
  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sales ($)',
        data: [12000, 15000, 10000, 22000, 18000, 24000],
        backgroundColor: 'rgba(63, 81, 181, 0.2)',
        borderColor: '#3f51b5',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  // Data for the bar chart (Orders Trend)
  const barChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Orders',
        data: [45, 60, 40, 80, 70, 90],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>

      {/* Statistics Cards */}
      <div className="dashboard-stats">
        <div className="stats-card">
          <h3>Total Sales</h3>
          <p>$25,000</p>
        </div>
        <div className="stats-card">
          <h3>Total Orders</h3>
          <p>350</p>
        </div>
        <div className="stats-card">
          <h3>New Users</h3>
          <p>45</p>
        </div>
        <div className="stats-card">
          <h3>Total Products</h3>
          <p>1,200</p>
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
            <tr>
              <td>#12345</td>
              <td>John Doe</td>
              <td>$150</td>
              <td>Shipped</td>
              <td>Oct 12, 2024</td>
            </tr>
            <tr>
              <td>#12346</td>
              <td>Jane Smith</td>
              <td>$200</td>
              <td>Processing</td>
              <td>Oct 13, 2024</td>
            </tr>
            <tr>
              <td>#12347</td>
              <td>Mike Johnson</td>
              <td>$75</td>
              <td>Delivered</td>
              <td>Oct 13, 2024</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Charts Section */}
      <div className="dashboard-charts">
        <h2>Sales Trend</h2>
        <Line data={lineChartData} />

        {/* <h2>Orders Trend</h2>
        <Bar data={barChartData} /> */}
      </div>
    </div>
  );
};

export default DashboardPage;
