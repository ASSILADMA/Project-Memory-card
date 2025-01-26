import React, { useEffect, useState } from 'react';
import './style.css';
import { useHistory } from 'react-router-dom';

function NotFound() {
    const history = useHistory();
    const [gradientColors, setGradientColors] = useState({
        color1: '#ff9900',
        color2: '#b700ff'
        });
    const [records, setRecords] = useState([]);
    
    useEffect(() => {
        const color1 = localStorage.getItem('color1') || '#ff9900';
        const color2 = localStorage.getItem('color2') || '#b700ff';
        setGradientColors({ color1, color2 });
    
        // Load history from localStorage
        const storedRecords = JSON.parse(localStorage.getItem('records')) || [];
        setRecords(storedRecords);
    }, []);
    // Load history from localStorage
  return (
    <div
      className="history"
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
    <table className="history-table">
        <thead>
          <tr>
            <th>Record date</th>
            <th>Number of Cards</th>
            <th>Time</th>
            <th>Number of Moves</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.recordTime}</td>
              <td>{record.cardCount}</td>
              <td>{record.time} seconds</td>
              <td>{record.numberOfMoves}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NotFound;
