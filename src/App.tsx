import React, { useEffect, useState } from 'react';
import {
  BrowserRouter, Route, Routes, Navigate,
} from 'react-router-dom';
import { useAppDispatch, useTypedSelector } from './store';
import Garage from './pages/Garage';
import Winners from './pages/Winners';
import Header from './components/Header';
import { EngineStatuses, Car } from './store/cars/types';
import WinnerBanner from './components/WinnerBanner';
import { createWinnerAsync, updateWinnerAsync } from './store/winners/api';
import Footer from './components/Footer';
import { updateRaceStatus } from './store/cars';

function App() {
  const { data: cars, race } = useTypedSelector((state) => state.cars);
  const { data: winners } = useTypedSelector((state) => state.winners);
  const dispatch = useAppDispatch();
  // const [winner, setWinner, findWinner] = useFindWinner(cars || []);
  const [winner, setWinner] = useState<Car|null>(null);
  const handleBannerClose = () => {
    setWinner(null);
  };

  useEffect(() => {
    // console.log(race.cars);

    if (race.status !== 'done' && race.cars.length === cars?.length && race.cars.some((car) => car.engineStatus === EngineStatuses.FINISHED)) {
      const sortedParticipants = [...race.cars]
        .filter((car) => car.engineStatus !== 'crashed') // Filter out cars with engineStatus 'crashed'
        .sort((a, b) => (a.distance / a.velocity) - (b.distance / b.velocity));
      const selectedWinner = sortedParticipants[0];
      setWinner(selectedWinner);
      console.log(selectedWinner);

      dispatch(updateRaceStatus('done'));
    }
  }, [race.cars]);
  useEffect(() => {
    if (winner) {
      const winnerobj = winners?.find((el) => el.id === winner.id);
      if (winnerobj) {
        dispatch(updateWinnerAsync({
          time: ((winner.distance / winner.velocity) / 1000).toFixed(2),
          id: winner.id,
          // eslint-disable-next-line no-unsafe-optional-chaining
          wins: winnerobj!.wins + 1,
        }));
      } else {
        dispatch(createWinnerAsync({
          time: ((winner.distance / winner.velocity) / 1000).toFixed(2),
          id: winner.id,
          wins: 1,
        }));
      }
    }
  }, [dispatch, winner]);

  return (
      <div className="App">
          <main>
              <BrowserRouter>
                  <Header />
                  <Routes>
                      <Route path="/garage" element={<Garage />} />
                      <Route path="/winners" element={<Winners />} />
                      <Route path="/" element={<Navigate to="/garage" />} />
                  </Routes>
              </BrowserRouter>
              {winner && (
              <WinnerBanner
                winnerName={winner.name}
                time={((winner.distance / winner.velocity) / 1000).toFixed(2)}
                closeBanner={handleBannerClose}
              />
              )}
          </main>
          <Footer />

      </div>
  );
}

export default App;
