import React from 'react';
import { useAppDispatch, useTypedSelector } from '../../store';
import { Car } from '../../store/cars/types';
import Button from '../../shared/Button';
import { ReactComponent as CarImg } from '../../assets/BW_Hatchback.svg';
import './styles.scss';
import { selectCar } from '../../store/cars';
import { deleteCarAsync } from '../../store/cars/api';

interface TrackProps{
    car:Car
}

function Track({ car }:TrackProps) {
  const { selectedCar } = useTypedSelector((state) => state.cars);
  const dispatch = useAppDispatch();
  const handleDeleteCar = async (id:number) => {
    await dispatch(deleteCarAsync(id));
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
                  <Button text="A" color="blue" />
                  <Button text="B" color="pink" />
              </div>
              <div>
                  <CarImg fill={car.color} width={100} height={80} />
                  {/* <img src={CarImg} alt="sd" /> */}
              </div>
          </div>
          <div className="track__road">

              <h3 className="track__road__carname">{car.name}</h3>
          </div>
      </div>
  );
}

export default Track;
