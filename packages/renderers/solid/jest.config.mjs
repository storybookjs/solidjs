export default {
  verbose: true,
  transform: {
    '\\.[jt]sx?$': 'ts-jest',
  },
  testMatch: ['**/?(*.)(test).ts?(x)'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js'],
};
