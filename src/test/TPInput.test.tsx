// OtpInput.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OtpInput from '../Components/OtpInput';


test('renders the correct number of OTP input fields', () => {
    const handleChange = jest.fn();
    const length = 6;
    render(<OtpInput length={length} onChange={handleChange} />);
  
    // Check if there are the correct number of input fields
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(length);
  });
  
  test('handles input correctly for dynamically created fields', () => {
    const handleChange = jest.fn();
    render(<OtpInput length={6} onChange={handleChange} />);
  
    const inputs = screen.getAllByRole('spinbutton');
  
    // Simulate entering values into each input field
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: '1' } });
    });
  
    // Check if the handleChange function is called with the correct OTP
    expect(handleChange).toHaveBeenCalledWith('111111');
  });
  
  test('prevents non-digit input in dynamically created fields', () => {
    const handleChange = jest.fn();
    render(<OtpInput length={6} onChange={handleChange} />);
  
    const inputs = screen.getAllByRole('spinbutton');
  
    // Simulate entering non-digit values
    fireEvent.change(inputs[0], { target: { value: 'a' } });
    expect(inputs[0].value).toBe(''); // Value should not be accepted
  
    fireEvent.change(inputs[0], { target: { value: '1' } });
    expect(inputs[0].value).toBe('1'); // Value should be accepted
  });