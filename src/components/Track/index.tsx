import React, { useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { Car } from '../../store/cars/types';
import Button from '../../shared/Button';
import { ReactComponent as CarImg } from '../../assets/BW_Hatchback.svg';
import './styles.scss';
import { useAppDispatch, useTypedSelector } from '../../store';
import { selectCar } from '../../store/cars';
import {
  deleteCarAsync, getCarsAsync, toggleCarEngineAsync, driveCarAsync,
} from '../../store/cars/api';

interface TrackProps{
    car:Car
}

function Track({ car }:TrackProps) {
  const { selectedCar, totalAmount, currentPage } = useTypedSelector((state) => state.cars);
  const [time, setTime] = useState<number|null>(null);
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
  const handleToggleCarEngine = async (status:'started'|'stopped') => {
    try {
      const data = unwrapResult(await dispatch(toggleCarEngineAsync({ id: car.id!, status })));
      const calc = data.distance / data.velocity;
      setTime(calc);

      unwrapResult(await dispatch(driveCarAsync(car.id!)));
    } catch (e) {
      console.error(e);
    }
  };
  const handleSelectCar = (carparam:Car) => { dispatch(selectCar(carparam)); };
  return (
      <div className="track">
          <div className="track__car">
              <div className="track__car__btns">
                  <Button text="SELECT" color="blue" onClick={() => handleSelectCar(car)} className={`${selectedCar?.id === car.id ? 'track__car__btns-selected' : ''}`} />
                  <Button text="REMOVE" color="pink" onClick={() => handleDeleteCar(car.id!)} />
              </div>
              <div className="track__car__btns">
                  <Button text="A" color="blue" onClick={() => handleToggleCarEngine('started')} />
                  <Button text="B" color="pink" onClick={() => handleToggleCarEngine('stopped')} />
              </div>
              <div>
                  {/* <img src={CarImg} alt="sd" /> */}
              </div>
          </div>
          <div className="track__road">
              <CarImg
                className="track__road__car"
                style={{
                  transition: time ? `left ${time / 1000}s linear` : '',
                  left: time ? 'calc(100% - 100px)' : '0%',
                }}
                fill={car.color}
                width={100}
                height={80}
              />
              {/* <h3 className="track__road__carname">{car.name}</h3> */}
          </div>
      </div>
  );
}

export default Track;
