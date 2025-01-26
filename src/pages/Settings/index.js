import React, { useEffect, useState } from 'react';
import './style.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Settings() {
  const history = useHistory();
  const [gradientColors, setGradientColors] = useState({
    color1 : localStorage.getItem('color1') || '#ff9900',
    color2 : localStorage.getItem('color2') || '#b700ff'
  });

  const [cardCount, setCardCount] = useState(
    Number(localStorage.getItem('cardCount')) || 16
  );

  useEffect(() => {
    // Ensure colors are saved to localStorage if not already present
    if (!localStorage.getItem('color1')) {
      localStorage.setItem('color1', gradientColors.color1);
    }
    if (!localStorage.getItem('color2')) {
      localStorage.setItem('color2', gradientColors.color2);
    }
  }, []);

  const handleColorChange = (e) => {
    const { name, value } = e.target;
    const newColors = { ...gradientColors, [name]: value };
    
    setGradientColors(newColors);
    localStorage.setItem(name, value);
  };

  const handleCardCountChange = (count) => {
    setCardCount(count);
    localStorage.setItem('cardCount', count.toString());
  };

  return (
    <div
      className="settings"
      style={{
        background: `linear-gradient(to bottom right, ${gradientColors.color1}, ${gradientColors.color2})`
      }}
    >
    <button 
      className="back-button" 
      onClick={() => history.push('/')}
    >
      ← Back
    </button>
      <h1>Settings</h1>
      
      <div className="card-count-selection">
        <h2>Number of Cards</h2>
        {[4, 16, 36].map(count => (
          <button 
            key={count}
            onClick={() => handleCardCountChange(count)}
            className={cardCount === count ? 'selected' : ''}
          >
            {count} Cards
          </button>
        ))}
      </div>

      <div className="color-selection">
        <h2>Background Colors</h2>
        <div>
          <label>
            Color 1:
            <input 
              type="color" 
              name="color1"
              value={gradientColors.color1}
              onChange={handleColorChange}
            />
          </label>
        </div>
        <div>
          <label>
            Color 2:
            <input 
              type="color" 
              name="color2"
              value={gradientColors.color2}
              onChange={handleColorChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default Settings;