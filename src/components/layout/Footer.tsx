import React from 'react';
import { Link } from 'react-router-dom';
import './layout.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="logo-text">Somaherence</h3>
            <p className="footer-tagline">A resonant chamber for rest.</p>
          </div>
          
          <div className="footer-links-group">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/support">Support / Contact</Link></li>
              <li><Link to="/safety">Safety notes</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
              <li><Link to="/accessibility">Accessibility</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Somaherence. All rights reserved.</p>
          <p className="medical-disclaimer">
            Somaherence provides experiential resonance and is not a medical device.
          </p>
        </div>
      </div>
    </footer>
  );
};
