import React, { useEffect, useRef, useState } from 'react';
import { FaPlay } from 'react-icons/fa6';
import { RxUpdate } from 'react-icons/rx';
import { BiRightArrow, BiLeftArrow } from 'react-icons/bi';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useTypedSelector } from '../../store';
import Button from '../../shared/Button';
import Input from '../../shared/Input';
import Arrow from '../../shared/Arrow';
import Track from '../../components/Track';
import { Car, createCarWithDefaults, EngineStatuses } from '../../store/cars/types';
import './styles.scss';
import {
  setCurrentPage, updateSelectedCarColor, updateSelectedCarName,
} from '../../store/cars';
import {
  createCarAsync, driveCarAsync, getCarsAsync, toggleCarEngineAsync, updateCarAsync,
} from '../../store/cars/api';
import { generateRandomCars } from '../../store/cars/helpers';

const CARS_PER_PAGE = 7;

function Garage() {
  const {
    data, currentPage, selectedCar, totalAmount,
  } = useTypedSelector((state) => state.cars);
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
  const handleCreateCar = async (e:React.FormEvent) => {
    try {
      e.preventDefault();
      const newCar:Car = createCarWithDefaults({ name: carName, color });
      await dispatch(createCarAsync(newCar));
    } catch (err) {
      console.error(err);
    } finally {
      setCarName('');
      setColor('');
    }
  };
  const handleUpdateCar = async (e:React.FormEvent) => {
    e.preventDefault();
    if (selectedCar) {
      await dispatch(updateCarAsync(selectedCar));
    }
  };
  const handleRaceStart = async () => {
    const startEngineRequests = data!.map((car) => dispatch(toggleCarEngineAsync({
      id: car.id!,
      status: EngineStatuses.STARTED,
    })));
    await Promise.all(startEngineRequests).then((values) => {
      // const driveCarRequests = [];
      const driveReq = values.map((val) => {
        unwrapResult(val);
        return dispatch(driveCarAsync(val.meta.arg.id));
      });
      Promise.all(driveReq);
    });
  };
  // const handleGenerateCars = () => {
  //   dispatch(generateCars());
  // };

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

  const handleGenerateCars2 = async () => {
    const randomCars = generateRandomCars(100);
    const requests = randomCars.map((car) => dispatch(createCarAsync(car)));
    try {
      await Promise.all(requests.map((p) => p.then(unwrapResult).catch((e) => e)));
    } catch (error) {
      console.error('Error generating cars:', error);
    }
  };

  useEffect(() => {
    const fetchGarageHandler = async () => {
      await dispatch(getCarsAsync({ page: currentPage, limit: CARS_PER_PAGE }));
    };
    fetchGarageHandler();
    console.log(data);
  }, [dispatch, currentPage]);
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
                    onClick={handleRaceStart}
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
                  <Input className="garage__header__form-input" type="text" name="create-car" placeholder="Car brand" labelText="" onChange={handleCarNameChange} value={carName} />
                  <input type="color" onChange={handleColorChange} value={color} />
                  <Button color="pink" text="create" type="submit" />
              </form>
              <form className="garage__header__form garage__header__form-update" onSubmit={handleUpdateCar}>
                  <Input disabled={selectedCar === null} className="garage__header__form-input" value={selectedCar?.name} onChange={(e) => dispatch(updateSelectedCarName(e.target.value))} type="text" name="update-car" placeholder="Car brand" labelText="" />
                  <input disabled={selectedCar === null} type="color" value={selectedCar?.color} onChange={(e) => dispatch(updateSelectedCarColor(e.target.value))} />
                  <Button disabled={selectedCar === null} color="pink" text="update" type="submit" />
              </form>

              <Button color="blue" text="generate cars" className="garage__header__gen" onClick={handleGenerateCars2} />
          </div>
          <div className="garage__race">
              <div className="garage__race__boundary" ref={containerRef}>
                  <div className="garage__race__boundary-upper" />
                  <div className="garage__race__boundary-under" />
                  {arrows}
              </div>
              <div>
                  {data?.map((car) => (
                      <Track key={car.id} car={car} />
                  ))}
              </div>
              <div className="garage__race__boundary" style={{ marginTop: 25 }} ref={containerRef}>
                  <div className="garage__race__boundary-upper" />
                  <div className="garage__race__boundary-under" />
                  {arrows}
              </div>
              <div className="garage__race__pagination">
                  <h4>
                      GARAGE (
                      {totalAmount}
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
