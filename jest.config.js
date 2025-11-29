export default {
  // ... configuración de Jest
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", 
  },
  testMatch: [
    "**/?(*.)+(spec|test).[tj]s?(x)",
  ],
  testEnvironment: 'jsdom',
};