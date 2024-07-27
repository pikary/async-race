import React from 'react';
import { BiRightArrow, BiLeftArrow } from 'react-icons/bi';
import Button from '../../shared/Button';
import './styles.scss';

interface PaginationProps {
  currentPage: number;
  totalAmount: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

function Pagination({
  currentPage,
  totalAmount,
  onNextPage,
  onPreviousPage,
}: PaginationProps) {
  return (
      <div className="pagination">
          <h4>
              GARAGE (
              {totalAmount}
              )
          </h4>
          <div className="pagination__controls">
              <Button
                className="pagination__controls__btn"
                text=""
                onClick={onPreviousPage}
                icon={<BiLeftArrow size={25} />}
              />
              <h4>
                  PAGE #
                  {currentPage}
              </h4>
              <Button
                className="pagination__controls__btn"
                text=""
                onClick={onNextPage}
                icon={<BiRightArrow size={25} />}
              />
          </div>
      </div>
  );
}

export default Pagination;
