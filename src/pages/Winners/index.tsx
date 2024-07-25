import React, { useEffect } from 'react';
import { BiRightArrow, BiLeftArrow } from 'react-icons/bi';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { useAppDispatch, useTypedSelector } from '../../store';
import Button from '../../shared/Button';
import { ReactComponent as CarSVG } from '../../assets/BW_Hatchback.svg';

import './styles.scss';
import { getWinnersAsync } from '../../store/winners/api';
import { setCurrentPage, setOrderType, setSortType } from '../../store/winners';
import { OrderTypes, SortTypes } from '../../store/winners/types';

function Winners() {
  const {
    data, currentPage, sort, order,
  } = useTypedSelector((state) => state.winners);
  const dispatch = useAppDispatch();
  const handleNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const handlePreviousPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const handleChangeSortType = (sortType:SortTypes) => {
    dispatch(setSortType(sortType));
  };
  const toggleSortOrder = () => {
    if (order === OrderTypes.ASC) {
      dispatch(setOrderType(OrderTypes.DSC));
    } else {
      dispatch(setOrderType(OrderTypes.ASC));
    }
  };
  useEffect(() => {
    const fetchWinners = async () => {
      await dispatch(getWinnersAsync({
        page: currentPage, limit: 7, sort, order,
      }));
    };
    fetchWinners();
  }, [dispatch, currentPage, sort, order]);
  return (
      <div className="winners">
          <div className="winners__header">
              <h2 className="winners__header__heading">Winners</h2>
              <div className="winners__header__sorting">
                  <select className="winners__header__sorting__selector" id="sortType" value={sort} onChange={(e) => handleChangeSortType(e.target.value as SortTypes)}>
                      <option value="">Select Sort Type</option>
                      {Object.values(SortTypes).map((type) => (
                          <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                          </option>
                      ))}
                  </select>
                  <Button className="winners__header__sorting__btn" onClick={toggleSortOrder} text="" icon={order === OrderTypes.DSC ? <FaSortAmountDown size={20} /> : <FaSortAmountUp size={20} />} />
              </div>
              {/* <select name="" id="" /> */}
          </div>

          <table className="winners__table">
              <thead>
                  <tr className="winners__table__header">
                      <td className="winners__table__header__text">
                          <div className="winners__table__header__text__wrapper">
                              <span>#</span>
                          </div>
                      </td>
                      <td className="winners__table__header__text">
                          <div className="winners__table__header__text__wrapper">
                              <span>CAR</span>
                          </div>
                      </td>
                      <td className="winners__table__header__text">
                          <div className="winners__table__header__text__wrapper">
                              <span>NAME</span>
                          </div>
                      </td>
                      <td className="winners__table__header__text highlight">
                          <div className="winners__table__header__text__wrapper">
                              <span>WINS</span>

                          </div>
                      </td>
                      <td className="winners__table__header__text">
                          <div className="winners__table__header__text__wrapper">
                              <span>BEST TIME (SECONDS)</span>

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
