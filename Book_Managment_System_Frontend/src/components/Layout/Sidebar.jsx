import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="menu-item">
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/books" className={({ isActive }) => isActive ? 'active' : ''}>
              Books
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/authors/new" className={({ isActive }) => isActive ? 'active' : ''}>
              Add Author
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/publishers/new" className={({ isActive }) => isActive ? 'active' : ''}>
              Add Publisher
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;