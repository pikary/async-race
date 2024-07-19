import React from 'react';
import { Car } from '../../store/cars/types';
import Button from '../../shared/Button';
import { ReactComponent as CarImg } from '../../assets/BW_Hatchback.svg';
import './styles.scss';

interface TrackProps{
    car:Car
}

function Track({ car }:TrackProps) {
  return (
      <div className="track">
          <div className="track__car">
              <div className="track__car__btns">
                  <Button text="SELECT" color="blue" />
                  <Button text="REMOVE" color="pink" />
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
