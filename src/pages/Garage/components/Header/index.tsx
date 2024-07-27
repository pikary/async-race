import React, { useState } from 'react';
import { FaPlay } from 'react-icons/fa6';
import { RxUpdate } from 'react-icons/rx';
import { useAppDispatch, useTypedSelector } from '../../../../store';
import Button from '../../../../shared/Button';
import Input from '../../../../shared/Input';
import { createCarWithDefaults, Car } from '../../../../store/cars/types';
import {
  updateSelectedCarColor, updateSelectedCarName, setCreateFormField,
  clearForm,
} from '../../../../store/cars';
import {
  createCarAsync, updateCarAsync,
} from '../../../../store/cars/api';
import './styles.scss';

interface GarageHeaderProps {
  handleRaceStart: () => void;
  handleReset: () => void;
  handleGenerateCars: () => void;
}

function GarageHeader({
  handleRaceStart, handleReset, handleGenerateCars,
}:GarageHeaderProps) {
  const { selectedCar, race, createform } = useTypedSelector((state) => state.cars);
  const dispatch = useAppDispatch();
  const [carName, setCarName] = useState('');
  const [color, setColor] = useState('');

  const handleCarNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCreateFormField({ field: 'name', value: e.target.value }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCreateFormField({ field: 'color', value: e.target.value }));
  };

  const handleCreateCar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCar: Car = createCarWithDefaults({ name: carName, color });
      await dispatch(createCarAsync(newCar));
      dispatch(clearForm());
    } catch (err) {
      console.error(err);
    } finally {
      setCarName('');
      setColor('');
    }
  };

  const handleUpdateCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCar) {
      await dispatch(updateCarAsync(selectedCar));
    }
  };

  return (
      <div className="garage__header">
          <div className="garage__header__control-btns">
              <Button
                color="blue"
                type="button"
                onClick={handleRaceStart}
                icon={<FaPlay />}
                disabled={race?.status === 'started' || race?.status === 'finished'}
                text="race"
              />
              <Button
                color="pink"
                type="button"
                onClick={handleReset}
                icon={<RxUpdate />}
                text="reset"
              />
          </div>
          <div className="garage__header__form-cont">
              <form className="garage__header__form-cont__form garage__header__form-cont-create" onSubmit={handleCreateCar}>
                  <Input className="garage__header__form-cont__form-input" type="text" name="create-car" placeholder="Car brand" labelText="" onChange={handleCarNameChange} value={createform.name} />
                  <input type="color" onChange={handleColorChange} value={createform.color} />
                  <Button color="pink" text="create" type="submit" />
              </form>
              <form className="garage__header__form-cont__form garage__header__form-cont-update" onSubmit={handleUpdateCar}>
                  <Input disabled={selectedCar === null} className="garage__header__form-cont__form-input" value={selectedCar?.name} onChange={(e) => dispatch(updateSelectedCarName(e.target.value))} type="text" name="update-car" placeholder="Car brand" labelText="" />
                  <input disabled={selectedCar === null} type="color" value={selectedCar?.color} onChange={(e) => dispatch(updateSelectedCarColor(e.target.value))} />
                  <Button disabled={selectedCar === null} color="pink" text="update" type="submit" />
              </form>
          </div>
          <Button color="blue" text="generate cars" className="garage__header__gen" onClick={handleGenerateCars} />
      </div>
  );
}

export default GarageHeader;
