
import React from 'react';

const PlayNumber = props => (
    <button
      className="number"
      //to change the backgroundColor depend on the status of the color
      style={{backgroundColor: colors[props.status]}}
      onClick={() => props.onClick(props.number, props.status)}
    >
      {props.number}
    </button>
);

//color theme
const colors = {
    available: 'lightgray',
    used: 'lightgreen',
    wrong: 'lightcoral',
    candidate: 'deepskyblue',
  };
  
export default PlayNumber