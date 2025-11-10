# Freelance Portfolio Website

A professional portfolio website with a contact form that sends emails using NodeMailer.

## Features

- Responsive design with clean, simple CSS
- Contact form with validation
- Email sending functionality using NodeMailer
- Success/failure messages
- Real-time form validation
- Professional portfolio sections

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure email settings:**
   - Open `server.js`
   - Replace `your-email@gmail.com` with your actual email address (appears twice)
   - Replace `your-app-password` with your email app password

3. **Gmail Setup (if using Gmail):**
   - Enable 2-factor authentication on your Gmail account
   - Generate an app password: Google Account → Security → App passwords
   - Use the generated app password in the configuration

4. **Run the application:**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Access the website:**
   Open your browser and go to `http://localhost:3000`

## Email Configuration

The application supports various email services. Update the transporter configuration in `server.js`:

### Gmail:
```javascript
service: 'gmail',
auth: {
  user: 'your-email@gmail.com',
  pass: 'your-app-password'
}
```

### Other providers:
```javascript
host: 'smtp.your-provider.com',
port: 587,
secure: false,
auth: {
  user: 'your-email@domain.com',
  pass: 'your-password'
}
```

## Form Validation

The contact form includes both client-side and server-side validation:

- **Name:** Minimum 2 characters
- **Email:** Valid email format
- **Subject:** Minimum 5 characters  
- **Message:** Minimum 10 characters

## Project Structure

```
├── server.js          # Express server and email handling
├── package.json       # Dependencies and scripts
├── .gitignore        # Git ignore file
├── public/
│   ├── index.html    # Main HTML file
│   ├── styles.css    # CSS styles
│   └── script.js     # Client-side JavaScript
└── README.md         # This file
```

## Customization

- Update personal information in `public/index.html`
- Modify styling in `public/styles.css`
- Add your portfolio projects and services
- Replace placeholder content with your actual information

## Security Notes

- Never commit your email credentials to version control
- Use environment variables for production deployment
- Consider using a dedicated email service for production