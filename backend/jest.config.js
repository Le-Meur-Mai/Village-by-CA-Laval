// Config jest pour qu'il accepte les import export car node est de type module
export default {
  testEnvironment: "node",
  transform: {},
  // On lui dit d'aller regarder dans src pour trouver les tests
  testMatch: [
    "**/tests/**/*.test.js",
    "**/src/**/*.test.js"
  ]
};
