import React, { useEffect, useRef, useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { Car, EngineStatuses } from '../../store/cars/types';
import Button from '../../shared/Button';

import { ReactComponent as CarImg } from '../../assets/BW_Hatchback.svg';
import './styles.scss';
import { useAppDispatch, useTypedSelector } from '../../store';
import { selectCar } from '../../store/cars';

import {
  deleteCarAsync, getCarsAsync, toggleCarEngineAsync, driveCarAsync,
} from '../../store/cars/api';
// eslint-disable-next-line import/no-extraneous-dependencies, import/order
import { useSpring, animated } from 'react-spring';

interface TrackProps{
    car:Car
}

function Track({ car }:TrackProps) {
  const { selectedCar, totalAmount, currentPage } = useTypedSelector((state) => state.cars);
  const thisRef = useRef<SVGSVGElement >(null);
  // const [position, setPosition] = useState('0%');
  const [time, setTime] = useState<number|null>(null);
  const [{ left }, api] = useSpring(() => ({ left: '0px' }));

  const dispatch = useAppDispatch();
  const handleDeleteCar = async (id:number) => {
    try {
      unwrapResult(await dispatch(deleteCarAsync(id)));
      // update page
      if (totalAmount > 7) {
        unwrapResult(await dispatch(getCarsAsync({ page: currentPage, limit: 7 })));
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleToggleCarEngine = async (status:EngineStatuses) => {
    try {
      if (status === 'stopped') {
        setTime(null);
        unwrapResult(await dispatch(toggleCarEngineAsync({ id: car.id!, status })));
      } else {
        const data = unwrapResult(await dispatch(toggleCarEngineAsync({ id: car.id!, status })));
        const calc = data.distance / data.velocity;
        setTime(calc);
        unwrapResult(await dispatch(driveCarAsync(car.id!)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectCar = (carparam:Car) => { dispatch(selectCar(carparam)); };
  useEffect(() => {
    if (car.engineStatus === EngineStatuses.STARTED) {
      const calc = car.distance / car.velocity;
      setTime(calc);
      api.start({ left: 'calc(100% - 100px)', config: { duration: 5000 } });
    } else if (car.engineStatus === EngineStatuses.STOPPED) {
      if (thisRef.current) {
        const rect = thisRef.current.getBoundingClientRect();
        api.start({ left: `${rect.left}px`, immediate: true });
        setTime(null);
      }
    }
  }, [car, api]);
  return (
      <div className="track">
          <div className="track__car">
              <div className="track__car__btns">
                  <Button text="SELECT" color="blue" onClick={() => handleSelectCar(car)} className={`${selectedCar?.id === car.id ? 'track__car__btns-selected' : ''}`} />
                  <Button text="REMOVE" color="pink" onClick={() => handleDeleteCar(car.id!)} />
              </div>
              <div className="track__car__btns">
                  <Button disabled={car.engineStatus === 'started' || car.engineStatus === 'drive'} text="A" color="blue" onClick={() => handleToggleCarEngine(EngineStatuses.STARTED)} />
                  <Button disabled={(car.engineStatus && car.engineStatus === 'stopped') || !car.engineStatus} text="B" color="pink" onClick={() => handleToggleCarEngine(EngineStatuses.STOPPED)} />
              </div>
              <div>
                  {/* <img src={CarImg} alt="sd" /> */}
              </div>
          </div>
          <div className="track__road">
              <animated.div
                className="track__road__car"
                style={{
                  position: 'absolute',
                  left,
                }}
              >
                  <CarImg
                    ref={thisRef}
                    fill={car.color}
                    width={100}
                    height={80}
                  />
              </animated.div>
              {/* <h3 className="track__road__carname">{car.name}</h3> */}
          </div>
      </div>
  );
}

export default Track;
