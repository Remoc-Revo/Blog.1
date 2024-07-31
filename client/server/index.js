console.log("Ignoreee importation ")
 
const path = require('path');

const ignoreStylesPath = path.resolve(__dirname, '../node_modules/ignore-styles');
require(ignoreStylesPath);


require("@babel/register")({
  ignore: [/(node_modules)/],
  presets: ["@babel/preset-env", "@babel/preset-react"],
});

require("./server");