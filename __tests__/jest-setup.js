// Add any global test setup here
// Jest matchers are now built-in to @testing-library/react-native v12.4+

import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock expo-file-system/legacy
jest.mock('expo-file-system/legacy', () => ({
  documentDirectory: 'file:///mock-documents/',
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
  EncodingType: { UTF8: 'utf8' },
}));

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
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  navigate: jest.fn(),
};

jest.mock('expo-router', () => ({
  useNavigation: () => ({
    setOptions: jest.fn(),
  }),
  useRouter: () => mockRouter,
  // `asChild` hands rendering to the child, which is how the app uses Link.
  Link: ({ children }) => children,
  Stack: ({ children }) => children,
  Tabs: ({ children }) => children,
}));

global.mockRouter = mockRouter;

// Mock expo-sharing
jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  shareAsync: jest.fn(() => Promise.resolve()),
}));
