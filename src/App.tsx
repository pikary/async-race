import React, { useEffect } from 'react';
import {
  BrowserRouter, Route, Routes, Navigate,
} from 'react-router-dom';
import useFindWinner from './hooks/useFindWInner';
import { useAppDispatch, useTypedSelector } from './store';
import Garage from './pages/Garage';
import Winners from './pages/Winners';
import Header from './components/Header';
import { EngineStatuses } from './store/cars/types';
import WinnerBanner from './components/WinnerBanner';
import { createWinnerAsync, updateWinnerAsync } from './store/winners/api';
import Footer from './components/Footer';
import { updateRaceStatus } from './store/cars';

function App() {
  const { data: cars, race } = useTypedSelector((state) => state.cars);
  const { data: winners } = useTypedSelector((state) => state.winners);
  const dispatch = useAppDispatch();
  const [winner, setWinner, findWinner] = useFindWinner(race.cars || []);
  const handleBannerClose = () => {
    setWinner(null);
  };
  useEffect(() => {
    // console.log(race.cars);

    if (race.cars.every((car) => car.engineStatus === EngineStatuses.DRIVE)) {
      console.log('finding winner');

      findWinner();
      // dispatch(updateRaceStatus('finished'));

      // create winner
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
