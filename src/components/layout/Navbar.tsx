import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '../ui/Button';
import clsx from 'clsx';
import './layout.css';

interface NavbarProps {
  onJoinWaitlist: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onJoinWaitlist }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={clsx('navbar', { 'navbar-scrolled': scrolled })}>
      <div className="container navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <span className="logo-text">Somaherence</span>
          </Link>
        </div>
        
        <nav className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => clsx('nav-link', { 'nav-link-active': isActive })}>
            Home
          </NavLink>
          <NavLink to="/how-it-works" className={({ isActive }) => clsx('nav-link', { 'nav-link-active': isActive })}>
            How It Works
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => clsx('nav-link', { 'nav-link-active': isActive })}>
            About
          </NavLink>
          <NavLink to="/support" className={({ isActive }) => clsx('nav-link', { 'nav-link-active': isActive })}>
            Support
          </NavLink>
        </nav>
        
        <div className="navbar-cta">
          <Button variant="primary" size="sm" onClick={onJoinWaitlist}>
            Join waitlist
          </Button>
        </div>
      </div>
    </header>
  );
};
