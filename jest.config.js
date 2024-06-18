module.exports = {
    transform: {
      "^.+\\.(js|jsx|ts|tsx|mjs)$": "babel-jest",
    },
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "mjs"],
    transformIgnorePatterns: [
        "/node_modules/(?!axios)" // Добавьте здесь любые другие модули, которые нужно трансформировать
    ],
};