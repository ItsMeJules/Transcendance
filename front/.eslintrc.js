module.exports = {
  // Your global ESLint configuration (if any) goes here

  // Rules specific to your React directory
  overrides: [
    {
      files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'], // Include JS and TypeScript files
      rules: {
        // Disable a specific rule for React files
        '@typescript-eslint/rule-name': 'off',
      },
    },
  ],
};
