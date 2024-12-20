# Budget Management System Frontend

This README provides a comprehensive overview of the Budget Management System's frontend application. The UI is built with React, Material-UI (MUI) as the component library, React Router for navigation, and Chart.js for data visualization. It interacts with a backend API to manage budgets, expenses, user authentication, and more.

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Authentication Flow](#authentication-flow)
- [Pages and Components](#pages-and-components)
- [Charts and Visualization](#charts-and-visualization)
- [Theme and Styles](#theme-and-styles)
- [Active Link Indication](#active-link-indication)
- [Footer Positioning](#footer-positioning)
- [Search Functionality](#search-functionality)
- [Additional Notes](#additional-notes)

## Overview
The frontend of this Budget Management System provides a user-friendly interface for:
- Creating and managing budgets
- Tracking expenses
- Viewing dashboards and charts for financial insights
- Managing user profiles and viewing other users
- Registering and logging in securely

The UI dynamically adapts to user authentication states, displays charts with adjustable styles depending on light/dark mode, and integrates a responsive navbar and footer layout.

## Key Features
- **Light/Dark Mode**: Toggle between light and dark themes.
- **Protected Routes**: Some pages (e.g., profile, budgets, expenses) are protected and require authentication.
- **Dynamic Navbar**: The navbar updates based on the user's login state and shows/hides certain links. Active links are highlighted (with a bottom border on desktop and a color change on mobile).
- **Responsive Design**: The UI is fully responsive, adapting navigation elements and layouts for mobile and desktop.
- **Charts**: Budget and expense data are visualized using Chart.js with MUI styling and dynamic text colors in dark mode.
- **Search**: Expenses can be searched using a dedicated search endpoint, with results displayed in tables and charts.
- **Modals for CRUD Operations**: Add and edit budgets/expenses directly from modals.

## Project Structure
```
frontend/
├── README.md
├── package.json
├── package-lock.json
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── public/
│   ├── index.html              // HTML template
└── src/
    ├── App.js                  // Root component, includes routes and theme
    ├── App.css                 // Global CSS overrides
    ├── index.js                // App entry point, renders App.js
    ├── theme.js                // MUI theme configuration (light/dark mode, colors)
    ├── reportWebVitals.js      // Web Vitals reporting
    ├── index.css               // Global CSS
    ├── services/ 
    │   ├── api.js              // Axios instance setup and API service helper
    │   ├── auth.js             // Token utilities, auth-related helpers
    ├── components/
    │   ├── Navbar.js           // Responsive navbar with dynamic links, token validation
    │   ├── Footer.js           // Footer that stays at bottom of viewport
    │   ├── ProtectedRoute.js   // Wrapper for protected routes
    │   ├── AddBudgetModal.js   // Modal for adding a budget
    │   ├── EditBudgetModal.js  // Modal for editing a budget
    │   ├── AddExpenseModal.js  // Modal for adding an expense
    │   ├── EditExpenseModal.js // Modal for editing an expense
    │   ├── LoadingOverlay.js   // Loading spinner overlay
    ├── charts/
    │   ├── BudgetChart.js      // Chart.js-based budget visualization
    │   ├── ExpenseChart.js     // Chart.js-based expense visualization
    ├── pages/
    │   ├── Home.js             // Landing page with intro and quick links
    │   ├── Login.js            // Login page with form
    │   ├── Register.js         // Register page with form and confirm password
    │   ├── Profile.js          // User profile page (protected)
    │   ├── Budgets.js          // Budgets page with CRUD and chart
    │   ├── Expenses.js         // Expenses page with CRUD, search, and chart
    │   ├── Users.js            // Users page showing list of users
    │   ├── Dashboard.js        // Dashboard with multiple charts
    │   ├── NotFound.js         // 404 page
    │   ├── ForgotPassword.js   // Forgot password page 
```

## Getting Started
1. **Install Dependencies**:  
   In the `frontend/` directory:
   ```bash
   npm install
   ```
2. **Configure Environment**:  
   Set up environment variables as needed (e.g., `REACT_APP_API_URL`).

3. **Run the Application**:
   ```bash
   npm start
   ```
   This will start the development server on `http://localhost:3000` (by default).

## Running the Application
- **Development Mode**: `npm start`
- **Production Build**: `npm run build`  
  This command creates a production-ready build in the `build/` folder.

## Authentication Flow
- **Login**: Users can log in on the `/login` page. A valid token is stored in `localStorage`.
- **Token Validation**: The navbar periodically verifies the token with a `POST /api/auth/verify-token` call.
- **Automatic Logout**: If the token is invalid or expired, the user is logged out and redirected to `/login`.
- **Protected Routes**: Components wrapped with `<ProtectedRoute>` require a valid token.

## Pages and Components
- **Home**: Showcases a welcome message, description, and quick links. On desktop, a large icon is shown beside the "keep track" text.
- **Login/Register**: Simple forms for authentication. The Register page includes a confirm password field.
- **Profile**: Shows user details (e.g., email, join date). Only available for logged-in users.
- **Budgets**: Create/edit/view budgets and see a bar chart summarizing them.
- **Expenses**: Add/edit/delete expenses, search them, and view distribution charts.
- **Users**: View and search other users (if allowed).
- **Navbar**: Shows/hides links based on login state. On desktop, active links have a white bottom border; on mobile, active links appear in brown-ish color.
- **Footer**: Always pinned to the bottom. If content is short, footer stays at viewport bottom. If content is long, the page scrolls and footer stays below content.

## Charts and Visualization
- **Chart.js Integration**: BudgetChart, ExpenseChart, and dashboards use Chart.js for data visualization.
- **Light/Dark Mode Adaptation**: Chart text color changes depending on theme mode, ensuring legends and axes are readable (white text in dark mode).
- **Dashboard**: Displays multiple charts (bar, pie, radar, polar area, doughnut, scatter, bubble) for various stats (budgets, orders, tasks, transactions).

## Theme and Styles
- **MUI Theme**: Defined in `theme.js`. Supports toggling between light and dark themes.
- **Global Styles**: Some overrides in `App.css`.
- **Styling Approach**: Primarily uses MUI’s sx prop and theme for styling. Components are responsive and consistent.

## Active Link Indication
- On desktop, the currently active route link in the navbar has a white bottom border (no radius).
- On mobile, the currently active link text color changes to a brown-ish tone.
- This ensures users always know which page they are on.

## Footer Positioning
- The `<Footer>` component is placed after the main content (`<Routes>`).
- Using a flex container with `flex:1` for main content ensures the footer is pushed to the bottom of the viewport if content is short, or below the fold if content is long.

## Search Functionality
- The Expenses page includes a search field to query expenses using `POST /api/search`.
- The returned expenses are displayed and can also be visualized in charts.
- The query can be triggered by pressing Enter or clicking the Search button.

**And many more features!**

## Additional Notes
- Ensure the backend API and Elasticsearch are running and configured properly for full functionality.
- Any environment variables (like API base URL, Elasticsearch URL) should be set before running.
- For troubleshooting token validation or logout behavior, check the console or network requests in the browser’s developer tools.

This UI aims to provide an intuitive and visually appealing interface, making it easier for users to manage and track their budgets and expenses while offering a full set of features from authentication to data-driven insights via charts.

---

Created with ❤️ by [Son Nguyen](https://sonnguyenhoang.com).
