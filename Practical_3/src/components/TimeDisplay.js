import React from 'react';

const TimeDisplay = ({ currentTime }) => {
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="time">
            It is {formatTime(currentTime)}
        </div>
    );
};

export default TimeDisplay;