import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Car, EngineStatuses } from '../../../store/cars/types';
import { updateCarProgress } from '../../../store/cars';

const useCarAnimation = (car: Car) => {
    const carRef = useRef<SVGSVGElement>(null);
    const roadRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number | null>(null);
    const dispatch = useDispatch();

    const moveCar = () => {
        const duration = car.distance / car.velocity;
        const startPosition = 0;
        const endPosition = 100 - (100 / roadRef.current!.offsetWidth) * 100;
        let startTime: number | null = null;

        const animate = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const elapsedTime = currentTime - startTime;
            const percentage = Math.min(elapsedTime / duration, 1);
            const position = startPosition + endPosition * percentage;

            if (carRef.current) {
                carRef.current.style.left = `${position}%`;
            }

            if (percentage < 1) {
                animationFrameId.current = requestAnimationFrame(animate);
            }
        };

        animationFrameId.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (car.engineStatus === EngineStatuses.STARTED) {
            moveCar();
        } else if (
            car.engineStatus === EngineStatuses.CRASHED ||
            car.engineStatus === EngineStatuses.FINISHED
        ) {
            cancelAnimationFrame(animationFrameId.current!);
            if (carRef.current?.style.left) {
                dispatch(
                    updateCarProgress({
                        id: car.id,
                        progress: carRef.current.style.left,
                    })
                );
            }
        } else if (car.engineStatus === EngineStatuses.STOPPED) {
            cancelAnimationFrame(animationFrameId.current!);
        }
    }, [car.engineStatus]);

    const getCarLeftPosition = (engineStatus: EngineStatuses) => {
        switch (engineStatus) {
            case EngineStatuses.STOPPED:
                return '0';
            case EngineStatuses.CRASHED:
                return car.progress || '';
            case EngineStatuses.FINISHED:
                return 'calc(100% - 100px)';
            default:
                return '';
        }
    };

    return {
        carRef,
        roadRef,
        getCarLeftPosition,
    };
};

export default useCarAnimation;
