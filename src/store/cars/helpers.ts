import { Car } from './types';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const getRandomCarName = () => {
  const carNames = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Audi', 'Mercedes', 'Nissan', 'Mazda', 'Tesla'];
  return carNames[Math.floor(Math.random() * carNames.length)];
};

const generateRandomCars = (count: number): Car[] => Array.from({ length: count }, (_, id) => ({
  id,
  name: getRandomCarName(),
  color: getRandomColor(),
}));

export { generateRandomCars, getRandomCarName, getRandomColor };
