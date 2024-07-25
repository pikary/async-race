import React, { useState } from 'react';
import { Car } from '../store/cars/types';

function useFindWinner(participants: Car[]) {
  const [winner, setWinner] = useState<Car | null>();

  const findWinner = () => {
    const sortedParticipants = [...participants]
      .sort((a, b) => (a.distance / a.velocity) - (b.distance / b.velocity));
    const selectedWinner = sortedParticipants[0];
    setWinner(selectedWinner);
    return selectedWinner;
  };
  return [winner, setWinner, findWinner] as
   [Car | null, React.Dispatch<React.SetStateAction<Car | null>>, () => Car | undefined];
}

export default useFindWinner;
