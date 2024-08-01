const path = require('path');
const fs = require('fs');
import express from "express";
import React from "../client/node_modules/react";
import ReactDOMServer from "../client/node_modules/react-dom/server";
import { StaticRouter } from "../client/node_modules/react-router-dom/server";

const appPath = path.join(__dirname, '../client/src/App.js');

let App;
try{
  console.log("is app file available? ",fs.existsSync(appPath));
  
  App  = require(appPath).default;
}catch(err){
  console.log("Why can't App be imported ?",err);
}


const app = express();


app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/*', (req, res) => {
  const context = {};
  const appString = ReactDOMServer.renderToString(
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
  );

  const indexFile = path.resolve(__dirname, '../client/build/index.html');
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, Server error!');
    }

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${appString}</div>`)
    );
  });
});


app.listen(3000, () => {
  console.log("App is running...");
});