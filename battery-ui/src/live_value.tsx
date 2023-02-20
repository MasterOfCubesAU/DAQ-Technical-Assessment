import React from 'react';
import './App.css';

interface TemperatureProps {
  temp: number
}

function LiveValue ({ temp }: TemperatureProps): JSX.Element {
  let valueColour;

  if (temp < 20 || temp > 80) {
    // Unsafe range
    valueColour = 'red';
  } else if ((temp >= 20 && temp <= 25) || (temp >= 75 && temp <= 80)) {
    // Close to unsafe range
    valueColour = 'yellow';
  } else {
    // Safe range
    valueColour = 'green';
  }

  return (
    <header className="live-value" style={{ color: valueColour }}>
      {`${temp.toString()}°C`}
    </header>
  );
}

export default LiveValue;
