import React, { useState} from 'react';
import './App.css';

import Game from './components/Game';

//to reset: using key attribute to unmount a component and remount it again and clean up its side effect and give a new state 
const StarMatch = () => {
	const [gameId, setGameId] = useState(1);
	return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)}/>;
}

export default StarMatch;

/*
function App() {
  return (
    <div className="App">
      <StarMatch />
    </div>
  );
}

export default App;
*/