import React, { useState, useEffect } from 'react';
import { FaHome, FaBoxOpen, FaListAlt, FaShoppingCart, FaMoneyBillWave } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', icon: FaHome, path: '/Dashboard' },
  { name: 'Products', icon: FaBoxOpen, path: '/Dashboard/products' },
  { name: 'Category', icon: FaListAlt, path: '/Dashboard/category' },
  { name: 'Orders', icon: FaShoppingCart, path: '/Dashboard/orders' },
  { name: 'Payments', icon: FaMoneyBillWave, path: '/Dashboard/payments' },
];

const DashboardLeftNav = () => {
  const location = useLocation(); // Hook to get the current route
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    // When the component mounts, set the active item based on the current route
    const currentPath = location.pathname;
    const currentItem = menuItems.find((item) => item.path === currentPath)?.name || 'Dashboard';
    setActiveItem(currentItem);
  }, [location]);

  const handleItemClick = (item) => {
    setActiveItem(item);
    // Save active item in localStorage (optional, for persistence after refresh)
    localStorage.setItem('activeNavItem', item);
  };

  return (
    <div className="dashboard-leftnav-container">
      <ul className="dashboard-leftnav-list">
        {menuItems.map((menuItem) => {
          const Icon = menuItem.icon;
          return (
              <Link to={menuItem.path}>
            <li
              key={menuItem.name}
              className={activeItem === menuItem.name ? 'active' : ''}
              onClick={() => handleItemClick(menuItem.name)}
            >
                <Icon className="nav-icon" />
                <span>{menuItem.name}</span>
            </li>
              </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default DashboardLeftNav;
