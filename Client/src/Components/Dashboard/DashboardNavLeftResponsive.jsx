import React, { useState, useEffect } from 'react';
import { FaHome, FaBoxOpen, FaListAlt, FaShoppingCart, FaMoneyBillWave, FaBars } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', icon: FaHome, path: '/Dashboard' },
  { name: 'Products', icon: FaBoxOpen, path: '/Dashboard/products' },
  { name: 'Category', icon: FaListAlt, path: '/Dashboard/category' },
  { name: 'Orders', icon: FaShoppingCart, path: '/Dashboard/orders' },
  { name: 'Payments', icon: FaMoneyBillWave, path: '/Dashboard/payments' },
];

const DashboardNavLeftResponsive = ({ isMenuOpen,toggleMenu }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find((item) => item.path === currentPath)?.name || 'Dashboard';
    setActiveItem(currentItem);
  }, [location]);

  const handleItemClick = (item) => {
    setActiveItem(item);
    localStorage.setItem('activeNavItem', item);
  };

  return (
    <div className="res-dashboard-leftnav-container">
      {/* Hamburger button */}
      

      {/* Left navigation list */}
      <ul className={`res-dashboard-leftnav-list`}>
        {menuItems.map((menuItem) => {
          const Icon = menuItem.icon;
          return (
            <Link to={menuItem.path} key={menuItem.name} onClick={toggleMenu}>
              <li
                className={activeItem === menuItem.name ? 'active' : ''}
                onClick={() => handleItemClick(menuItem.name)}
              >
                <Icon className="res-nav-icon" />
                <span>{menuItem.name}</span>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default DashboardNavLeftResponsive;
