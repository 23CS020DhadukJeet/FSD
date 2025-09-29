import React, { useState, useEffect } from 'react';
import WelcomeMessage from './WelcomeMessage';
import DateDisplay from './DateDisplay';
import TimeDisplay from './TimeDisplay';

const WelcomePage = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="welcome-container">
            <WelcomeMessage />
            <DateDisplay currentTime={currentTime} />
            <TimeDisplay currentTime={currentTime} />
        </div>
    );
};

export default WelcomePage;