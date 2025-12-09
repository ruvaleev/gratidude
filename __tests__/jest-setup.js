// Add any global test setup here
// Jest matchers are now built-in to @testing-library/react-native v12.4+

import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock expo-localization for tests
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [
    {
      languageCode: 'en',
      languageTag: 'en-US',
      regionCode: 'US',
      currencyCode: 'USD',
      currencySymbol: '$',
      decimalSeparator: '.',
      digitGroupingSeparator: ',',
    },
  ]),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name }) => {
    const { Text } = require('react-native');
    const React = require('react');
    return React.createElement(Text, { testID: `icon-${name}` }, name);
  },
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useNavigation: () => ({
    setOptions: jest.fn(),
  }),
  Stack: ({ children }) => children,
}));
