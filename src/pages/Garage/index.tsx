import React, { useEffect, useRef, useState } from 'react';
import { FaPlay } from 'react-icons/fa6';
import { RxUpdate } from 'react-icons/rx';
import Button from '../../shared/Button';
import Input from '../../shared/Input';
import Arrow from '../../shared/Arrow';
import './styles.scss';

function Garage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [arrowCount, setArrowCount] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const containerWidth = container.clientWidth;
      const arrowWidth = 30; // Assuming the width of Arrow is 20px, adjust accordingly
      const numberOfArrows = Math.floor(containerWidth / arrowWidth);
      setArrowCount(numberOfArrows);
    }
  }, []);

  const arrows = Array.from({ length: arrowCount }, (_, index) => (
      <Arrow
        key={index}
        size="small"
        color={(index % 8 < 4 || index % 8 >= 8) ? 'pink' : 'blue'}
      />
  ));
  return (
      <div className="garage">
          <div className="garage__header">
              <div className="garage__header__control-btns">
                  <Button
                    color="blue"
                    type="button"
                    onClick={() => {
                      console.log();
                    }}
                    icon={<RxUpdate />}
                    text="race"
                  />
                  <Button
                    color="pink"
                    type="button"
                    onClick={() => {
                      console.log();
                    }}
                    icon={<FaPlay />}
                    text="reset"
                  />
              </div>
              <form className="garage__header__form garage__header__form-create">
                  <Input className="garage__header__form-input" type="text" name="brand" placeholder="Car brand" labelText="" />
                  <input type="color" />

                  <Button color="pink" text="create" type="submit" />
              </form>
              <div className="garage__header__form garage__header__form-update">
                  <Input className="garage__header__form-input" type="text" name="brand" placeholder="Car brand" labelText="" />
                  <input type="color" />
                  <Button color="pink" text="update" type="submit" />
              </div>

              <Button color="blue" text="generate cars" className="garage__header__gen" />
          </div>
          <div className="garage__race">
              <div className="garage__race__boundary" ref={containerRef}>
                  <div className="garage__race__boundary-upper" />
                  <div className="garage__race__boundary-under" />
                  {arrows}
              </div>
              <div>
                  RACE
              </div>
              <div className="garage__race__boundary" ref={containerRef}>
                  <div className="garage__race__boundary-upper" />
                  <div className="garage__race__boundary-under" />
                  {arrows}
              </div>

          </div>
      </div>
  );
}

export default Garage;
