import React, { useCallback, useEffect, useRef } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { Car, EngineStatuses } from '../../store/cars/types';
import Button from '../../shared/Button';
import { ReactComponent as CarImg } from '../../assets/BW_Hatchback.svg';
import { useAppDispatch, useTypedSelector } from '../../store';
import { selectCar, updateCarProgress } from '../../store/cars';
import {
    deleteCarAsync,
    toggleCarEngineAsync,
    driveCarAsync,
} from '../../store/cars/api';
import './styles.scss';

// updateRaceParticipants
interface TrackProps {
    car: Car;
}

function Track({ car }: TrackProps) {
    const { selectedCar, currentPage } = useTypedSelector(
        (state) => state.cars
    );
    const thisRef = useRef<SVGSVGElement>(null);
    const roadRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number | null>(null);
    const dispatch = useAppDispatch();

    const handleDeleteCar = useCallback(
        async (id: number) => {
            try {
                unwrapResult(await dispatch(deleteCarAsync(id)));
            } catch (e) {
                console.error(e);
            }
        },
        [currentPage]
    );
    // const handleDeleteCar = async (id: number) => {

    // };
    const moveCar = () => {
        const duration = car.distance / car.velocity; // 5 seconds
        const startPosition = 0;
        const endPosition = 100 - (100 / roadRef.current!.offsetWidth) * 100;
        let startTime: number | null = null;

        const animate = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const elapsedTime = currentTime - startTime;
            const percentage = Math.min(elapsedTime / duration, 1);
            const position = startPosition + endPosition * percentage;
            if (thisRef.current) {
                thisRef.current.style.left = `${position}%`;
            }

            if (percentage < 1) {
                animationFrameId.current = requestAnimationFrame(animate);
            }
        };

        animationFrameId.current = requestAnimationFrame(animate);
    };
    const handleToggleCarEngine = async (status: EngineStatuses) => {
        try {
            if (status === EngineStatuses.STOPPED) {
                cancelAnimationFrame(animationFrameId.current!);
                await dispatch(
                    toggleCarEngineAsync({ id: car.id!, status })
                ).then(unwrapResult);
            } else if (status === EngineStatuses.STARTED) {
                await dispatch(
                    toggleCarEngineAsync({ id: car.id!, status })
                ).then(unwrapResult);
                moveCar();
                unwrapResult(await dispatch(driveCarAsync(car.id!)));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSelectCar = (carParam: Car) => {
        dispatch(selectCar(carParam));
    };

    useEffect(() => {
        if (car.engineStatus === EngineStatuses.STARTED) {
            moveCar();
        } else if (
            car.engineStatus === EngineStatuses.CRASHED ||
            car.engineStatus === EngineStatuses.FINISHED
        ) {
            cancelAnimationFrame(animationFrameId.current!);
            if (thisRef.current?.style.left) {
                dispatch(
                    updateCarProgress({
                        id: car.id,
                        progress: thisRef.current.style.left,
                    })
                );
            }
        } else if (car.engineStatus === EngineStatuses.STOPPED) {
            cancelAnimationFrame(animationFrameId.current!);
        }
    }, [car.engineStatus]);

    const getCarLeftPosition = (engineStatus: EngineStatuses) => {
        if (engineStatus === EngineStatuses.STOPPED) {
            return '0';
        }
        if (engineStatus === EngineStatuses.CRASHED) {
            return car.progress || '';
        }
        if (engineStatus === EngineStatuses.FINISHED) {
            return 'calc(100% - 100px)';
        }
        return '';
    };
    return (
        <div className="track">
            <div className="track__car">
                <div className="track__car__btns">
                    <Button
                        shortenText="S"
                        text="SELECT"
                        color="blue"
                        onClick={() => handleSelectCar(car)}
                        className={`${selectedCar?.id === car.id ? 'track__car__btns-selected' : ''}`}
                    />
                    <Button
                        shortenText="R"
                        text="REMOVE"
                        color="pink"
                        onClick={() => handleDeleteCar(car.id!)}
                        disabled={car.engineStatus === EngineStatuses.STARTED}
                    />
                </div>
                <div className="track__car__btns">
                    <Button
                        disabled={
                            car.engineStatus === 'started' ||
                            car.engineStatus === 'drive'
                        }
                        text="A"
                        color="blue"
                        onClick={() =>
                            handleToggleCarEngine(EngineStatuses.STARTED)
                        }
                    />
                    <Button
                        disabled={
                            (car.engineStatus &&
                                car.engineStatus === 'stopped') ||
                            !car.engineStatus
                        }
                        text="B"
                        color="pink"
                        onClick={() =>
                            handleToggleCarEngine(EngineStatuses.STOPPED)
                        }
                    />
                </div>
            </div>
            <div className="track__road" ref={roadRef}>
                <CarImg
                    ref={thisRef}
                    className="track__road__car"
                    style={{
                        left: getCarLeftPosition(car.engineStatus),
                    }}
                    fill={car.color}
                    width={100}
                    height={80}
                />
                <h3 className="track__road__carname">{car.name}</h3>
            </div>
        </div>
    );
}

export default Track;
