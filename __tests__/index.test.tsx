import { render, screen } from '@testing-library/react-native';
import React from 'react';
import Index from '../app/index';
import i18n from '../i18n';

describe('Index Screen', () => {
  it('should display the edit instruction text', () => {
    render(<Index />);
    
    const text = screen.getByText(i18n.t('index.editInstruction'));
    expect(text).toBeTruthy();
  });
});

