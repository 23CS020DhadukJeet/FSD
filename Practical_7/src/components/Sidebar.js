import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isOpen, activeSection, onNavigate, onToggle }) => {
    const navigationItems = [
        { name: 'Home', icon: '🏠' },
        { name: 'About', icon: '👤' },
        { name: 'Contact', icon: '📧' }
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

            <div className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
                <div className="sidebar__header">
                    <button
                        className="sidebar__toggle"
                        onClick={onToggle}
                        aria-label="Toggle sidebar"
                    >
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>
                </div>

                <nav className="sidebar__nav">
                    {navigationItems.map((item) => (
                        <button
                            key={item.name}
                            className={`sidebar__nav-item ${activeSection === item.name ? 'sidebar__nav-item--active' : ''
                                }`}
                            onClick={() => onNavigate(item.name)}
                        >
                            <span className="sidebar__nav-icon">{item.icon}</span>
                            <span className="sidebar__nav-text">{item.name}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;