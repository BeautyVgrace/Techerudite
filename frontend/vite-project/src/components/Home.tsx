// import React from "react";
import { useEffect } from "react";
import LOGO from "../assets/images/logo.png";
import { Icon } from "@iconify/react";
import "../Styles/home.css";
import { Link, Outlet, useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const menuButtons = document.querySelectorAll(".menu-button");
    const screenOverlay = document.querySelector(
      ".main-layout .screen-overlay"
    );
    const themeButton = document.querySelector(".navbar .theme-button i");

    // Toggle sidebar visibility function
    const toggleSidebar = () => {
      document.body.classList.toggle("sidebar-hidden");
    };

    // Add event listeners for menu buttons if they exist
    menuButtons.forEach((button) => {
      button.addEventListener("click", toggleSidebar);
    });

    // Only add event listener if screenOverlay is defined
    if (screenOverlay) {
      screenOverlay.addEventListener("click", toggleSidebar);
    }

    // Initialize dark mode based on localStorage
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
      themeButton?.classList.replace("uil-moon", "uil-sun");
    } else {
      themeButton?.classList.replace("uil-sun", "uil-moon");
    }

    // Toggle dark mode when theme button is clicked
    const toggleDarkMode = () => {
      const isDarkMode = document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
      themeButton?.classList.toggle("uil-sun", isDarkMode);
      themeButton?.classList.toggle("uil-moon", !isDarkMode);
    };

    // Only add event listener if themeButton is defined
    themeButton?.addEventListener("click", toggleDarkMode);

    // Show sidebar on large screens by default
    if (window.innerWidth >= 768) {
      document.body.classList.remove("sidebar-hidden");
    }

    // Clean up event listeners on component unmount
    return () => {
      menuButtons.forEach((button) => {
        button.removeEventListener("click", toggleSidebar);
      });
      if (screenOverlay) {
        screenOverlay.removeEventListener("click", toggleSidebar);
      }
      themeButton?.removeEventListener("click", toggleDarkMode);
    };
  }, []);
  return (
    <div className="sidebar-hidden">
      <div className="container">
        <header>
          <nav className="navbar">
            <div className="nav-section nav-left">
              <button className="nav-button menu-button">
                {/* <Icon icon="prime:bars" className="icon-nav" /> */}
                <Icon icon="gravity-ui:bars" className="icon-nav" />
              </button>
              <Link to="/" className="nav-logo">
                <Icon icon="logos:supabase-icon" className="logo-icon" />
                <h2 className="logo-text">Techerudite</h2>
              </Link>
            </div>

            <div className="nav-section nav-center">
              <form action="#" className="search-form">
                <input
                  type="search"
                  placeholder="Search"
                  className="search-input"
                  required
                />
                <button className="nav-button search-button">
                  <Icon icon="mynaui:search" className="search-btn" />
                </button>
              </form>
              <button className="nav-button mic-button">
                <Icon icon="weui:mike-outlined" className="mike-btn" />
              </button>
            </div>

            <div className="nav-section nav-right">
              <button className="nav-button search-button">
                <i className="uil uil-search"></i>
              </button>
              <button className="nav-button theme-button">
                <i className="fa-solid fa-moon"></i>
              </button>
              <img src={LOGO} alt="User Image" className="user-image" />
            </div>
          </nav>
        </header>

        <main className="main-layout">
          <div className="screen-overlay"></div>
          {/* <!-- Sidebar --> */}
          <aside className="sidebar">
            <div className="nav-section nav-left">
              <button className="nav-button menu-button">
                <Icon icon="gravity-ui:bars" className="icon-nav" />
              </button>
              <Link to="/" className="nav-logo">
                <Icon icon="logos:supabase-icon" className="logo-icon" />
                <h2 className="logo-text">Record</h2>
              </Link>
            </div>

            <div className="links-container">
              <div className="link-section">
                <Link to="/" className="link-item">
                  <Icon icon="jam:home" className="iconify-icon" />
                  Home
                </Link>
                <Link to="/customerregister" className="link-item">
                  <Icon
                    icon="system-uicons:user-male"
                    className="iconify-icon"
                  />
                  Customer Register
                </Link>
                <Link to="/adminregister" className="link-item">
                  <Icon icon="system-uicons:create" className="iconify-icon" />
                  Admin Register
                </Link>
                <Link to="/login" className="link-item">
                  <Icon icon="system-uicons:enter" className="iconify-icon" />
                  Login
                </Link>
              </div>
              <div className="section-separator"></div>
              <div className="link-section">
                <a href="#" className="link-item">
                  <i className="uil uil-setting"></i> Settings
                </a>
                <a href="#" className="link-item">
                  <i className="uil uil-question-circle"></i> Help
                </a>
                <a href="#" className="link-item">
                  <i className="uil uil-exclamation-triangle"></i> Feedback
                </a>
              </div>
            </div>
          </aside>

          <div className="content-wrapper">
            <div className="category-list">
              <button className="category-button active">All</button>
            </div>
            {location.pathname === "/" && (
              <div className="welcome-message">
                <h1>Welcome to Our Platform</h1>
                <p>
                  Our platform helps customers and admins manage their accounts
                  and interact with the system. Choose your role to get started.
                </p>
              </div>
            )}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
