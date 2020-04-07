import React from 'react';
import utils from '../math-utils';

const StarsDisplay = props => (
    //use fragement <> 
    <>
      {utils.range(1, props.count).map(starId => (
        <div key={starId} className="star" />
      ))}
    </>
  );
  
export default StarsDisplay