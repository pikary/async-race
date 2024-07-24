import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../shared/Button';
import Arrow from '../../shared/Arrow';
import './styles.scss';

// import Logo from '../../shared/Logo';

function Header() {
  const navigate = useNavigate();
  const navigateTo = (route:string) => {
    navigate(`/${route}`);
  };
  return (
      <header className="header">
          <div className="header__buttons">
              <Button
                color="pink"
                type="button"
                onClick={() => {
                  navigateTo('garage');
                }}
                text="garage"
              />
              <Button
                color="blue"
                type="button"
                onClick={() => {
                  navigateTo('winners');
                }}
                text="winners"
              />
          </div>
          <div className="header__arrows">
              <Arrow size="normal" color="pink" />
              <Arrow size="normal" color="pink" />
              <Arrow size="normal" color="pink" />
              <Arrow size="normal" color="pink" />
              <Arrow size="normal" color="pink" />
              <Arrow size="normal" color="pink" />
              <Arrow size="normal" color="pink" />
              <Arrow size="normal" color="pink" />
          </div>
          <div className="header__logo">
              <div className="header__logo__container">
                  <h1>
                      Async
                      <br />
                      race
                  </h1>
              </div>
              {/* <div className="header__logo__rectangle first" />
              <div className="header__logo__rectangle second">
                  Async Race

              </div> */}

          </div>
          <div className="header__arrows">
              <Arrow size="normal" color="blue" />
              <Arrow size="normal" color="blue" />
              <Arrow size="normal" color="blue" />
              <Arrow size="normal" color="blue" />
              <Arrow size="normal" color="blue" />
              <Arrow size="normal" color="blue" />
              <Arrow size="normal" color="blue" />
              <Arrow size="normal" color="blue" />
          </div>
      </header>
  );
}

export default Header;
