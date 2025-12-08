import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Index from '../app/index';

describe('Index Screen', () => {
  it('should display the edit instruction text', () => {
    render(<Index />);
    
    const text = screen.getByText('Edit app/index.tsx to edit this screen.');
    expect(text).toBeTruthy();
  });
});

