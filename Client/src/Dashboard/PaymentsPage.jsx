import React, { useEffect, useState } from 'react';
import '../css/OrderTable.css';
import { FaEye } from 'react-icons/fa';
import Modal from 'react-modal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAdminPaymentHistory, updatePaymentStatus } from '../util/queries';

const PaymentsPage = () => {
  const queryClient = useQueryClient();
  const [payments, setPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortOption, setSortOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    document.title = "Dashboard | Payment"; // Change this title as needed
  }, [])
  // Fetch payment data with loading and error handling
  const { data, isLoading,  isSuccess,isError } = useQuery({
    queryKey: ['paymentHistory'],
    queryFn: getAdminPaymentHistory,
  });

  // Mutation for updating payment status
  const { mutate: changeStatus } = useMutation({
    mutationFn: (payment) => updatePaymentStatus(payment.paymentId, payment),
    onSuccess: () => queryClient.invalidateQueries(["paymentHistory"]),
  });

  // Load data into payments state
  useEffect(() => {
    if (data && isSuccess) {
      console.log("Successfully loaded")
      setPayments(data);
    }
  }, [isSuccess, data]);

  // Filtered and sorted payments based on search, status, and sort criteria
  const filteredPayments = payments
    .filter((payment) => 
      filterStatus === 'All' || payment.status.toLowerCase() === filterStatus.toLowerCase()
    )
    .filter((payment) =>
      payment.stripe_charge_id.toLowerCase().includes(searchTerm.toLowerCase()) || payment.order.toLowerCase().includes(searchTerm.toLowerCase())  
    );

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (sortOption === 'amount') return b.amount - a.amount;
    if (sortOption === 'date') return new Date(b.created_at) - new Date(a.created_at);
    return 0;
  });

  // Modal handlers
  const openModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPayment(null);
    setIsModalOpen(false);
  };

  // Handle payment status change
  const handleStatusChange = (newStatus) => {
    if (selectedPayment) {
      changeStatus({ paymentId: selectedPayment.id, status: newStatus });
      closeModal();
    }
  };

  // Display loading or error messages
  if (isLoading) return <div>Loading...</div>;
  // if (isError) return <div>Error loading payment history.</div>;

  return (
    <div className="order-table-container">
      <h1>Payments</h1>

      {/* Search, Filter, and Sort Options */}
      <div className="filter-sort-options">
        <label>
          Search by Order or Charge ID:
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter Charge or Order ID"
          />
        </label>

        <label>
          Filter by Status:
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </label>

        <label>
          Sort by:
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="">Select</option>
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
        </label>
      </div>

      {/* Payments Table */}
      <table className="order-table">
        <thead>
          <tr>
            <th>Charge ID</th>
            <th>Order ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedPayments?.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.stripe_charge_id || 'N/A'}</td>
              <td>{"#" +String(payment.order).slice(0,5) || 'N/A'}</td>
              <td>{new Date(payment.created_at).toLocaleDateString()}</td>
              <td>{`${payment.currency || 'USD'} ${payment.amount}`}</td>
              <td className={`status-${String(payment.status).toLowerCase()}`}>{payment.status}</td>
              <td title={payment.user.first_name + " "+  payment.user.last_name + " "+ (payment.user.email)}>{payment.user.first_name} {payment.user.last_name} ({String(payment.user.email).slice(0,20)}{String(payment.user.email).length>20?'...':''})</td>
              <td>
                <FaEye className="view-icon" onClick={() => openModal(payment)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Payment Details */}
      {selectedPayment && (
        <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal" overlayClassName="modal-overlay">
          <h3>Payment Details for: {selectedPayment.stripe_charge_id || 'N/A'}</h3>
          <p>Date: {new Date(selectedPayment.created_at).toLocaleDateString()}</p>
          <p>Amount: {`${selectedPayment.currency || 'USD'} ${selectedPayment.amount}`}</p>
          <p>Status: <span className={`status-${String(selectedPayment.status).toLowerCase()}`}>{selectedPayment.status}</span></p>
          <p>Description: {selectedPayment.description || 'No description provided'}</p>
          
          {/* Display user information */}
          <h4>User Information</h4>
          <p>Name: {selectedPayment.user.first_name} {selectedPayment.user.last_name}</p>
          <p>Email: {selectedPayment.user.email}</p>
          
          {/* Status Change Dropdown */}
          <label>
            Update Status:
            <select onChange={(e) => handleStatusChange(e.target.value)} defaultValue={selectedPayment.status}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </label>

          {/* Close Button */}
          <button onClick={closeModal}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default PaymentsPage;
