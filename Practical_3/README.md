# CHARUSAT Welcome Page

A React application that displays a welcome message with real-time date and time updates.

## Features

- Welcome message display
- Real-time date display
- Real-time time display
- Responsive design
- Modern React component structure

## Project Structure

```
Practical_3/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── WelcomeMessage.js
│   │   ├── DateDisplay.js
│   │   ├── TimeDisplay.js
│   │   └── WelcomePage.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── index.css
│   └── reportWebVitals.js
├── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the project files
2. Navigate to the project directory:
   ```bash
   cd Practical_3
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
```

## Components

- **WelcomeMessage**: Displays the welcome message
- **DateDisplay**: Shows the current date
- **TimeDisplay**: Shows the current time with real-time updates
- **WelcomePage**: Main container component that manages state and renders all components

## Technologies Used

- React 18
- React DOM
- Modern JavaScript (ES6+)
- CSS3
- HTML5