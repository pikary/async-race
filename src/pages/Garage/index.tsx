/* eslint-disable max-len */
import React, { useEffect, useCallback } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useTypedSelector } from '../../store';
import Track from '../../components/Track';
import { createCarWithDefaults, EngineStatuses } from '../../store/cars/types';
import './styles.scss';
import {
  createRace,
  setCurrentPage, updateCarList, updateRaceStatus,
} from '../../store/cars';
import {
  createCarAsync, driveCarAsync, getCarsAsync, toggleCarEngineAsync,
} from '../../store/cars/api';
import { generateRandomCars } from '../../store/cars/helpers';
import Pagination from '../../components/Pagination';
import GarageHeader from './components/Header';
import GarageBoundary from './components/GarageBoundary/GarageBoundary';

const CARS_PER_PAGE = 7;

function Garage() {
  const {
    data, currentPage, totalAmount, race,
  } = useTypedSelector((state) => state.cars);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchGarageHandler = async () => {
      await dispatch(getCarsAsync({ page: currentPage, limit: CARS_PER_PAGE }));
    };
    if (currentPage === race?.page) {
      dispatch(updateCarList(race.cars!));
    } else {
      fetchGarageHandler();
    }
  }, [dispatch, currentPage, race?.page]);

  const handleRaceStart = useCallback(async () => {
    try {
      dispatch(createRace({ currentPage, cars: data || [createCarWithDefaults()] }));
      const startEngineRequests = data!.map((car) => dispatch(toggleCarEngineAsync({
        id: car.id!,
        status: EngineStatuses.STARTED,
      })));

      const startEngineResults = await Promise.all(startEngineRequests);
      startEngineResults.forEach(async (res) => {
        await dispatch(driveCarAsync(res.meta.arg.id));
      });
    } catch (error) {
      console.log('Error starting engines or driving cars:', error);
    }
  }, [data, currentPage, dispatch]);

  const handleNextPage = useCallback(() => dispatch(setCurrentPage(currentPage + 1)), [currentPage, dispatch]);
  const handlePreviousPage = useCallback(() => dispatch(setCurrentPage(currentPage - 1)), [currentPage, dispatch]);

  const handleGenerateCars = useCallback(async () => {
    const randomCars = generateRandomCars(100);
    const requests = randomCars.map((car) => dispatch(createCarAsync(car)));
    try {
      await Promise.all(requests.map((p) => p.then(unwrapResult).catch((e) => e)));
    } catch (error) {
      console.error('Error generating cars:', error);
    }
  }, [dispatch]);

  const handleReset = useCallback(async () => {
    try {
      const requests = data!.map((car) => dispatch(toggleCarEngineAsync({
        id: car.id,
        status: EngineStatuses.STOPPED,
      })));
      await Promise.all(requests);
      dispatch(updateRaceStatus('idle'));
    } catch (e) {
      console.log(e);
    }
  }, [data, dispatch]);

  return (
      <div className="garage">
          <GarageHeader
            handleRaceStart={handleRaceStart}
            handleReset={handleReset}
            handleGenerateCars={handleGenerateCars}
          />
          <div className="garage__race">
              <GarageBoundary />
              <div style={{ marginBottom: 30 }}>
                  {(!data || data.length === 0) ? (
                      <h4 className="garage__race__err">No cars</h4>
                  ) : (
                    data.map((car) => (
                        <Track key={car.id} car={car} />
                    ))
                  )}
              </div>
              <GarageBoundary />
              <Pagination
                currentPage={currentPage}
                totalAmount={totalAmount}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
              />
          </div>
      </div>
  );
}

export default Garage;
