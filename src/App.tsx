import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import useFindWinner from './hooks/useFindWInner';
import { useTypedSelector } from './store';
import Garage from './pages/Garage';
import Header from './components/Header';
import { EngineStatuses } from './store/cars/types';
import WinnerBanner from './components/WinnerBanner';

function App() {
  const { data } = useTypedSelector((state) => state.cars);

  const [winner, setWinner, findWinner] = useFindWinner(data || []);
  const handleBannerClose = () => {
    setWinner(null);
  };
  useEffect(() => {
    if (data?.every((car) => car.engineStatus === EngineStatuses.STARTED)) {
      findWinner();
    }
  }, [data]);
  return (
      <div className="App">
          <main>
              <BrowserRouter>
                  <Header />
                  <Routes>
                      <Route path="/garage" element={<Garage />} />
                      <Route path="/winner" element={<Garage />} />
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

      </div>
  );
}

export default App;
