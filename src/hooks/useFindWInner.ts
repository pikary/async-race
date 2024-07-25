import { useEffect, useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useTypedSelector } from '../store';
import { EngineStatuses, Car } from '../store/cars/types';
import { createWinnerAsync, getWinnerAsync, updateWinnerAsync } from '../store/winners/api';
import { updateRaceStatus } from '../store/cars';

const useWinner = () => {
  const { data: cars, race } = useTypedSelector((state) => state.cars);
  const dispatch = useAppDispatch();
  const [winner, setWinner] = useState<Car | null>(null);

  useEffect(() => {
    if (race.status !== 'finished' && race.cars.length === cars?.length && race.cars.some((car) => car.engineStatus === EngineStatuses.FINISHED)) {
      const sortedParticipants = [...race.cars]
        .filter((car) => car.engineStatus && car.engineStatus !== 'crashed')
        .sort((a, b) => (a.distance / a.velocity) - (b.distance / b.velocity));
      const selectedWinner = sortedParticipants[0];
      setWinner(selectedWinner);
      dispatch(updateRaceStatus('finished'));
    }
  }, [race.cars, cars?.length, dispatch, race.status]);

  const handleGetWinner = async (car: Car) => {
    try {
      const result = unwrapResult(await dispatch(getWinnerAsync(car.id)));
      if (result) {
        await dispatch(updateWinnerAsync({
          time: ((car.distance / car.velocity) / 1000).toFixed(2),
          id: result.id,
          wins: result.wins + 1,
        }));
      } else {
        await dispatch(createWinnerAsync({
          time: ((car.distance / car.velocity) / 1000).toFixed(2),
          id: car.id,
          wins: 1,
        }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (winner) {
      handleGetWinner(winner);
    }
  }, [dispatch, winner]);

  const handleBannerClose = () => {
    setWinner(null);
  };

  return { winner, handleBannerClose };
};

export default useWinner;
