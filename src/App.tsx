import React from 'react';
import {
  BrowserRouter, Route, Routes,
} from 'react-router-dom';
import Garage from './pages/Garage';
import Winners from './pages/Winners';
import Header from './components/Header';
import WinnerBanner from './components/WinnerBanner';
import Footer from './components/Footer';
import useWinner from './hooks/useFindWInner';
// import { Winner } from './store/winners/types';

function App() {
  const { winner, handleBannerClose } = useWinner();

  return (
      <div className="App">
          <main>
              <BrowserRouter>
                  <Header />
                  <Routes>
                      <Route index path="/" element={<Garage />} />
                      <Route path="/winners" element={<Winners />} />
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
