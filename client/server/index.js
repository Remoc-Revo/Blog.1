const path = require('path');

const ignoreStylesPath = path.resolve(__dirname, '../node_modules/ignore-styles');
require(ignoreStylesPath);

console.log("Ignoreee importation ")

require("@babel/register")({
  ignore: [/(node_modules)/],
  presets: ["@babel/preset-env", "@babel/preset-react"],
});

require("./server");