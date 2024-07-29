import React, { useState } from "react";

const Play = () => {
  const [counter, setCounter] = useState(0);

  const increaseCount = () => {
    if (counter === 4) {
      setCounter(100);
    } else {
      setCounter(counter + 1);
    }
  };

  const decreaseCount = () => {
    setCounter(counter - 1);
  };

  return (
    <div>
      <p>Counter: {counter}</p>
      <button className="bg-green-500" onClick={increaseCount}>
        Increase
      </button>
      <button className="bg-blue-500" onClick={decreaseCount}>
        Decrease
      </button>
      <button className="bg-red-500" onClick={() => setCounter(0)}>
        Reset
      </button>
    </div>
  );
};

export default Play;
