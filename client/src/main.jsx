import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Footer from "./components/footer.jsx";
import Navbar from "./components/navbar.jsx";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react';
import { clerkConfig } from './clerk';

function AppWrapper() {
  return (
    <Router>
      <ConditionalWrapper />
    </Router>
  );
}

function ConditionalWrapper() {
  const location = useLocation();
  const showFooter = location.pathname !== "/login" && location.pathname !== "/chat";

  return (
    <>
      <Navbar />
      <App />
      {showFooter && <Footer />}
    </>
  );
}

// Wrap the entire app with ClerkProvider and Router
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider {...clerkConfig}>
      <AppWrapper />
    </ClerkProvider>
  </StrictMode>
);