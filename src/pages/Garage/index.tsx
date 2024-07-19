import React from 'react';
import { FaPlay } from 'react-icons/fa6';
import Button from '../../shared/Button';

import './styles.scss';

function Garage() {
  return (
      <div>
          <div>
              <div>
                  <Button
                    className="blue"
                    type="button"
                    onClick={() => {
                      console.log();
                    }}
                    text="race"
                  />
                  <Button
                    className="pink"
                    type="button"
                    onClick={() => {
                      console.log();
                    }}
                    icon={<FaPlay />}
                    text="reset"
                  />

              </div>
          </div>
      </div>
  );
}

export default Garage;
