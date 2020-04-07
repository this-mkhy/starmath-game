import React, { useState,useEffect} from 'react';
import utils from '../math-utils';

import StarsDisplay from './StarsDisplay';
import PlayNumber from './PlayNumber';
import PlayAgain from './PlayAgain';

//Custom Hook: state that manges and group everything about state and transacting on the state
//const useGameState = timeLimit => {
const useGameState = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);

  //HOOKs unto the side effects of this component
  useEffect(() => {
    //1-rendering/changing
    if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      //2-going to rerendering/changing: clean up any timer happened before
      //callback function used to clean the side effect whenever the component is changing
      return () => clearTimeout(timerId);
    }
  });

  //Logic: if we have an exact pick or not
  //if the sum of the new candidate numbers not equals the count of the stars, the wrong pick 
  const setGameState = (newCandidateNums) => {
    if (utils.sum(newCandidateNums) !== stars) {
		setCandidateNums(newCandidateNums);
    } 
    //else if the sum of the new candidate numbers equals the count of the stars, the correct pick 
    //so all the new candidate numbers should be marked as used, they should be removed from the available numbers array, then we need to reset the candidate numbers to an empty array and also we need to redraw the number of stars so we need to invoke all three state updater functions
    else {
      const newAvailableNums = availableNums.filter(
        //if the available number isn't included in the new candidate numbers, keep it in the new available numbers. Otherwise, remove it
        n => !newCandidateNums.includes(n)
      );
      //redraw the number of stars from what's new available
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      //reset the candidate numbers to an empty array
      setCandidateNums([]);
    }
  };
  //return an object that Game component needs
  return { stars, availableNums, candidateNums, secondsLeft, setGameState };
};

const Game = props => {
  //read values from a custom hook
  const {
    stars,
    availableNums,
    candidateNums,
    secondsLeft,
    setGameState,
  } = useGameState();

  //Computations based on the state 
  const candidatesAreWrong = utils.sum(candidateNums) > stars;
    
  //Check the game is done
  //The game is done, if the length of available numbers is zero
  const gameStatus = availableNums.length === 0 
  	? 'won'
    : secondsLeft === 0 ? 'lost' : 'active'
 
  //numberStatus function determine the status so it used to determine if the number isUsed or isCandidate or isWrong
  const numberStatus = number => {
    if (!availableNums.includes(number)) {
      return 'used';
    }

    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }

    return 'available';
  };

  //transaction that should happen when we click on each number
  const onNumberClick = (number, currentStatus) => {
    if (currentStatus === 'used' || secondsLeft === 0) {
      //can't do anything here
      return;
    }

    const newCandidateNums =
      currentStatus === 'available'
        ? candidateNums.concat(number)
        : candidateNums.filter(cn => cn !== number);

    setGameState(newCandidateNums);
  };

  return (
    <div className="game">
      <div className="help">
        <mark>Pick 1 or more numbers that sum to the number of stars</mark>
      </div>
      <div className="body">
        <div className="left">
          {/*If the game is done, display the Play Again button, else display StarsDisplay component*/}
          {gameStatus !== 'active' ? (
          	<PlayAgain onClick={props.startNewGame} gameStatus={gameStatus} />
          ) : (
          	<StarsDisplay count={stars} />
          )}
        </div>
        <div className="right">
          {utils.range(1, 9).map(number => (
            <PlayNumber
              key={number}
              //status used to determine if the number isUsed , isCandidate
              status={numberStatus(number)}
              number={number}
              onClick={onNumberClick}
            />
          ))}
        </div>
      </div>
      <h3 className="timer"><mark>Time Remaining: {secondsLeft}</mark></h3>
    </div>
  );
};

export default Game;