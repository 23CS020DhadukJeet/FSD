import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './App.css';

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('Home');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleNavigation = (section) => {
        setActiveSection(section);
        setIsSidebarOpen(false); // Close sidebar on mobile after selection
    };

    return (
        <div className="app">
            <Sidebar
                isOpen={isSidebarOpen}
                activeSection={activeSection}
                onNavigate={handleNavigation}
                onToggle={toggleSidebar}
            />
            <MainContent
                activeSection={activeSection}
                onToggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
            />
        </div>
    );
}

export default App;