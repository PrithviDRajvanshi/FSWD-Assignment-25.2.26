module.exports = {
  projects: [
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/**/*.test.js'],
    },
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/client/src/**/*.test.jsx'],
      transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
      },
      moduleNameMapper: {
        '^react$': '<rootDir>/client/node_modules/react',
        '^react-dom$': '<rootDir>/client/node_modules/react-dom',
        '^react/jsx-runtime$': '<rootDir>/client/node_modules/react/jsx-runtime',
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    },
  ],
};
