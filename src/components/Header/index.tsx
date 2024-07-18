import React from 'react';
import Button from '../../shared/Button';
import Arrow from '../../shared/Arrow';
import './styles.scss';

function Header() {
  return (
      <header className="header">
          <div className="header__buttons">
              <Button
                className="pink"
                type="button"
                onClick={() => {
                  console.log();
                }}
              >
                  garage
              </Button>
              <Button
                className="blue"
                type="button"
                onClick={() => {
                  console.log();
                }}
              >
                  winners
              </Button>
          </div>
          <div className="header__arrows">
              <Arrow color="pink" />
              <Arrow color="pink" />
              <Arrow color="pink" />
              <Arrow color="pink" />
              <Arrow color="pink" />
              <Arrow color="pink" />
              <Arrow color="pink" />
              <Arrow color="pink" />
              <Arrow color="pink" />
              <Arrow color="pink" />
          </div>
          <div />
          <div className="header__arrows">
              <Arrow />
              <Arrow />
          </div>
      </header>
  );
}

export default Header;
