import React, { useState, useEffect } from 'react';
import './style.css';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function MainPage() {
  const [cardCount, setCardCount] = useState(
    Number(localStorage.getItem('cardCount')) || 16
  );
  const [gradientColors, setGradientColors] = useState({
    color1: localStorage.getItem('color1') || '#ff9900',
    color2: localStorage.getItem('color2') || '#b700ff'
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const generateCards = () => {
    const totalPairs = cardCount / 2;
    const cardValues = Array.from({ length: totalPairs }, (_, i) => i + 1);
    const shuffledCards = [...cardValues, ...cardValues]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(shuffledCards);
    setStartTime(Date.now());
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setEndTime(null);
  };

  useEffect(() => {
    generateCards();
  }, [cardCount]);


  useEffect(() => {
    let timer;
    if (gameStarted && !endTime) {
      timer = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
    } else if (endTime) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [gameStarted, endTime]);

  useEffect(() => {
    if (endTime) {
      const time = ((endTime - startTime) / 1000).toFixed(2);
      const newRecord = { time: parseFloat(time), numberOfMoves: moves, cardCount: cardCount, recordTime: new Date().toLocaleString() };

      let records = JSON.parse(localStorage.getItem('records')) || [];
      records.push(newRecord);
      localStorage.setItem('records', JSON.stringify(records));
    }
  }, [endTime]);
  const startGame = () => {
    setMoves(0);
    setStartTime(Date.now());
    setEndTime(null);
    setGameStarted(true);
    setCurrentTime(Date.now());
    generateCards();
    // Initialize or reset the game board here
  };
  const stopGame = () => {
    setEndTime(null);
    // Reset states to initial values except for endTime
    setMoves(0);
    setStartTime(null);
    setGameStarted(false);
    setCurrentTime(0);
    setFlippedCards([]);
  };
  
  
  const handleCardClick = (clickedCard) => {
    // Prevent clicking matched or already flipped cards
    if (
      clickedCard.isMatched || 
      flippedCards.length === 2 || 
      flippedCards.some(card => card.id === clickedCard.id)
    ) return;

    // Update card state
    const updatedCards = cards.map(card => 
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(updatedCards);

    // Track flipped cards
    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);
    setMoves(moves + 1);

    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards;
      
      if (first.value === second.value) {
        // Match found
        const matchedCardIds = [first.id, second.id];
        const finalCards = cards.map(card => 
          matchedCardIds.includes(card.id) 
            ? { ...card, isMatched: true, isFlipped: true } 
            : card
        );
        setCards(finalCards);
        
        const newMatchedPairs = [...matchedPairs, ...matchedCardIds];
        setMatchedPairs(newMatchedPairs);

        // Check if game is complete
        if (newMatchedPairs.length === cardCount) {
          setEndTime(Date.now());
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          const resetCards = cards.map(card => 
            newFlippedCards.some(f => f.id === card.id)
              ? { ...card, isFlipped: false }
              : card
          );
          setCards(resetCards);
        }, 1000);
      }

      // Reset flipped cards
      setTimeout(() => {
        setFlippedCards([]);
      }, 1000);
    }
  };

  const renderGameBoard = () => {
    const gridColumns = Math.sqrt(cardCount);
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
      gap: '10px',
      maxWidth: '500px',
      margin: '0 auto'
    };

    return (
      <div style={gridStyle}>
        {cards.map(card => (
          <div 
            key={card.id}
            className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
            onClick={() => gameStarted && handleCardClick(card)}
          style={{ pointerEvents: gameStarted ? 'auto' : 'none' }}
          >
            {card.isFlipped || card.isMatched ? card.value : '?'}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className="memory-game"
      style={{
        background: `linear-gradient(to bottom right, ${gradientColors.color1}, ${gradientColors.color2})`,
        minHeight: '100vh'
      }}
    >
      <Link to="/settings" className="settings-link">
      <i class="fa fa-gear" ></i>
      </Link>
      <Link to="/history" className="history-link">
      <i class="fa fa-history" ></i>
      </Link>
      <h1>Memory Game</h1>
      <div className="game-stats">
        <button
          className={`start-button ${gameStarted && !endTime ? 'stop-button' : ''}`}
          onClick={gameStarted && !endTime ? stopGame : startGame}
        >
          {gameStarted && !endTime ? 'Stop' : 'Start'}
        </button>
        <div className="stats">
        <p>Moves: {moves}</p>
        {gameStarted && !endTime && (
          <p>Time: {((currentTime - startTime) / 1000).toFixed(0)} s</p>
        )}
        {endTime && (
          <p>Time: {((endTime - startTime) / 1000).toFixed(2)} seconds</p>
        )}
        </div>
      </div>
      {renderGameBoard()}
      {endTime && (
        <div className="game-over">
        <h2>Congratulations!</h2>
        <p>You completed the game in {moves} moves</p>
        <p>Total time: {((endTime - startTime) / 1000).toFixed(2)} seconds</p>
        <button onClick={stopGame}>Close</button>
      </div>
      )}
    </div>
  );
}

export default MainPage;