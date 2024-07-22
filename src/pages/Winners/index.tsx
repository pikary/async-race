import React from 'react';
import { BiRightArrow, BiLeftArrow } from 'react-icons/bi';
import { useTypedSelector } from '../../store';
import Button from '../../shared/Button';
import { ReactComponent as CarSVG } from '../../assets/BW_Hatchback.svg';
import './styles.scss';

function Winners() {
  const { data } = useTypedSelector((state) => state.cars);
  return (
      <div className="winners">
          <h2 className="winners__header">Winners</h2>
          <table className="winners__table">
              <thead>
                  <tr className="winners__table__header">
                      <td className="winners__table__header__text">
                          №
                      </td>
                      <td className="winners__table__header__text">CAR</td>
                      <td className="winners__table__header__text">NAME</td>
                      <td className="winners__table__header__text highlight">WINS</td>
                      <td className="winners__table__header__text">BEST TIME (SECONDS)</td>
                  </tr>
              </thead>
              <tbody>
                  {data?.map((car) => (
                      <tr className="winners__table__row">
                          <td>{car.id}</td>
                          <td>
                              <CarSVG
                                width={80}
                                height={60}
                                fill={car.color}
                              />
                          </td>
                          <td>{car.name}</td>
                          <td className="highlight">2</td>
                          <td>2.2 s</td>
                      </tr>
                  ))}

              </tbody>
          </table>
          <div className="winners__footer">
              <div className="winners__footer__pagination__controls">
                  <Button className="winners__footer__pagination__controls__btn disabled" text="" onClick={() => {}} icon={<BiLeftArrow size={25} />} />
                  <h4>
                      PAGE #
                      {2}
                  </h4>
                  <Button className="winners__footer__pagination__controls__btn" text="" onClick={() => {}} icon={<BiRightArrow size={25} />} />
              </div>
          </div>
      </div>
  );
}

export default Winners;
