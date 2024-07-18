import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Garage from './pages/Garage';
import Header from './components/Header';

function App() {
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
          </main>

      </div>
  );
}

export default App;
