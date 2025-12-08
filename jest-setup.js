// Add any global test setup here
// Jest matchers are now built-in to @testing-library/react-native v12.4+

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
