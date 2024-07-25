import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../shared/Button';
import Arrow from '../../shared/Arrow';
import './styles.scss';

// import Logo from '../../shared/Logo';

function Header() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLHeadElement>(null);
  const [arrowCount, setArrowCount] = useState(0);

  const navigateTo = (route:string) => {
    navigate(`/${route}`);
  };
  useEffect(() => {
    const handleResize = () => {
      const container = headerRef.current;
      if (container) {
        if (container.clientWidth > 768) {
          setArrowCount(9);
        } else {
          setArrowCount(8);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
      <header className="header" ref={headerRef}>
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
              {Array.from({ length: arrowCount }).map(() => <Arrow size="small" color="pink" />)}
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
              {Array.from({ length: arrowCount }).map(() => <Arrow size="small" color="blue" />)}

          </div>
      </header>
  );
}

export default Header;
