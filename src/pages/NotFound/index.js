import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

function NotFound() {
const [gradientColors, setGradientColors] = useState({
    color1: '#ff9900',
    color2: '#b700ff'
    });

    useEffect(() => {
    const color1 = localStorage.getItem('color1') || '#ff9900';
    const color2 = localStorage.getItem('color2') || '#b700ff';
    setGradientColors({ color1, color2 });
      }, []);
  return (
    <div
      className="not-found"
      style={{
        background: `linear-gradient(to bottom right, ${gradientColors.color1}, ${gradientColors.color2})`
      }}
    >
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/home" className="return-link">
        Return to Home page
      </Link>
    </div>
  );
}

export default NotFound;
