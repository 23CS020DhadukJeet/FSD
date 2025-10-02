import React from 'react';
import './MainContent.css';

const MainContent = ({ activeSection, onToggleSidebar, isSidebarOpen }) => {
    const getContent = () => {
        switch (activeSection) {
            case 'Home':
                return {
                    title: 'Welcome to My Website',
                    content: 'This is the main content of the webpage. Here you can find information about our services, latest updates, and much more.'
                };
            case 'About':
                return {
                    title: 'About Us',
                    content: 'Learn more about our company, our mission, and the team behind this amazing website. We are dedicated to providing excellent service.'
                };
            case 'Contact':
                return {
                    title: 'Contact Information',
                    content: 'Get in touch with us through various channels. We would love to hear from you and answer any questions you might have.'
                };
            default:
                return {
                    title: 'Welcome to My Website',
                    content: 'This is the main content of the webpage.'
                };
        }
    };

    const { title, content } = getContent();

    return (
        <main className={`main-content ${isSidebarOpen ? 'main-content--shifted' : ''}`}>
            <header className="main-content__header">
                <button
                    className="main-content__menu-btn"
                    onClick={onToggleSidebar}
                    aria-label="Toggle menu"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
            </header>

            <div className="main-content__body">
                <h1 className="main-content__title">{title}</h1>
                <p className="main-content__text">{content}</p>

                <div className="main-content__features">
                    <div className="feature-card">
                        <h3>Responsive Design</h3>
                        <p>Works perfectly on desktop and mobile devices</p>
                    </div>
                    <div className="feature-card">
                        <h3>Smooth Animations</h3>
                        <p>Beautiful transitions and hover effects</p>
                    </div>
                    <div className="feature-card">
                        <h3>Easy Navigation</h3>
                        <p>Intuitive sidebar menu for quick access</p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MainContent;