import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(7);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleReset = () => {
    setCount(0);
  };

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  const handleIncrementFive = () => {
    setCount(count + 5);
  };

  return (
    <div className="App">
      <div className="counter-container">
        <h1>Count: {count}</h1>
        
        <div className="button-group">
          <button onClick={handleReset}>Reset</button>
          <button onClick={handleIncrement}>Increment</button>
          <button onClick={handleDecrement}>Decrement</button>
          <button onClick={handleIncrementFive}>Increment 5</button>
        </div>

        <h2>Welcome to CHARUSAT!!!</h2>

        <div className="input-group">
          <div className="input-field">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          
          <div className="input-field">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="display-names">
          <p>First Name: {firstName}</p>
          <p>Last Name: {lastName}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
