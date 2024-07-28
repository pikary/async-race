import { Car, createCarWithDefaults, EngineStatus } from './types';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const getRandomCarName = () => {
  const carNames = [
    'Toyota',
    'Honda',
    'Ford',
    'Chevrolet',
    'BMW',
    'Audi',
    'Mercedes',
    'Nissan',
    'Mazda',
    'Tesla',
  ];
  const models = ['Corolla', 'F-150', 'Camaro', 'Civic', 'Model 3'];

  return `${carNames[Math.floor(Math.random() * carNames.length)]}  ${
    models[Math.floor(Math.random() * models.length)]
  }`;
};

// eslint-disable-next-line max-len
const generateRandomCars = (count: number): Car[] => Array.from({ length: count }, (_, id) => createCarWithDefaults({
  id,
  name: getRandomCarName(),
  color: getRandomColor(),
}));
const updateCarStatus = (car:Car, status:EngineStatus, velocity = 0, distance = 0) => ({
  ...car,
  engineStatus: status,
  velocity,
  distance,
});

export {
  generateRandomCars, getRandomCarName, getRandomColor, updateCarStatus,
};
