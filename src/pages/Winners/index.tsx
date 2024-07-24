import React, { useEffect } from 'react';
import { BiRightArrow, BiLeftArrow } from 'react-icons/bi';
import { FaSortAmountDown } from 'react-icons/fa';
import { useAppDispatch, useTypedSelector } from '../../store';
import Button from '../../shared/Button';
import { ReactComponent as CarSVG } from '../../assets/BW_Hatchback.svg';

import './styles.scss';
import { getWinnersAsync } from '../../store/winners/api';
import { OrderTypes, SortTypes } from '../../store/winners/types';
import { setCurrentPage } from '../../store/winners';

function Winners() {
  const { data, currentPage } = useTypedSelector((state) => state.winners);
  const dispatch = useAppDispatch();

  const handleNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const handlePreviousPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  useEffect(() => {
    const fetchWinners = async () => {
      await dispatch(getWinnersAsync({
        page: currentPage, limit: 7, sort: SortTypes.ID, order: OrderTypes.ASC,
      }));
    };
    fetchWinners();
  }, [dispatch, currentPage]);
  return (
      <div className="winners">
          <h2 className="winners__header">Winners</h2>
          <table className="winners__table">
              <thead>
                  <tr className="winners__table__header">
                      <td className="winners__table__header__text">
                          <div className="winners__table__header__text__wrapper">
                              <span>#</span>
                              <Button onClick={() => {}} icon={<FaSortAmountDown />} text="" disabled={false} />
                          </div>
                      </td>
                      <td className="winners__table__header__text">
                          <div className="winners__table__header__text__wrapper">
                              <span>CAR</span>
                              <Button onClick={() => {}} icon={<FaSortAmountDown />} text="" />
                          </div>
                      </td>
                      <td className="winners__table__header__text">
                          <div className="winners__table__header__text__wrapper">
                              <span>NAME</span>
                              <Button onClick={() => {}} icon={<FaSortAmountDown />} text="" />
                          </div>
                      </td>
                      <td className="winners__table__header__text highlight">
                          <div className="winners__table__header__text__wrapper">
                              <span>WINS</span>
                              <Button onClick={() => {}} icon={<FaSortAmountDown />} text="" />
                          </div>
                      </td>
                      <td className="winners__table__header__text">
                          <div className="winners__table__header__text__wrapper">
                              <span>BEST TIME (SECONDS)</span>
                              <Button onClick={() => {}} icon={<FaSortAmountDown />} text="" />
                          </div>
                      </td>
                  </tr>
              </thead>
              <tbody>
                  {data?.map((winner) => (
                      <tr className="winners__table__row">
                          <td>{winner.id}</td>
                          <td>
                              <CarSVG
                                width={90}
                                height={75}
                                fill={winner.car?.color}
                              />
                          </td>
                          <td>{winner.car?.name}</td>
                          <td className="highlight">{winner.wins}</td>
                          <td>
                              {winner.time}
                              {' '}
                              s
                          </td>
                      </tr>
                  ))}

              </tbody>
          </table>
          <div className="winners__footer">
              <div className="winners__footer__pagination__controls">
                  <Button className="winners__footer__pagination__controls__btn disabled" text="" onClick={handlePreviousPage} icon={<BiLeftArrow size={25} />} />
                  <h4>
                      PAGE #
                      {currentPage}
                  </h4>
                  <Button className="winners__footer__pagination__controls__btn" text="" onClick={handleNextPage} icon={<BiRightArrow size={25} />} />
              </div>
          </div>
      </div>
  );
}

export default Winners;
