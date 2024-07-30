const path = require('path');
const fs = require('fs');
import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
const  App = require("../src/App").default;

const app = express();


app.use(express.static(path.resolve(__dirname, '../build')));

app.get('/*', (req, res) => {
  const context = {};
  const appString = ReactDOMServer.renderToString(
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
  );

  const indexFile = path.resolve(__dirname, '../build/index.html');
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