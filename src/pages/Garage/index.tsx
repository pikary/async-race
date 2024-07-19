import React, { useEffect, useRef, useState } from 'react';
import { FaPlay } from 'react-icons/fa6';
import { RxUpdate } from 'react-icons/rx';
import { BiRightArrow, BiLeftArrow } from 'react-icons/bi';

import { useAppDispatch, useTypedSelector } from '../../store';
import Button from '../../shared/Button';
import Input from '../../shared/Input';
import Arrow from '../../shared/Arrow';
import Track from '../../components/Track';
import { Car } from '../../store/cars/types';
import './styles.scss';
import { createCar, generateCars, setCurrentPage } from '../../store/cars';

const CARS_PER_PAGE = 7;

// const cars = [
//   { name: 'Cobalt', id: 1, color: 'red' },
//   { name: 'Toyota', id: 2, color: 'white' },
//   { name: 'Honda', id: 3, color: 'blue' },
//   { name: 'Ford', id: 4, color: 'black' },
//   { name: 'Chevrolet', id: 5, color: 'green' },
//   { name: 'BMW', id: 6, color: 'yellow' },
//   { name: 'Audi', id: 7, color: 'purple' },
// ];

function Garage() {
  const { data, currentPage } = useTypedSelector((state) => state.cars);
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);

  const [arrowCount, setArrowCount] = useState(0);
  const [carName, setCarName] = useState('');
  const [color, setColor] = useState('');

  const handleCarNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setCarName(e.target.value);
  };
  const handleColorChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };
  const handleCreateCar = (e:React.FormEvent) => {
    e.preventDefault();
    const newCar:Car = { name: carName, color, id: Math.random() };
    dispatch(createCar(newCar));
    // cleanUp
    setCarName('');
    setColor('');
  };
  const handleGenerateCars = () => {
    dispatch(generateCars());
  };

  const startIndex = (currentPage - 1) * CARS_PER_PAGE;
  const paginatedCars = data?.slice(startIndex, startIndex + CARS_PER_PAGE);
  const handleNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const handlePreviousPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const containerWidth = container.clientWidth;
      const arrowWidth = 30; // 20 + флекс гап 10
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
              <form className="garage__header__form garage__header__form-create" onSubmit={handleCreateCar}>
                  <Input className="garage__header__form-input" type="text" name="brand" placeholder="Car brand" labelText="" onChange={handleCarNameChange} value={carName} />
                  <input type="color" onChange={handleColorChange} value={color} />
                  <Button color="pink" text="create" type="submit" />
              </form>
              <div className="garage__header__form garage__header__form-update">
                  <Input className="garage__header__form-input" type="text" name="brand" placeholder="Car brand" labelText="" />
                  <input type="color" />
                  <Button color="pink" text="update" type="submit" />
              </div>

              <Button color="blue" text="generate cars" className="garage__header__gen" onClick={handleGenerateCars} />
          </div>
          <div className="garage__race">
              <div className="garage__race__boundary" ref={containerRef}>
                  <div className="garage__race__boundary-upper" />
                  <div className="garage__race__boundary-under" />
                  {arrows}
              </div>
              <div>
                  {paginatedCars?.map((car) => (
                      <Track key={car.id} car={car} />
                  ))}
              </div>
              <div className="garage__race__boundary" style={{ marginTop: 20 }} ref={containerRef}>
                  <div className="garage__race__boundary-upper" />
                  <div className="garage__race__boundary-under" />
                  {arrows}
              </div>
              <div className="garage__race__pagination">
                  <h4>
                      GARAGE (
                      {data?.length || 0}
                      )
                  </h4>
                  <div className="garage__race__pagination__controls">
                      <Button className="garage__race__pagination__controls__btn disabled" text="" onClick={handlePreviousPage} icon={<BiLeftArrow size={25} />} />
                      <h4>
                          PAGE #
                          {currentPage}
                      </h4>
                      <Button className="garage__race__pagination__controls__btn" text="" onClick={handleNextPage} icon={<BiRightArrow size={25} />} />
                  </div>
              </div>
          </div>
      </div>
  );
}

export default Garage;
