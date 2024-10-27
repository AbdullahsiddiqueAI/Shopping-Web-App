import React, { useEffect, useState } from 'react';
import '../css/OrderTable.css';
import { FaEye } from 'react-icons/fa';
import Modal from 'react-modal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { getAdminOrderHistory, orderCancel, updateOrderStatus } from '../util/queries';
import { getAdminOrderHistory, orderCancel, updateOrderStatus } from '../util/queries';

Modal.setAppElement('#root');

const OrdersPage = () => {
  const queryClient = useQueryClient();
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortOption, setSortOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch order data
  const { data, isSuccess } = useQuery({
    queryKey: ['adminOrdersHistory'],
    queryFn: getAdminOrderHistory,
  });

  // Mutation for canceling an order
  const { mutate: cancelOrder } = useMutation({
    mutationKey: ['orderCancel'],
    mutationFn: (id) => orderCancel(id),
    onSuccess: () => queryClient.invalidateQueries(["adminOrdersHistory"]),
  });

  // Mutation for updating order status
  const { mutate: changeStatus } = useMutation({
    mutationFn: (order) => updateOrderStatus(order.orderId, order),
    onSuccess: () => queryClient.invalidateQueries(["adminOrdersHistory"]),
  });

  // Load data into orders state
  useEffect(() => {
    if (data && isSuccess) {
      setOrders(data);
    }
  }, [isSuccess, data]);

  // Filtered and sorted orders based on search, status, and sort criteria
  const filteredOrders = orders
    .filter((order) => 
      filterStatus === 'All' || order.status.toLowerCase() === filterStatus.toLowerCase()
    )
    .filter((order) =>
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortOption === 'amount') return b.total_amount - a.total_amount;
    if (sortOption === 'date') return new Date(b.order_date) - new Date(a.order_date);
    return 0;
  });

  // Modal handlers
  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  // Handle order status change
  const handleStatusChange = (newStatus) => {
    if (selectedOrder) {
      changeStatus({ orderId: selectedOrder.order_id, status: newStatus });
      closeModal();
    }
  };

  return (
    <div className="order-table-container" >
      <h1>Orders</h1>

      {/* Search, Filter, and Sort Options */}
      <div className="filter-sort-options">
        <label>
          Search by Order ID:
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter Order ID"
          />
        </label>

        <label>
          Filter by Status:
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All</option>
            <option value="Placed">Placed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Canceled">Canceled</option>
          </select>
        </label>

        <label>
          Sort by:
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="">Select</option>
            <option value="date">Order Date</option>
            <option value="amount">Total Amount</option>
          </select>
        </label>
      </div>

      {/* Orders Table */}
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order) => (
            <tr key={order.order_id}>
              <td>#{String(order.order_id).slice(0, 5)}</td>
              <td>{new Date(order.order_date).toLocaleDateString()}</td>
              <td>${order.total_amount}</td>
              <td className={`status-${String(order.status).toLowerCase()}`}>{order.status}</td>
              <td>{order.user.first_name} {order.user.last_name} ({order.user.email})</td>
              <td>
                <FaEye className="view-icon" onClick={() => openModal(order)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Order Details */}
      {selectedOrder && (
        <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal" overlayClassName="modal-overlay">
          <h3>Order Details for: # {String(selectedOrder.order_id).slice(0, 6)}</h3>
          <p>Date: {new Date(selectedOrder.order_date).toLocaleDateString()}</p>
          <p>Total Amount: ${selectedOrder.total_amount}</p>
          <p>Status: <span className={`status-${String(selectedOrder.status).toLowerCase()}`}>{selectedOrder.status}</span></p>
          
          {/* Display user information */}
          <h4>User Information</h4>
          <p>Name: {selectedOrder?.user?.first_name} {selectedOrder?.user?.last_name}</p>
          <p>Email: {selectedOrder?.user?.email}</p>
          <p>Address: {selectedOrder?.user?.address || 'N/A'}</p>

          {/* Items in the order */}
          <h4>Items:</h4>
          <ul>
            {selectedOrder.order_items.map((item, index) => (
              <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={`${import.meta.env.VITE_BACKEND_END_POINT_image}${item?.product?.productPic}`} alt="item-image" width={50} height={50} />{item?.product?.name} - {item?.quantity} x ${item?.price}
              </li>
            ))}
          </ul>

          {/* Status Change Dropdown */}
          <label>
            Update Status:
            <select onChange={(e) => handleStatusChange(e.target.value)} defaultValue={selectedOrder.status}>
              <option value="Placed">Placed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
            </select>
          </label>

          {/* Close and Cancel Order Buttons */}
          <button onClick={closeModal}>Close</button>
          <button onClick={() => { cancelOrder(selectedOrder.order_id); closeModal(); }} className='cancel-btn' disabled={selectedOrder.status === 'Canceled'}>Cancel Order</button>
        </Modal>
      )}
    </div>
  );
};

export default OrdersPage;
