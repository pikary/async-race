import React from 'react';
import { FaPlay } from 'react-icons/fa6';
import { RxUpdate } from 'react-icons/rx';
import Button from '../../shared/Button';
import Input from '../../shared/Input';
import './styles.scss';

function Garage() {
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
          <div className="garage__line" />

      </div>
  );
}

export default Garage;
