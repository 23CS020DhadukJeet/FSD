import React from 'react';

const DateDisplay = ({ currentTime }) => {
    const formatDate = (date) => {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    return (
        <div className="date-time">
            It is {formatDate(currentTime)}
        </div>
    );
};

export default DateDisplay;