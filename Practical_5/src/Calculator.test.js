import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from './Calculator';

test('renders calculator with initial display of 0', () => {
  render(<Calculator />);
  const display = screen.getByText('0');
  expect(display).toBeInTheDocument();
});

test('can input numbers', () => {
  render(<Calculator />);
  const button1 = screen.getByText('1');
  const button2 = screen.getByText('2');
  const button3 = screen.getByText('3');
  
  fireEvent.click(button1);
  fireEvent.click(button2);
  fireEvent.click(button3);
  
  expect(screen.getByText('123')).toBeInTheDocument();
});

test('can perform addition', () => {
  render(<Calculator />);
  
  fireEvent.click(screen.getByText('5'));
  fireEvent.click(screen.getByText('+'));
  fireEvent.click(screen.getByText('3'));
  fireEvent.click(screen.getByText('='));
  
  expect(screen.getByText('8')).toBeInTheDocument();
});

test('can perform subtraction', () => {
  render(<Calculator />);
  
  fireEvent.click(screen.getByText('9'));
  fireEvent.click(screen.getByText('-'));
  fireEvent.click(screen.getByText('4'));
  fireEvent.click(screen.getByText('='));
  
  expect(screen.getByText('5')).toBeInTheDocument();
});

test('can perform multiplication', () => {
  render(<Calculator />);
  
  fireEvent.click(screen.getByText('6'));
  fireEvent.click(screen.getByText('*'));
  fireEvent.click(screen.getByText('7'));
  fireEvent.click(screen.getByText('='));
  
  expect(screen.getByText('42')).toBeInTheDocument();
});

test('can perform division', () => {
  render(<Calculator />);
  
  fireEvent.click(screen.getByText('8'));
  fireEvent.click(screen.getByText('/'));
  fireEvent.click(screen.getByText('2'));
  fireEvent.click(screen.getByText('='));
  
  expect(screen.getByText('4')).toBeInTheDocument();
});

test('can clear display', () => {
  render(<Calculator />);
  
  fireEvent.click(screen.getByText('1'));
  fireEvent.click(screen.getByText('2'));
  fireEvent.click(screen.getByText('3'));
  fireEvent.click(screen.getByText('DEL'));
  
  expect(screen.getByText('0')).toBeInTheDocument();
});

test('can input decimal numbers', () => {
  render(<Calculator />);
  
  fireEvent.click(screen.getByText('3'));
  fireEvent.click(screen.getByText('.'));
  fireEvent.click(screen.getByText('1'));
  fireEvent.click(screen.getByText('4'));
  
  expect(screen.getByText('3.14')).toBeInTheDocument();
});