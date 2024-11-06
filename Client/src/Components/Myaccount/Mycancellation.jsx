import React, { useEffect, useState } from 'react';
import '../../css/OrderTable.css'; // Assuming CSS is in this file
import { FaTrashAlt, FaEye } from 'react-icons/fa';
import Modal from 'react-modal'; // Install this via npm if not already installed
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrderCancelHistory, orderCancel } from '../../util/queries';
// Initializing Modal root element (for accessibility)
Modal.setAppElement('#root');

const Mycancellation = () => {
  const queryClient=useQueryClient();
  // Fake data to simulate order information
  const [orders, setOrders] = useState([
    // {
    //   order_id: '1e94a8c1-85e2-4b59-85a5-5a5e08544bca',
    //   order_date: '2023-09-04T15:30:00',
    //   total_amount: '100.50',
    //   status: 'Placed',
    //   items: [
    //     { name: 'Product A', quantity: 2, price: '25.00' },
    //     { name: 'Product B', quantity: 1, price: '50.50' }
    //   ]
    // },
    // {
    //   order_id: '2a65b0f4-9f7b-4cbe-8a9d-2b5d4376b074',
    //   order_date: '2023-09-03T10:45:00',
    //   total_amount: '250.00',
    //   status: 'Processing',
    //   items: [
    //     { name: 'Product C', quantity: 3, price: '83.33' }
    //   ]
    // },
    // Add more order objects here if needed
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortOption, setSortOption] = useState('');
  const {data,isLoading,isSuccess}=useQuery({
    queryKey: ['ordersHistory'],
    queryFn: getOrderCancelHistory,
   
  })
  const {mutate,isLoading:orderCancelLoading,isSuccess:orderCancelSuccess}=useMutation({
    mutationKey: ['orderCancel'],
    mutationFn: (id)=>orderCancel(id),
   
  })
  useEffect(()=>{
    if(data && isSuccess){
      setOrders(data)
    }

  },[isSuccess,data])
  useEffect(()=>{
    if(orderCancelSuccess){
      queryClient.invalidateQueries(["ordersHistory"])
    }

  },[orderCancelSuccess])


  // Sort orders based on selected option
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortOption === 'amount') return b.total_amount - a.total_amount;
    if (sortOption === 'date') return new Date(b.order_date) - new Date(a.order_date);
    return 0;
  });

  const openModal = (order) => {
    console.log("order",order)
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  // const handleDelete = (order_id) => {
  //   const updatedOrders = orders.filter(order => order.order_id !== order_id);
  //   setOrders(updatedOrders);
  // };

  // const updateStatus = (order_id, newStatus) => {
  //   const updatedOrders = orders.map(order =>
  //     order.order_id === order_id ? { ...order, status: newStatus } : order
  //   );
  //   setOrders(updatedOrders);
  // };

  return (
    <div className="order-table-container">
      <h2>Your Orders</h2>

      {/* Filter and Sort Options */}
      <div className="filter-sort-options">
        {/* <label>
          Filter by Status:
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All</option>
            <option value="Placed">Placed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </label> */}
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order) => (
            <tr key={order.order_id}>
              <td>#{String(order.order_id).slice(0,5)}</td>
              <td>{new Date(order.order_date).toLocaleDateString()}</td>
              <td>${order.total_amount}</td>
              <td className={`status-${String(order.status).toLowerCase()}`}>{order.status}</td>
              <td>
                <FaEye className="view-icon" onClick={() => openModal(order)} /> {/* View Details */}
                {/* <FaTrashAlt className="delete-icon" onClick={() => handleDelete(order.order_id)} /> Delete */}
                {/* Update Status Dropdown */}
                {/* <select onChange={(e) => updateStatus(order.order_id, e.target.value)}>
                  <option>Change Status</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Order Details */}
      {selectedOrder && (
        <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal" overlayClassName="modal-overlay">
          <h3>Order Details for: # {String(selectedOrder.order_id).slice(0,6)}</h3>
          <p>Date: {new Date(selectedOrder.order_date).toLocaleDateString()}</p>
          <p>Total Amount: ${selectedOrder.total_amount}</p>
          <p >Status: <span className={`status-${String(selectedOrder.status).toLowerCase()}`}>{selectedOrder.status}</span></p>
          <h4>Items:</h4>
          <ul>
            {selectedOrder.order_items.map((item, index) => (
              <li key={index} style={{display:'flex',alignItems:'center' ,gap:'1rem'}}>
                <img src={`${import.meta.env.VITE_BACKEND_END_POINT_image}${item?.product?.productPic}`} alt="item-image" width={50} height={50} />{item?.product?.name} - {item?.quantity} x ${item?.price}
              </li>
            ))}
          </ul>
          <button onClick={closeModal}>Close</button>
          <button onClick={()=>{mutate(selectedOrder.order_id);closeModal(); }} className='cancel-btn' disabled={selectedOrder.status=='Canceled'}>Cancel</button>
        </Modal>
      )}
    </div>
  );
};

export default Mycancellation;
